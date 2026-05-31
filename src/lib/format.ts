/** Formatiert ein ISO-Datum als TT.MM.JJJJ (deutsch). */
export function formatDate(iso?: string): string {
  if (!iso) return "–";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Heutiges Datum im Format YYYY-MM-DD (für <input type="date">). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Liefert Initialen für den Avatar. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
