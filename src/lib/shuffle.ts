import type { Question } from "@/data/questions";

export function shuffleQuestions(questions: Question[]): Question[] {
  return [...questions].sort(() => Math.random() - 0.5);
}
