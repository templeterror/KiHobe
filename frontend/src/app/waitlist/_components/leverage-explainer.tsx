"use client";

import { motion } from "framer-motion";

export function LeverageExplainer() {
  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div>
            <span className="text-[var(--brand)] text-xs font-bold tracking-widest uppercase mb-3 block">
              The KiHobe Edge
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              Bet against the crowd.
              <br />
              Win bigger.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              When 70% say YES and you say NO — your lottery ticket is worth more. You&apos;re in a
              smaller pool competing for the same prize. KiHobe rewards conviction, not conformity.
            </p>
          </div>

          {/* Visual: two voter rows */}
          <div className="flex flex-col gap-3">
            {/* With crowd */}
            <div className="bg-white/4 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white/70 text-xs font-medium">With the crowd</p>
                  <p className="text-white/35 text-xs mt-0.5">70% voted YES</p>
                </div>
                <span className="text-white/40 text-sm font-semibold">1× odds</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-white/20" style={{ width: "70%" }} />
              </div>
              <p className="text-white/25 text-xs mt-1.5">You share the prize pool with most voters</p>
            </div>

            {/* Against crowd */}
            <div className="bg-[var(--brand)]/8 border border-[var(--brand)]/20 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white font-medium text-xs">Against the crowd</p>
                  <p className="text-white/50 text-xs mt-0.5">30% voted NO</p>
                </div>
                <span className="text-[var(--brand)] text-sm font-bold">2.3× odds</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: "30%" }}
                />
              </div>
              <p className="text-white/50 text-xs mt-1.5">Smaller pool → better lottery odds</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
