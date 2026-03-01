"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useVote } from "@/hooks/use-vote";
import type { PredictionChoice } from "@/hooks/use-predictions";
import { MULTI_CHOICE_COLORS } from "@/components/chart";

interface VoteButtonsProps {
  predictionId: string;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onVoted?: (newBalance: number) => void;
  disabled?: boolean;
  predictionType?: "binary" | "multi_choice";
  choices?: PredictionChoice[] | null;
}

export function VoteButtons({
  predictionId,
  isAuthenticated,
  onAuthRequired,
  onVoted,
  disabled,
  predictionType = "binary",
  choices,
}: VoteButtonsProps) {
  const { vote, voteChoice, loading, error } = useVote(predictionId);
  const [voted, setVoted] = useState<boolean | null>(null);
  const [votedChoice, setVotedChoice] = useState<string | null>(null);

  const handleVote = async (value: boolean) => {
    const res = await vote(value);
    if (res.success) {
      setVoted(value);
      if (res.new_balance !== undefined) onVoted?.(res.new_balance);
    }
  };

  const handleVoteChoice = async (choiceKey: string) => {
    const res = await voteChoice(choiceKey);
    if (res.success) {
      setVotedChoice(choiceKey);
      if (res.new_balance !== undefined) onVoted?.(res.new_balance);
    }
  };

  // Multi-choice voted state
  if (votedChoice && predictionType === "multi_choice" && choices) {
    const idx = choices.findIndex((c) => c.key === votedChoice);
    const color = MULTI_CHOICE_COLORS[idx >= 0 ? idx : 0];
    const label = choices.find((c) => c.key === votedChoice)?.label;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-3"
      >
        <span className="text-lg font-semibold" style={{ color: color.line }}>
          ✓ Voted {label}
        </span>
      </motion.div>
    );
  }

  // Binary voted state
  if (voted !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-3"
      >
        <span className="text-lg font-semibold" style={{ color: voted ? "#0ac285" : "#d91616" }}>
          {voted ? "✓ Voted YES" : "✓ Voted NO"}
        </span>
      </motion.div>
    );
  }

  // Multi-choice buttons
  if (predictionType === "multi_choice" && choices) {
    return (
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          {choices.map((choice, i) => {
            const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
            return (
              <motion.button
                key={choice.key}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleVoteChoice(choice.key)}
                disabled={loading || disabled}
                className="py-3.5 rounded-xl font-semibold text-base transition-all disabled:opacity-50 border"
                style={{ backgroundColor: color.bg, borderColor: color.border, color: color.line }}
              >
                {choice.label}
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs text-center text-[#e0e0e0]">Costs 1 coin · 1 vote per market</p>
        {error && <p className="text-xs text-center" style={{ color: "#d91616" }}>{error}</p>}
      </div>
    );
  }

  // Binary buttons
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleVote(true)}
          disabled={loading || disabled}
          className="py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 border"
          style={{
            backgroundColor: "rgba(10,194,133,0.12)",
            borderColor: "rgba(10,194,133,0.35)",
            color: "#0ac285",
          }}
        >
          YES
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleVote(false)}
          disabled={loading || disabled}
          className="py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 border"
          style={{
            backgroundColor: "rgba(217,22,22,0.12)",
            borderColor: "rgba(217,22,22,0.35)",
            color: "#d91616",
          }}
        >
          NO
        </motion.button>
      </div>
      <p className="text-xs text-center text-[#e0e0e0]">Costs 1 coin · 1 vote per market</p>
      {error && <p className="text-xs text-center" style={{ color: "#d91616" }}>{error}</p>}
    </div>
  );
}
