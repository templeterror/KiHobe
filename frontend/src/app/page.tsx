"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { usePredictions } from "@/hooks/use-predictions";
import { PredictionCard } from "@/components/prediction-card";
import { FeaturedCard } from "@/components/featured-card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "politics", label: "Politics" },
  { key: "international politics", label: "International politics" },
];

export default function HomePage() {
  const { predictions, loading, error } = usePredictions();
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filtered = activeCategory === "all"
    ? predictions
    : predictions.filter((p) => p.category === activeCategory);

  const clampedIndex = Math.min(featuredIndex, Math.max(filtered.length - 1, 0));
  const featured = filtered[clampedIndex] ?? null;
  const rest = filtered.filter((_, i) => i !== clampedIndex);

  const handlePrev = () => setFeaturedIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const handleNext = () => setFeaturedIndex((i) => (i + 1) % filtered.length);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/95 backdrop-blur border-b border-white/8 px-4 md:px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold" style={{ color: "#ff5f05" }}>KiHobe</span>
        <nav className="flex items-center gap-3">
          <Link href="/leaderboard" className="text-sm text-[#e0e0e0] hover:text-white transition-colors font-medium">
            Ranks
          </Link>
          <Link
            href="/login"
            className="text-sm px-3 py-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ff5f05" }}
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Category tabs */}
      <div className="sticky top-[49px] z-10 bg-black/95 backdrop-blur border-b border-white/8 px-4 md:px-6">
        <div className="flex items-center overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setFeaturedIndex(0); }}
              className="relative shrink-0 px-4 py-3 text-sm font-medium transition-colors"
              style={{ color: activeCategory === cat.key ? "#ff5f05" : "#e0e0e0" }}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#ff5f05" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {loading && (
          <div className="space-y-4">
            <div className="bg-[#111111] border border-white/8 rounded-2xl h-64 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#111111] border border-white/8 rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm p-4 rounded-xl border" style={{ color: "#d91616", backgroundColor: "rgba(217,22,22,0.08)", borderColor: "rgba(217,22,22,0.2)" }}>
            Failed to load predictions. Make sure your Supabase credentials are set.
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Featured card */}
              {featured && (
                <FeaturedCard
                  prediction={featured}
                  index={clampedIndex}
                  total={filtered.length}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#e0e0e0]/60 mb-3 uppercase tracking-wider text-xs">More markets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rest.map((p, i) => (
                      <PredictionCard key={p.id} prediction={p} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <p className="text-[#e0e0e0]/40 text-sm text-center py-16">
                  No markets in this category yet.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
