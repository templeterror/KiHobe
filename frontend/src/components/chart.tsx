"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { VoteStatPoint } from "@/hooks/use-chart-data";
import type { PredictionChoice } from "@/hooks/use-predictions";

export const MULTI_CHOICE_COLORS = [
  { line: "#0ac285", bg: "rgba(10,194,133,0.12)", border: "rgba(10,194,133,0.35)" },
  { line: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)" },
  { line: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" },
  { line: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
  { line: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.35)" },
];

interface ChartProps {
  data: VoteStatPoint[];
  height?: number;
  predictionType?: "binary" | "multi_choice";
  choices?: PredictionChoice[] | null;
}

export function PredictionChart({ data, height = 220, predictionType = "binary", choices }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    let chart: ReturnType<typeof import("lightweight-charts").createChart> | undefined;

    import("lightweight-charts").then(({ createChart, ColorType, AreaSeries, LineSeries, LineStyle }) => {
      if (!containerRef.current) return;

      const crosshairColor = predictionType === "multi_choice" ? "rgba(255,255,255,0.2)" : "rgba(10,194,133,0.3)";
      const crosshairLabel = predictionType === "multi_choice" ? "#333" : "#0ac285";

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "rgba(255,255,255,0.35)",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: "rgba(255,255,255,0.06)", style: LineStyle.Dotted },
        },
        width: containerRef.current.clientWidth,
        height,
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: { top: 0.08, bottom: 0.08 },
          autoScale: false,
          entireTextOnly: true,
        },
        timeScale: {
          borderVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
          tickMarkFormatter: (time: number) => {
            const d = new Date(time * 1000);
            return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
          },
        },
        crosshair: {
          vertLine: {
            color: crosshairColor,
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: crosshairLabel,
          },
          horzLine: {
            color: crosshairColor,
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: crosshairLabel,
          },
        },
        handleScale: false,
        handleScroll: false,
      });

      type UTCTimestamp = import("lightweight-charts").UTCTimestamp;

      if (predictionType === "multi_choice" && choices && choices.length > 0) {
        // ── Multi-choice: one LineSeries per choice ──
        choices.forEach((choice, i) => {
          const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];

          const series = chart!.addSeries(LineSeries, {
            color: color.line,
            lineWidth: 2,
            priceFormat: {
              type: "custom",
              formatter: (price: number) => `${Math.round(price)}%`,
            },
            crosshairMarkerRadius: 4,
            crosshairMarkerBackgroundColor: color.line,
            crosshairMarkerBorderColor: color.line,
            lastValueVisible: false,
            priceLineVisible: false,
          });

          const finalData = data.map((d) => {
            const counts = d.choice_counts || {};
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            const time = Math.floor(new Date(d.recorded_at).getTime() / 1000) as UTCTimestamp;
            return {
              time,
              value: total > 0 ? ((counts[choice.key] || 0) / total) * 100 : 100 / choices.length,
            };
          });

          series.applyOptions({
            autoscaleInfoProvider: () => ({
              priceRange: { minValue: 0, maxValue: 100 },
            }),
          });

          // GSAP: animate from flat baseline to real values
          const baseline = finalData[0]?.value ?? (100 / choices.length);
          const flatData = finalData.map((d) => ({ time: d.time, value: baseline }));
          series.setData(flatData);

          const proxy = { progress: 0 };
          gsap.to(proxy, {
            progress: 1,
            duration: 1.2,
            delay: i * 0.1, // stagger per line
            ease: "power2.out",
            onUpdate: () => {
              const animated = finalData.map((d, j) => ({
                time: d.time,
                value: flatData[j].value + (d.value - flatData[j].value) * proxy.progress,
              }));
              series.setData(animated);
            },
            onComplete: () => {
              series.setData(finalData);
            },
          });
        });

        chart.timeScale().fitContent();
      } else {
        // ── Binary: single AreaSeries for YES probability ──
        const series = chart.addSeries(AreaSeries, {
          lineColor: "#0ac285",
          topColor: "rgba(10,194,133,0.0)",
          bottomColor: "rgba(10,194,133,0.0)",
          lineWidth: 2,
          priceFormat: {
            type: "custom",
            formatter: (price: number) => `${Math.round(price)}%`,
          },
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: "#0ac285",
          crosshairMarkerBorderColor: "#0ac285",
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const finalData = data.map((d) => {
          const total = d.yes_count + d.no_count;
          const time = Math.floor(new Date(d.recorded_at).getTime() / 1000) as UTCTimestamp;
          return {
            time,
            value: total > 0 ? (d.yes_count / total) * 100 : 50,
          };
        });

        series.applyOptions({
          autoscaleInfoProvider: () => ({
            priceRange: { minValue: 0, maxValue: 100 },
          }),
        });

        const baseline = finalData[0]?.value ?? 50;
        const flatData = finalData.map((d) => ({ time: d.time, value: baseline }));
        series.setData(flatData);
        chart.timeScale().fitContent();

        const proxy = { progress: 0 };
        gsap.to(proxy, {
          progress: 1,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            const animated = finalData.map((d, j) => ({
              time: d.time,
              value: flatData[j].value + (d.value - flatData[j].value) * proxy.progress,
            }));
            series.setData(animated);
          },
          onComplete: () => {
            series.setData(finalData);
            gsap.to({ opacity: 0 }, {
              opacity: 1,
              duration: 0.6,
              ease: "power1.in",
              onUpdate() {
                const o = this.targets()[0].opacity;
                series.applyOptions({
                  topColor: `rgba(10,194,133,${0.12 * o})`,
                });
              },
            });
          },
        });
      }

      // Fade in the container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    });

    const ro = new ResizeObserver(() => {
      if (chart && containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart?.remove();
    };
  }, [data, height, predictionType, choices]);

  return <div ref={containerRef} className="w-full" />;
}
