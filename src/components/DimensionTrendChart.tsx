import type { DimensionTrend } from "../lib/analytics";
import { formatDate } from "../lib/format";

const PALETTE = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#0ea5e9"];

/** Liniendiagramm mit je einer Linie pro Kompetenz-Dimension (1–5 über die Zeit). */
export default function DimensionTrendChart({ trend }: { trend: DimensionTrend }) {
  if (trend.dates.length < 2) {
    return (
      <p className="py-2 text-sm text-slate-400">
        Sobald mindestens zwei Visiten mit Kompetenz-Check vorliegen, erscheint hier der Verlauf je
        Dimension.
      </p>
    );
  }

  const W = 320;
  const H = 168;
  const padL = 22;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const n = trend.dates.length;
  const x = (i: number) => padL + (plotW * i) / (n - 1);
  const y = (v: number) => padT + plotH * (1 - (v - 1) / 4);
  const labelEvery = n > 6 ? Math.ceil(n / 5) : 1;

  // Pfad pro Serie über die vorhandenen (nicht-null) Punkte.
  function pathFor(values: (number | null)[]): string {
    let d = "";
    let started = false;
    values.forEach((v, i) => {
      if (v === null) return;
      d += `${started ? "L" : "M"} ${x(i)} ${y(v)} `;
      started = true;
    });
    return d.trim();
  }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kompetenz-Verlauf je Dimension">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <g key={lvl}>
            <line x1={padL} y1={y(lvl)} x2={W - padR} y2={y(lvl)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 6} y={y(lvl) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">
              {lvl}
            </text>
          </g>
        ))}

        {trend.dates.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={8.5} fill="#94a3b8">
              {formatDate(d).slice(0, 6)}
            </text>
          ) : null,
        )}

        {trend.series.map((s, si) => {
          const color = PALETTE[si % PALETTE.length];
          return (
            <g key={s.categoryId}>
              <path d={pathFor(s.values)} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
              {s.values.map((v, i) =>
                v === null ? null : <circle key={i} cx={x(i)} cy={y(v)} r={3} fill={color} />,
              )}
            </g>
          );
        })}
      </svg>

      {/* Legende */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {trend.series.map((s, si) => (
          <span key={s.categoryId} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PALETTE[si % PALETTE.length] }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
