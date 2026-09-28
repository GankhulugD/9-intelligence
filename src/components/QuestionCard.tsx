"use client";

import type { Question } from "@/data/questions";
import { LikertScale } from "@/components/LikertScale";

interface QuestionCardProps {
  question: Question;
  value?: number;
  onSelect: (value: number) => void;
  isTransitioning: boolean;
}

export function QuestionCard({
  question,
  value,
  onSelect,
  isTransitioning,
}: QuestionCardProps) {
  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mb-6 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        {question.categoryName}
      </div>
      <h2 className="mb-8 text-xl font-semibold leading-relaxed text-zinc-900 sm:text-2xl">
        {question.question}
      </h2>
      <LikertScale value={value} onSelect={onSelect} disabled={isTransitioning} />
    </div>
  );
}
