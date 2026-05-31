import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState } from "../components/ui";
import { formatDate } from "../lib/format";

export default function Dashboard() {
  const { data } = useStore();

  const openGoals = data.goals.filter((g) => g.status !== "erreicht");
  const today = new Date().toISOString().slice(0, 10);
  const dueGoals = openGoals.filter((g) => g.dueDate && g.dueDate <= today);
  const recentVisits = [...data.visits].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const employeeName = (id: string) =>
    data.employees.find((e) => e.id === id)?.name ?? "Unbekannt";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Willkommen 👋</h2>
        <p className="text-sm text-slate-500">
          Begleite dein Team strukturiert in der Entwicklung.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Mitarbeiter" value={data.employees.length} to="/mitarbeiter" />
        <Stat label="Visiten" value={data.visits.length} />
        <Stat label="Offene Ziele" value={openGoals.length} highlight={dueGoals.length > 0} />
      </div>

      <Link to="/visite/neu" className="btn-primary w-full py-3 text-base">
        📋 Neue Visite starten
      </Link>

      {dueGoals.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Fällige Ziele
          </h3>
          <div className="space-y-2">
            {dueGoals.map((g) => (
              <Link
                key={g.id}
                to={`/mitarbeiter/${g.employeeId}`}
                className="card flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{g.title}</p>
                  <p className="text-xs text-slate-500">{employeeName(g.employeeId)}</p>
                </div>
                <span className="chip shrink-0 bg-red-100 text-red-700">
                  fällig {formatDate(g.dueDate)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Letzte Visiten
        </h3>
        {recentVisits.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Noch keine Visiten"
            hint="Lege zuerst Mitarbeiter an und starte dann deine erste Visite."
            action={
              <Link to="/mitarbeiter/neu" className="btn-primary">
                Mitarbeiter anlegen
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentVisits.map((v) => (
              <Link
                key={v.id}
                to={`/visite/${v.id}`}
                className="card flex items-center gap-3 px-4 py-3"
              >
                <Avatar name={employeeName(v.employeeId)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {employeeName(v.employeeId)}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(v.date)}</p>
                </div>
                <span className="text-slate-300">›</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  to,
  highlight,
}: {
  label: string;
  value: number;
  to?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={`card flex flex-col items-center justify-center px-2 py-4 ${
        highlight ? "ring-2 ring-red-200" : ""
      }`}
    >
      <span className="text-2xl font-bold tabular-nums text-slate-900">{value}</span>
      <span className="mt-0.5 text-center text-xs text-slate-500">{label}</span>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
