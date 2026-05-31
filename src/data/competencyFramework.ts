import type { CompetencyLevel, VisitType } from "../types";

export interface Competency {
  id: string;
  label: string;
  hint?: string;
}

export interface CompetencyCategory {
  id: string;
  label: string;
  description: string;
  competencies: Competency[];
}

export const VISIT_TYPES: { id: VisitType; label: string; short: string }[] = [
  { id: "fachkraft", label: "Fachkraft-Visite", short: "Fachkraft" },
  { id: "hilfskraft", label: "Hilfskraft-Visite", short: "Hilfskraft" },
];

/**
 * Kompetenzkatalog für PFLEGEFACHKRÄFTE (QS 3) – umfassend, inkl. Behandlungspflege,
 * Medikamentenmanagement und Pflegeprozess.
 */
const FACHKRAFT: CompetencyCategory[] = [
  {
    id: "fk_fach",
    label: "Fachkompetenz",
    description: "Pflegefachliches Wissen und Können in der direkten Versorgung.",
    competencies: [
      { id: "fk_grundpflege", label: "Grundpflege & Mobilisation", hint: "Körperpflege, Lagerung, Prophylaxen, Bewegungsförderung" },
      { id: "fk_behandlungspflege", label: "Behandlungspflege", hint: "Verbände, Injektionen, Vitalzeichen, ärztliche Anordnungen" },
      { id: "fk_medikamente", label: "Medikamentenmanagement", hint: "Stellen, Gabe, 6-R-Regel, BtM, Dokumentation" },
      { id: "fk_wunde", label: "Wundversorgung & -dokumentation", hint: "Wundbeurteilung, Versorgung, Verlauf" },
      { id: "fk_hygiene", label: "Hygiene & Infektionsschutz", hint: "Standards, Schutzausrüstung, Arbeitssicherheit" },
      { id: "fk_notfall", label: "Notfall- & Risikomanagement", hint: "Kritische Situationen erkennen, Sturz-/Dekubitusrisiko steuern" },
    ],
  },
  {
    id: "fk_methode",
    label: "Methodenkompetenz",
    description: "Strukturiertes, prozesshaftes und rechtssicheres Arbeiten.",
    competencies: [
      { id: "fk_pflegeprozess", label: "Pflegeprozess & -planung", hint: "Anamnese, Planung, Evaluation, Maßnahmen ableiten" },
      { id: "fk_doku", label: "Pflegedokumentation", hint: "Vollständig, sachlich, zeitnah, rechtssicher" },
      { id: "fk_organisation", label: "Arbeitsorganisation & Delegation", hint: "Prioritäten, Zeitmanagement, sichere Delegation an Hilfskräfte" },
    ],
  },
  {
    id: "fk_sozial",
    label: "Sozial-kommunikative Kompetenz",
    description: "Beziehung zu Bewohnern, Angehörigen und im Team.",
    competencies: [
      { id: "fk_bewohner", label: "Beziehung zu Bewohner:innen", hint: "Empathie, Wertschätzung, Bedürfnisorientierung" },
      { id: "fk_angehoerige", label: "Angehörigenarbeit", hint: "Kommunikation, Beratung, Deeskalation" },
      { id: "fk_anleitung", label: "Team & Anleitung", hint: "Kooperation, Anleiten von Hilfskräften, Feedback" },
    ],
  },
  {
    id: "fk_personal",
    label: "Personale Kompetenz",
    description: "Selbststeuerung, Haltung und Weiterentwicklung.",
    competencies: [
      { id: "fk_eigenverantwortung", label: "Eigenverantwortung", hint: "Selbstständigkeit, Verlässlichkeit, Entscheidungsfreude" },
      { id: "fk_belastbarkeit", label: "Belastbarkeit & Resilienz", hint: "Umgang mit Stress und Verantwortung" },
      { id: "fk_lernen", label: "Lern- & Reflexionsbereitschaft", hint: "Offenheit für Feedback und Weiterbildung" },
    ],
  },
];

/**
 * Kompetenzkatalog für PFLEGE-/HILFSKRÄFTE (QS 1 & QS 2) – Fokus auf Grundpflege,
 * Begleitung sowie Beobachten & Melden (ohne vorbehaltene fachpflegerische Tätigkeiten).
 */
