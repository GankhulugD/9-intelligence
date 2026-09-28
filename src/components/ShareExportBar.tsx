"use client";

import { useState } from "react";
import { Copy, Download, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/Toast";
import { downloadCsv } from "@/lib/export-csv";
import { buildShareUrl } from "@/lib/result-code";
import type { CategoryScore } from "@/lib/scoring";

interface ShareExportBarProps {
  scores: CategoryScore[];
  resultCode: string;
  shortCode: string;
  onRetake: () => void;
  onDownloadImage: () => void;
  isDownloading: boolean;
}

export function ShareExportBar({
  scores,
  resultCode,
  shortCode,
  onRetake,
  onDownloadImage,
  isDownloading,
}: ShareExportBarProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleCopyLink = async () => {
    const url = buildShareUrl(resultCode);
    await navigator.clipboard.writeText(url);
    showToast("Линк хуулагдлаа!");
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(shortCode);
    showToast("Код хуулагдлаа!");
  };

  const handleExportCsv = () => {
    downloadCsv(scores);
    showToast("CSV файл татагдлаа!");
  };

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h3 className="mb-1 text-lg font-semibold text-zinc-900">Хуваалцах & Экспортлох</h3>
        <p className="mb-4 text-sm text-zinc-500">
          Таны профайлын код:{" "}
          <button
            type="button"
            onClick={handleCopyCode}
            className="font-mono font-semibold text-emerald-600 hover:underline"
          >
            {shortCode}
          </button>
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button onClick={handleCopyLink} variant="secondary" className="w-full text-sm">
            <Copy className="h-4 w-4" />
            Линк хуулах
          </Button>
          <Button
            onClick={onDownloadImage}
            variant="secondary"
            disabled={isDownloading}
            className="w-full text-sm"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Татаж байна..." : "Зураг татах (PNG)"}
          </Button>
          <Button onClick={handleExportCsv} variant="secondary" className="w-full text-sm">
            <FileSpreadsheet className="h-4 w-4" />
            CSV / Sheets-д экспорт
          </Button>
          <Button onClick={onRetake} variant="secondary" className="w-full text-sm">
            <RotateCcw className="h-4 w-4" />
            Дахин өгөх
          </Button>
        </div>
      </div>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}
