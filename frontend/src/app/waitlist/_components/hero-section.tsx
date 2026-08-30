"use client";

import { motion } from "framer-motion";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { MARKET_CARDS } from "../_lib/mock-data";
import { MockPredictionCard, yesPctOf } from "./mock-prediction-card";

const featured = MARKET_CARDS[0];
const tickerItems = MARKET_CARDS.map((card) => {
  const yes = yesPctOf(card);
  return `${card.category}  ·  ${card.title}  ·  YES ${yes}%  ·  NO ${100 - yes}%`;
});

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      <DottedSurface tone="light" className="!absolute inset-0 z-0 opacity-50 sm:opacity-80" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:py-16">
        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-odds mb-6 text-[11px] uppercase tracking-[0.28em] text-[var(--brand-ink)] sm:text-xs"
          >
            Bangladesh
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.25rem,12vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-[var(--landing-ink)] [font-stretch:extra-condensed]"
          >
            Dekhi&nbsp;ki
            <br />
            <span className="text-[var(--brand-ink)]">hobe.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial mt-8 max-w-md text-lg leading-relaxed text-[var(--landing-muted)] sm:text-xl"
          >
            Bangladesh&apos;s first prediction market.
            <span className="mt-1 block italic text-[var(--landing-faint)]">
              The scoreboard for every argument you already have.
            </span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 1.4 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-md lg:mx-0 lg:-ml-6 lg:max-w-none"
        >
          <MockPredictionCard card={featured} featured />
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-[var(--landing-line)] bg-[var(--landing-bg-alt)]/80">
        <div className="overflow-hidden py-3">
          <div className="landing-ticker-track flex w-max gap-0">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0">
                {tickerItems.map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="font-odds flex items-center px-6 text-[11px] uppercase tracking-[0.18em] text-[var(--landing-faint)]"
                  >
                    <span className="mr-6 inline-block h-1 w-1 rounded-full bg-[var(--brand)]" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
