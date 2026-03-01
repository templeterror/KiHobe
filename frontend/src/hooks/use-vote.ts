"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useVote(predictionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = async (voteValue: boolean): Promise<{ success: boolean; new_balance?: number }> => {
    setLoading(true);
    setError(null);
    try {
      // Temporary: call Supabase RPC directly (bypasses auth for testing)
      const { error: rpcError } = await supabase.rpc("cast_vote", {
        p_user_id: "00000000-0000-0000-0000-000000000001", // placeholder user
        p_prediction_id: predictionId,
        p_vote: voteValue,
      });

      if (rpcError) throw new Error(rpcError.message);
      return { success: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Vote failed";
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const voteChoice = async (choiceKey: string): Promise<{ success: boolean; new_balance?: number }> => {
    setLoading(true);
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc("cast_vote_choice", {
        p_user_id: "00000000-0000-0000-0000-000000000001",
        p_prediction_id: predictionId,
        p_choice_key: choiceKey,
      });

      if (rpcError) throw new Error(rpcError.message);
      return { success: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Vote failed";
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { vote, voteChoice, loading, error };
}
