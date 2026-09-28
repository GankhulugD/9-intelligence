"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import {
  FRIEND_OVERLAY_THEME,
  RadarChart,
  TESLA_OVERLAY_THEME,
  type RadarOverlay,
} from "@/components/RadarChart";
import { mapCategoryScoresToRadarValues } from "@/lib/radar-mapping";
import { getTeslaBenchmarkMax, getTeslaRadarValues } from "@/data/teslaProfile";
import { CategoryResultsSection } from "@/components/CategoryResultsSection";
import { StrengthsWeaknessesSection } from "@/components/StrengthsWeaknessesSection";
import { ShareExportBar } from "@/components/ShareExportBar";
import { FriendComparison } from "@/components/FriendComparison";
import { HistoricalFigureComparison } from "@/components/HistoricalFigureComparison";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { clearQuizResults, loadQuizResults } from "@/lib/quiz-storage";
import {
  decodeScores,
  encodeScores,
  generateShortCode,
} from "@/lib/result-code";
import { getGrowthAreas, getTopStrengths, type CategoryScore } from "@/lib/scoring";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chartRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<CategoryScore[] | null>(null);
  const [resultCode, setResultCode] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [friendScores, setFriendScores] = useState<CategoryScore[] | null>(null);
  const [compareTesla, setCompareTesla] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const codeParam = searchParams.get("code");

    if (codeParam) {
      const decoded = decodeScores(codeParam);
      if (decoded) {
        setScores(decoded);
        setResultCode(codeParam);
        setShortCode(generateShortCode(codeParam));
        return;
      }
    }

    const stored = loadQuizResults();
    if (stored) {
      setScores(stored.scores);
      const code = stored.resultCode ?? encodeScores(stored.scores);
      const short = stored.shortCode ?? generateShortCode(code);
      setResultCode(code);
      setShortCode(short);

      if (!codeParam) {
        router.replace(`/result?code=${code}`);
      }
      return;
    }

    router.replace("/quiz");
  }, [searchParams, router]);

  const handleRetake = () => {
    clearQuizResults();
    router.push("/quiz");
  };

  const handleDownload = async () => {
    if (!chartRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "oyun-ukhaany-profail.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!scores) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const topStrengths = getTopStrengths(scores, 3);
  const growthAreas = getGrowthAreas(scores, 3);

  const radarOverlays: RadarOverlay[] = [];
  if (friendScores) {
    radarOverlays.push({
      ...FRIEND_OVERLAY_THEME,
      values: mapCategoryScoresToRadarValues(friendScores, "percentage"),
    });
  }
  const benchmarkScaleMax = compareTesla ? getTeslaBenchmarkMax() : undefined;
  if (compareTesla) {
    radarOverlays.push({
      ...TESLA_OVERLAY_THEME,
      values: getTeslaRadarValues(),
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        <div className="animate-fade-in space-y-10">
          <header className="text-center">
            <h1 className="mb-3 text-2xl font-bold text-zinc-900 sm:text-3xl">
              Таны оюун ухааны профайл
            </h1>
            <p className="text-zinc-600">
              9 өнцөгт радар график — таны сэтгэлгээний онцлогийг харуулж байна
            </p>
            {shortCode && (
              <p className="mt-2 font-mono text-sm text-emerald-600">{shortCode}</p>
            )}
          </header>

          <DisclaimerNote>
            <strong>Санамж:</strong> Энэхүү тестийн үр дүн 100% үнэн гэж баталгаажихгүй.
            Self-assessment асуулгаас гаргасан барагцаалсан үзүүлэлт тул зөвхөн өөрийгөө
            танин мэдэх, чиглэл тодорхойлоход зориулсан чиглүүлэгч мэдээлэл гэж ойлгоно уу.
          </DisclaimerNote>

          <ShareExportBar
            scores={scores}
            resultCode={resultCode}
            shortCode={shortCode}
            onRetake={handleRetake}
            onDownloadImage={handleDownload}
            isDownloading={isDownloading}
          />

          <div
            ref={chartRef}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <RadarChart
              scores={scores}
              overlays={radarOverlays}
              benchmarkScaleMax={benchmarkScaleMax}
            />
          </div>

          <FriendComparison
            friendScores={friendScores}
            onCompare={setFriendScores}
            onClear={() => setFriendScores(null)}
          />

          <HistoricalFigureComparison
            isComparing={compareTesla}
            onCompare={() => setCompareTesla(true)}
            onClear={() => setCompareTesla(false)}
          />

          <StrengthsWeaknessesSection
            strengths={topStrengths}
            growthAreas={growthAreas}
          />

          <CategoryResultsSection
            userScores={scores}
            friendScores={friendScores}
            compareTesla={compareTesla}
          />
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
