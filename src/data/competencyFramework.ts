import type { CompetencyLevel } from "../types";

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

/**
 * Kompetenzmodell für die Pflege, angelehnt an die vier klassischen
 * Handlungskompetenz-Dimensionen (Fach-, Methoden-, Sozial- und Personalkompetenz).
 * Bewusst kompakt gehalten – kann jederzeit erweitert werden.
 */
export const COMPETENCY_FRAMEWORK: CompetencyCategory[] = [
  {
    id: "fach",
    label: "Fachkompetenz",
    description: "Pflegefachliches Wissen und Können in der direkten Versorgung.",
    competencies: [
      { id: "fach_grundpflege", label: "Grundpflege & Mobilisation", hint: "Körperpflege, Lagerung, Prophylaxen, Bewegungsförderung" },
      { id: "fach_behandlungspflege", label: "Behandlungspflege", hint: "Verbände, Injektionen, Vitalzeichen, Wundversorgung" },
      { id: "fach_medikamente", label: "Medikamentenmanagement", hint: "Stellen, Gabe, 6-R-Regel, Dokumentation" },
      { id: "fach_hygiene", label: "Hygiene & Sicherheit", hint: "Standards, Infektionsschutz, Arbeitssicherheit" },
      { id: "fach_notfall", label: "Notfall- & Risikomanagement", hint: "Erkennen kritischer Situationen, Sturz-/Dekubitusrisiko" },
    ],
  },
  {
    id: "methode",
    label: "Methodenkompetenz",
    description: "Strukturiertes, prozesshaftes und dokumentiertes Arbeiten.",
    competencies: [
      { id: "methode_pflegeprozess", label: "Pflegeprozess & -planung", hint: "Anamnese, Planung, Evaluation" },
      { id: "methode_doku", label: "Dokumentation", hint: "Vollständig, sachlich, zeitnah, rechtssicher" },
      { id: "methode_organisation", label: "Arbeitsorganisation", hint: "Prioritäten setzen, Zeitmanagement, Übergaben" },
    ],
  },
  {
    id: "sozial",
    label: "Sozial-kommunikative Kompetenz",
    description: "Beziehung zu Bewohnern, Angehörigen und im Team.",
    competencies: [
      { id: "sozial_bewohner", label: "Beziehung zu Bewohner:innen", hint: "Empathie, Wertschätzung, Bedürfnisorientierung" },
      { id: "sozial_angehoerige", label: "Umgang mit Angehörigen", hint: "Kommunikation, Deeskalation, Information" },
      { id: "sozial_team", label: "Teamarbeit & Kommunikation", hint: "Kooperation, Feedback, Konfliktfähigkeit" },
    ],
  },
  {
    id: "personal",
    label: "Personale Kompetenz",
    description: "Selbststeuerung, Haltung und berufliche Weiterentwicklung.",
    competencies: [
      { id: "personal_eigenverantwortung", label: "Eigenverantwortung", hint: "Selbstständigkeit, Verlässlichkeit" },
      { id: "personal_belastbarkeit", label: "Belastbarkeit & Resilienz", hint: "Umgang mit Stress und Druck" },
      { id: "personal_lernbereitschaft", label: "Lern- & Reflexionsbereitschaft", hint: "Offenheit für Feedback und Weiterbildung" },
    ],
  },
];

/** Entwicklungsorientierte Bewertungsskala (nicht wertend, sondern Standortbestimmung). */
export const LEVEL_SCALE: Record<CompetencyLevel, { label: string; description: string }> = {
  1: { label: "Einarbeitung", description: "Benötigt noch Anleitung und enge Begleitung" },
  2: { label: "Grundlagen", description: "Führt Aufgaben mit Unterstützung sicher aus" },
  3: { label: "Sicher", description: "Arbeitet selbstständig und zuverlässig" },
  4: { label: "Routiniert", description: "Handelt eigenverantwortlich, auch in komplexen Lagen" },
  5: { label: "Vorbild", description: "Expertenniveau, kann andere anleiten und schulen" },
};

const COMPETENCY_INDEX: Record<string, { competency: Competency; category: CompetencyCategory }> =
  {};
for (const category of COMPETENCY_FRAMEWORK) {
  for (const competency of category.competencies) {
    COMPETENCY_INDEX[competency.id] = { competency, category };
  }
}

export function findCompetency(id: string): Competency | undefined {
  return COMPETENCY_INDEX[id]?.competency;
}

export function findCategoryOf(competencyId: string): CompetencyCategory | undefined {
  return COMPETENCY_INDEX[competencyId]?.category;
}

export function categoryById(id: string): CompetencyCategory | undefined {
  return COMPETENCY_FRAMEWORK.find((c) => c.id === id);
}
