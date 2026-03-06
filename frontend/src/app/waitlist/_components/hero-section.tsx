"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";
import { PredictionChart } from "@/components/chart";
import { IRAN_CHART_DATA, ABBAS_CHART_DATA, HASINA_CHART_DATA } from "../_lib/mock-data";
import type { VoteStatPoint } from "@/hooks/use-chart-data";

const lines = [
  "Everybody makes predictions",
  "But nobody keeps score",
  "KiHobe gives you a scoreboard",
  "\u201CTong er adda\u201D with the entire country",
];

const prizes = ["500 Tk", "1000 Tk", "5000 Tk"];

interface CardData {
  title: string;
  yesCount: number;
  noCount: number;
  data: VoteStatPoint[];
  prize: string;
}

const cards: CardData[] = [
  {
    title: "Will the US send ground troops to Iran before August 2026?",
    yesCount: 4500,
    noCount: 1055,
    data: IRAN_CHART_DATA,
    prize: "Win 500 Tk",
  },
  {
    title: "Will Mirza Abbas get convicted of 'Chadabaji' during his term?",
    yesCount: 4000,
    noCount: 3101,
    data: ABBAS_CHART_DATA,
    prize: "Win 1000 Tk",
  },
  {
    title: "Will Sheikh Hasina return to Bangladesh before 2027?",
    yesCount: 800,
    noCount: 4500,
    data: HASINA_CHART_DATA,
    prize: "Win 5000 Tk",
  },
];

function RotatingPrize() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % prizes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden align-middle rounded-md w-[130px] h-[42px] sm:w-[105px] sm:h-[34px] sm:ml-2"
      style={{ background: "linear-gradient(135deg, #FFBA08 0%, #FFD166 100%)" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#1A1B1F] font-bold text-2xl sm:text-lg"
        >
          {prizes[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function MockPredictionCard({ card }: { card: CardData }) {
  const total = card.yesCount + card.noCount;
  const yesPct = Math.round((card.yesCount / total) * 100);
  const noPct = 100 - yesPct;

  return (
    <div className="relative bg-[#222327]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-[var(--no)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--no)] animate-pulse" />
          Live
        </span>
        <span className="text-[var(--brand)] text-xs font-semibold tracking-wide">{card.prize}</span>
      </div>

      <h3 className="text-[15px] font-semibold text-white leading-snug tracking-[-0.01em]">{card.title}</h3>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/45 font-medium uppercase tracking-wider">Yes</span>
          <span className="text-xs font-bold text-[var(--brand)]">{yesPct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${yesPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #FFBA08, #FFD166)",
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/45 font-medium uppercase tracking-wider">No</span>
          <span className="text-xs font-bold text-[var(--no)]">{noPct}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${noPct}%` }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="h-full rounded-full bg-[var(--no)]/50"
          />
        </div>
      </div>

      <div className="pt-1">
        <PredictionChart data={card.data} height={150} />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
        <span className="text-xs text-white/30 font-medium">
          {total.toLocaleString()} votes
        </span>
        <span className="text-xs text-white/20">Updated live</span>
      </div>
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function PredictionCarousel() {
  const [[activeIndex, direction], setActive] = useState([0, 1]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  const next = useCallback(() => {
    setActive(([prev]) => [(prev + 1) % cards.length, 1]);
  }, []);

  const prev = useCallback(() => {
    setActive(([prev]) => [(prev - 1 + cards.length) % cards.length, -1]);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 3000);
  }, [next]);

  useEffect(() => {
    timerRef.current = setInterval(next, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const handlePanEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.velocity.y < -200 || info.offset.y < -50) {
        next();
        resetTimer();
      } else if (info.velocity.y > 200 || info.offset.y > 50) {
        prev();
        resetTimer();
      }
    },
    [next, prev, resetTimer],
  );

  const handleDotClick = useCallback(
    (index: number) => {
      goTo(index);
      resetTimer();
    },
    [goTo, resetTimer],
  );

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="relative overflow-hidden"
        style={{ minHeight: 420 }}
        onPanEnd={handlePanEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <MockPredictionCard card={cards[activeIndex]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to prediction ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-4 bg-[var(--brand)]"
                : "w-2 bg-white/20 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative px-6 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Left: copy + form */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl text-white"
            >
              {line}
            </motion.p>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl font-bold text-white"
          >
            <span className="whitespace-nowrap">Winners get rewarded with</span>{" "}
            <span className="block h-3 sm:hidden" />
            <RotatingPrize />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4"
          >
            <p className="text-white/40 text-sm mb-4">Join the waitlist for early access</p>
            <div className="max-w-lg">
              <WaitlistForm size="large" />
            </div>
          </motion.div>
        </div>

        {/* Right: prediction carousel */}
        <div className="w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-2">
          <PredictionCarousel />
        </div>
      </div>
    </section>
  );
}
