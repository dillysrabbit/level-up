import { Link } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState } from "../components/ui";
import { formatDate, formatDateTime } from "../lib/format";
import {
  VisitIcon,
  TeamIcon,
  GoalIcon,
  ChevronRightIcon,
  PlusIcon,
  AlertIcon,
  NoteIcon,
} from "../components/icons";

export default function Dashboard() {
  const { data } = useStore();

  const openGoals = data.goals.filter((g) => g.status !== "erreicht");
  const today = new Date().toISOString().slice(0, 10);
  const dueGoals = openGoals.filter((g) => g.dueDate && g.dueDate <= today);
  const employeeName = (id: string) =>
    data.employees.find((e) => e.id === id)?.name ?? "Unbekannt";

  // Visiten und Notizen zu einem chronologischen Aktivitäts-Feed zusammenführen.
  const recentActivity = [
    ...data.visits.map((v) => ({
      kind: "visit" as const,
      id: v.id,
      employeeId: v.employeeId,
      date: v.date,
      ts: Date.parse(v.date) || 0,
      text: v.summary || v.observations || "Visite",
    })),
    ...data.notes.map((n) => ({
      kind: "note" as const,
      id: n.id,
      employeeId: n.employeeId,
      date: n.createdAt,
      ts: Date.parse(n.createdAt) || 0,
      text: n.text,
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[1.7rem] font-bold leading-tight text-slate-900">Willkommen</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Begleite dein Team strukturiert in der Entwicklung.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Team" value={data.employees.length} Icon={TeamIcon} to="/mitarbeiter" />
        <Stat label="Visiten" value={data.visits.length} Icon={VisitIcon} />
        <Stat
          label="Offene Ziele"
          value={openGoals.length}
          Icon={GoalIcon}
          highlight={dueGoals.length > 0}
        />
      </div>

      <div>
        <p className="mb-2 px-1 text-sm font-medium text-slate-500">Neu erfassen</p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/visite/neu" className="btn-primary py-3.5 text-base">
            <VisitIcon size={19} strokeWidth={2} />
            Visite
          </Link>
          <Link to="/notiz/neu" className="btn-secondary py-3.5 text-base">
            <NoteIcon size={19} strokeWidth={2} />
            Notiz
          </Link>
        </div>
      </div>

      {dueGoals.length > 0 && (
        <section>
          <h3 className="section-title flex items-center gap-1.5 text-amber-600">
            <AlertIcon size={14} strokeWidth={2.2} /> Fällige Ziele
          </h3>
          <div className="space-y-2">
            {dueGoals.map((g) => (
              <Link
                key={g.id}
                to={`/mitarbeiter/${g.employeeId}`}
                className="card flex items-center justify-between gap-3 px-4 py-3 transition hover:shadow-card"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{g.title}</p>
                  <p className="text-xs text-slate-500">{employeeName(g.employeeId)}</p>
                </div>
                <span className="chip shrink-0 bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
                  {formatDate(g.dueDate)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="section-title">Letzte Aktivität</h3>
        {recentActivity.length === 0 ? (
          <EmptyState
            icon={<VisitIcon size={26} strokeWidth={1.7} />}
            title="Noch keine Aktivität"
            hint="Lege zuerst Mitarbeiter:innen an und erfasse dann eine Visite oder Notiz."
            action={
              <Link to="/mitarbeiter/neu" className="btn-primary">
                <PlusIcon size={17} strokeWidth={2.2} /> Mitarbeiter:in anlegen
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a) => (
              <Link
                key={`${a.kind}-${a.id}`}
                to={a.kind === "visit" ? `/visite/${a.id}` : `/mitarbeiter/${a.employeeId}`}
                className="card flex items-center gap-3 px-4 py-3 transition hover:shadow-card"
              >
                <Avatar name={employeeName(a.employeeId)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {employeeName(a.employeeId)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-medium ${
                        a.kind === "visit"
                          ? "bg-brand-50 text-brand-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {a.kind === "visit" ? (
                        <VisitIcon size={11} strokeWidth={2.2} />
                      ) : (
                        <NoteIcon size={11} strokeWidth={2.2} />
                      )}
                      {a.kind === "visit" ? "Visite" : "Notiz"}
                    </span>
                    <span className="truncate">
                      {a.kind === "note" ? formatDateTime(a.date) : formatDate(a.date)}
                      {a.text ? ` · ${a.text}` : ""}
                    </span>
                  </p>
                </div>
                <ChevronRightIcon size={18} className="shrink-0 text-slate-300" />
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
  Icon,
  to,
  highlight,
}: {
  label: string;
  value: number;
  Icon: typeof VisitIcon;
  to?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={`card flex flex-col gap-2 px-3.5 py-4 transition ${
        highlight ? "ring-1 ring-amber-300" : ""
      } ${to ? "hover:shadow-card" : ""}`}
    >
      <Icon size={18} strokeWidth={2} className={highlight ? "text-amber-500" : "text-brand-500"} />
      <div>
        <span className="block text-2xl font-bold leading-none tabular-nums text-slate-900">
          {value}
        </span>
        <span className="mt-1 block text-xs text-slate-500">{label}</span>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
