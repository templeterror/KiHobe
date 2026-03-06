"use client";

import { motion } from "framer-motion";
import { KiHobeLogo } from "@/components/kihobe-logo";

export function IntroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
      {/* Logo + badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center gap-4 mb-14"
      >
        <KiHobeLogo height={44} />
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-3xl sm:text-4xl lg:text-[3.25rem] font-bold text-white mb-7 tracking-tight leading-[1.12] max-w-xl"
      >
        Bangladesh&apos;s First
        <br />
        <span className="text-[var(--brand)]">Prediction Market</span>
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative text-white/50 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto"
      >
        You always try to predict the future
        <br />
        Now, you get <span className="font-semibold text-white">paid</span> for it
      </motion.p>
    </section>
  );
}
