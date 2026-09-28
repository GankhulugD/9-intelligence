import { CATEGORIES, CATEGORY_ORDER } from "@/data/categories";
import type { CategoryScore } from "@/lib/scoring";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsvContent(scores: CategoryScore[]): string {
  const scoreMap = new Map(scores.map((s) => [s.category, s]));
  const header = "Ангилал,Оноо (%),Тайлбар";

  const rows = CATEGORY_ORDER.map((id) => {
    const meta = CATEGORIES.find((c) => c.id === id)!;
    const score = scoreMap.get(id);
    const pct = score?.percentage ?? 0;

    return [
      escapeCsv(meta.name),
      pct.toString(),
      escapeCsv(meta.overview),
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

export function downloadCsv(scores: CategoryScore[], filename = "oyun-ukhaany-profail.csv"): void {
  const content = generateCsvContent(scores);
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
