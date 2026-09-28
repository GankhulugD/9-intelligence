import { type ReactNode } from "react";
import { Info } from "lucide-react";

interface DisclaimerNoteProps {
  children: ReactNode;
  variant?: "default" | "amber";
}

export function DisclaimerNote({ children, variant = "default" }: DisclaimerNoteProps) {
  const styles =
    variant === "amber"
      ? "border-amber-200 bg-amber-50/60 text-zinc-700"
      : "border-zinc-200 bg-zinc-50 text-zinc-600";

  return (
    <div
      className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}
    >
      <Info
        className={`mt-0.5 h-4 w-4 shrink-0 ${variant === "amber" ? "text-amber-600" : "text-zinc-400"}`}
        strokeWidth={1.75}
      />
      <div>{children}</div>
    </div>
  );
}
