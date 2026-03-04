"use client";

import { motion } from "framer-motion";
import { KiHobeLogo } from "@/components/kihobe-logo";

export function IntroSection() {
  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center px-4 py-16 max-w-6xl mx-auto text-center">
      {/* Logo + badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <KiHobeLogo height={40} />
        <span className="text-white/30 text-xs border border-white/10 rounded-full px-2 py-0.5">
          Early Access
        </span>
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          A prediction market built for Bangladesh.
        </h2>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Vote YES or NO on real events — elections, cricket, business — using coins, not cash.
          No deposits. No real money bets. If you&apos;re right, you enter a lottery for a real bKash prize.
        </p>
      </motion.div>
    </section>
  );
}
