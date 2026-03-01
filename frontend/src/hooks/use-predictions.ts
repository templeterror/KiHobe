"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface PredictionChoice {
  key: string;
  label: string;
}

export interface Prediction {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  resolution_date: string | null;
  yes_count: number;
  no_count: number;
  prize_description: string | null;
  outcome: boolean | null;
  created_at: string;
  prediction_type: "binary" | "multi_choice";
  choices: PredictionChoice[] | null;
  choice_counts: Record<string, number> | null;
  outcome_choice: string | null;
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPredictions(data ?? []);
      }
      setLoading(false);
    }

    load();

    // Realtime subscription for live count updates
    const channel = supabase
      .channel("predictions-feed")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "predictions" },
        (payload) => {
          setPredictions((prev) =>
            prev.map((p) => (p.id === payload.new.id ? { ...p, ...(payload.new as Prediction) } : p))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { predictions, loading, error };
}

export function usePrediction(id: string) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("id", id)
        .single();
      setPrediction(data);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel(`prediction-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "predictions", filter: `id=eq.${id}` },
        (payload) => setPrediction((prev) => prev ? { ...prev, ...(payload.new as Prediction) } : prev)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { prediction, loading };
}
