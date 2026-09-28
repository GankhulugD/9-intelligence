import { CATEGORIES } from "@/data/categories";
import { getUserScoreContext } from "@/lib/score-context";
import type { CategoryScore } from "@/lib/scoring";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StrengthsWeaknessesSectionProps {
  strengths: CategoryScore[];
  growthAreas: CategoryScore[];
}

function StrengthCard({ score }: { score: CategoryScore }) {
  const meta = CATEGORIES.find((c) => c.id === score.category);
  if (!meta) return null;

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="font-medium text-zinc-900">{meta.name}</h4>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-emerald-600">
          {score.percentage}%
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-700">{meta.insight}</p>
      <p className="mt-3 text-xs text-zinc-500">{meta.careers}</p>
    </div>
  );
}

function GrowthCard({ score }: { score: CategoryScore }) {
  const meta = CATEGORIES.find((c) => c.id === score.category);
  if (!meta) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="font-medium text-zinc-900">{meta.name}</h4>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-zinc-600">
          {score.percentage}%
        </span>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-zinc-600">{meta.overview}</p>
      <p className="text-sm leading-relaxed text-zinc-500">{getUserScoreContext(score.percentage)}</p>
    </div>
  );
}

export function StrengthsWeaknessesSection({
  strengths,
  growthAreas,
}: StrengthsWeaknessesSectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <p className="mb-6 text-sm text-zinc-500">
        Тестийн хариунаас хамгийн өндөр болон хамгийн бага 3 чиглэл. Энэ нь баталгаажсан
        дүгнэлт биш — зөвхөн таны өнөөдрийн self-assessment тойм.
      </p>

      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <ArrowUp className="h-5 w-5 text-emerald-500" />
          Давуу талууд
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {strengths.map((score) => (
            <StrengthCard key={score.category} score={score} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <ArrowDown className="h-5 w-5 text-zinc-400" />
          Харьцангуй сул чиглэлүүд
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {growthAreas.map((score) => (
            <GrowthCard key={score.category} score={score} />
          ))}
        </div>
      </div>
    </section>
  );
}
