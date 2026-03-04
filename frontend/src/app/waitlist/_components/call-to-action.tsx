"use client";

import { motion } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";

export function CallToAction() {
  return (
    <section className="px-4 py-16 max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Be the first to predict.
        </h2>
        <p className="text-white/45 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          KiHobe is launching soon. Join the waitlist and get early access.
        </p>
        <WaitlistForm size="large" />
        <p className="text-white/25 text-xs mt-3">
          No spam. We&apos;ll text you when we launch.
        </p>
      </motion.div>
    </section>
  );
}
