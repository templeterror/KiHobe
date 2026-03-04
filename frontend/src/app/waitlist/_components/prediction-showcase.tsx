"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PredictionChart } from "@/components/chart";
import type { VoteStatPoint } from "@/hooks/use-chart-data";
import { BNP_CHART_DATA, HASINA_CHART_DATA } from "../_lib/mock-data";

interface MockCard {
  title: string;
  yesCount: number;
  noCount: number;
  data: VoteStatPoint[];
  prize: string;
}

const CARDS: MockCard[] = [
  {
    title: "Will BNP win the most seats in the next Bangladesh general election?",
    yesCount: 523,
    noCount: 201,
    data: BNP_CHART_DATA,
    prize: "Win 1000 Tk",
  },
  {
    title: "Will Sheikh Hasina return to Bangladesh before the 2026 election?",
    yesCount: 134,
    noCount: 289,
    data: HASINA_CHART_DATA,
    prize: "Win 1000 Tk",
  },
];

function ChartOnVisible({ data }: { data: VoteStatPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ minHeight: 160 }}>
      {inView && <PredictionChart data={data} height={160} />}
    </div>
  );
}

function MockPredictionCard({ card, index }: { card: MockCard; index: number }) {
  const total = card.yesCount + card.noCount;
  const yesPct = Math.round((card.yesCount / total) * 100);
  const noPct = 100 - yesPct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#111111] border border-white/8 rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Live badge */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-[var(--no)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--no)] animate-pulse" />
          Live
        </span>
        <span className="text-[var(--brand)] text-xs">{card.prize}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white leading-snug">{card.title}</h3>

      {/* YES row */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/50">Yes</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{ backgroundColor: "rgba(10,194,133,0.15)", color: "#0ac285" }}
          >
            {yesPct}%
          </span>
        </div>
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${yesPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.12 + 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "#0ac285" }}
          />
        </div>
      </div>

      {/* NO row */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/50">No</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{ backgroundColor: "rgba(217,22,22,0.15)", color: "#d91616" }}
          >
            {noPct}%
          </span>
        </div>
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${noPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.12 + 0.4, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "#d91616" }}
          />
        </div>
      </div>

      {/* Chart */}
      <ChartOnVisible data={card.data} />

      {/* Footer */}
      <div className="text-xs text-white/30 mt-auto">
        {total.toLocaleString()} votes
      </div>
    </motion.div>
  );
}

export function PredictionShowcase() {
  return (
    <section className="px-4 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          What the crowd thinks right now
        </h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto">
          These questions are live on KiHobe. Every vote shifts the chart in real time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map((card, i) => (
          <MockPredictionCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}