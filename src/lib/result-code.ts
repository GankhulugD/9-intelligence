import { CATEGORIES, type IntelligenceCategory } from "@/data/categories";
import type { CategoryScore } from "@/lib/scoring";

const CATEGORY_PREFIX: Record<IntelligenceCategory, string> = {
  logical: "L",
  existential: "E",
  intrapersonal: "I",
  visual: "V",
  kinesthetic: "K",
  linguistic: "G",
  interpersonal: "P",
  musical: "M",
  naturalist: "N",
};

const PREFIX_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_PREFIX).map(([cat, prefix]) => [prefix, cat]),
) as Record<string, IntelligenceCategory>;

const FULL_CODE_PATTERN = /^([LEGIVKPMN]\d{2}){9}$/;

export function encodeScores(scores: CategoryScore[]): string {
  const scoreMap = new Map(scores.map((s) => [s.category, s.percentage]));

  return CATEGORIES.map(({ id, name }) => {
    const pct = Math.min(100, Math.max(0, scoreMap.get(id) ?? 0));
    return `${CATEGORY_PREFIX[id]}${pct.toString().padStart(2, "0")}`;
  }).join("");
}

export function decodeScores(code: string): CategoryScore[] | null {
  const normalized = extractCodeFromInput(code);
  if (!FULL_CODE_PATTERN.test(normalized)) return null;

  const segments = normalized.match(/[LEGIVKPMN]\d{2}/g);
  if (!segments || segments.length !== 9) return null;

  const percentages = new Map<IntelligenceCategory, number>();

  for (const segment of segments) {
    const prefix = segment[0];
    const category = PREFIX_TO_CATEGORY[prefix];
    if (!category) return null;

    const value = parseInt(segment.slice(1), 10);
    if (Number.isNaN(value) || value < 0 || value > 100) return null;

    percentages.set(category, value);
  }

  if (percentages.size !== 9) return null;

  return CATEGORIES.map(({ id, name }) => {
    const percentage = percentages.get(id) ?? 0;
    const rawScore = Math.round((percentage / 100) * 12 + 3);
    return {
      category: id,
      categoryName: name,
      rawScore,
      percentage,
    };
  });
}

export function generateShortCode(fullCode: string): string {
  let hash = 0;
  for (let i = 0; i < fullCode.length; i++) {
    hash = (hash * 31 + fullCode.charCodeAt(i)) >>> 0;
  }
  const encoded = hash.toString(36).toUpperCase().padStart(5, "0").slice(0, 5);
  return `IQ-${encoded}`;
}

export function extractCodeFromInput(input: string): string {
  const trimmed = input.trim();

  try {
    const url = new URL(trimmed);
    const codeParam = url.searchParams.get("code");
    if (codeParam) return codeParam.toUpperCase();
  } catch {
    /* not a URL */
  }

  if (trimmed.startsWith("IQ-")) {
    return trimmed.slice(3).toUpperCase();
  }

  return trimmed.toUpperCase();
}

export function isFullResultCode(input: string): boolean {
  return FULL_CODE_PATTERN.test(extractCodeFromInput(input));
}

export function buildShareUrl(fullCode: string): string {
  if (typeof window === "undefined") {
    return `/result?code=${fullCode}`;
  }
  return `${window.location.origin}/result?code=${fullCode}`;
}

export function scoresToCategoryMap(scores: CategoryScore[]): Map<IntelligenceCategory, number> {
  return new Map(scores.map((s) => [s.category, s.percentage]));
}
