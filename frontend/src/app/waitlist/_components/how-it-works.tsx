"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pick a question",
    body: "Real events happening in Bangladesh — politics, cricket, business. Each question has a closing date.",
  },
  {
    number: "02",
    title: "Vote YES or NO",
    body: "Spend coins to cast your vote. You can only vote once per question.",
  },
  {
    number: "03",
    title: "Win if you're right",
    body: "When the result is confirmed, everyone who voted correctly enters a lottery. One winner takes the bKash prize — paid instantly, no bank account needed.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Simple rules. Real rewards.
        </h2>
        <p className="text-white/40 text-sm max-w-xs mx-auto">
          Three steps. Just your opinion against Bangladesh.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111111] border border-white/8 rounded-2xl p-6"
          >
            <span className="text-[var(--brand)] font-bold text-xs tracking-widest mb-4 block">
              {step.number}
            </span>
            <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
