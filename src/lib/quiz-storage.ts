import type { CategoryScore } from "@/lib/scoring";

const RESULTS_KEY = "intelligence-quiz-results";

export interface QuizResults {
  scores: CategoryScore[];
  completedAt: string;
  resultCode?: string;
  shortCode?: string;
}

export function saveQuizResults(
  scores: CategoryScore[],
  resultCode?: string,
  shortCode?: string,
): void {
  const payload: QuizResults = {
    scores,
    completedAt: new Date().toISOString(),
    resultCode,
    shortCode,
  };
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(payload));
}

export function loadQuizResults(): QuizResults | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(RESULTS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as QuizResults;
  } catch {
    return null;
  }
}

export function clearQuizResults(): void {
  sessionStorage.removeItem(RESULTS_KEY);
}
