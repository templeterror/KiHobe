import type { VoteStatPoint } from "@/hooks/use-chart-data";

// US troops to Iran — starts ~45% YES after initial skepticism, surges on news events,
// brief pullback on diplomacy rumors, then rockets to ~80%. Dramatic and volatile.
export const IRAN_CHART_DATA: VoteStatPoint[] = [
  { recorded_at: "2026-01-01T06:00:00+00:00", yes_count: 9, no_count: 11, choice_counts: null },
  { recorded_at: "2026-01-03T06:00:00+00:00", yes_count: 18, no_count: 22, choice_counts: null },
  { recorded_at: "2026-01-05T06:00:00+00:00", yes_count: 30, no_count: 32, choice_counts: null },
  { recorded_at: "2026-01-08T06:00:00+00:00", yes_count: 48, no_count: 42, choice_counts: null },
  // Carrier group deployed — spike
  { recorded_at: "2026-01-10T06:00:00+00:00", yes_count: 85, no_count: 50, choice_counts: null },
  { recorded_at: "2026-01-11T18:00:00+00:00", yes_count: 130, no_count: 55, choice_counts: null },
  { recorded_at: "2026-01-13T06:00:00+00:00", yes_count: 175, no_count: 62, choice_counts: null },
  // Diplomacy rumor — pullback
  { recorded_at: "2026-01-16T06:00:00+00:00", yes_count: 195, no_count: 98, choice_counts: null },
  { recorded_at: "2026-01-19T06:00:00+00:00", yes_count: 210, no_count: 130, choice_counts: null },
  { recorded_at: "2026-01-22T06:00:00+00:00", yes_count: 230, no_count: 148, choice_counts: null },
  // Talks collapse — second surge
  { recorded_at: "2026-01-24T06:00:00+00:00", yes_count: 310, no_count: 155, choice_counts: null },
  { recorded_at: "2026-01-26T12:00:00+00:00", yes_count: 420, no_count: 162, choice_counts: null },
  { recorded_at: "2026-01-29T06:00:00+00:00", yes_count: 550, no_count: 170, choice_counts: null },
  // Steady high conviction
  { recorded_at: "2026-02-02T06:00:00+00:00", yes_count: 680, no_count: 185, choice_counts: null },
  { recorded_at: "2026-02-07T06:00:00+00:00", yes_count: 820, no_count: 198, choice_counts: null },
  { recorded_at: "2026-02-12T06:00:00+00:00", yes_count: 1050, no_count: 220, choice_counts: null },
  { recorded_at: "2026-02-17T06:00:00+00:00", yes_count: 1380, no_count: 260, choice_counts: null },
  { recorded_at: "2026-02-22T06:00:00+00:00", yes_count: 1820, no_count: 310, choice_counts: null },
  // Troop mobilization confirmed — final push
  { recorded_at: "2026-02-25T06:00:00+00:00", yes_count: 2800, no_count: 420, choice_counts: null },
  { recorded_at: "2026-02-28T06:00:00+00:00", yes_count: 3600, no_count: 680, choice_counts: null },
  { recorded_at: "2026-03-03T18:00:00+00:00", yes_count: 4500, no_count: 1155, choice_counts: null },
];

