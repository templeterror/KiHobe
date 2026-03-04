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
      ? "flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-white/30"
      : "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-white/30";

  const btnClass =
    size === "large"
      ? "bg-[var(--brand)] text-white font-semibold rounded-xl px-6 py-3.5 text-base whitespace-nowrap hover:bg-[var(--brand-secondary)] transition-colors disabled:opacity-50"
      : "bg-[var(--brand)] text-white font-semibold rounded-lg px-5 py-3 text-sm whitespace-nowrap hover:bg-[var(--brand-secondary)] transition-colors disabled:opacity-50";

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[var(--yes)]/10 border border-[var(--yes)]/30 rounded-xl px-5 py-4"
        >
          <span className="text-[var(--yes)] text-xl">✓</span>
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
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button type="submit" disabled={loading || !email} className={btnClass}>
              {loading ? "Joining…" : "Get early access"}
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
