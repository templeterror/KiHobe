"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { getReferralUrl, copyLink } from "@/lib/share";

export default function FriendsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<{ friend_id: string; users: { display_name: string | null } }[]>([]);
  const [code, setCode] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    api.get<typeof friends>("/friends").then(setFriends).catch(() => {});
  }, [user]);

  const addFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      await api.post("/friends/add", { referral_code: code });
      const updated = await api.get<typeof friends>("/friends");
      setFriends(updated);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add friend");
    } finally {
      setAdding(false);
    }
  };

  const handleCopyReferral = async () => {
    if (!user) return;
    await copyLink(getReferralUrl(user.referral_code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">← Home</Link>
        <h1 className="text-sm font-medium">Friends</h1>
        <div />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Invite link */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Invite friends</p>
          <p className="text-xs text-muted-foreground mb-3">Share your referral link. You both earn bonus coins.</p>
          <button onClick={handleCopyReferral} className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium">
            {copied ? "Copied!" : "Copy invite link"}
          </button>
        </div>

        {/* Add by code */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Add by referral code</p>
          <form onSubmit={addFriend} className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABCD1234"
              maxLength={8}
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={adding || code.length < 6} className="bg-primary text-primary-foreground rounded-lg px-4 text-sm font-medium disabled:opacity-50">
              {adding ? "…" : "Add"}
            </button>
          </form>
          {error && <p className="text-destructive text-xs mt-2">{error}</p>}
        </div>

        {/* Friends list */}
        <div>
          <p className="text-sm font-medium mb-3">{friends.length} friend{friends.length !== 1 ? "s" : ""}</p>
          <div className="space-y-2">
            {friends.map((f) => (
              <div key={f.friend_id} className="bg-card border border-border rounded-xl px-4 py-3 text-sm">
                {f.users?.display_name ?? "Anonymous"}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
