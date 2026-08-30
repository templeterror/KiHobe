import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LANDING = "/waitlist";

export function middleware(request: NextRequest) {
  // Local: keep / as the old app and /waitlist as the landing.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Canonical public URL is /. Keep /waitlist working, but don't show it.
  if (pathname === LANDING || pathname.startsWith(`${LANDING}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = LANDING;
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
