import type { CompetencyLevel, VisitType } from "../types";

export interface Competency {
  id: string;
  label: string;
  hint?: string;
  /** Operationalisierte Beobachtungspunkte (Leithinweise für die Visitierenden). */
  points?: string[];
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
      {
        id: "fk_grundpflege",
        label: "Grundpflege & Mobilisation",
        hint: "Körperpflege, Lagerung, Prophylaxen, Bewegungsförderung",
        points: [
          "Führt Körperpflege ressourcenorientiert durch (aktivierend, nicht „über den Kopf hinweg“)",
          "Wendet Transfer-/Kinästhetik-Prinzipien rücken- und bewohnerschonend an",
          "Setzt Prophylaxen (Dekubitus, Kontraktur, Sturz) situationsgerecht um",
        ],
      },
      {
        id: "fk_behandlungspflege",
        label: "Behandlungspflege",
        hint: "Verbände, Injektionen, Vitalzeichen, ärztliche Anordnungen",
        points: [
          "Führt ärztliche Anordnungen korrekt und nachvollziehbar aus",
          "Misst und interpretiert Vitalzeichen, reagiert angemessen auf Abweichungen",
          "Arbeitet bei invasiven Maßnahmen sicher und steril",
        ],
      },
      {
        id: "fk_medikamente",
        label: "Medikamentenmanagement",
        hint: "Stellen, Gabe, 6-R-Regel, BtM, Dokumentation",
        points: [
          "Hält die 6-R-Regel konsequent ein",
          "Stellt/verabreicht Medikamente sicher, inkl. korrekter BtM-Handhabung",
          "Erkennt Wechsel-/Nebenwirkungen und meldet sie",
        ],
      },
      {
        id: "fk_wunde",
        label: "Wundversorgung & -dokumentation",
        hint: "Wundbeurteilung, Versorgung, Verlauf",
        points: [
          "Beurteilt Wunden systematisch (Größe, Exsudat, Wundrand)",
          "Wählt die Versorgung gemäß Standard/Anordnung",
          "Dokumentiert den Wundverlauf lückenlos (inkl. Fotodoku, falls vorgesehen)",
        ],
      },
      {
        id: "fk_hygiene",
        label: "Hygiene & Infektionsschutz",
        hint: "Standards, Schutzausrüstung, Arbeitssicherheit",
        points: [
          "Setzt Händehygiene zu den „5 Momenten“ korrekt um",
          "Nutzt Schutzausrüstung situationsgerecht",
          "Hält Standards bei Isolation/multiresistenten Keimen ein",
        ],
      },
      {
        id: "fk_notfall",
        label: "Notfall- & Risikomanagement",
        hint: "Kritische Situationen erkennen, Sturz-/Dekubitusrisiko steuern",
        points: [
          "Erkennt kritische Zustandsveränderungen früh (z.B. Exsikkose, Delir, Sturzfolgen)",
          "Handelt im Notfall strukturiert und priorisiert",
          "Steuert Risiken proaktiv über Assessments",
        ],
      },
    ],
  },
  {
    id: "fk_methode",
    label: "Methodenkompetenz",
    description: "Strukturiertes, prozesshaftes und rechtssicheres Arbeiten.",
    competencies: [
      {
        id: "fk_pflegeprozess",
        label: "Pflegeprozess & -planung",
        hint: "Anamnese, Planung, Evaluation, Maßnahmen ableiten",
        points: [
          "Leitet Maßnahmen nachvollziehbar aus dem Assessment ab",
          "Formuliert Ziele konkret und überprüfbar",
          "Evaluiert die Planung regelmäßig und passt sie an",
        ],
      },
      {
        id: "fk_doku",
        label: "Pflegedokumentation",
        hint: "Vollständig, sachlich, zeitnah, rechtssicher",
        points: [
          "Dokumentiert zeitnah, sachlich und fallbezogen",
          "Wählt die korrekte Eintragskategorie / verknüpft mit der Planung",
          "Dokumentation ist widerspruchsfrei zur durchgeführten Pflege",
        ],
      },
      {
        id: "fk_organisation",
        label: "Arbeitsorganisation & Delegation",
        hint: "Prioritäten, Zeitmanagement, sichere Delegation an Hilfskräfte",
        points: [
          "Setzt Prioritäten sinnvoll, auch bei hoher Belastung",
          "Delegiert klar, adressatengerecht und kontrolliert das Ergebnis",
          "Übergaben sind strukturiert und vollständig",
        ],
      },
    ],
  },
  {
    id: "fk_sozial",
    label: "Sozial-kommunikative Kompetenz",
    description: "Beziehung zu Bewohnern, Angehörigen und im Team.",
    competencies: [
      {
        id: "fk_bewohner",
        label: "Beziehung zu Bewohner:innen",
        hint: "Empathie, Wertschätzung, Bedürfnisorientierung",
        points: [
          "Begegnet Bewohner:innen wertschätzend und auf Augenhöhe",
          "Achtet auf Intimsphäre, kündigt Handlungen an, holt Zustimmung ein",
          "Geht individuell auf Biografie/Bedürfnisse ein",
        ],
      },
      {
        id: "fk_angehoerige",
        label: "Angehörigenarbeit",
        hint: "Kommunikation, Beratung, Deeskalation",
        points: [
          "Informiert verständlich und proaktiv",
          "Bleibt in Konfliktsituationen sachlich und deeskalierend",
          "Wahrt professionelle Grenzen (Datenschutz, Zuständigkeit)",
        ],
      },
      {
        id: "fk_anleitung",
        label: "Team & Anleitung",
        hint: "Kooperation, Anleiten von Hilfskräften, Feedback",
        points: [
          "Leitet Hilfskräfte/Azubis verständlich und geduldig an",
          "Gibt konstruktives Feedback und nimmt es an",
          "Kooperiert verlässlich und teilt Wissen",
        ],
      },
    ],
  },
  {
    id: "fk_personal",
    label: "Personale Kompetenz",
    description: "Selbststeuerung, Haltung und Weiterentwicklung.",
    competencies: [
      {
        id: "fk_eigenverantwortung",
        label: "Eigenverantwortung",
        hint: "Selbstständigkeit, Verlässlichkeit, Entscheidungsfreude",
        points: [
          "Trifft im Rahmen der Kompetenz eigenständig tragfähige Entscheidungen",
          "Übernimmt Verantwortung für Ergebnisse, auch bei Fehlern",
        ],
      },
      {
        id: "fk_belastbarkeit",
        label: "Belastbarkeit & Resilienz",
        hint: "Umgang mit Stress und Verantwortung",
        points: [
          "Bleibt in Stresssituationen handlungsfähig und ruhig",
          "Erkennt eigene Grenzen und holt rechtzeitig Unterstützung",
        ],
      },
      {
        id: "fk_lernen",
        label: "Lern- & Reflexionsbereitschaft",
        hint: "Offenheit für Feedback und Weiterbildung",
        points: [
          "Reflektiert eigenes Handeln kritisch",
          "Setzt Fortbildungsinhalte in die Praxis um",
        ],
      },
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
      {
        id: "hk_koerperpflege",
        label: "Körperpflege & Unterstützung",
        hint: "Waschen, Kleiden, Toilettengang – ressourcenorientiert",
        points: [
          "Unterstützt aktivierend und fördert vorhandene Fähigkeiten",
          "Achtet auf Intimsphäre, Wärme und Wohlbefinden",
          "Beachtet individuelle Gewohnheiten/Vorlieben",
        ],
      },
      {
        id: "hk_mobilisation",
        label: "Mobilisation & Lagerung",
        hint: "Transfer, Bewegungsförderung, Unterstützung bei Prophylaxen",
        points: [
          "Führt Transfers sicher und schonend durch",
          "Unterstützt Lagerungen/Positionswechsel nach Vorgabe",
          "Animiert zu Bewegung im Alltag",
        ],
      },
      {
        id: "hk_ernaehrung",
        label: "Ernährung & Flüssigkeit",
        hint: "Hilfe beim Essen/Trinken, auf ausreichende Zufuhr achten",
        points: [
          "Reicht Essen/Trinken geduldig und aspirationssicher an",
          "Achtet auf ausreichende Trinkmenge, erkennt Auffälligkeiten",
          "Beachtet Kostformen (z.B. passiert, Diät)",
        ],
      },
      {
        id: "hk_hygiene",
        label: "Hygiene im Alltag",
        hint: "Händehygiene, saubere Arbeitsweise, Schutzausrüstung",
        points: [
          "Setzt Händehygiene korrekt um",
          "Arbeitet sauber (Schmutzwäsche, Flächen, Hilfsmittel)",
          "Nutzt Schutzausrüstung situationsgerecht",
        ],
      },
    ],
  },
  {
    id: "hk_beobachtung",
    label: "Beobachten & Melden",
    description: "Veränderungen wahrnehmen und sicher an die Fachkraft weitergeben.",
    competencies: [
      {
        id: "hk_beobachten",
        label: "Beobachten von Veränderungen",
        hint: "Haut, Verhalten, Appetit, Allgemeinzustand wahrnehmen",
        points: [
          "Nimmt Veränderungen an Haut, Verhalten, Appetit, Allgemeinzustand wahr",
          "Erkennt Schmerzäußerungen (auch nonverbale)",
        ],
      },
      {
        id: "hk_melden",
        label: "Melden & Weitergeben",
        hint: "Auffälligkeiten zeitnah und klar an die Fachkraft berichten",
        points: [
          "Meldet Auffälligkeiten zeitnah und vollständig an die Fachkraft",
          "Schätzt selbst ein, was dringlich ist",
        ],
      },
      {
        id: "hk_berichteblatt",
        label: "Korrekte Anwendung des Berichteblattes",
        hint: "Korrekte Auswahl der Berichtskategorie; sachlich, vollständig und zeitnah dokumentieren",
        points: [
          "Wählt die korrekte Berichtskategorie",
          "Dokumentiert sachlich, konkret und zeitnah",
          "Trägt im richtigen Bewohnerprofil ein",
        ],
      },
      {
        id: "hk_risiken",
        label: "Umgang mit Risiken",
        hint: "Sturz-, Dekubitus-, Dehydrationszeichen erkennen und melden",
        points: [
          "Erkennt Sturz-, Dekubitus-, Dehydrationszeichen und meldet sie",
          "Handelt im Rahmen der eigenen Kompetenz richtig (z.B. Notruf absetzen)",
        ],
      },
    ],
  },
  {
    id: "hk_sozial",
    label: "Sozial-kommunikative Kompetenz",
    description: "Beziehung zu Bewohnern, Angehörigen und im Team.",
    competencies: [
      {
        id: "hk_bewohner",
        label: "Beziehung & Kommunikation",
        hint: "Empathie, Wertschätzung, geduldiger Umgang",
        points: [
          "Begegnet Bewohner:innen freundlich, geduldig, wertschätzend",
          "Kündigt Handlungen an und kommuniziert verständlich",
        ],
      },
      {
        id: "hk_angehoerige",
        label: "Umgang mit Angehörigen",
        hint: "Freundlich, hilfsbereit, Grenzen kennen",
        points: [
          "Tritt freundlich und hilfsbereit auf",
          "Kennt Grenzen und verweist bei Bedarf an die Fachkraft",
        ],
      },
      {
        id: "hk_team",
        label: "Teamarbeit",
        hint: "Zusammenarbeit, Absprachen einhalten, Übergaben",
        points: [
          "Hält Absprachen ein und arbeitet zuverlässig zu",
          "Gibt relevante Infos in der Übergabe weiter",
        ],
      },
    ],
  },
  {
    id: "hk_personal",
    label: "Personale Kompetenz",
    description: "Haltung, Zuverlässigkeit und Lernbereitschaft.",
    competencies: [
      {
        id: "hk_zuverlaessigkeit",
        label: "Zuverlässigkeit & Pünktlichkeit",
        hint: "Verlässliche Aufgabenerfüllung, Absprachen",
        points: [
          "Erfüllt übertragene Aufgaben verlässlich und vollständig",
          "Ist pünktlich und meldet Ausfälle rechtzeitig",
        ],
      },
      {
        id: "hk_sorgfalt",
        label: "Sorgfalt & Hygienebewusstsein",
        hint: "Gewissenhaftes, sicheres Arbeiten",
        points: [
          "Arbeitet gewissenhaft und sicher",
          "Hält sich konsequent an Hygiene-/Sicherheitsregeln",
        ],
      },
      {
        id: "hk_lernen",
        label: "Lernbereitschaft",
        hint: "Offenheit für Anleitung und Feedback",
        points: [
          "Nimmt Anleitung und Feedback offen an",
          "Setzt Rückmeldungen sichtbar um",
        ],
      },
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
