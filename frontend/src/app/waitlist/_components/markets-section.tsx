"use client";

import { motion } from "framer-motion";
import { MARKET_CARDS } from "../_lib/mock-data";
import { MockPredictionCard } from "./mock-prediction-card";

export function MarketsSection() {
  return (
    <section id="markets" className="relative bg-[var(--kihobe-green-dark)] px-5 py-28 sm:px-6 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <p className="font-odds mb-4 text-[11px] uppercase tracking-[0.28em] text-white/45 sm:text-xs">
            Markets
          </p>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-white [font-stretch:condensed] sm:text-5xl lg:text-6xl">
            From cricket
            <br />
            to the cabinet.
          </h2>
          <p className="font-editorial mt-6 max-w-sm text-lg leading-relaxed text-white/75">
            Live odds on the fights Bangladesh already has. Politics, cricket, the world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {MARKET_CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <MockPredictionCard card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
