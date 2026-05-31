import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { EmptyState, PageHeader } from "../components/ui";
import SkillMatrix from "../components/SkillMatrix";
import { categoryScores } from "../lib/analytics";
import { findCompetency, LEVEL_SCALE } from "../data/competencyFramework";
import { formatDate } from "../lib/format";

const OCCASION_LABELS: Record<string, string> = {
  routine: "Routine",
  einarbeitung: "Einarbeitung",
  anlassbezogen: "Anlassbezogen",
  jahresgespraech: "Jahresgespräch",
};

export default function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, getEmployee, deleteVisit } = useStore();

  const visit = data.visits.find((v) => v.id === id);
  if (!visit) {
    return (
      <EmptyState
        icon="🔍"
        title="Visite nicht gefunden"
        action={
          <Link to="/" className="btn-primary">
            Zum Start
          </Link>
        }
      />
    );
  }

  const employee = getEmployee(visit.employeeId);
  const scores = categoryScores(visit);

  function handleDelete() {
    if (confirm("Diese Visite wirklich löschen?")) {
      deleteVisit(visit!.id);
      navigate(`/mitarbeiter/${visit!.employeeId}`);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Visite ${formatDate(visit.date)}`}
        subtitle={`${employee?.name ?? "Unbekannt"} · ${OCCASION_LABELS[visit.occasion] ?? visit.occasion}`}
      />

      {visit.location && (
        <p className="text-sm text-slate-500">📍 {visit.location}</p>
      )}

      {visit.ratings.length > 0 && (
        <section className="card p-4">
          <h3 className="mb-3 font-semibold text-slate-800">Kompetenzprofil</h3>
          <SkillMatrix scores={scores} />
        </section>
      )}

      <TextBlock title="Beobachtungen" text={visit.observations} />
      <TextBlock title="Stärken & Ressourcen ✅" text={visit.strengths} />
      <TextBlock title="Entwicklungsfelder 🎯" text={visit.developmentAreas} />
      <TextBlock title="Fazit & Vereinbarung" text={visit.summary} />

      {visit.ratings.length > 0 && (
        <section className="card p-4">
          <h3 className="mb-3 font-semibold text-slate-800">Einzelbewertungen</h3>
          <div className="space-y-1.5 text-sm">
            {visit.ratings.map((r) => (
              <div key={r.competencyId} className="flex items-center justify-between gap-2">
                <span className="text-slate-600">{findCompetency(r.competencyId)?.label ?? r.competencyId}</span>
                <span className="chip bg-brand-50 text-brand-700">
                  {r.level} · {LEVEL_SCALE[r.level].label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-2">
        {employee && (
          <Link to={`/mitarbeiter/${employee.id}`} className="btn-secondary flex-1">
            Zum Profil
          </Link>
        )}
        <button className="btn-danger" onClick={handleDelete}>
          Löschen
        </button>
      </div>
    </div>
  );
}

function TextBlock({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <section className="card p-4">
      <h3 className="mb-1 font-semibold text-slate-800">{title}</h3>
      <p className="whitespace-pre-wrap text-sm text-slate-600">{text}</p>
    </section>
  );
}
