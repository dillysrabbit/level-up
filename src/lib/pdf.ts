import { jsPDF } from "jspdf";
import type { Employee, Visit } from "../types";
import {
  categoryScores,
  overallAverage,
  averageTrend,
  dimensionTrends,
  type DimensionTrend,
} from "./analytics";
import { findCompetency, LEVEL_SCALE, visitTypeLabel } from "../data/competencyFramework";
import { formatDate } from "./format";

const OCCASION_LABELS: Record<string, string> = {
  routine: "Routine",
  einarbeitung: "Einarbeitung",
  anlassbezogen: "Anlassbezogen",
  jahresgespraech: "Jahresgespräch",
};

const PALETTE: [number, number, number][] = [
  [37, 99, 235],
  [16, 185, 129],
  [245, 158, 11],
  [139, 92, 246],
  [236, 72, 153],
  [14, 165, 233],
];

const SLATE: [number, number, number] = [51, 65, 85];
const MUTED: [number, number, number] = [120, 134, 150];
const BRAND: [number, number, number] = [37, 99, 235];

// Standard-Schriften (Helvetica) bilden typografische Sonderzeichen nicht zuverlässig ab –
// daher auf ASCII-nahe Varianten normalisieren (Umlaute/ß bleiben erhalten).
function sanitize(text: string): string {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[„“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...");
}

function levelColor(v: number): [number, number, number] {
  if (v >= 4) return [16, 185, 129];
  if (v >= 3) return [59, 130, 246];
  if (v >= 2) return [245, 158, 11];
  return [248, 113, 113];
}

/** Bündelt jsPDF + Layout-Helfer mit fortlaufendem Cursor. */
function makeRenderer(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  function header(title: string) {
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 64, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(sanitize(title), margin, 36);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("LevelUp - Mitarbeitervisiten Pflege", margin, 52);
    y = 64 + 28;
  }

  function nameBlock(employee: Employee | undefined) {
    setColor(SLATE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(sanitize(employee?.name ?? "Unbekannt"), margin, y);
    y += 18;
    const stamm = [employee?.role, employee?.area].filter(Boolean).join("  ·  ");
    if (stamm) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setColor(MUTED);
      doc.text(sanitize(stamm), margin, y);
      y += 16;
    }
    y += 6;
  }

  function metaTable(rows: [string, string][]) {
    doc.setFontSize(10);
    for (const [label, value] of rows) {
      ensure(16);
      setColor(MUTED);
      doc.setFont("helvetica", "normal");
      doc.text(label, margin, y);
      setColor(SLATE);
      doc.setFont("helvetica", "bold");
      doc.text(sanitize(value), margin + 110, y);
      y += 16;
    }
    y += 6;
  }

  function heading(text: string) {
    ensure(28);
    setColor(BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(sanitize(text), margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  }

  function mutedLine(text: string) {
    ensure(14);
    setColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(sanitize(text), margin, y);
    y += 14;
  }

  function paragraph(text: string) {
    setColor(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(sanitize(text), contentW) as string[];
    for (const line of lines) {
      ensure(14);
      doc.text(line, margin, y);
      y += 14;
    }
    y += 8;
  }

  function textSections(visit: Visit) {
    const sections: [string, string][] = [
      ["Beobachtungen", visit.observations],
      ["Stärken & Ressourcen", visit.strengths],
      ["Entwicklungsfelder", visit.developmentAreas],
      ["Fazit & Vereinbarung", visit.summary],
    ];
    for (const [title, body] of sections) {
      if (!body.trim()) continue;
      heading(title);
      paragraph(body);
    }
  }

  function competencyProfile(visit: Visit) {
    if (visit.ratings.length === 0) return;
    heading("Kompetenzprofil");
    for (const s of categoryScores(visit)) {
      if (s.average === null) continue;
      ensure(22);
      setColor(SLATE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(sanitize(s.label), margin, y);
      doc.setFont("helvetica", "bold");
      doc.text(`${s.average.toFixed(1)} / 5`, pageW - margin, y, { align: "right" });
      const barY = y + 4;
      doc.setFillColor(226, 232, 240);
      doc.rect(margin, barY, contentW, 5, "F");
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, barY, (contentW * s.average) / 5, 5, "F");
      y += 22;
    }
    y += 4;
    ensure(18);
    setColor(MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Einzelbewertungen", margin, y);
    y += 14;
    for (const r of visit.ratings) {
      const comp = findCompetency(r.competencyId);
      ensure(14);
      setColor(SLATE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(sanitize(comp?.label ?? r.competencyId), margin, y);
      doc.setFont("helvetica", "bold");
      doc.text(sanitize(`${r.level} · ${LEVEL_SCALE[r.level].label}`), pageW - margin, y, {
        align: "right",
      });
      y += 14;
      // Leithinweise (Beobachtungspunkte) als Referenz
      if (comp?.points?.length) {
        setColor(MUTED);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        for (const p of comp.points) {
          const lines = doc.splitTextToSize(`• ${sanitize(p)}`, contentW - 12) as string[];
          for (const line of lines) {
            ensure(11);
            doc.text(line, margin + 12, y);
            y += 11;
          }
        }
        y += 4;
      }
    }
    y += 8;
  }

  // Zeichnet Achsen/Gitter und liefert Koordinaten-Funktionen + Abschluss.
  function plotFrame(dates: string[], h: number) {
    ensure(h + 6);
    const top = y;
    const left = margin + 22;
    const right = pageW - margin;
    const bottom = top + h - 18;
    const n = dates.length;
    const X = (i: number) => (n === 1 ? (left + right) / 2 : left + ((right - left) * i) / (n - 1));
    const Y = (v: number) => top + (bottom - top) * (1 - (v - 1) / 4);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.setFontSize(8);
    setColor(MUTED);
    for (let lvl = 1; lvl <= 5; lvl++) {
      doc.line(left, Y(lvl), right, Y(lvl));
      doc.text(String(lvl), left - 6, Y(lvl) + 3, { align: "right" });
    }
    const labelEvery = n > 6 ? Math.ceil(n / 5) : 1;
    doc.setFontSize(7.5);
    dates.forEach((d, i) => {
      if (i % labelEvery === 0) doc.text(formatDate(d).slice(0, 6), X(i), bottom + 12, { align: "center" });
    });
    return { X, Y, finish: () => (y = top + h + 6) };
  }

  function trendOverall(points: { date: string; average: number }[]) {
    if (points.length < 2) {
      mutedLine("Verlauf erscheint ab zwei Visiten mit Kompetenz-Check.");
      return;
    }
    const f = plotFrame(points.map((p) => p.date), 150);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);
    for (let i = 1; i < points.length; i++) {
      doc.line(f.X(i - 1), f.Y(points[i - 1].average), f.X(i), f.Y(points[i].average));
    }
    points.forEach((p, i) => {
      const c = levelColor(p.average);
      doc.setFillColor(c[0], c[1], c[2]);
      doc.circle(f.X(i), f.Y(p.average), 2.6, "F");
    });
    f.finish();
  }

  function trendDimensions(dim: DimensionTrend) {
    if (dim.dates.length < 2) {
      mutedLine("Dimensions-Verlauf erscheint ab zwei Visiten mit Kompetenz-Check.");
      return;
    }
    const f = plotFrame(dim.dates, 150);
    doc.setLineWidth(1.75);
    dim.series.forEach((s, si) => {
      const c = PALETTE[si % PALETTE.length];
      doc.setDrawColor(c[0], c[1], c[2]);
      doc.setFillColor(c[0], c[1], c[2]);
      let prev: { x: number; y: number } | null = null;
      s.values.forEach((v, i) => {
        if (v === null) {
          prev = null;
          return;
        }
        const px = f.X(i);
        const py = f.Y(v);
        if (prev) doc.line(prev.x, prev.y, px, py);
        doc.circle(px, py, 2.2, "F");
        prev = { x: px, y: py };
      });
    });
    f.finish();

    // Legende
    ensure(16);
    let lx = margin;
    doc.setFontSize(8);
    dim.series.forEach((s, si) => {
      const c = PALETTE[si % PALETTE.length];
      const label = sanitize(s.label);
      const w = doc.getTextWidth(label) + 14;
      if (lx + w > pageW - margin) {
        lx = margin;
        y += 14;
        ensure(14);
      }
      doc.setFillColor(c[0], c[1], c[2]);
      doc.rect(lx, y - 6, 8, 8, "F");
      setColor(SLATE);
      doc.text(label, lx + 11, y);
      lx += w + 6;
    });
    y += 16;
  }

  function signatures() {
    ensure(50);
    y += 14;
    doc.setDrawColor(150, 160, 175);
    doc.setLineWidth(0.75);
    const colW = (contentW - 30) / 2;
    doc.line(margin, y, margin + colW, y);
    doc.line(margin + colW + 30, y, pageW - margin, y);
    y += 12;
    setColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Mitarbeiter:in", margin, y);
    doc.text("Leitung", margin + colW + 30, y);
  }

  function footer() {
    const pageCount = doc.getNumberOfPages();
    const stamp = `Erstellt am ${formatDate(new Date().toISOString())} mit LevelUp`;
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      setColor(MUTED);
      doc.text(stamp, margin, pageH - 24);
      doc.text(`Seite ${p} / ${pageCount}`, pageW - margin, pageH - 24, { align: "right" });
    }
  }

  return {
    header,
    nameBlock,
    metaTable,
    heading,
    mutedLine,
    textSections,
    competencyProfile,
    trendOverall,
    trendDimensions,
    signatures,
    footer,
  };
}

function safeFile(name: string | undefined): string {
  return (name ?? "Mitarbeiter").replace(/[^\p{L}\p{N}]+/gu, "_");
}

/** Einzelne Visite als PDF-Protokoll. */
export function exportVisitPdf(visit: Visit, employee: Employee | undefined): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const r = makeRenderer(doc);
  r.header("Mitarbeitervisite");
  r.nameBlock(employee);
  r.metaTable([
    ["Datum", formatDate(visit.date)],
    ["Visiten-Typ", visitTypeLabel(visit.visitType)],
    ["Anlass", OCCASION_LABELS[visit.occasion] ?? visit.occasion],
    ["Ort / Setting", visit.location || "-"],
  ]);
  r.textSections(visit);
  r.competencyProfile(visit);
  r.signatures();
  r.footer();
  doc.save(`Visite_${safeFile(employee?.name)}_${visit.date}.pdf`);
}

/** Sammel-Export: alle Visiten einer Person als zusammenhängender Bericht inkl. Verlauf. */
export function exportEmployeePdf(employee: Employee | undefined, visits: Visit[]): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const r = makeRenderer(doc);
  const sorted = [...visits].sort((a, b) => a.date.localeCompare(b.date));

  r.header("Visiten-Bericht");
  r.nameBlock(employee);

  const current = overallAverage(sorted[sorted.length - 1]);
  r.metaTable([
    [
      "Zeitraum",
      sorted.length
        ? `${formatDate(sorted[0].date)} - ${formatDate(sorted[sorted.length - 1].date)}`
        : "-",
    ],
    ["Anzahl Visiten", String(sorted.length)],
    ["Aktuelles Niveau", current !== null ? `${current.toFixed(1)} / 5` : "-"],
  ]);

  const trend = averageTrend(sorted);
  if (trend.length >= 2) {
    r.heading("Kompetenz-Verlauf (Gesamt)");
    r.trendOverall(trend);
  }
  const dim = dimensionTrends(sorted);
  if (dim.dates.length >= 2) {
    r.heading("Verlauf je Dimension");
    r.trendDimensions(dim);
  }

  // Einzelne Visiten, neueste zuerst
  for (const v of [...sorted].reverse()) {
    r.heading(`Visite vom ${formatDate(v.date)} - ${visitTypeLabel(v.visitType)}`);
    const meta = [OCCASION_LABELS[v.occasion] ?? v.occasion, v.location].filter(Boolean).join("  ·  ");
    if (meta) r.mutedLine(meta);
    r.textSections(v);
    r.competencyProfile(v);
  }

  r.footer();
  doc.save(`Visiten-Bericht_${safeFile(employee?.name)}.pdf`);
}
