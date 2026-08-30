"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    n: "01",
    title: "Pick a market",
    body: "Cricket. Cabinet. The thing your group chat will not shut up about. If people are arguing, it is a market.",
  },
  {
    n: "02",
    title: "Spend coins, not cash",
    body: "You play with coins. No money required to participate. (We know our audience hates Shakib al Hasan.)",
  },
  {
    n: "03",
    title: "Right calls enter a lottery",
    body: "Correct voters get tickets. The more you went against the crowd, the more tickets you hold. Winners walk with gifts or cash.",
  },
];

export function HowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=220%",
        pin,
        pinSpacing: true,
        onUpdate: (self) => {
          const next = Math.min(2, Math.floor(self.progress * 3));
          setStep((prev) => (prev === next ? prev : next));
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="how" ref={sectionRef} className="relative bg-[var(--kihobe-green-dark)]">
      <div
        ref={pinRef}
        className="flex min-h-0 flex-col justify-center px-5 py-28 sm:px-6 sm:py-36 lg:min-h-[100svh] lg:py-0"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-odds mb-10 text-[11px] uppercase tracking-[0.28em] text-white/45 sm:text-xs">
            How it works
          </p>

          <div className="hidden grid-cols-[auto_1fr] gap-x-10 gap-y-4 lg:grid lg:gap-x-16">
            <div className="flex flex-col gap-3 pt-2">
              {steps.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`font-odds text-left text-xs tabular-nums tracking-[0.2em] transition-colors ${
                    i === step ? "text-white" : "text-white/35"
                  }`}
                  aria-current={i === step}
                >
                  {s.n}
                </button>
              ))}
            </div>

            <div className="min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-odds mb-4 text-sm tabular-nums text-white/70">
                    {steps[step].n} / 03
                  </p>
                  <h2 className="font-display text-5xl font-extrabold tracking-[-0.045em] text-white [font-stretch:condensed] sm:text-6xl lg:text-7xl">
                    {steps[step].title}
                  </h2>
                  <p className="font-editorial mt-8 max-w-xl text-xl leading-relaxed text-white/75 sm:text-2xl">
                    {steps[step].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-16 sm:space-y-20 lg:hidden">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="font-odds mb-3 text-xs tabular-nums tracking-[0.2em] text-white/70">
                  {s.n}
                </p>
                <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-white [font-stretch:condensed] sm:text-5xl">
                  {s.title}
                </h2>
                <p className="font-editorial mt-5 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
