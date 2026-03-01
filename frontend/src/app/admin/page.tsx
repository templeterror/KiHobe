"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

interface AdminPrediction {
  id: string;
  title: string;
  status: string;
  yes_count: number;
  no_count: number;
  category: string | null;
  prediction_type: "binary" | "multi_choice";
  choices: { key: string; label: string }[] | null;
  choice_counts: Record<string, number> | null;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [predictions, setPredictions] = useState<AdminPrediction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.is_admin) return;
    api.get<AdminPrediction[]>("/admin/predictions")
      .then(setPredictions)
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [user]);

  const approve = async (id: string) => {
    await api.patch(`/admin/predictions/${id}`, { status: "active" });
    setPredictions((p) => p.map((x) => x.id === id ? { ...x, status: "active" } : x));
  };

  const reject = async (id: string) => {
    await api.patch(`/admin/predictions/${id}`, { status: "draft" });
    setPredictions((p) => p.map((x) => x.id === id ? { ...x, status: "draft" } : x));
  };

  const resolve = async (id: string, outcome: boolean) => {
    await api.post(`/admin/predictions/${id}/resolve?outcome=${outcome}`);
    setPredictions((p) => p.map((x) => x.id === id ? { ...x, status: "resolved" } : x));
  };

  const resolveChoice = async (id: string, choiceKey: string) => {
    await api.post(`/admin/predictions/${id}/resolve?outcome_choice=${choiceKey}`);
    setPredictions((p) => p.map((x) => x.id === id ? { ...x, status: "resolved" } : x));
  };

  if (loading || !user) return null;

  const filtered = filter === "all" ? predictions : predictions.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">← Home</Link>
        <h1 className="text-sm font-medium">Admin</h1>
        <div />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["all", "pending_approval", "active", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">{p.status}</span>
                      {p.prediction_type === "multi_choice" && p.choice_counts ? (
                        Object.entries(p.choice_counts).map(([key, count]) => {
                          const label = p.choices?.find((c) => c.key === key)?.label || key;
                          return <span key={key} className="text-xs text-muted-foreground">{label}: {count}</span>;
                        })
                      ) : (
                        <>
                          <span className="text-xs text-primary">YES {p.yes_count}</span>
                          <span className="text-xs text-destructive">NO {p.no_count}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {p.status === "pending_approval" && (
                      <>
                        <button onClick={() => approve(p.id)} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30">Approve</button>
                        <button onClick={() => reject(p.id)} className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-lg hover:bg-secondary/80">Reject</button>
                      </>
                    )}
                    {p.status === "active" && p.prediction_type === "multi_choice" && p.choices ? (
                      p.choices.map((c) => (
                        <button key={c.key} onClick={() => resolveChoice(p.id, c.key)} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30 whitespace-nowrap">
                          {c.label} wins
                        </button>
                      ))
                    ) : p.status === "active" && (
                      <>
                        <button onClick={() => resolve(p.id, true)} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-lg hover:bg-primary/30">YES wins</button>
                        <button onClick={() => resolve(p.id, false)} className="text-xs bg-destructive/20 text-destructive px-3 py-1 rounded-lg hover:bg-destructive/30">NO wins</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nothing here.</p>}
          </div>
        )}
      </main>
    </div>
  );
}
