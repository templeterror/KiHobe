"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitToWaitlist } from "../_lib/waitlist";

interface WaitlistFormProps {
  size?: "default" | "large";
}

export function WaitlistForm({ size = "default" }: WaitlistFormProps) {
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
    try {
      await submitToWaitlist(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    size === "large"
      ? "flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-3.5 text-base text-white focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/50 focus:border-[var(--brand)]/30 placeholder:text-white/30 transition-all backdrop-blur-sm"
      : "flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/50 focus:border-[var(--brand)]/30 placeholder:text-white/30 transition-all backdrop-blur-sm";

  const btnClass =
    size === "large"
      ? "font-semibold rounded-xl px-7 py-3.5 text-base whitespace-nowrap transition-all disabled:opacity-50 text-[#1A1B1F] shadow-[0_0_24px_rgba(255,186,8,0.2)]"
      : "font-semibold rounded-lg px-5 py-3 text-sm whitespace-nowrap transition-all disabled:opacity-50 text-[#1A1B1F] shadow-[0_0_20px_rgba(255,186,8,0.15)]";

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[var(--yes)]/10 border border-[var(--yes)]/25 rounded-xl px-5 py-4 backdrop-blur-sm"
        >
          <span className="text-[var(--yes)] text-xl">&#10003;</span>
          <div>
            <p className="text-white font-semibold text-sm">You&apos;re on the list.</p>
            <p className="text-white/50 text-xs mt-0.5">We&apos;ll reach out when KiHobe opens.</p>
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
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className={btnClass}
              style={{
                background: "linear-gradient(135deg, #FFBA08 0%, #FFD166 100%)",
              }}
            >
              {loading ? "Joining\u2026" : "Get early access"}
            </button>
          </div>
          {error && (
            <p className="text-[var(--no)] text-xs mt-2 pl-1">{error}</p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
