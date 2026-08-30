"use client";

import { motion } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";

export function AddaSection() {
  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-6 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 font-bengali text-[clamp(4.5rem,18vw,14rem)] font-semibold leading-none text-[var(--landing-ink)]/[0.08] select-none">
        দেখি কি হবে
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bengali text-4xl font-semibold leading-tight text-[var(--brand-ink)] sm:text-5xl lg:text-6xl"
        >
          দেখি কি হবে
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial mx-auto mt-10 max-w-xl text-xl leading-relaxed text-[var(--landing-muted)] sm:text-2xl"
        >
          From cricket to politics, every tong er adda ends the same way.
          A take. A laugh. Nothing written down.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="font-editorial mx-auto mt-8 max-w-lg text-lg leading-relaxed text-[var(--landing-faint)] sm:text-xl"
        >
          But no one tracks the result.
          <span className="mt-2 block text-[var(--landing-ink)]">KiHobe keeps score.</span>
        </motion.p>

        <motion.div
          id="waitlist"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-md scroll-mt-24"
        >
          <WaitlistForm size="large" />
        </motion.div>
      </div>
    </section>
  );
}
