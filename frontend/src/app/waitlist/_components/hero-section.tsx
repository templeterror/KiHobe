"use client";

import React from "react";
import { motion } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";
import { PredictionChart } from "@/components/chart";
import { BNP_CHART_DATA } from "../_lib/mock-data";

const headlineWords = ["Who's", "right", "about", "Bangladesh?"];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const word = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function FadeUp({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MockPredictionCard() {
  const card = {
    title: "Will BNP win the most seats in the next Bangladesh general election?",
    yesCount: 523,
    noCount: 201,
    data: BNP_CHART_DATA,
    prize: "Win 1000 Tk",
  };
  const total = card.yesCount + card.noCount;
  const yesPct = Math.round((card.yesCount / total) * 100);
  const noPct = 100 - yesPct;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            style={{ backgroundColor: "rgba(234,179,8,0.15)", color: "#eab308" }}
          >
            {yesPct}%
          </span>
        </div>
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${yesPct}%` }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "#eab308" }}
          />
        </div>
      </div>

      {/* NO row */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/50">No</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{ backgroundColor: "rgba(234,179,8,0.1)", color: "#D91616" }}
          >
            {noPct}%
          </span>
        </div>
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${noPct}%` }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "#D91616", opacity: 0.5 }}
          />
        </div>
      </div>

      {/* Chart */}
      <PredictionChart data={card.data} height={140} />

      {/* Footer */}
      <div className="text-xs text-white/30 mt-auto">
        {total.toLocaleString()} votes
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex flex-col px-4 py-16 max-w-6xl mx-auto overflow-hidden">
      {/* Subtle brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 40%, rgba(255,95,5,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main: two columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8">
        {/* Left: copy + form */}
        <div>
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-white mb-5"
          >
            {headlineWords.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-3">
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <FadeUp delay={0.55} className="text-white/55 text-base sm:text-lg mb-8 leading-relaxed max-w-sm">
            <p>
              Predict politics, cricket, and business. Vote YES or NO.
              Beat the crowd. Win prizes.
            </p>
          </FadeUp>

          <FadeUp delay={0.7} className="w-full max-w-md">
            <WaitlistForm size="large" />
            <p className="text-white/25 text-xs mt-3">
              No spam. We&apos;ll text you when we launch.
            </p>
          </FadeUp>
        </div>

        {/* Right: prediction card */}
        <div className="w-full max-w-sm mx-auto lg:max-w-none">
          <MockPredictionCard />
        </div>
      </div>
    </section>
  );
}
