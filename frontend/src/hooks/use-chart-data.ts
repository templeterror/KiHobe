"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface VoteStatPoint {
  recorded_at: string;
  yes_count: number;
  no_count: number;
  choice_counts: Record<string, number> | null;
}

export function useChartData(predictionId: string) {
  const [data, setData] = useState<VoteStatPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from("vote_stats")
        .select("recorded_at, yes_count, no_count, choice_counts")
        .eq("prediction_id", predictionId)
        .order("recorded_at", { ascending: true });

      setData(rows ?? []);
      setLoading(false);
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [predictionId]);

  return { data, loading };
}
