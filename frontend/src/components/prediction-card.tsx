"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Prediction } from "@/hooks/use-predictions";
import { MULTI_CHOICE_COLORS } from "@/components/chart";

interface PredictionCardProps {
  prediction: Prediction;
  index?: number;
}

export function PredictionCard({ prediction, index = 0 }: PredictionCardProps) {
  const isMulti = prediction.prediction_type === "multi_choice" && prediction.choices;
  const counts = prediction.choice_counts || {};
  const multiTotal = Object.values(counts).reduce((a, b) => a + b, 0);
  const binaryTotal = prediction.yes_count + prediction.no_count;
  const total = isMulti ? multiTotal : binaryTotal;
  const yesPct = binaryTotal > 0 ? Math.round((prediction.yes_count / binaryTotal) * 100) : 50;
  const noPct = 100 - yesPct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link href={`/prediction/${prediction.id}`}>
        <div className="group bg-[#111111] border border-white/8 rounded-xl p-4 hover:border-[#ff5f05]/40 hover:bg-[#161616] transition-all cursor-pointer">

          {/* Title */}
          <h3 className="text-sm font-semibold text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#ff5f05] transition-colors">
            {prediction.title}
          </h3>

          {isMulti && prediction.choices ? (
            <>
              {prediction.choices.map((choice, i) => {
                const count = counts[choice.key] || 0;
                const pct = multiTotal > 0 ? Math.round((count / multiTotal) * 100) : 0;
                const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
                return (
                  <div key={choice.key} className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#e0e0e0]">{choice.label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: color.bg, color: color.line }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color.line }} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {/* YES row */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#e0e0e0]">Yes</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "rgba(10,194,133,0.15)", color: "#0ac285" }}>
                    {yesPct}%
                  </span>
                </div>
                <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${yesPct}%`, backgroundColor: "#0ac285" }} />
                </div>
              </div>

              {/* NO row */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#e0e0e0]">No</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: "rgba(217,22,22,0.15)", color: "#d91616" }}>
                    {noPct}%
                  </span>
                </div>
                <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${noPct}%`, backgroundColor: "#d91616" }} />
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[#e0e0e0]/60 mt-3">
            <span>{total.toLocaleString()} votes</span>
            {prediction.prize_description && (
              <span className="text-[#ff5f05]">🏆 {prediction.prize_description}</span>
            )}
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
