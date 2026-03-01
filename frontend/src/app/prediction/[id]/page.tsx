"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { usePrediction } from "@/hooks/use-predictions";
import { useChartData } from "@/hooks/use-chart-data";
import { useAuth } from "@/hooks/use-auth";
import { VoteButtons } from "@/components/vote-buttons";
import { MULTI_CHOICE_COLORS } from "@/components/chart";
import { shareWhatsApp, shareMessenger, shareTelegram, copyLink, getMarketUrl } from "@/lib/share";

const PredictionChart = dynamic(
  () => import("@/components/chart").then((m) => m.PredictionChart),
  { ssr: false, loading: () => <div className="h-[200px] bg-white/5 rounded-lg animate-pulse" /> }
);

export default function PredictionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { prediction, loading } = usePrediction(id);
  const { data: chartData } = useChartData(id);
  const { user } = useAuth();
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-7 w-7 border-2 rounded-full" style={{ borderColor: "#ff5f05", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!prediction) notFound();

  const isMulti = prediction.prediction_type === "multi_choice" && prediction.choices;
  const counts = prediction.choice_counts || {};
  const multiTotal = Object.values(counts).reduce((a, b) => a + b, 0);
  const binaryTotal = prediction.yes_count + prediction.no_count;
  const total = isMulti ? multiTotal : binaryTotal;
  const yesPct = binaryTotal > 0 ? Math.round((prediction.yes_count / binaryTotal) * 100) : 50;
  const noPct = 100 - yesPct;
  const marketUrl = typeof window !== "undefined" ? getMarketUrl(id) : "";

  const handleCopy = async () => {
    await copyLink(marketUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-[#e0e0e0] hover:text-white text-sm font-medium transition-colors">← Back</Link>
        {prediction.category && (
          <span className="text-xs font-medium text-[#e0e0e0] bg-white/10 px-2 py-0.5 rounded-full">
            {prediction.category}
          </span>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* Title */}
          <h1 className="text-xl font-semibold leading-snug text-white">{prediction.title}</h1>

          {/* Vote count boxes */}
          {isMulti && prediction.choices ? (
            <div className={`grid gap-3 ${prediction.choices.length <= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {prediction.choices.map((choice, i) => {
                const count = counts[choice.key] || 0;
                const pct = multiTotal > 0 ? Math.round((count / multiTotal) * 100) : 0;
                const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
                return (
                  <div key={choice.key} className="rounded-xl p-3 text-center border" style={{ backgroundColor: color.bg, borderColor: color.border }}>
                    <div className="text-2xl font-semibold tabular-nums" style={{ color: color.line }}>{pct}%</div>
                    <div className="text-[10px] text-[#e0e0e0] mt-1 leading-tight">{choice.label} · {count.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: "rgba(10,194,133,0.08)", borderColor: "rgba(10,194,133,0.25)" }}>
                <div className="text-3xl font-semibold" style={{ color: "#0ac285" }}>{yesPct}%</div>
                <div className="text-xs text-[#e0e0e0] mt-1">YES · {prediction.yes_count.toLocaleString()}</div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: "rgba(217,22,22,0.08)", borderColor: "rgba(217,22,22,0.25)" }}>
                <div className="text-3xl font-semibold" style={{ color: "#d91616" }}>{noPct}%</div>
                <div className="text-xs text-[#e0e0e0] mt-1">NO · {prediction.no_count.toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-[#141619] border border-white/8 rounded-xl p-4">
              {isMulti && prediction.choices ? (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                  {prediction.choices.map((choice, i) => {
                    const count = counts[choice.key] || 0;
                    const pct = multiTotal > 0 ? Math.round((count / multiTotal) * 100) : 0;
                    const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
                    return (
                      <div key={choice.key} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.line }} />
                        <span className="text-xs text-white/50">{choice.label}</span>
                        <span className="text-xs font-semibold text-white tabular-nums">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#0ac285]" />
                  <span className="text-xs text-white/50">Yes probability</span>
                  <span className="text-sm font-semibold text-white ml-auto tabular-nums">{yesPct}%</span>
                </div>
              )}
              <PredictionChart
                data={chartData}
                predictionType={prediction.prediction_type}
                choices={prediction.choices}
              />
            </div>
          )}

          {/* Vote buttons */}
          {prediction.status === "active" && (
            <div className="bg-[#2e2e2e] border border-white/10 rounded-xl p-4">
              <VoteButtons
                predictionId={id}
                isAuthenticated={!!user}
                onAuthRequired={() => { window.location.href = "/login"; }}
                onVoted={(bal) => setCoinBalance(bal)}
                predictionType={prediction.prediction_type}
                choices={prediction.choices}
              />
              {coinBalance !== null && (
                <p className="text-xs text-center text-[#e0e0e0] mt-2">New balance: {coinBalance} coins</p>
              )}
            </div>
          )}

          {/* Description */}
          {prediction.description && (
            <div className="bg-[#2e2e2e] border border-white/10 rounded-xl p-4">
              <p className="text-sm text-[#e0e0e0] leading-relaxed">{prediction.description}</p>
            </div>
          )}

          {/* Meta */}
          <div className="bg-[#2e2e2e] border border-white/10 rounded-xl p-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#e0e0e0]">Total votes</span>
              <span className="text-white font-medium">{total.toLocaleString()}</span>
            </div>
            {prediction.resolution_date && (
              <div className="flex justify-between">
                <span className="text-[#e0e0e0]">Closes</span>
                <span className="text-white font-medium">
                  {new Date(prediction.resolution_date).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            )}
            {prediction.prize_description && (
              <div className="flex justify-between">
                <span className="text-[#e0e0e0]">Prize</span>
                <span className="text-white font-medium">🏆 {prediction.prize_description}</span>
              </div>
            )}
          </div>

          {/* Share */}
          <div className="bg-[#2e2e2e] border border-white/10 rounded-xl p-4">
            <p className="text-xs text-[#e0e0e0] mb-3">Share this market</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "WhatsApp", action: () => shareWhatsApp(prediction.title, marketUrl) },
                { label: "Messenger", action: () => shareMessenger(marketUrl) },
                { label: "Telegram", action: () => shareTelegram(prediction.title, marketUrl) },
                { label: copied ? "Copied!" : "Copy", action: handleCopy },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="py-2 rounded-lg text-xs font-medium text-[#e0e0e0] hover:text-white transition-colors bg-white/5 hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
