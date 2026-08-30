"use client";

import { motion } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";

const rows = [
  { rank: 1, name: "Shuvo", record: "41–12", coins: "12,400", take: "Hasina stays out." },
  { rank: 2, name: "Farzana", record: "38–15", coins: "10,820", take: "India in 3." },
  { rank: 3, name: "Arif", record: "36–19", coins: "9,150", take: "Abbas walks." },
  { rank: 4, name: "Mehnaz", record: "33–14", coins: "8,640", take: "No ground troops." },
  { rank: 5, name: "Tonmoy", record: "29–21", coins: "7,200", take: "Tigers in the final." },
  { rank: 6, name: "Sadia", record: "27–16", coins: "6,880", take: "Election before Eid." },
];

export function ScoreboardSection() {
  return (
    <section id="rank" className="relative px-5 py-28 sm:px-6 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <p className="font-odds mb-4 text-[11px] uppercase tracking-[0.28em] text-[var(--brand-ink)] sm:text-xs">
            Rank
          </p>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-[var(--landing-ink)] [font-stretch:condensed] sm:text-5xl lg:text-6xl">
            Flex the leaderboard.
          </h2>
          <p className="font-editorial mt-6 text-lg leading-relaxed text-[var(--landing-muted)] sm:text-xl">
            Compete with friends. Share the take. Keep the record public.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--landing-line)] bg-[var(--landing-card)] shadow-[0_20px_40px_rgba(10,10,12,0.08)]">
          <div className="hidden grid-cols-[3.5rem_1fr_7rem_7rem_1fr] border-b border-[var(--landing-line)] px-6 py-3 font-odds text-[10px] uppercase tracking-[0.2em] text-[var(--landing-ghost)] sm:grid">
            <span>#</span>
            <span>Name</span>
            <span>Record</span>
            <span>Coins</span>
            <span>Latest take</span>
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-[3rem_1fr] items-center gap-y-1 border-b border-[var(--landing-line)] px-5 py-3.5 last:border-b-0 sm:grid-cols-[3.5rem_1fr_7rem_7rem_1fr] sm:px-6"
            >
              <span
                className={`font-odds text-sm tabular-nums ${
                  row.rank === 1 ? "text-[var(--kihobe-green-market)]" : "text-[var(--landing-ghost)]"
                }`}
              >
                {String(row.rank).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-extrabold tracking-[-0.03em] text-[var(--landing-ink)] [font-stretch:condensed]">
                {row.name}
              </span>
              <span className="col-start-2 font-odds text-xs tabular-nums text-[var(--landing-faint)] sm:col-start-auto sm:text-sm">
                {row.record}
              </span>
              <span className="hidden font-odds text-sm tabular-nums text-[var(--landing-muted)] sm:block">
                {row.coins}
              </span>
              <span className="col-span-2 font-editorial text-sm italic text-[var(--landing-faint)] sm:col-span-1 sm:text-base">
                {row.take}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid items-center gap-8 rounded-3xl bg-[var(--kihobe-green-dark)] px-6 py-8 sm:px-8 lg:mt-10 lg:grid-cols-[1fr_1.15fr] lg:px-10 lg:py-12">
          <div>
            <p className="font-odds mb-3 text-[11px] uppercase tracking-[0.28em] text-[#00DD94] sm:text-xs">
              Early access
            </p>
            <p className="font-display text-3xl font-extrabold tracking-[-0.04em] text-white [font-stretch:condensed] sm:text-4xl">
              Get on the list.
            </p>
            <p className="font-editorial mt-3 max-w-sm text-lg leading-relaxed text-white/75">
              We&apos;ll ping you when it opens.
            </p>
          </div>
          <WaitlistForm size="large" onDark />
        </div>
      </div>
    </section>
  );
}