const HILFSKRAFT: CompetencyCategory[] = [
  {
    id: "hk_grund",
    label: "Grundpflege & Unterstützung",
    description: "Sichere, würdevolle Unterstützung im Alltag.",
    competencies: [
      { id: "hk_koerperpflege", label: "Körperpflege & Unterstützung", hint: "Waschen, Kleiden, Toilettengang – ressourcenorientiert" },
      { id: "hk_mobilisation", label: "Mobilisation & Lagerung", hint: "Transfer, Bewegungsförderung, Unterstützung bei Prophylaxen" },
      { id: "hk_ernaehrung", label: "Ernährung & Flüssigkeit", hint: "Hilfe beim Essen/Trinken, auf ausreichende Zufuhr achten" },
      { id: "hk_hygiene", label: "Hygiene im Alltag", hint: "Händehygiene, saubere Arbeitsweise, Schutzausrüstung" },
    ],
  },
  {
    id: "hk_beobachtung",
    label: "Beobachten & Melden",
    description: "Veränderungen wahrnehmen und sicher an die Fachkraft weitergeben.",
    competencies: [
      { id: "hk_beobachten", label: "Beobachten von Veränderungen", hint: "Haut, Verhalten, Appetit, Allgemeinzustand wahrnehmen" },
      { id: "hk_melden", label: "Melden & Weitergeben", hint: "Auffälligkeiten zeitnah und klar an die Fachkraft berichten" },
      { id: "hk_berichteblatt", label: "Korrekte Anwendung des Berichteblattes", hint: "Korrekte Auswahl der Berichtskategorie; sachlich, vollständig und zeitnah dokumentieren" },
      { id: "hk_risiken", label: "Umgang mit Risiken", hint: "Sturz-, Dekubitus-, Dehydrationszeichen erkennen und melden" },
    ],
  },
  {
    id: "hk_sozial",
    label: "Sozial-kommunikative Kompetenz",
    description: "Beziehung zu Bewohnern, Angehörigen und im Team.",
    competencies: [
      { id: "hk_bewohner", label: "Beziehung & Kommunikation", hint: "Empathie, Wertschätzung, geduldiger Umgang" },
      { id: "hk_angehoerige", label: "Umgang mit Angehörigen", hint: "Freundlich, hilfsbereit, Grenzen kennen" },
      { id: "hk_team", label: "Teamarbeit", hint: "Zusammenarbeit, Absprachen einhalten, Übergaben" },
    ],
  },
  {
    id: "hk_personal",
    label: "Personale Kompetenz",
    description: "Haltung, Zuverlässigkeit und Lernbereitschaft.",
    competencies: [
      { id: "hk_zuverlaessigkeit", label: "Zuverlässigkeit & Pünktlichkeit", hint: "Verlässliche Aufgabenerfüllung, Absprachen" },
      { id: "hk_sorgfalt", label: "Sorgfalt & Hygienebewusstsein", hint: "Gewissenhaftes, sicheres Arbeiten" },
      { id: "hk_lernen", label: "Lernbereitschaft", hint: "Offenheit für Anleitung und Feedback" },
    ],
  },
];

export const FRAMEWORKS: Record<VisitType, CompetencyCategory[]> = {
  fachkraft: FACHKRAFT,
  hilfskraft: HILFSKRAFT,
};

/** Liefert den Kompetenzkatalog zu einem Visiten-Typ. */
export function frameworkFor(type: VisitType): CompetencyCategory[] {
  return FRAMEWORKS[type] ?? FACHKRAFT;
}

/** Leitet den Visiten-Typ aus der Qualifikation ab: QS 3 → Fachkraft, sonst Hilfskraft. */
export function visitTypeForQualification(role: string | undefined): VisitType {
  return role?.includes("QS 3") ? "fachkraft" : "hilfskraft";
}

export function visitTypeLabel(type: VisitType): string {
  return VISIT_TYPES.find((t) => t.id === type)?.label ?? type;
}

/** Entwicklungsorientierte Bewertungsskala (für beide Visiten-Typen identisch). */
export const LEVEL_SCALE: Record<CompetencyLevel, { label: string; description: string }> = {
  1: { label: "Einarbeitung", description: "Benötigt noch Anleitung und enge Begleitung" },
  2: { label: "Grundlagen", description: "Führt Aufgaben mit Unterstützung sicher aus" },
  3: { label: "Sicher", description: "Arbeitet selbstständig und zuverlässig" },
  4: { label: "Routiniert", description: "Handelt eigenverantwortlich, auch in komplexen Lagen" },
  5: { label: "Vorbild", description: "Expertenniveau, kann andere anleiten und schulen" },
};

/* ---------- globale Indizes über beide Kataloge ---------- */

const ALL_CATEGORIES = [...FACHKRAFT, ...HILFSKRAFT];

const COMPETENCY_INDEX: Record<string, { competency: Competency; category: CompetencyCategory }> =
  {};
for (const category of ALL_CATEGORIES) {
  for (const competency of category.competencies) {
    COMPETENCY_INDEX[competency.id] = { competency, category };
  }
}

export function findCompetency(id: string): Competency | undefined {
  return COMPETENCY_INDEX[id]?.competency;
}

export function categoryById(id: string): CompetencyCategory | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}
