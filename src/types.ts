// Zentrale Domänen-Typen für LevelUp.
// Alle Daten werden lokal im Browser gehalten (siehe src/store/storage.ts).

export type ID = string;

/** Eine Pflegekraft / ein Mitarbeiter, der begleitet wird. */
export interface Employee {
  id: ID;
  name: string;
  /** Qualifikation, z.B. "Examinierte Pflegefachkraft", "Pflegehelfer:in", "Auszubildende:r" */
  role: string;
  /** Wohnbereich / Station / Tour */
  area: string;
  /** Beschäftigt seit (ISO-Datum, optional) */
  startDate?: string;
  notes?: string;
  createdAt: string;
}

/** Bewertungsstufe einer Kompetenz – entwicklungsorientiert, nicht wertend gemeint. */
export type CompetencyLevel = 1 | 2 | 3 | 4 | 5;

export interface CompetencyRating {
  /** Verweist auf eine Kompetenz aus dem Framework (src/data/competencyFramework.ts) */
  competencyId: string;
  level: CompetencyLevel;
}

export type VisitOccasion = "routine" | "einarbeitung" | "anlassbezogen" | "jahresgespraech";

/** Zielgruppe der Visite – bestimmt den Kompetenzkatalog. */
export type VisitType = "fachkraft" | "hilfskraft";

/** Eine durchgeführte Mitarbeitervisite. */
export interface Visit {
  id: ID;
  employeeId: ID;
  /** Visiten-Typ (Kompetenzkatalog) */
  visitType: VisitType;
  /** ISO-Datum der Visite */
  date: string;
  /** Ort / Setting der Beobachtung */
  location: string;
  occasion: VisitOccasion;
  /** Was wurde beobachtet? */
  observations: string;
  /** Was lief gut? Ressourcen & Stärken */
  strengths: string;
  /** Wo gibt es Entwicklungspotenzial? */
  developmentAreas: string;
  /** Kompetenzbewertungen dieser Visite (Basis für die Skill-Matrix über Zeit) */
  ratings: CompetencyRating[];
  /** Gemeinsames Fazit / Vereinbarung */
  summary: string;
  createdAt: string;
}

export type GoalStatus = "offen" | "in_arbeit" | "erreicht";

/** Ein Entwicklungsziel mit konkreten Maßnahmen. */
export interface Goal {
  id: ID;
  employeeId: ID;
  /** Optional aus welcher Visite das Ziel entstanden ist */
  visitId?: ID;
  title: string;
  /** Kompetenz-Kategorie-ID aus dem Framework */
  category: string;
  /** Konkret vereinbarte Maßnahmen (Schulung, Mentoring, ...) */
  measures: string;
  /** Zieltermin (ISO-Datum, optional) */
  dueDate?: string;
  status: GoalStatus;
  /** Fortschritt 0–100 % */
  progress: number;
  createdAt: string;
}

/** Gesamter persistierter Zustand. */
export interface AppData {
  version: number;
  employees: Employee[];
  visits: Visit[];
  goals: Goal[];
}
