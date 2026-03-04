"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string | null;
  total_bets: number;
  correct_predictions: number;
  win_rate: number;
  prizes_won: number;
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"friends" | "global">("friends");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    api.get<LeaderboardEntry[]>(`/leaderboard/${tab}`)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setDataLoading(false));
  }, [tab, user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">← Home</Link>
        <h1 className="text-sm font-medium">Leaderboard</h1>
        <div />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {(["friends", "global"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {t === "friends" ? "Friends" : "Global Top 100"}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-card rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((entry) => (
              <div key={entry.user_id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground w-7 text-center">#{entry.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{entry.display_name ?? "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground">{entry.correct_predictions} correct · {entry.win_rate}% rate</div>
                </div>
                {entry.prizes_won > 0 && <span className="text-xs">{entry.prizes_won} wins</span>}
              </div>
            ))}
            {data.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No data yet.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
