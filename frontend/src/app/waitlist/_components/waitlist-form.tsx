"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistFormProps {
  size?: "default" | "large";
  inset?: boolean;
  onDark?: boolean;
}

export function WaitlistForm({ size = "default", inset = false, onDark = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);
    setSubmitted(true);
  };

  const large = size === "large";

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 rounded-xl px-5 py-4 ${
            onDark
              ? "border border-white/15 bg-white/10"
              : "border border-[var(--kihobe-green-dark)]/20 bg-[var(--kihobe-green)]/15"
          }`}
        >
          <span className={`text-lg ${onDark ? "text-[#00DD94]" : "text-[var(--kihobe-green-dark)]"}`}>&#10003;</span>
          <div>
            <p className={`font-display text-sm font-extrabold tracking-wide [font-stretch:condensed] ${onDark ? "text-white" : "text-[var(--landing-ink)]"}`}>
              You&apos;re on the list.
            </p>
            <p className={`mt-0.5 font-editorial text-sm ${onDark ? "text-white/70" : "text-[var(--landing-faint)]"}`}>
              We&apos;ll reach out when KiHobe opens.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onSubmit={handleSubmit}
          className="w-full"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 border transition-colors focus:outline-none focus:ring-1 ${
                onDark
                  ? "border-white/15 bg-white text-[var(--kihobe-ink)] placeholder:text-[var(--landing-ghost)] focus:border-[#00DD94] focus:ring-[#00DD94]"
                  : `border-[var(--landing-line)] text-[var(--landing-ink)] placeholder:text-[var(--landing-ghost)] focus:border-[var(--kihobe-green-market)] focus:ring-[var(--kihobe-green)] ${
                      inset ? "bg-[var(--kihobe-paper)]" : "bg-[var(--landing-card)]"
                    }`
              } ${large ? "rounded-xl px-5 py-3.5 text-base" : "rounded-lg px-4 py-3 text-sm"}`}
            />
            <button
              type="submit"
              disabled={loading}
              className={`whitespace-nowrap bg-[#00DD94] font-display font-extrabold tracking-wide text-[#050D0A] [font-stretch:condensed] ${
                large ? "rounded-xl px-7 py-3.5 text-base" : "rounded-lg px-5 py-3 text-sm"
              }`}
            >
              {loading ? "Joining\u2026" : "Get early access"}
            </button>
          </div>
          {error && <p className="mt-2 pl-1 text-xs text-[var(--no)]">{error}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
