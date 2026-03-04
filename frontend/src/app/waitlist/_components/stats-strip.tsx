"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

const MOCK_USERS = [
  { initials: "RH", city: "Dhaka" },
  { initials: "FA", city: "Chittagong" },
  { initials: "NS", city: "Sylhet" },
];

function CounterNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current || !ref.current) return;
    hasRun.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString();
        }
      },
    });
  }, [inView, target]);

  return <span ref={ref}>0</span>;
}

export function StatsStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-4 py-16 max-w-5xl mx-auto"
    >
      <div className="bg-[#111111] border border-white/8 rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Counter */}
        <div className="text-center sm:text-left">
          <p className="text-4xl font-bold text-white">
            <CounterNumber target={1240} />
          </p>
          <p className="text-white/40 text-sm mt-1">people already waiting</p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-12 bg-white/10" />

        {/* Mock users */}
        <div className="flex items-center gap-4">
          {MOCK_USERS.map((user) => (
            <div key={user.city} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/25 flex items-center justify-center text-[var(--brand)] text-xs font-bold">
                {user.initials}
              </div>
              <span className="text-white/35 text-xs">{user.city}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-xs font-semibold">
              +1.2k
            </div>
            <span className="text-white/35 text-xs">more</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
