import { CATEGORY_ORDER, CATEGORIES, type IntelligenceCategory } from "@/data/categories";
import type { CategoryScore } from "@/lib/scoring";

export const TESLA_SCORE_MAX = 180;

export interface HistoricalProfile {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  scores: Record<IntelligenceCategory, number>;
  explanations: Record<IntelligenceCategory, string>;
  summary: string;
}

export const TESLA_PROFILE: HistoricalProfile = {
  id: "tesla",
  name: "Никола Тесла (Nikola Tesla)",
  title: "Суут зохион бүтээгч, физикч, инженер",
  avatar: "/tesla.jpg",
  scores: {
    logical: 165, // Логик - Математик
    existential: 150, // Оршин тогтнохуй
    intrapersonal: 95, // Өөрийгөө танин мэдэх
    visual: 180, // Орон зай - Хараа
    kinesthetic: 85, // Бие - Хөдөлгөөн
    linguistic: 150, // Хэл шинжлэл (8+ хэл, ой тогтоолт)
    interpersonal: 35, // Харилцаа / Нийгэм
    musical: 70, // Хөгжим
    naturalist: 65, // Байгаль дэлхий
  },
  explanations: {
    logical:
      "Хувьсах ток (AC), радио долгион, цахилгаан соронзон орны физик болон математик логикийг шинээр томьёолж практикт нэвтрүүлсэн.",
    existential:
      "Ертөнц, энерги, давтамж, чичиргээний цаад гүн логикийг амьдралынхаа туршид тасралтгүй тунгаан бодож байв.",
    intrapersonal:
      "Гэр бүл болон хувийн амьдралаа золиослон, өөрийн эрдэм шинжилгээний зорилгодоо тууштай төвлөрч чаддаг дотоод өндөр сахилга баттай байсан.",
    visual:
      "Тесла ямар ч нооргонгүйгээр нарийн төвөгтэй генератор, мотор, трансформаторыг тархиндаа 3D-гээр бүтээж, туршиж алдааг нь засдаг феноменал 'photographic memory'-тэй байсан.",
    kinesthetic:
      "Лабораторийнхоо нарийн төвөгтэй туршилтын төхөөрөмжүүдийг өөрийн гараар гар ур дүй сайтайгаар угсарч туршдаг байв.",
    linguistic:
      "8+ гаруй хэлээр (Серб, Англи, Герман, Франц, Итали г.м) чөлөөтэй ярьдаг, Гётегийн 'Фауст' зохиолыг үг үсэггүй цээжилсэн полиглот.",
    interpersonal:
      "Нийгмийн харилцаанаас зайсхийдэг, хаалттай байсан тул бизнес болон санхүүгийн тал дээр амархан залилуулах эрсдэлтэй байжээ.",
    musical:
      "Цахилгаан соронзон долгионы хэмнэл, байгалийн чичиргээг соргог мэдэрч, сонгодог урлагийг шимтэн үздэг байжээ.",
    naturalist:
      "Аянга цахилгаан, дэлхийн резонанс зэрэг байгалийн хүчийг ажиглаж технологийн эх сурвалж болгохыг зорьж байв.",
  },
  summary:
    "Тесла нь Орон зай-Хараа, Логик болон Хэл шинжлэлийн хувьд хүн төрөлхтний дээд хязгаарыг давсан гоц авьяастай байсан хэдий ч Нийгмийн харилцааны хувьд маш доогуур оноотой нь түүнийг амьдралдаа санхүүгийн хүндрэлтэй тулахад хүргэж байв.",
};

/** Raw radar values (0–180) — index i = CATEGORY_ORDER[i]. Extends past user 100 ring. */
export function getTeslaRadarValues(): number[] {
  return CATEGORY_ORDER.map((id) => TESLA_PROFILE.scores[id]);
}

export function getTeslaBenchmarkMax(): number {
  return Math.max(...getTeslaRadarValues());
}

export function historicalScoresToCategoryScores(
  profile: HistoricalProfile,
): CategoryScore[] {
  return CATEGORY_ORDER.map((id) => {
    const name = CATEGORIES.find((c) => c.id === id)!.name;
    const rawScore = profile.scores[id];
    const percentage = Math.round((rawScore / TESLA_SCORE_MAX) * 100);
    return {
      category: id,
      categoryName: name,
      rawScore,
      percentage,
    };
  });
}

export function getTeslaCategoryScores(): CategoryScore[] {
  return historicalScoresToCategoryScores(TESLA_PROFILE);
}

/** Normalized 0–100% for optional cross-scale reference. */
export function getTeslaNormalizedPercent(raw: number): number {
  return Math.round((raw / TESLA_SCORE_MAX) * 100);
}
