import { jsPDF } from "jspdf";
import type { Employee, Visit } from "../types";
import { categoryScores } from "./analytics";
import { findCompetency, LEVEL_SCALE, visitTypeLabel } from "../data/competencyFramework";
import { formatDate } from "./format";

const OCCASION_LABELS: Record<string, string> = {
  routine: "Routine",
  einarbeitung: "Einarbeitung",
  anlassbezogen: "Anlassbezogen",
  jahresgespraech: "Jahresgespräch",
};

// Standard-Schriften (Helvetica) bilden typografische Sonderzeichen nicht zuverlässig ab –
// daher auf ASCII-nahe Varianten normalisieren (Umlaute/ß bleiben erhalten).
function sanitize(text: string): string {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[„“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...");
}

export function exportVisitPdf(visit: Visit, employee: Employee | undefined): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const setColor = (hex: [number, number, number]) => doc.setTextColor(hex[0], hex[1], hex[2]);
  const SLATE: [number, number, number] = [51, 65, 85];
  const MUTED: [number, number, number] = [120, 134, 150];
  const BRAND: [number, number, number] = [37, 99, 235];

  // Kopfzeile mit Markenbalken
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageW, 64, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Mitarbeitervisite", margin, 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("LevelUp - Mitarbeitervisiten Pflege", margin, 52);
  y = 64 + 28;

  // Titelblock: Name + Stammdaten
  setColor(SLATE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(sanitize(employee?.name ?? "Unbekannt"), margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setColor(MUTED);
  const stamm = [employee?.role, employee?.area].filter(Boolean).join("  ·  ");
  if (stamm) {
    doc.text(sanitize(stamm), margin, y);
    y += 16;
  }

  // Meta-Tabelle
  y += 6;
  const meta: [string, string][] = [
    ["Datum", formatDate(visit.date)],
    ["Visiten-Typ", visitTypeLabel(visit.visitType)],
    ["Anlass", OCCASION_LABELS[visit.occasion] ?? visit.occasion],
    ["Ort / Setting", visit.location || "-"],
  ];
  doc.setFontSize(10);
  for (const [label, value] of meta) {
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

  const sectionHeading = (text: string) => {
    ensure(26);
    setColor(BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(sanitize(text), margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };

  const paragraph = (text: string) => {
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
  };

  const textSections: [string, string][] = [
    ["Beobachtungen", visit.observations],
    ["Stärken & Ressourcen", visit.strengths],
    ["Entwicklungsfelder", visit.developmentAreas],
    ["Fazit & Vereinbarung", visit.summary],
  ];
  for (const [title, body] of textSections) {
    if (!body.trim()) continue;
    sectionHeading(title);
    paragraph(body);
  }

  // Kompetenzprofil
  if (visit.ratings.length > 0) {
    sectionHeading("Kompetenzprofil");

    // Kategorien als Balken
    for (const s of categoryScores(visit)) {
      if (s.average === null) continue;
      ensure(22);
      setColor(SLATE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(sanitize(s.label), margin, y);
      doc.setFont("helvetica", "bold");
      doc.text(`${s.average.toFixed(1)} / 5`, pageW - margin, y, { align: "right" });
      // Balken
      const barY = y + 4;
      const barW = contentW;
      doc.setFillColor(226, 232, 240);
      doc.rect(margin, barY, barW, 5, "F");
      doc.setFillColor(37, 99, 235);
      doc.rect(margin, barY, (barW * s.average) / 5, 5, "F");
      y += 22;
    }
    y += 6;

    // Einzelbewertungen
    ensure(20);
    setColor(MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Einzelbewertungen", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(SLATE);
    for (const r of visit.ratings) {
      ensure(14);
      const label = findCompetency(r.competencyId)?.label ?? r.competencyId;
      doc.text(sanitize(label), margin, y);
      doc.text(
        sanitize(`${r.level} · ${LEVEL_SCALE[r.level].label}`),
        pageW - margin,
        y,
        { align: "right" },
      );
      y += 14;
    }
    y += 8;
  }

  // Unterschriftenzeilen
  ensure(60);
  y += 10;
  doc.setDrawColor(150, 160, 175);
  const colW = (contentW - 30) / 2;
  doc.line(margin, y, margin + colW, y);
  doc.line(margin + colW + 30, y, pageW - margin, y);
  y += 12;
  setColor(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Mitarbeiter:in", margin, y);
  doc.text("Leitung", margin + colW + 30, y);

  // Fußzeile auf allen Seiten
  const pageCount = doc.getNumberOfPages();
  const stamp = `Erstellt am ${formatDate(new Date().toISOString())} mit LevelUp`;
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    setColor(MUTED);
    doc.text(stamp, margin, pageH - 24);
    doc.text(`Seite ${p} / ${pageCount}`, pageW - margin, pageH - 24, { align: "right" });
  }

  const safeName = (employee?.name ?? "Mitarbeiter").replace(/[^\p{L}\p{N}]+/gu, "_");
  doc.save(`Visite_${safeName}_${visit.date}.pdf`);
}
