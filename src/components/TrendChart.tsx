import { formatDate } from "../lib/format";

export interface TrendPoint {
  date: string;
  average: number;
}

function levelColor(v: number): string {
  if (v >= 4) return "#10b981"; // emerald-500
  if (v >= 3) return "#3b82f6"; // brand-500
  if (v >= 2) return "#f59e0b"; // amber-500
  return "#f87171"; // red-400
}

/**
 * Liniendiagramm des durchschnittlichen Kompetenzniveaus (1–5) über die Zeit.
 * Reines SVG, skaliert responsiv auf die Containerbreite.
 */
export default function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) {
    return (
      <p className="py-2 text-sm text-slate-400">
        Sobald mindestens zwei Visiten mit Kompetenz-Check vorliegen, erscheint hier der Verlauf.
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

  const n = points.length;
  const x = (i: number) => padL + (plotW * i) / (n - 1);
  const y = (v: number) => padT + plotH * (1 - (v - 1) / 4);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.average)}`).join(" ");
  const areaPath =
    `M ${x(0)} ${y(points[0].average)} ` +
    points.map((p, i) => `L ${x(i)} ${y(p.average)}`).join(" ") +
    ` L ${x(n - 1)} ${padT + plotH} L ${x(0)} ${padT + plotH} Z`;

  const first = points[0].average;
  const last = points[n - 1].average;
  const delta = last - first;
  // Bei vielen Punkten nicht jedes Datum beschriften (Überlappung vermeiden).
  const labelEvery = n > 6 ? Math.ceil(n / 5) : 1;

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold tabular-nums text-slate-900">{last.toFixed(1)}</span>
          <span className="text-sm text-slate-400"> / 5</span>
        </div>
        <span
          className={`chip ${
            delta > 0
              ? "bg-emerald-50 text-emerald-700"
              : delta < 0
                ? "bg-red-50 text-red-600"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "■"} {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)} seit Beginn
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kompetenz-Verlauf">
        {/* Gitterlinien & Y-Beschriftung (Stufen 1–5) */}
        {[1, 2, 3, 4, 5].map((lvl) => (
          <g key={lvl}>
            <line
              x1={padL}
              y1={y(lvl)}
              x2={W - padR}
              y2={y(lvl)}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <text x={padL - 6} y={y(lvl) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">
              {lvl}
            </text>
          </g>
        ))}

        {/* Fläche unter der Linie */}
        <path d={areaPath} fill="#3b82f6" opacity={0.08} />

        {/* Trendlinie */}
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Punkte + X-Beschriftung */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.average)} r={3.5} fill="#fff" stroke={levelColor(p.average)} strokeWidth={2.5} />
            {i % labelEvery === 0 && (
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize={8.5} fill="#94a3b8">
                {formatDate(p.date).slice(0, 6)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
