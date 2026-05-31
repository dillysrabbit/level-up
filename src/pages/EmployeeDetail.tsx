import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState, PageHeader, StatusChip } from "../components/ui";
import SkillMatrix from "../components/SkillMatrix";
import GoalEditor, { type GoalDraft } from "../components/GoalEditor";
import { categoryScores, overallAverage } from "../lib/analytics";
import { categoryById } from "../data/competencyFramework";
import { formatDate } from "../lib/format";
import type { Goal } from "../types";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, deleteEmployee, visitsOf, goalsOf, addGoal, updateGoal, deleteGoal } =
    useStore();

  const employee = id ? getEmployee(id) : undefined;
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [creatingGoal, setCreatingGoal] = useState(false);

  if (!employee) {
    return (
      <EmptyState
        icon="🔍"
        title="Mitarbeiter:in nicht gefunden"
        action={
          <Link to="/mitarbeiter" className="btn-primary">
            Zur Übersicht
          </Link>
        }
      />
    );
  }

  const visits = visitsOf(employee.id);
  const goals = goalsOf(employee.id);
  const latestVisit = visits[0];
  const scores = categoryScores(latestVisit);
  const avg = overallAverage(latestVisit);

  function handleDelete() {
    if (confirm(`„${employee!.name}" und alle zugehörigen Visiten & Ziele wirklich löschen?`)) {
      deleteEmployee(employee!.id);
      navigate("/mitarbeiter");
    }
  }

  function saveGoal(draft: GoalDraft) {
    if (editingGoal) {
      updateGoal(editingGoal.id, draft);
    } else {
      addGoal({ employeeId: employee!.id, ...draft });
    }
    setEditingGoal(null);
    setCreatingGoal(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={employee.name} subtitle={`${employee.role}${employee.area ? ` · ${employee.area}` : ""}`} />

      <div className="card flex items-center gap-4 p-4">
        <Avatar name={employee.name} size="lg" />
        <div className="min-w-0 flex-1 text-sm text-slate-600">
          {employee.startDate && <p>Beschäftigt seit {formatDate(employee.startDate)}</p>}
          <p>{visits.length} Visiten · {goals.filter((g) => g.status !== "erreicht").length} offene Ziele</p>
          {avg !== null && (
            <p className="mt-1 font-medium text-slate-800">
              Aktuelles Niveau: {avg.toFixed(1)} / 5
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/visite/neu/${employee.id}`} className="btn-primary flex-1">
          📋 Neue Visite
        </Link>
        <Link to={`/mitarbeiter/${employee.id}/bearbeiten`} className="btn-secondary">
          Bearbeiten
        </Link>
      </div>

      {employee.notes && (
        <div className="card p-4 text-sm text-slate-600">
          <p className="mb-1 font-semibold text-slate-700">Notizen</p>
          {employee.notes}
        </div>
      )}

      {/* Skill-Matrix */}
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Kompetenzprofil {latestVisit && `(${formatDate(latestVisit.date)})`}
        </h3>
        {latestVisit ? (
          <div className="card p-4">
            <SkillMatrix scores={scores} />
          </div>
        ) : (
          <EmptyState
            icon="📊"
            title="Noch kein Kompetenzprofil"
            hint="Führe eine Visite durch, um die erste Standortbestimmung zu erfassen."
          />
        )}
      </section>

      {/* Ziele */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Entwicklungsziele
          </h3>
          <button className="btn-ghost px-2 py-1 text-sm text-brand-600" onClick={() => setCreatingGoal(true)}>
            + Ziel
          </button>
        </div>
        {goals.length === 0 ? (
          <p className="px-1 text-sm text-slate-400">Noch keine Ziele vereinbart.</p>
        ) : (
          <div className="space-y-2">
            {goals.map((g) => (
              <div key={g.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{g.title}</p>
                    <p className="text-xs text-slate-500">
                      {categoryById(g.category)?.label ?? g.category}
                      {g.dueDate ? ` · bis ${formatDate(g.dueDate)}` : ""}
                    </p>
                  </div>
                  <StatusChip status={g.status} />
                </div>
                {g.measures && <p className="mt-2 text-sm text-slate-600">{g.measures}</p>}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-end gap-3 text-xs">
                  <button className="text-brand-600" onClick={() => setEditingGoal(g)}>
                    Bearbeiten
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => confirm("Ziel löschen?") && deleteGoal(g.id)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Visiten-Historie */}
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Visiten-Historie
        </h3>
        {visits.length === 0 ? (
          <p className="px-1 text-sm text-slate-400">Noch keine Visiten dokumentiert.</p>
        ) : (
          <div className="space-y-2">
            {visits.map((v) => {
              const vAvg = overallAverage(v);
              return (
                <Link key={v.id} to={`/visite/${v.id}`} className="card flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">{formatDate(v.date)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {v.summary || v.observations || "Visite"}
                    </p>
                  </div>
                  {vAvg !== null && (
                    <span className="chip bg-brand-50 text-brand-700">{vAvg.toFixed(1)}</span>
                  )}
                  <span className="text-slate-300">›</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <button className="btn-danger w-full" onClick={handleDelete}>
        Mitarbeiter:in löschen
      </button>

      {(creatingGoal || editingGoal) && (
        <GoalEditor
          initial={editingGoal ?? undefined}
          onSave={saveGoal}
          onCancel={() => {
            setEditingGoal(null);
            setCreatingGoal(false);
          }}
        />
      )}
    </div>
  );
}
