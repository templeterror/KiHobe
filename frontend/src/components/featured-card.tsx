"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Prediction } from "@/hooks/use-predictions";
import { useChartData } from "@/hooks/use-chart-data";
import { MULTI_CHOICE_COLORS } from "@/components/chart";

interface FeaturedCardProps {
  prediction: Prediction;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function MiniChart({ predictionId, prediction }: { predictionId: string; prediction: Prediction }) {
  const { data } = useChartData(predictionId);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);
  const isMulti = prediction.prediction_type === "multi_choice" && prediction.choices;

  useEffect(() => {
    if (!containerRef.current || data.length < 2) return;

    import("lightweight-charts").then(({ createChart, ColorType, AreaSeries, LineSeries, LineStyle }) => {
      if (!containerRef.current) return;

      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
        chartRef.current = null;
      }

      const crosshairColor = isMulti ? "rgba(255,255,255,0.2)" : "rgba(10,194,133,0.3)";
      const crosshairLabel = isMulti ? "#333" : "#0ac285";

      const chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "rgba(255,255,255,0.3)",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 10,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: "rgba(255,255,255,0.05)", style: LineStyle.Dotted },
        },
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
          vertLine: { color: crosshairColor, width: 1, style: LineStyle.Dashed, labelBackgroundColor: crosshairLabel },
          horzLine: { color: crosshairColor, width: 1, style: LineStyle.Dashed, labelBackgroundColor: crosshairLabel },
        },
        handleScale: false,
        handleScroll: false,
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 180,
      });

      chartRef.current = chart;

      type UTCTimestamp = import("lightweight-charts").UTCTimestamp;

      if (isMulti && prediction.choices) {
        // Multi-choice: one LineSeries per choice
        prediction.choices.forEach((choice, i) => {
          const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
          const series = chart.addSeries(LineSeries, {
            color: color.line,
            lineWidth: 2,
            priceFormat: { type: "custom", formatter: (price: number) => `${Math.round(price)}%` },
            crosshairMarkerRadius: 3,
            crosshairMarkerBackgroundColor: color.line,
            crosshairMarkerBorderColor: color.line,
            lastValueVisible: false,
            priceLineVisible: false,
          });

          const finalData = data.map((d) => {
            const counts = d.choice_counts || {};
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            return {
              time: Math.floor(new Date(d.recorded_at).getTime() / 1000) as UTCTimestamp,
              value: total > 0 ? ((counts[choice.key] || 0) / total) * 100 : 100 / prediction.choices!.length,
            };
          });

          series.applyOptions({
            autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
          });

          const baseline = finalData[0]?.value ?? (100 / prediction.choices!.length);
          const flatData = finalData.map((d) => ({ time: d.time, value: baseline }));
          series.setData(flatData);

          const proxy = { progress: 0 };
          gsap.to(proxy, {
            progress: 1,
            duration: 1,
            delay: i * 0.1,
            ease: "power2.out",
            onUpdate: () => {
              const animated = finalData.map((d, j) => ({
                time: d.time,
                value: flatData[j].value + (d.value - flatData[j].value) * proxy.progress,
              }));
              series.setData(animated);
            },
            onComplete: () => series.setData(finalData),
          });
        });
        chart.timeScale().fitContent();
      } else {
        // Binary: single AreaSeries
        const series = chart.addSeries(AreaSeries, {
          lineColor: "#0ac285",
          topColor: "rgba(10,194,133,0.0)",
          bottomColor: "rgba(10,194,133,0.0)",
          lineWidth: 2,
          priceFormat: { type: "custom", formatter: (price: number) => `${Math.round(price)}%` },
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: "#0ac285",
          crosshairMarkerBorderColor: "#0ac285",
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const finalData = data.map((d) => {
          const total = d.yes_count + d.no_count;
          return {
            time: Math.floor(new Date(d.recorded_at).getTime() / 1000) as UTCTimestamp,
            value: total > 0 ? (d.yes_count / total) * 100 : 50,
          };
        });

        series.applyOptions({
          autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
        });

        const baseline = finalData[0]?.value ?? 50;
        const flatData = finalData.map((d) => ({ time: d.time, value: baseline }));
        series.setData(flatData);
        chart.timeScale().fitContent();

        const proxy = { progress: 0 };
        gsap.to(proxy, {
          progress: 1,
          duration: 1,
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
              duration: 0.5,
              ease: "power1.in",
              onUpdate() {
                const o = this.targets()[0].opacity;
                series.applyOptions({ topColor: `rgba(10,194,133,${0.12 * o})` });
              },
            });
          },
        });
      }

      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });

      const ro = new ResizeObserver(() => {
        if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
      });
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    });

    return () => {
      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
        chartRef.current = null;
      }
    };
  }, [data, isMulti, prediction.choices]);

  if (data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-white/20">No chart history yet</span>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}

export function FeaturedCard({ prediction, index, total, onPrev, onNext }: FeaturedCardProps) {
  const isMulti = prediction.prediction_type === "multi_choice" && prediction.choices;
  const counts = prediction.choice_counts || {};
  const multiTotal = Object.values(counts).reduce((a, b) => a + b, 0);
  const voteTotal = isMulti ? multiTotal : prediction.yes_count + prediction.no_count;
  const yesPct = voteTotal > 0 && !isMulti ? Math.round((prediction.yes_count / voteTotal) * 100) : 50;
  const noPct = 100 - yesPct;

  return (
    <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <Link href={`/prediction/${prediction.id}`}>
          <h2 className="text-lg font-semibold text-white leading-snug hover:text-[#ff5f05] transition-colors cursor-pointer">
            {prediction.title}
          </h2>
        </Link>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <button
            onClick={onPrev}
            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            ‹
          </button>
          <span className="text-xs text-white/30 tabular-nums whitespace-nowrap">{index + 1} of {total}</span>
          <button
            onClick={onNext}
            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            ›
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Left — market info */}
        <div className="px-5 pb-5 flex flex-col gap-4">
          {/* Column headers */}
          <div className="flex items-center text-xs text-white/30">
            <span className="flex-1">Market</span>
            <span className="w-16 text-right">Votes</span>
            <span className="w-14 text-right">Odds</span>
          </div>

          {isMulti && prediction.choices ? (
            prediction.choices.map((choice, i) => {
              const count = counts[choice.key] || 0;
              const pct = multiTotal > 0 ? Math.round((count / multiTotal) * 100) : 0;
              const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
              return (
                <div key={choice.key} className="space-y-1.5">
                  <div className="flex items-center">
                    <span className="flex-1 text-sm font-medium text-white">{choice.label}</span>
                    <span className="w-16 text-right text-xs text-white/40 tabular-nums">{count.toLocaleString()}</span>
                    <span
                      className="w-14 text-right text-sm font-semibold px-2 py-0.5 rounded-lg tabular-nums ml-1"
                      style={{ backgroundColor: color.bg, color: color.line }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="h-0.5 rounded-full" style={{ backgroundColor: color.line }} />
                </div>
              );
            })
          ) : (
            <>
              {/* YES */}
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <span className="flex-1 text-sm font-medium text-white">Yes</span>
                  <span className="w-16 text-right text-xs text-white/40 tabular-nums">{prediction.yes_count.toLocaleString()}</span>
                  <span
                    className="w-14 text-right text-sm font-semibold px-2 py-0.5 rounded-lg tabular-nums ml-1"
                    style={{ backgroundColor: "rgba(10,194,133,0.15)", color: "#0ac285" }}
                  >
                    {yesPct}%
                  </span>
                </div>
                <div className="h-0.5 rounded-full" style={{ backgroundColor: "#0ac285" }} />
              </div>

              {/* NO */}
              <div className="space-y-1.5">
                <div className="flex items-center">
                  <span className="flex-1 text-sm font-medium text-white">No</span>
                  <span className="w-16 text-right text-xs text-white/40 tabular-nums">{prediction.no_count.toLocaleString()}</span>
                  <span
                    className="w-14 text-right text-sm font-semibold px-2 py-0.5 rounded-lg tabular-nums ml-1"
                    style={{ backgroundColor: "rgba(217,22,22,0.15)", color: "#d91616" }}
                  >
                    {noPct}%
                  </span>
                </div>
                <div className="h-0.5 rounded-full" style={{ backgroundColor: "#d91616" }} />
              </div>
            </>
          )}

          {/* Meta */}
          <div className="pt-2 border-t border-white/8 flex items-center justify-between text-xs text-white/30">
            <span>{voteTotal.toLocaleString()} total votes</span>
            {prediction.resolution_date && (
              <span>Closes {new Date(prediction.resolution_date).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</span>
            )}
          </div>

          {/* Description */}
          {prediction.description && (
            <div className="pt-2 border-t border-white/8">
              <p className="text-xs text-white/35 leading-relaxed line-clamp-3">
                <span className="text-white/50 font-medium">About </span>
                {prediction.description}
              </p>
            </div>
          )}
        </div>

        {/* Right — chart */}
        <div className="border-t md:border-t-0 md:border-l border-white/8 p-5 flex flex-col gap-3">
          {/* Legend */}
          {isMulti && prediction.choices ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {prediction.choices.map((choice, i) => {
                const count = counts[choice.key] || 0;
                const pct = multiTotal > 0 ? Math.round((count / multiTotal) * 100) : 0;
                const color = MULTI_CHOICE_COLORS[i % MULTI_CHOICE_COLORS.length];
                return (
                  <div key={choice.key} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.line }} />
                    <span className="text-[10px] text-white/50">{choice.label}</span>
                    <span className="text-xs font-semibold text-white tabular-nums">{pct}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#0ac285" }} />
              <span className="text-xs text-white/50">Yes probability</span>
              <strong className="text-sm text-white tabular-nums ml-auto">{yesPct}%</strong>
            </div>
          )}

          {/* Chart */}
          <div className="flex-1 min-h-[180px]">
            <MiniChart predictionId={prediction.id} prediction={prediction} />
          </div>
        </div>
      </div>
    </div>
  );
}
