"use client";

import { motion } from "framer-motion";
import { PredictionChart } from "@/components/chart";
import type { MarketCardData } from "../_lib/mock-data";

export function yesPctOf(card: MarketCardData) {
  const total = card.yesCount + card.noCount;
  return total > 0 ? Math.round((card.yesCount / total) * 100) : 50;
}

export function MockPredictionCard({
  card,
  featured = false,
}: {
  card: MarketCardData;
  compact?: boolean;
  featured?: boolean;
}) {
  const total = card.yesCount + card.noCount;
  const yesPct = yesPctOf(card);
  const noPct = 100 - yesPct;

  return (
    <article
      className={`relative flex h-full flex-col border border-[var(--landing-line)] bg-[var(--landing-card)] shadow-[0_20px_40px_rgba(10,10,12,0.1)] ${
        featured ? "gap-6 p-6 sm:p-8 rounded-3xl" : "gap-5 p-5 sm:p-6 rounded-2xl"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-odds text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--no)] sm:text-xs">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--no)]" />
          Live
        </span>
        <span className="font-odds text-[10px] uppercase tracking-[0.16em] text-[var(--landing-ghost)] sm:text-xs">
          {card.category}
        </span>
      </div>

      <h3
        className={`font-display font-extrabold leading-snug tracking-[-0.03em] text-[var(--landing-ink)] [font-stretch:condensed] ${
          featured ? "text-xl sm:text-2xl min-h-[2.6em]" : "text-[15px] sm:text-lg min-h-[2.5em]"
        }`}
      >
        {card.title}
      </h3>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-odds text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--landing-faint)]">
            Yes
          </span>
          <span className="font-odds text-xs font-semibold tabular-nums text-[var(--brand-ink)]">
            {yesPct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-track)]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${yesPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--brand-grad)" }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-odds text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--landing-faint)]">
            No
          </span>
          <span className="font-odds text-xs font-semibold tabular-nums text-[var(--no)]">
            {noPct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-track)]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${noPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full bg-[var(--no)]/55"
          />
        </div>
      </div>

      <div className="h-[200px] w-full shrink-0">
        <PredictionChart data={card.data} height={200} light lineColor="#00B67A" interactive={false} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[var(--landing-line)] pt-3">
        <span className="font-odds text-[11px] tabular-nums text-[var(--landing-ghost)]">
          {total.toLocaleString()} votes
        </span>
        <span className="font-display text-xs font-semibold tracking-wide text-[var(--brand-ink)] [font-stretch:condensed]">
          {card.prize}
        </span>
      </div>
    </article>
  );
}
