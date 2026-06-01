import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";
import ScaleLegend from "../components/ScaleLegend";
import {
  frameworkFor,
  LEVEL_SCALE,
  VISIT_TYPES,
  visitTypeForQualification,
} from "../data/competencyFramework";
import { todayISO } from "../lib/format";
import type { CompetencyLevel, CompetencyRating, VisitOccasion, VisitType } from "../types";
import {
  TalkIcon,
  StrengthIcon,
  GrowthIcon,
  CheckIcon,
  TrendIcon,
  PlusIcon,
} from "../components/icons";

const OCCASIONS: { value: VisitOccasion; label: string }[] = [
  { value: "routine", label: "Routine" },
  { value: "einarbeitung", label: "Einarbeitung" },
  { value: "anlassbezogen", label: "Anlassbezogen" },
  { value: "jahresgespraech", label: "Jahresgespräch" },
];

export default function VisitForm() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { data, addVisit } = useStore();

  const initialEmployee = employeeId ? data.employees.find((e) => e.id === employeeId) : undefined;
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId ?? "");
  const [visitType, setVisitType] = useState<VisitType>(
    visitTypeForQualification(initialEmployee?.role),
  );
  const [date, setDate] = useState(todayISO());
  const [location, setLocation] = useState("");
  const [occasion, setOccasion] = useState<VisitOccasion>("routine");
  const [observations, setObservations] = useState("");
  const [strengths, setStrengths] = useState("");
  const [developmentAreas, setDevelopmentAreas] = useState("");
  const [summary, setSummary] = useState("");
  const [ratings, setRatings] = useState<Record<string, CompetencyLevel>>({});

  const canSave = selectedEmployee !== "";
  const framework = frameworkFor(visitType);

  // Visiten-Typ wechseln: Bewertungen verwerfen (anderer Kompetenzkatalog).
  function changeType(type: VisitType) {
    if (type === visitType) return;
    setVisitType(type);
    setRatings({});
  }

  // Bei Mitarbeiterwechsel den Typ automatisch aus der Qualifikation ableiten.
  function changeEmployee(id: string) {
    setSelectedEmployee(id);
    const emp = data.employees.find((e) => e.id === id);
    if (emp) changeType(visitTypeForQualification(emp.role));
  }

  function setRating(competencyId: string, level: CompetencyLevel) {
    setRatings((prev) => {
      const next = { ...prev };
      if (next[competencyId] === level) delete next[competencyId];
      else next[competencyId] = level;
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const ratingList: CompetencyRating[] = Object.entries(ratings).map(([competencyId, level]) => ({
      competencyId,
      level,
    }));
    const visit = addVisit({
      employeeId: selectedEmployee,
      visitType,
      date,
      location: location.trim(),
      occasion,
      observations: observations.trim(),
      strengths: strengths.trim(),
      developmentAreas: developmentAreas.trim(),
      ratings: ratingList,
      summary: summary.trim(),
    });
    navigate(`/visite/${visit.id}`);
  }

  if (data.employees.length === 0) {
    return (
      <div>
        <PageHeader title="Neue Visite" />
        <div className="card p-6 text-center text-slate-600">
          <p className="mb-3">Lege zuerst eine:n Mitarbeiter:in an, um eine Visite zu starten.</p>
          <button className="btn-primary" onClick={() => navigate("/mitarbeiter/neu")}>
            <PlusIcon size={17} strokeWidth={2.2} /> Mitarbeiter:in anlegen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PageHeader title="Neue Visite" back={!!employeeId} />

      <div className="card space-y-4 p-4">
        <div>
          <label className="label">Mitarbeiter:in *</label>
          <select
            className="input"
            value={selectedEmployee}
            onChange={(e) => changeEmployee(e.target.value)}
            disabled={!!employeeId}
          >
            <option value="">– bitte wählen –</option>
            {[...data.employees]
              .sort((a, b) => a.name.localeCompare(b.name, "de"))
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="label">Visiten-Typ</label>
          <div className="grid grid-cols-2 gap-2">
            {VISIT_TYPES.map((t) => {
              const active = visitType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => changeType(t.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-brand-300"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Automatisch nach Qualifikation vorgewählt – bei Bedarf änderbar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="min-w-0">
            <label className="label">Datum</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="min-w-0">
            <label className="label">Anlass</label>
            <select
              className="input"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as VisitOccasion)}
            >
              {OCCASIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Ort / Setting</label>
          <input
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z.B. Frühdienst Wohnbereich 2"
          />
        </div>
      </div>

      {/* Gesprächsdokumentation */}
      <div className="card space-y-4 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
          <TalkIcon size={18} className="text-brand-500" /> Beobachtung & Gespräch
        </h3>
        <Field
          icon={<TalkIcon size={15} className="text-slate-400" />}
          label="Beobachtungen"
          value={observations}
          onChange={setObservations}
          placeholder="Was war heute zu beobachten? Konkrete Situationen…"
        />
        <Field
          icon={<StrengthIcon size={15} className="text-emerald-500" />}
          label="Stärken & Ressourcen"
          value={strengths}
          onChange={setStrengths}
          placeholder="Was lief gut? Worauf lässt sich aufbauen?"
        />
        <Field
          icon={<GrowthIcon size={15} className="text-amber-500" />}
          label="Entwicklungsfelder"
          value={developmentAreas}
          onChange={setDevelopmentAreas}
          placeholder="Wo gibt es Potenzial? Was wurde besprochen?"
        />
        <Field
          icon={<CheckIcon size={15} className="text-brand-500" />}
          label="Fazit & Vereinbarung"
          value={summary}
          onChange={setSummary}
          placeholder="Gemeinsames Fazit und nächste Schritte"
        />
      </div>

      {/* Kompetenz-Check */}
      <div className="card p-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
          <TrendIcon size={18} className="text-brand-500" /> Kompetenz-Check
        </h3>
        <p className="mb-3 mt-1 text-xs leading-relaxed text-slate-500">
          Optionale Standortbestimmung. Tippe auf eine Stufe, erneutes Tippen entfernt die Bewertung.
        </p>
        <div className="mb-4">
          <ScaleLegend />
        </div>
        <div className="space-y-5">
          {framework.map((category) => (
            <div key={category.id}>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                {category.label}
              </p>
              <div className="space-y-3">
                {category.competencies.map((c) => (
                  <div key={c.id}>
                    <span className="mb-1.5 block text-sm text-slate-700">{c.label}</span>
                    <div className="flex gap-1.5">
                      {([1, 2, 3, 4, 5] as CompetencyLevel[]).map((lvl) => {
                        const active = ratings[c.id] === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setRating(c.id, lvl)}
                            title={`${LEVEL_SCALE[lvl].label} – ${LEVEL_SCALE[lvl].description}`}
                            className={`h-10 flex-1 rounded-lg border text-sm font-semibold transition ${
                              active
                                ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-400 hover:border-brand-300 hover:text-brand-500"
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn-secondary flex-1" onClick={() => navigate(-1)}>
          Abbrechen
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={!canSave}>
          <CheckIcon size={17} strokeWidth={2.4} /> Visite speichern
        </button>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <textarea
        className="input min-h-[80px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
