import {
  CATEGORIES,
  CATEGORY_ORDER,
  type IntelligenceCategory,
} from "@/data/categories";
import type { CategoryScore } from "@/lib/scoring";

export type RadarValueField = "percentage" | "rawScore";

const categoryMeta = new Map(CATEGORIES.map((c) => [c.id, c]));

// Dev guard: labels[i] must always match CATEGORY_ORDER[i]
if (process.env.NODE_ENV === "development") {
  CATEGORY_ORDER.forEach((id, index) => {
    if (CATEGORIES[index]?.id !== id) {
      throw new Error(
        `Radar axis mismatch at index ${index}: CATEGORY_ORDER has "${id}" but CATEGORIES has "${CATEGORIES[index]?.id}"`,
      );
    }
  });
}

/** Radar point labels — index i = CATEGORY_ORDER[i]. */
export function getRadarLabels(): string[] {
  return CATEGORY_ORDER.map((id) => categoryMeta.get(id)!.shortLabel);
}

/**
 * Map scores → number[9] where array[i] = value for CATEGORY_ORDER[i].
 * Used for both user quiz results and normalized benchmark overlays.
 */
export function mapCategoryScoresToRadarValues(
  scores: CategoryScore[],
  field: RadarValueField = "percentage",
): number[] {
  const byCategory = new Map(scores.map((s) => [s.category, s]));
  return CATEGORY_ORDER.map((category) => {
    const score = byCategory.get(category);
    return score ? score[field] : 0;
  });
}

/**
 * Normalize benchmark raw scores (0–maxScore) to 0–100% for fair overlay
 * comparison with user quiz percentages on the same axis.
 */
export function mapBenchmarkScoresToRadarPercentages(
  scores: Record<IntelligenceCategory, number>,
  maxScore: number,
): number[] {
  return CATEGORY_ORDER.map((category) => {
    const raw = scores[category] ?? 0;
    return Math.round((raw / maxScore) * 100);
  });
}

export function getCategoryAtRadarIndex(index: number): IntelligenceCategory {
  return CATEGORY_ORDER[index];
}

export function getCategoryNameAtRadarIndex(index: number): string {
  const id = getCategoryAtRadarIndex(index);
  return categoryMeta.get(id)?.name ?? id;
}
