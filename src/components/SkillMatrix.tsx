import type { CategoryScore } from "../lib/analytics";

function barColor(avg: number): string {
  if (avg >= 4) return "bg-emerald-500";
  if (avg >= 3) return "bg-brand-500";
  if (avg >= 2) return "bg-amber-500";
  return "bg-red-400";
}

/** Zeigt die Kompetenz-Kategorien als Balken (Skill-Matrix-Übersicht). */
export default function SkillMatrix({ scores }: { scores: CategoryScore[] }) {
  return (
    <div className="space-y-3">
      {scores.map((s) => (
        <div key={s.categoryId}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-slate-700">{s.label}</span>
            <span className="tabular-nums text-slate-500">
              {s.average !== null ? `${s.average.toFixed(1)} / 5` : "–"}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            {s.average !== null && (
              <div
                className={`h-full rounded-full transition-all ${barColor(s.average)}`}
                style={{ width: `${(s.average / 5) * 100}%` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
