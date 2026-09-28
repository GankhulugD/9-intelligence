"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/Button";
import { QUESTIONS } from "@/data/questions";
import { calculateScores, type Answers } from "@/lib/scoring";
import { encodeScores, generateShortCode } from "@/lib/result-code";
import { saveQuizResults } from "@/lib/quiz-storage";
import { shuffleQuestions } from "@/lib/shuffle";

export default function QuizPage() {
  const router = useRouter();
  const [questions] = useState(() => shuffleQuestions(QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const goToNext = useCallback(
    (nextAnswers: Answers) => {
      if (isLastQuestion) {
        const scores = calculateScores(nextAnswers);
        const resultCode = encodeScores(scores);
        const shortCode = generateShortCode(resultCode);
        saveQuizResults(scores, resultCode, shortCode);
        router.push(`/result?code=${resultCode}`);
        return;
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 250);
    },
    [isLastQuestion, router],
  );

  const handleSelect = (value: number) => {
    if (isTransitioning) return;

    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    setTimeout(() => goToNext(nextAnswers), 300);
  };

  const handleBack = () => {
    if (currentIndex === 0 || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-zinc-50/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4 sm:px-8">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8 sm:px-8 sm:py-12">
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onSelect={handleSelect}
          isTransitioning={isTransitioning}
        />

        <div className="mt-auto pt-8">
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isTransitioning}
              className="px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Өмнөх
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
