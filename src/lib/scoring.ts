import { CATEGORIES, CATEGORY_ORDER, type IntelligenceCategory } from "@/data/categories";
import { QUESTIONS } from "@/data/questions";

export interface CategoryScore {
  category: IntelligenceCategory;
  categoryName: string;
  rawScore: number;
  percentage: number;
}

export type Answers = Record<number, number>;

export function normalizeScore(rawScore: number): number {
  return Math.round(((rawScore - 3) / 12) * 100);
}

export function calculateScores(answers: Answers): CategoryScore[] {
  const rawByCategory = new Map<IntelligenceCategory, number>();

  for (const question of QUESTIONS) {
    const category = question.category as IntelligenceCategory;
    const answer = answers[question.id] ?? 0;
    rawByCategory.set(category, (rawByCategory.get(category) ?? 0) + answer);
  }

  return CATEGORY_ORDER.map((id) => {
    const name = CATEGORIES.find((c) => c.id === id)!.name;
    const rawScore = rawByCategory.get(id) ?? 0;
    return {
      category: id,
      categoryName: name,
      rawScore,
      percentage: normalizeScore(rawScore),
    };
  });
}

export function getTopStrengths(scores: CategoryScore[], count = 3): CategoryScore[] {
  return [...scores].sort((a, b) => b.percentage - a.percentage).slice(0, count);
}

export function getGrowthAreas(scores: CategoryScore[], count = 3): CategoryScore[] {
  return [...scores].sort((a, b) => a.percentage - b.percentage).slice(0, count);
}

export function isQuizComplete(answers: Answers): boolean {
  return QUESTIONS.every((question) => answers[question.id] !== undefined);
}
