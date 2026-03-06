import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { email, website } = body;

  // Honeypot: silently fake success if filled
  if (website) {
    return NextResponse.json({ success: true });
  }

  // Rate limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try later." },
      { status: 429 }
    );
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  // Insert into Supabase
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "Already on the list" },
      { status: 409 }
    );
  }
  if (error) {
    return NextResponse.json(
      { error: "Could not join waitlist. Try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
