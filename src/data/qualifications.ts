// Qualifikationsstufen (QS) gemäß Mitarbeiterverzeichnis / digitaler Stecktafel.
// Dienen als Auswahloptionen beim Anlegen von Mitarbeiter:innen.

export interface Qualification {
  /** Stabiler Schlüssel, z.B. "QS1" */
  id: string;
  /** Stufenkürzel, z.B. "QS 1" */
  level: string;
  /** Kurzbezeichnung, z.B. "Hilfskraft" */
  short: string;
  /** Vollständige Bezeichnung, z.B. "QS 1 – Hilfskraft" (wird als role gespeichert) */
  label: string;
}

export const QUALIFICATIONS: Qualification[] = [
  { id: "QS1", level: "QS 1", short: "Hilfskraft", label: "QS 1 – Hilfskraft" },
  { id: "QS2", level: "QS 2", short: "Assistenzkraft", label: "QS 2 – Assistenzkraft" },
  { id: "QS3", level: "QS 3", short: "Pflegefachkraft", label: "QS 3 – Pflegefachkraft" },
];

/** Standard-Vorauswahl beim Anlegen. */
export const DEFAULT_QUALIFICATION = QUALIFICATIONS[2].label; // QS 3 – Pflegefachkraft
