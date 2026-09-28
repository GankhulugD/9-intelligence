"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { CategoryScore } from "@/lib/scoring";
import {
  getCategoryNameAtRadarIndex,
  getRadarLabels,
  mapCategoryScoresToRadarValues,
} from "@/lib/radar-mapping";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const USER_SCALE_MAX = 100;
export const USER_TICK_STEP = 20;

/** Overlay values are 0–100% (same scale as user). */
export type RadarOverlayScale = "percentage" | "raw";

export interface RadarOverlay {
  label: string;
  /** Length 9 — index i = CATEGORY_ORDER[i]. */
  values: number[];
  scaleMode: RadarOverlayScale;
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointHoverBorderColor: string;
  borderDash?: number[];
}

interface RadarChartProps {
  scores: CategoryScore[];
  overlays?: RadarOverlay[];
  /** When raw benchmark active: max of benchmark (e.g. 180). User stays 0–100 inside this scale. */
  benchmarkScaleMax?: number;
}

const USER_THEME = {
  backgroundColor: "rgba(16, 185, 129, 0.2)",
  borderColor: "#10B981",
  pointBackgroundColor: "#10B981",
  pointHoverBorderColor: "#10B981",
};

export const FRIEND_OVERLAY_THEME: Omit<RadarOverlay, "values"> = {
  label: "Найзын профайл",
  scaleMode: "percentage",
  backgroundColor: "rgba(99, 102, 241, 0.2)",
  borderColor: "rgba(99, 102, 241, 1)",
  pointBackgroundColor: "rgba(99, 102, 241, 1)",
  pointHoverBorderColor: "rgba(99, 102, 241, 1)",
};

export const TESLA_OVERLAY_THEME: Omit<RadarOverlay, "values"> = {
  label: "Тесла (Benchmark)",
  scaleMode: "raw",
  backgroundColor: "rgba(245, 158, 11, 0.15)",
  borderColor: "#F59E0B",
  pointBackgroundColor: "#F59E0B",
  pointHoverBorderColor: "#F59E0B",
  borderDash: [5, 5],
};

function buildDataset(
  label: string,
  dataValues: number[],
  theme: {
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
    pointHoverBorderColor: string;
    borderDash?: number[];
  },
) {
  return {
    label,
    data: dataValues,
    backgroundColor: theme.backgroundColor,
    borderColor: theme.borderColor,
    borderWidth: 2,
    borderDash: theme.borderDash,
    pointBackgroundColor: theme.pointBackgroundColor,
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: theme.pointHoverBorderColor,
    pointRadius: 4,
    pointHoverRadius: 6,
  };
}

export function RadarChart({ scores, overlays = [], benchmarkScaleMax }: RadarChartProps) {
  const labels = getRadarLabels();
  const userValues = mapCategoryScoresToRadarValues(scores, "percentage");
  const hasRawBenchmark = benchmarkScaleMax != null && benchmarkScaleMax > USER_SCALE_MAX;
  const scaleMax = hasRawBenchmark ? benchmarkScaleMax : USER_SCALE_MAX;
  const tickStep = hasRawBenchmark ? 20 : USER_TICK_STEP;

  const datasets = [
    buildDataset("Таны профайл", userValues, USER_THEME),
    ...overlays.map((overlay) => buildDataset(overlay.label, overlay.values, overlay)),
  ];

  const overlayMeta = overlays.map((o) => o.scaleMode);

  const data = { labels, datasets };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: scaleMax,
        beginAtZero: true,
        startAngle: 0,
        ticks: {
          stepSize: tickStep,
          display: true,
          backdropColor: "transparent",
          color: (ctx) => {
            const tick = ctx.tick?.value;
            if (hasRawBenchmark && tick === USER_SCALE_MAX) {
              return "#10B981";
            }
            return "#a1a1aa";
          },
          font: (ctx) => {
            const tick = ctx.tick?.value;
            if (hasRawBenchmark && tick === USER_SCALE_MAX) {
              return { size: 11, weight: "bold" as const };
            }
            return { size: 10 };
          },
        },
        grid: {
          color: (ctx) => {
            if (hasRawBenchmark && ctx.tick?.value === USER_SCALE_MAX) {
              return "rgba(16, 185, 129, 0.45)";
            }
            return "rgba(161, 161, 170, 0.3)";
          },
          lineWidth: (ctx) => {
            if (hasRawBenchmark && ctx.tick?.value === USER_SCALE_MAX) {
              return 2;
            }
            return 1;
          },
        },
        angleLines: {
          color: "rgba(161, 161, 170, 0.3)",
        },
        pointLabels: {
          color: "#3f3f46",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: overlays.length > 0,
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 13 },
          color: "#52525b",
        },
      },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#fafafa",
        bodyColor: "#fafafa",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (items) => {
            const index = items[0]?.dataIndex ?? 0;
            return getCategoryNameAtRadarIndex(index);
          },
          label: (context) => {
            const val = context.parsed.r ?? 0;
            const overlayIdx = context.datasetIndex - 1;
            const scaleMode = overlayIdx >= 0 ? overlayMeta[overlayIdx] : "percentage";

            if (scaleMode === "raw") {
              const beyond = val > USER_SCALE_MAX ? " · 100+ ring давсан" : "";
              return `${context.dataset.label}: ${val} (benchmark 0–180)${beyond}`;
            }
            return `${context.dataset.label}: ${val}%`;
          },
        },
      },
    },
  };

  return (
    <div className="mx-auto aspect-square w-full max-w-lg">
      <Radar
        key={hasRawBenchmark ? `radar-extended-${scaleMax}` : "radar-standard"}
        data={data}
        options={options}
      />
    </div>
  );
}
