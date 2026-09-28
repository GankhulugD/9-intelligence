"use client";

import { useState } from "react";
import { GitCompare, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { decodeScores, extractCodeFromInput, isFullResultCode } from "@/lib/result-code";
import type { CategoryScore } from "@/lib/scoring";

interface FriendComparisonProps {
  friendScores: CategoryScore[] | null;
  onCompare: (scores: CategoryScore[]) => void;
  onClear: () => void;
}

export function FriendComparison({ friendScores, onCompare, onClear }: FriendComparisonProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    setError(null);
    const extracted = extractCodeFromInput(input);

    if (!isFullResultCode(extracted)) {
      setError("Буруу код эсвэл линк. Жишээ: L95E90I88V82K72G62P52M50N45 эсвэл бүтэн URL.");
      return;
    }

    const decoded = decodeScores(extracted);
    if (!decoded) {
      setError("Код уншиж чадсангүй. Дахин оролдоно уу.");
      return;
    }

    onCompare(decoded);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-zinc-900">Найзтайгаа харьцуулах</h3>
      </div>
      <p className="text-sm text-zinc-600">
        Найзынхаа линк эсвэл кодыг оруулаад график дээр харьцуулна уу.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          placeholder="https://.../result?code=L95E90I88..."
          className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <Button onClick={handleCompare} className="shrink-0 bg-indigo-500 hover:bg-indigo-600">
          <GitCompare className="h-4 w-4" />
          Харьцуулах
        </Button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {friendScores && (
        <Button variant="ghost" onClick={onClear} className="text-sm text-zinc-500">
          Харьцуулалтыг арилгах
        </Button>
      )}
    </div>
  );
}
