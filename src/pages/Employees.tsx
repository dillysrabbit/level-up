import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState, PageHeader } from "../components/ui";

export default function Employees() {
  const { data, goalsOf, visitsOf } = useStore();
  const [query, setQuery] = useState("");

  const employees = [...data.employees]
    .filter((e) =>
      `${e.name} ${e.role} ${e.area}`.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle={`${data.employees.length} Mitarbeiter:innen`}
        back={false}
        action={
          <Link to="/mitarbeiter/neu" className="btn-primary">
            + Neu
          </Link>
        }
      />

      {data.employees.length > 0 && (
        <input
          className="input mb-4"
          placeholder="Suchen nach Name, Rolle, Bereich…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {data.employees.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Noch keine Mitarbeiter:innen"
          hint="Lege deine erste Pflegekraft an, um Visiten und Entwicklungsziele zu erfassen."
          action={
            <Link to="/mitarbeiter/neu" className="btn-primary">
              Mitarbeiter:in anlegen
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {employees.map((e) => {
            const openGoals = goalsOf(e.id).filter((g) => g.status !== "erreicht").length;
            const visitCount = visitsOf(e.id).length;
            return (
              <Link
                key={e.id}
                to={`/mitarbeiter/${e.id}`}
                className="card flex items-center gap-3 px-4 py-3"
              >
                <Avatar name={e.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{e.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {e.role}
                    {e.area ? ` · ${e.area}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-slate-500">
                  <span>{visitCount} Visiten</span>
                  {openGoals > 0 && (
                    <span className="chip bg-amber-100 text-amber-700">{openGoals} Ziele</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
