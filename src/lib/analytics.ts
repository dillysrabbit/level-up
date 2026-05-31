import { COMPETENCY_FRAMEWORK } from "../data/competencyFramework";
import type { Visit } from "../types";

export interface CategoryScore {
  categoryId: string;
  label: string;
  /** Durchschnitt 1–5 oder null, wenn nicht bewertet */
  average: number | null;
  ratedCount: number;
  totalCount: number;
}

/** Berechnet je Kompetenz-Kategorie den Durchschnitt aus den Bewertungen einer Visite. */
export function categoryScores(visit: Visit | undefined): CategoryScore[] {
  return COMPETENCY_FRAMEWORK.map((category) => {
    const ids = new Set(category.competencies.map((c) => c.id));
    const levels = (visit?.ratings ?? [])
      .filter((r) => ids.has(r.competencyId))
      .map((r) => r.level);
    const average =
      levels.length > 0 ? levels.reduce((sum, l) => sum + l, 0) / levels.length : null;
    return {
      categoryId: category.id,
      label: category.label,
      average,
      ratedCount: levels.length,
      totalCount: category.competencies.length,
    };
  });
}

/** Vergleicht zwei Visiten und liefert die Veränderung des Gesamtdurchschnitts. */
export function overallAverage(visit: Visit | undefined): number | null {
  const levels = visit?.ratings.map((r) => r.level) ?? [];
  if (levels.length === 0) return null;
  return levels.reduce((sum, l) => sum + l, 0) / levels.length;
}

/** Trend über mehrere Visiten (chronologisch aufsteigend) für eine Mini-Verlaufsanzeige. */
export function averageTrend(visits: Visit[]): { date: string; average: number }[] {
  return [...visits]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((v) => ({ date: v.date, average: overallAverage(v) }))
    .filter((p): p is { date: string; average: number } => p.average !== null);
}
