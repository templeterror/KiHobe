"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getReferralUrl } from "@/lib/share";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const referralUrl = getReferralUrl(user.referral_code);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">← Home</Link>
        <h1 className="text-sm font-medium">Profile</h1>
        <button onClick={logout} className="text-muted-foreground hover:text-foreground text-sm">Logout</button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-lg font-semibold">{user.display_name ?? "Anonymous"}</div>
          <div className="text-sm text-muted-foreground mt-1">
            +880 {user.phone.replace("+880", "").replace(/(\d{4})(\d{3})(\d{2})/, "$1-$2-$3")}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{user.coin_balance}</span>
            <span className="text-muted-foreground text-sm">coins</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Referral link</p>
          <div className="text-xs font-mono bg-secondary rounded-lg px-3 py-2 break-all">{referralUrl}</div>
        </div>
      </main>
    </div>
  );
}
