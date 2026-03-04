import type { VoteStatPoint } from "@/hooks/use-chart-data";

// BNP election seats — starts ~60% YES, climbs to ~80%, pulls back to ~72%
// Visually: strong upward trend with a mid-race dip. Confident, decisive.
export const BNP_CHART_DATA: VoteStatPoint[] = [
  { recorded_at: "2026-01-01T06:00:00+00:00", yes_count: 12, no_count: 8, choice_counts: null },
  { recorded_at: "2026-01-02T06:00:00+00:00", yes_count: 22, no_count: 14, choice_counts: null },
  { recorded_at: "2026-01-03T06:00:00+00:00", yes_count: 35, no_count: 20, choice_counts: null },
  { recorded_at: "2026-01-05T06:00:00+00:00", yes_count: 60, no_count: 30, choice_counts: null },
  { recorded_at: "2026-01-07T06:00:00+00:00", yes_count: 85, no_count: 35, choice_counts: null },
  { recorded_at: "2026-01-09T12:00:00+00:00", yes_count: 110, no_count: 40, choice_counts: null },
  { recorded_at: "2026-01-11T06:00:00+00:00", yes_count: 145, no_count: 44, choice_counts: null },
  { recorded_at: "2026-01-13T12:00:00+00:00", yes_count: 178, no_count: 48, choice_counts: null },
  { recorded_at: "2026-01-15T06:00:00+00:00", yes_count: 192, no_count: 68, choice_counts: null },
  { recorded_at: "2026-01-18T06:00:00+00:00", yes_count: 210, no_count: 82, choice_counts: null },
  { recorded_at: "2026-01-22T06:00:00+00:00", yes_count: 240, no_count: 92, choice_counts: null },
  { recorded_at: "2026-01-26T06:00:00+00:00", yes_count: 258, no_count: 115, choice_counts: null },
  { recorded_at: "2026-01-30T06:00:00+00:00", yes_count: 280, no_count: 125, choice_counts: null },
  { recorded_at: "2026-02-03T06:00:00+00:00", yes_count: 310, no_count: 135, choice_counts: null },
  { recorded_at: "2026-02-07T06:00:00+00:00", yes_count: 345, no_count: 142, choice_counts: null },
  { recorded_at: "2026-02-11T06:00:00+00:00", yes_count: 378, no_count: 152, choice_counts: null },
  { recorded_at: "2026-02-15T06:00:00+00:00", yes_count: 410, no_count: 162, choice_counts: null },
  { recorded_at: "2026-02-19T06:00:00+00:00", yes_count: 440, no_count: 172, choice_counts: null },
  { recorded_at: "2026-02-23T06:00:00+00:00", yes_count: 475, no_count: 182, choice_counts: null },
  { recorded_at: "2026-02-28T18:00:00+00:00", yes_count: 523, no_count: 201, choice_counts: null },
];

// Sheikh Hasina return — starts ~5% YES, two news spikes, settles ~32%
// Visually: dramatic reactivity, shows the market responds to real events.
export const HASINA_CHART_DATA: VoteStatPoint[] = [
  { recorded_at: "2026-01-01T06:00:00+00:00", yes_count: 1, no_count: 18, choice_counts: null },
  { recorded_at: "2026-01-03T06:00:00+00:00", yes_count: 3, no_count: 35, choice_counts: null },
  { recorded_at: "2026-01-05T06:00:00+00:00", yes_count: 5, no_count: 48, choice_counts: null },
  { recorded_at: "2026-01-07T06:00:00+00:00", yes_count: 7, no_count: 56, choice_counts: null },
  { recorded_at: "2026-01-10T18:00:00+00:00", yes_count: 10, no_count: 70, choice_counts: null },
  // Rumor spike
  { recorded_at: "2026-01-11T06:00:00+00:00", yes_count: 18, no_count: 72, choice_counts: null },
  { recorded_at: "2026-01-11T18:00:00+00:00", yes_count: 25, no_count: 74, choice_counts: null },
  { recorded_at: "2026-01-12T06:00:00+00:00", yes_count: 30, no_count: 78, choice_counts: null },
  // Correction
  { recorded_at: "2026-01-14T06:00:00+00:00", yes_count: 34, no_count: 98, choice_counts: null },
  { recorded_at: "2026-01-17T06:00:00+00:00", yes_count: 38, no_count: 115, choice_counts: null },
  { recorded_at: "2026-01-21T06:00:00+00:00", yes_count: 42, no_count: 128, choice_counts: null },
  // Second spike: court summons
  { recorded_at: "2026-01-22T06:00:00+00:00", yes_count: 52, no_count: 132, choice_counts: null },
  { recorded_at: "2026-01-22T18:00:00+00:00", yes_count: 60, no_count: 135, choice_counts: null },
  { recorded_at: "2026-01-23T12:00:00+00:00", yes_count: 65, no_count: 140, choice_counts: null },
  // Slow fade
  { recorded_at: "2026-01-27T06:00:00+00:00", yes_count: 72, no_count: 156, choice_counts: null },
  { recorded_at: "2026-01-31T06:00:00+00:00", yes_count: 80, no_count: 172, choice_counts: null },
  { recorded_at: "2026-02-04T06:00:00+00:00", yes_count: 88, no_count: 188, choice_counts: null },
  { recorded_at: "2026-02-08T06:00:00+00:00", yes_count: 96, no_count: 205, choice_counts: null },
  { recorded_at: "2026-02-12T06:00:00+00:00", yes_count: 104, no_count: 225, choice_counts: null },
  { recorded_at: "2026-02-16T06:00:00+00:00", yes_count: 112, no_count: 245, choice_counts: null },
  { recorded_at: "2026-02-20T06:00:00+00:00", yes_count: 120, no_count: 260, choice_counts: null },
  { recorded_at: "2026-02-28T18:00:00+00:00", yes_count: 134, no_count: 289, choice_counts: null },
];
