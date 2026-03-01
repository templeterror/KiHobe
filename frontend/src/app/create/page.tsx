"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

const CATEGORIES = ["sports", "politics", "economy", "entertainment", "technology", "society"];

export default function CreatePredictionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "sports",
    resolution_date: "",
    resolution_source: "",
    prize_description: "",
    prediction_type: "binary" as "binary" | "multi_choice",
  });
  const [choiceLabels, setChoiceLabels] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        ...form,
        resolution_date: form.resolution_date ? new Date(form.resolution_date).toISOString() : undefined,
      };
      if (form.prediction_type === "multi_choice") {
        payload.choices = choiceLabels
          .filter((l) => l.trim())
          .map((label) => ({ key: label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_+$/, ""), label: label.trim() }));
      }
      await api.post("/predictions", payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">✓</div>
          <h2 className="text-lg font-semibold">Proposal submitted!</h2>
          <p className="text-muted-foreground text-sm">Admins will review and approve your market.</p>
          <Link href="/" className="text-primary text-sm">← Back to markets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">← Home</Link>
        <h1 className="text-sm font-medium">Propose a Market</h1>
        <div />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Question *</label>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Will Bangladesh win the next cricket world cup?"
              required
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Type</label>
            <div className="flex gap-2">
              {(["binary", "multi_choice"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, prediction_type: t })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${form.prediction_type === t ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary text-muted-foreground border-border"}`}
                >
                  {t === "binary" ? "Yes / No" : "Multi-choice"}
                </button>
              ))}
            </div>
          </div>

          {form.prediction_type === "multi_choice" && (
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Choices (min 2)</label>
              <div className="space-y-2">
                {choiceLabels.map((label, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => { const next = [...choiceLabels]; next[i] = e.target.value; setChoiceLabels(next); }}
                      placeholder={`Choice ${i + 1}`}
                      className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {choiceLabels.length > 2 && (
                      <button type="button" onClick={() => setChoiceLabels(choiceLabels.filter((_, j) => j !== i))} className="text-xs text-destructive px-2">×</button>
                    )}
                  </div>
                ))}
                {choiceLabels.length < 5 && (
                  <button type="button" onClick={() => setChoiceLabels([...choiceLabels, ""])} className="text-xs text-primary">+ Add choice</button>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Context / description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Resolution date</label>
            <input
              type="datetime-local"
              value={form.resolution_date}
              onChange={(e) => setForm({ ...form, resolution_date: e.target.value })}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">How will this resolve?</label>
            <input
              type="text"
              value={form.resolution_source}
              onChange={(e) => setForm({ ...form, resolution_source: e.target.value })}
              placeholder="e.g. ICC official results"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !form.title}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      </main>
    </div>
  );
}
