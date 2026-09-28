import { Button } from "@/components/ui/Button";
import { Brain, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="animate-fade-in w-full text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-emerald-50 p-4">
            <Brain className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Оюун ухааны 9 төрлийн
            <br />
            <span className="text-emerald-600">профайл тест</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Та өөрийн сэтгэлгээний онцлог, гүн логик болон давуу талуудаа 9 өнцөгт
            радар диаграммаар тодорхойлоорой.
          </p>

          <Button href="/quiz" className="text-base px-8 py-4">
            Тест эхлүүлэх
            <ChevronRight className="h-5 w-5" />
          </Button>

          <p className="mt-8 text-sm text-zinc-400">27 асуулт · ~5 минут</p>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-6 text-center text-xs text-zinc-400">
        Howard Gardner-ийн олон оюун ухааны онолд суурилсан
      </footer>
    </div>
  );
}
