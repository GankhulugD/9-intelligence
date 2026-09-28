"use client";

import { LIKERT_OPTIONS } from "@/data/categories";

interface LikertScaleProps {
  value?: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export function LikertScale({ value, onSelect, disabled }: LikertScaleProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-2">
      {LIKERT_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className={`group flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-200 sm:px-5 sm:py-3.5 ${
              isSelected
                ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                isSelected
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 text-zinc-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
              }`}
            >
              {option.value}
            </span>
            <span className="text-sm leading-snug sm:text-base">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