// Mirza Abbas convicted — oscillates wildly between 55-75% as legal proceedings
// swing back and forth. Shows the market reacting to courtroom drama.
export const ABBAS_CHART_DATA: VoteStatPoint[] = [
  { recorded_at: "2026-01-01T06:00:00+00:00", yes_count: 11, no_count: 9, choice_counts: null },
  { recorded_at: "2026-01-03T06:00:00+00:00", yes_count: 24, no_count: 16, choice_counts: null },
  { recorded_at: "2026-01-06T06:00:00+00:00", yes_count: 42, no_count: 28, choice_counts: null },
  // Charges filed — jump to ~70%
  { recorded_at: "2026-01-08T06:00:00+00:00", yes_count: 70, no_count: 30, choice_counts: null },
  { recorded_at: "2026-01-10T06:00:00+00:00", yes_count: 105, no_count: 38, choice_counts: null },
  // Defense team press conference — drops to ~55%
  { recorded_at: "2026-01-13T06:00:00+00:00", yes_count: 118, no_count: 68, choice_counts: null },
  { recorded_at: "2026-01-15T06:00:00+00:00", yes_count: 128, no_count: 98, choice_counts: null },
  // Key witness testimony — surges back to ~72%
  { recorded_at: "2026-01-18T06:00:00+00:00", yes_count: 178, no_count: 105, choice_counts: null },
  { recorded_at: "2026-01-20T06:00:00+00:00", yes_count: 240, no_count: 110, choice_counts: null },
  // Judge recusal rumors — dip to ~58%
  { recorded_at: "2026-01-23T06:00:00+00:00", yes_count: 260, no_count: 148, choice_counts: null },
  { recorded_at: "2026-01-26T06:00:00+00:00", yes_count: 278, no_count: 192, choice_counts: null },
  // New evidence leaked — climbs to ~68%
  { recorded_at: "2026-01-29T06:00:00+00:00", yes_count: 340, no_count: 200, choice_counts: null },
  { recorded_at: "2026-02-01T06:00:00+00:00", yes_count: 425, no_count: 210, choice_counts: null },
  // Delay in proceedings — wobbles
  { recorded_at: "2026-02-05T06:00:00+00:00", yes_count: 480, no_count: 268, choice_counts: null },
  { recorded_at: "2026-02-09T06:00:00+00:00", yes_count: 540, no_count: 310, choice_counts: null },
  // Prosecution rests strong — recovers
  { recorded_at: "2026-02-13T06:00:00+00:00", yes_count: 650, no_count: 330, choice_counts: null },
  { recorded_at: "2026-02-17T06:00:00+00:00", yes_count: 810, no_count: 365, choice_counts: null },
  { recorded_at: "2026-02-21T06:00:00+00:00", yes_count: 1020, no_count: 420, choice_counts: null },
  // Closing arguments — settles ~66%
  { recorded_at: "2026-02-25T06:00:00+00:00", yes_count: 1650, no_count: 680, choice_counts: null },
  { recorded_at: "2026-03-01T06:00:00+00:00", yes_count: 2800, no_count: 1200, choice_counts: null },
  { recorded_at: "2026-03-03T18:00:00+00:00", yes_count: 4000, no_count: 2101, choice_counts: null },
];

// Hasina return — starts ~25% YES on initial hope, gradually bleeds down to ~15%
// with two small hope spikes that each fade. Tells a story of fading likelihood.
export const HASINA_CHART_DATA: VoteStatPoint[] = [
  { recorded_at: "2026-01-01T06:00:00+00:00", yes_count: 5, no_count: 15, choice_counts: null },
  { recorded_at: "2026-01-03T06:00:00+00:00", yes_count: 12, no_count: 35, choice_counts: null },
  { recorded_at: "2026-01-06T06:00:00+00:00", yes_count: 20, no_count: 58, choice_counts: null },
  // Rumor of diplomatic deal — brief spike to ~28%
  { recorded_at: "2026-01-09T06:00:00+00:00", yes_count: 35, no_count: 65, choice_counts: null },
  { recorded_at: "2026-01-10T18:00:00+00:00", yes_count: 48, no_count: 68, choice_counts: null },
  { recorded_at: "2026-01-12T06:00:00+00:00", yes_count: 55, no_count: 72, choice_counts: null },
  // Denied — drops
  { recorded_at: "2026-01-15T06:00:00+00:00", yes_count: 60, no_count: 110, choice_counts: null },
  { recorded_at: "2026-01-18T06:00:00+00:00", yes_count: 65, no_count: 155, choice_counts: null },
  { recorded_at: "2026-01-22T06:00:00+00:00", yes_count: 72, no_count: 210, choice_counts: null },
  // Second rumor: family members spotted at airport
  { recorded_at: "2026-01-24T06:00:00+00:00", yes_count: 88, no_count: 218, choice_counts: null },
  { recorded_at: "2026-01-25T12:00:00+00:00", yes_count: 102, no_count: 222, choice_counts: null },
  // Debunked — steady decline
  { recorded_at: "2026-01-28T06:00:00+00:00", yes_count: 110, no_count: 280, choice_counts: null },
  { recorded_at: "2026-02-01T06:00:00+00:00", yes_count: 120, no_count: 360, choice_counts: null },
  { recorded_at: "2026-02-05T06:00:00+00:00", yes_count: 135, no_count: 450, choice_counts: null },
  { recorded_at: "2026-02-10T06:00:00+00:00", yes_count: 155, no_count: 580, choice_counts: null },
  { recorded_at: "2026-02-15T06:00:00+00:00", yes_count: 180, no_count: 750, choice_counts: null },
  { recorded_at: "2026-02-19T06:00:00+00:00", yes_count: 250, no_count: 1100, choice_counts: null },
  { recorded_at: "2026-02-23T06:00:00+00:00", yes_count: 380, no_count: 1800, choice_counts: null },
  { recorded_at: "2026-02-27T06:00:00+00:00", yes_count: 550, no_count: 2800, choice_counts: null },
  { recorded_at: "2026-03-03T18:00:00+00:00", yes_count: 800, no_count: 4500, choice_counts: null },
];
