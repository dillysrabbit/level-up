import { frameworkFor } from "../data/competencyFramework";
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
  const framework = frameworkFor(visit?.visitType ?? "fachkraft");
  return framework.map((category) => {
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

export interface DimensionTrend {
  /** Zeitachse (Visitendaten, chronologisch aufsteigend) */
  dates: string[];
  series: { categoryId: string; label: string; values: (number | null)[] }[];
}

/** Verlauf je Kompetenz-Dimension: pro Kategorie eine Linie über die Zeit. */
export function dimensionTrends(visits: Visit[]): DimensionTrend {
  const sorted = [...visits]
    .filter((v) => v.ratings.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const dates = sorted.map((v) => v.date);

  // Kategorien in Framework-Reihenfolge sammeln (über alle Visiten hinweg).
  const order: { id: string; label: string }[] = [];
  const seen = new Set<string>();
  const scoresByVisit = sorted.map((v) => categoryScores(v));
  for (const scores of scoresByVisit) {
    for (const s of scores) {
      if (!seen.has(s.categoryId)) {
        seen.add(s.categoryId);
        order.push({ id: s.categoryId, label: s.label });
      }
    }
  }

  const series = order.map((o) => ({
    categoryId: o.id,
    label: o.label,
    values: scoresByVisit.map((scores) => {
      const s = scores.find((c) => c.categoryId === o.id);
      return s ? s.average : null;
    }),
  }));

  return { dates, series };
}
