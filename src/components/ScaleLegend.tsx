import { LEVEL_SCALE } from "../data/competencyFramework";
import type { CompetencyLevel } from "../types";

const dotColor: Record<CompetencyLevel, string> = {
  1: "bg-red-400",
  2: "bg-amber-500",
  3: "bg-brand-500",
  4: "bg-emerald-500",
  5: "bg-emerald-600",
};

/**
 * Erklärt die entwicklungsorientierte Bewertungsskala.
 * Wichtig: 1 ist keine schlechte Note, sondern ein früher Entwicklungsstand.
 */
export default function ScaleLegend() {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-sm">
      <p className="font-semibold text-slate-700">So ist die Skala gemeint</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
        Es ist eine <span className="font-medium">Entwicklungsskala</span>, keine Schulnote. Eine{" "}
        <span className="font-medium">1</span> ist nicht „schlecht", sondern ein früher Stand (z.B.
        in der Einarbeitung). Je höher der Wert, desto eigenständiger und sicherer.
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {([1, 2, 3, 4, 5] as CompetencyLevel[]).map((lvl) => (
          <li key={lvl} className="flex items-start gap-2">
            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[lvl]}`} />
            <span className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                {lvl} · {LEVEL_SCALE[lvl].label}
              </span>{" "}
              – {LEVEL_SCALE[lvl].description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
