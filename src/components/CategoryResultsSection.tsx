import { CATEGORIES, CATEGORY_ORDER, type IntelligenceCategory } from "@/data/categories";
import {
  TESLA_PROFILE,
  TESLA_SCORE_MAX,
  getTeslaNormalizedPercent,
} from "@/data/teslaProfile";
import { getUserScoreContext } from "@/lib/score-context";
import type { CategoryScore } from "@/lib/scoring";

export type CategoryResultsMode = "solo" | "friend" | "benchmark";

interface CategoryResultsSectionProps {
  userScores: CategoryScore[];
  friendScores?: CategoryScore[] | null;
  compareTesla?: boolean;
}

const ACCENT = {
  user: { bar: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-100" },
  friend: { bar: "bg-indigo-500", text: "text-indigo-600", border: "border-indigo-100" },
  benchmark: { bar: "bg-amber-500", text: "text-amber-600", border: "border-amber-100" },
} as const;

function resolveMode(
  friendScores?: CategoryScore[] | null,
  compareTesla?: boolean,
): CategoryResultsMode {
  if (compareTesla) return "benchmark";
  if (friendScores) return "friend";
  return "solo";
}

function PercentScoreCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: (typeof ACCENT)[keyof typeof ACCENT];
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${accent.border}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${accent.text}`}>{value}%</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${accent.bar}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400">0–100% шкала</p>
    </div>
  );
}

function BenchmarkScoreCell({
  label,
  raw,
  accent,
}: {
  label: string;
  raw: number;
  accent: (typeof ACCENT)[keyof typeof ACCENT];
}) {
  const barWidth = Math.round((raw / TESLA_SCORE_MAX) * 100);
  const normalized = getTeslaNormalizedPercent(raw);

  return (
    <div className={`rounded-xl border bg-white p-4 ${accent.border}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${accent.text}`}>{raw}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${accent.bar}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        Benchmark 0–{TESLA_SCORE_MAX}
        {raw > 100 ? " · 100+ ring давсан" : ""}
        {" · ≈"}
        {normalized}% (0–100-тай харьцуулахад)
      </p>
    </div>
  );
}

function ExplanationCell({
  label,
  text,
  accentBorder,
}: {
  label: string;
  text: string;
  accentBorder: string;
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${accentBorder}`}>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function PersonalScoreNote({ userPct, insight }: { userPct: number; insight: string }) {
  return (
    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
      <span className="font-medium text-zinc-800">Таны хариунд: </span>
      {userPct >= 55 ? insight : getUserScoreContext(userPct)}
    </p>
  );
}

function CategoryDescriptionBlock({
  overview,
  insight,
  userPct,
}: {
  overview: string;
  insight: string;
  userPct: number;
}) {
  return (
    <div className="mt-4 border-t border-zinc-100 pt-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Ангиллын тайлбар
      </p>
      <p className="text-sm leading-relaxed text-zinc-600">{overview}</p>
      <PersonalScoreNote userPct={userPct} insight={insight} />
    </div>
  );
}

function CategoryCard({
  categoryId,
  mode,
  userPct,
  friendPct,
  teslaRaw,
}: {
  categoryId: IntelligenceCategory;
  mode: CategoryResultsMode;
  userPct: number;
  friendPct?: number;
  teslaRaw?: number;
}) {
  const meta = CATEGORIES.find((c) => c.id === categoryId)!;

  return (
    <article className="rounded-xl border border-zinc-100 bg-zinc-50/40 p-4 sm:p-5">
      <h4 className="mb-4 font-semibold text-zinc-900">{meta.name}</h4>

      {mode === "solo" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <PercentScoreCell label="Таны оноо" value={userPct} accent={ACCENT.user} />
            <div className="flex flex-col justify-center sm:col-span-2">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Ангиллын тайлбар
              </p>
              <p className="text-sm leading-relaxed text-zinc-600">{meta.overview}</p>
              <PersonalScoreNote userPct={userPct} insight={meta.insight} />
            </div>
          </div>
        </>
      )}

      {mode === "friend" && friendPct != null && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <PercentScoreCell label="Та" value={userPct} accent={ACCENT.user} />
            <PercentScoreCell label="Найз" value={friendPct} accent={ACCENT.friend} />
          </div>
          <CategoryDescriptionBlock
            overview={meta.overview}
            insight={meta.insight}
            userPct={userPct}
          />
        </>
      )}

      {mode === "benchmark" && teslaRaw != null && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <PercentScoreCell label="Та" value={userPct} accent={ACCENT.user} />
            <BenchmarkScoreCell label="Тесла" raw={teslaRaw} accent={ACCENT.benchmark} />
          </div>
          <CategoryDescriptionBlock
            overview={meta.overview}
            insight={meta.insight}
            userPct={userPct}
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ExplanationCell
              label="Таны оноо яагаад ийм байна"
              text={getUserScoreContext(userPct)}
              accentBorder={ACCENT.user.border}
            />
            <ExplanationCell
              label="Тесла яагаад ийм benchmark"
              text={TESLA_PROFILE.explanations[categoryId]}
              accentBorder={ACCENT.benchmark.border}
            />
          </div>
        </>
      )}
    </article>
  );
}

const MODE_COPY: Record<CategoryResultsMode, { title: string; subtitle: string }> = {
  solo: {
    title: "9 чиглэлийн үр дүн",
    subtitle: "Ангилал бүрт таны оноо болон чиглэлийн ерөнхий тайлбар.",
  },
  friend: {
    title: "9 чиглэлийн харьцуулалт",
    subtitle: "Зүүн тал — таны оноо, баруун тал — найзын оноо, доор нь чиглэлийн тайлбар.",
  },
  benchmark: {
    title: "9 чиглэлийн benchmark харьцуулалт",
    subtitle: `Таны оноо 0–100%, Тесла benchmark 0–${TESLA_SCORE_MAX} (график дээрх raw утгатай ижил).`,
  },
};

export function CategoryResultsSection({
  userScores,
  friendScores,
  compareTesla,
}: CategoryResultsSectionProps) {
  const mode = resolveMode(friendScores, compareTesla);
  const copy = MODE_COPY[mode];

  const userMap = new Map(userScores.map((s) => [s.category, s.percentage]));
  const friendMap = new Map(friendScores?.map((s) => [s.category, s.percentage]) ?? []);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{copy.title}</h3>
      <p className="mt-1 mb-6 text-sm text-zinc-500">{copy.subtitle}</p>

      <div className="space-y-4">
        {CATEGORY_ORDER.map((id) => (
          <CategoryCard
            key={id}
            categoryId={id}
            mode={mode}
            userPct={userMap.get(id) ?? 0}
            friendPct={friendMap.get(id)}
            teslaRaw={TESLA_PROFILE.scores[id]}
          />
        ))}
      </div>
    </section>
  );
}
