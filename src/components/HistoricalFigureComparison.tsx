"use client";

import { useState } from "react";
import { GitCompare, Landmark, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DisclaimerNote } from "@/components/DisclaimerNote";
import { TESLA_PROFILE } from "@/data/teslaProfile";

interface HistoricalFigureComparisonProps {
  isComparing: boolean;
  onCompare: () => void;
  onClear: () => void;
}

export function HistoricalFigureComparison({
  isComparing,
  onCompare,
  onClear,
}: HistoricalFigureComparisonProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Landmark className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-zinc-900">
          Түүхэн алдартай хүнтэй харьцуулах
        </h3>
      </div>

      <DisclaimerNote variant="amber">
        <p>
          <strong>Никола Тесла</strong> — түүхэн benchmark. График дээр харьцуулж харна;
          Tesla-ийн тоонууд барагцаалсан, баталгаажаагүй үзүүлэлт.
        </p>
      </DisclaimerNote>

      <div className="flex flex-col gap-4 rounded-xl border border-amber-100 bg-amber-50/40 p-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-amber-100">
          {!avatarError && TESLA_PROFILE.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={TESLA_PROFILE.avatar}
              alt={TESLA_PROFILE.name}
              className="h-full w-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <Zap className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-zinc-900">{TESLA_PROFILE.name}</h4>
          <p className="text-sm text-amber-800">{TESLA_PROFILE.title}</p>
        </div>
        {!isComparing ? (
          <Button
            onClick={onCompare}
            className="shrink-0 bg-amber-500 hover:bg-amber-600"
          >
            <GitCompare className="h-4 w-4" />
            Tesla-тай харьцуулах
          </Button>
        ) : (
          <Button variant="secondary" onClick={onClear} className="shrink-0">
            Харьцуулалтыг арилгах
          </Button>
        )}
      </div>
    </div>
  );
}
