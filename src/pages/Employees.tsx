import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState, PageHeader } from "../components/ui";
import { PlusIcon, SearchIcon, TeamIcon } from "../components/icons";

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
            <PlusIcon size={17} strokeWidth={2.2} /> Neu
          </Link>
        }
      />

      {data.employees.length > 0 && (
        <div className="relative mb-4">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="input pl-10"
            placeholder="Name, Rolle oder Bereich suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {data.employees.length === 0 ? (
        <EmptyState
          icon={<TeamIcon size={26} strokeWidth={1.7} />}
          title="Noch keine Mitarbeiter:innen"
          hint="Lege deine erste Pflegekraft an, um Visiten und Entwicklungsziele zu erfassen."
          action={
            <Link to="/mitarbeiter/neu" className="btn-primary">
              <PlusIcon size={17} strokeWidth={2.2} /> Mitarbeiter:in anlegen
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
                className="card flex items-center gap-3 px-4 py-3 transition hover:shadow-card"
              >
                <Avatar name={e.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{e.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {e.role}
                    {e.area ? ` · ${e.area}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-slate-400">
                  <span>{visitCount} Visiten</span>
                  {openGoals > 0 && (
                    <span className="chip bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
                      {openGoals} Ziele
                    </span>
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
