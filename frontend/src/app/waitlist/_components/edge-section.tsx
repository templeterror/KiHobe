"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const MIN = 55;
const MAX = 92;
const DEFAULT = 78;

function lotteryWeight(crowdYes: number, pick: "yes" | "no") {
  const yes = crowdYes / 100;
  const no = 1 - yes;
  const yours = pick === "yes" ? yes : no;
  return yours <= 0 ? 99 : (1 - yours) / yours;
}

export function EdgeSection() {
  const [crowdYes, setCrowdYes] = useState(DEFAULT);
  const [pick, setPick] = useState<"yes" | "no">("no");

  const barRef = useRef<HTMLDivElement>(null);
  const weight = useMemo(() => lotteryWeight(crowdYes, pick), [crowdYes, pick]);
  const crowdNo = 100 - crowdYes;
  const againstCrowd = (pick === "yes" && crowdYes < 50) || (pick === "no" && crowdYes >= 50);

  const setFromClientX = useCallback((clientX: number) => {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.round(((clientX - rect.left) / rect.width) * 100);
    setCrowdYes(Math.min(MAX, Math.max(MIN, next)));
  }, []);

  return (
    <section id="edge" className="relative px-5 py-28 sm:px-6 sm:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <p className="font-odds mb-5 text-[11px] uppercase tracking-[0.28em] text-[var(--brand-ink)] sm:text-xs">
            The edge
          </p>
          <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.045em] text-[var(--landing-ink)] [font-stretch:condensed] sm:text-6xl lg:text-7xl">
            The crowd
            <br />
            is the payout.
          </h2>
          <p className="font-editorial mt-8 max-w-md text-lg leading-relaxed text-[var(--landing-muted)] sm:text-xl">
            Betting with everyone else is cheap. Betting against them is how you stack lottery tickets.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--landing-line)] bg-[var(--landing-card)] p-6 shadow-[0_24px_50px_rgba(10,10,12,0.12)] sm:p-8">
          <p className="font-editorial text-lg text-[var(--landing-muted)] sm:text-xl">
            Will Bangladesh win the next Asia Cup?
          </p>

          <div className="mt-8">
            <div className="mb-2 flex items-end justify-between">
              <span className="font-odds text-xs uppercase tracking-[0.16em] text-[var(--brand-ink)]">
                Yes {crowdYes}%
              </span>
              <span className="font-odds text-xs uppercase tracking-[0.16em] text-[var(--no)]">
                No {crowdNo}%
              </span>
            </div>
            <div
              ref={barRef}
              role="slider"
              tabIndex={0}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={crowdYes}
              aria-label="Crowd yes percentage"
              className="relative mt-1 h-8 cursor-ew-resize touch-none outline-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setFromClientX(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  setFromClientX(e.clientX);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setCrowdYes((v) => Math.max(MIN, v - 1));
                }
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setCrowdYes((v) => Math.min(MAX, v + 1));
                }
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full bg-[var(--landing-track)]">
                <div
                  className="h-full"
                  style={{
                    width: `${crowdYes}%`,
                    background: "var(--brand-grad)",
                  }}
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#050D0A] bg-[#00DD94]"
                style={{ left: `${crowdYes}%` }}
              />
            </div>
            <p className="font-odds mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--landing-ghost)]">
              Drag the crowd
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setPick("yes")}
              className={`flex-1 rounded-xl border py-3.5 font-display text-sm font-extrabold tracking-wide [font-stretch:condensed] transition-colors ${
                pick === "yes"
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--kihobe-ink)]"
                  : "border-[var(--landing-line)] bg-transparent text-[var(--landing-muted)] hover:text-[var(--landing-ink)]"
              }`}
            >
              You call YES
            </button>
            <button
              type="button"
              onClick={() => setPick("no")}
              className={`flex-1 rounded-xl border py-3.5 font-display text-sm font-extrabold tracking-wide [font-stretch:condensed] transition-colors ${
                pick === "no"
                  ? "border-[var(--no)] bg-[var(--no)] text-white"
                  : "border-[var(--landing-line)] bg-transparent text-[var(--landing-muted)] hover:text-[var(--landing-ink)]"
              }`}
            >
              You call NO
            </button>
          </div>

          <div className="mt-10 border-t border-[var(--landing-line)] pt-8">
            <p className="font-odds text-[10px] uppercase tracking-[0.22em] text-[var(--landing-ghost)]">
              Your lottery weight
            </p>
            <motion.p
              key={`${pick}-${crowdYes}`}
              initial={{ opacity: 0.4, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display mt-2 text-6xl font-extrabold tabular-nums tracking-[-0.05em] text-[var(--landing-ink)] [font-stretch:condensed] sm:text-7xl"
            >
              {weight.toFixed(1)}
              <span className="text-[0.55em] text-[var(--brand-ink)]">×</span>
            </motion.p>
            <p className="font-editorial mt-4 max-w-md text-base leading-relaxed text-[var(--landing-faint)]">
              {againstCrowd
                ? `When you fade ${Math.max(crowdYes, crowdNo)}% of the room, you hold ${weight.toFixed(1)}× the tickets if you are right.`
                : `You are with the crowd. Fewer tickets. Safer, and much less interesting.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
