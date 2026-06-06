import type { AppData } from "../types";

const STORAGE_KEY = "levelup.data.v1";
const CURRENT_VERSION = 1;

export const emptyData: AppData = {
  version: CURRENT_VERSION,
  employees: [],
  visits: [],
  goals: [],
  notes: [],
};

/** Lädt die Daten aus dem localStorage. Fällt bei Fehlern auf einen leeren Zustand zurück. */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyData };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      version: parsed.version ?? CURRENT_VERSION,
      employees: parsed.employees ?? [],
      visits: parsed.visits ?? [],
      goals: parsed.goals ?? [],
      notes: parsed.notes ?? [],
    };
  } catch (err) {
    console.error("LevelUp: Daten konnten nicht geladen werden.", err);
    return { ...emptyData };
  }
}

/** Speichert die Daten lokal. */
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("LevelUp: Daten konnten nicht gespeichert werden.", err);
  }
}

/** Erzeugt eine eindeutige ID (crypto.randomUUID mit Fallback). */
export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Exportiert die Daten als herunterladbare JSON-Datei (Backup). */
export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `levelup-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Liest und validiert eine importierte Backup-Datei. */
export async function importData(file: File): Promise<AppData> {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<AppData>;
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.employees)) {
    throw new Error("Ungültiges Backup-Format.");
  }
  return {
    version: parsed.version ?? CURRENT_VERSION,
    employees: parsed.employees ?? [],
    visits: parsed.visits ?? [],
    goals: parsed.goals ?? [],
    notes: parsed.notes ?? [],
  };
}
