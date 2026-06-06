import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { Avatar, EmptyState, PageHeader, StatusChip } from "../components/ui";
import SkillMatrix from "../components/SkillMatrix";
import TrendChart from "../components/TrendChart";
import DimensionTrendChart from "../components/DimensionTrendChart";
import ScaleLegend from "../components/ScaleLegend";
import GoalEditor, { type GoalDraft } from "../components/GoalEditor";
import { categoryScores, overallAverage, averageTrend, dimensionTrends } from "../lib/analytics";
import { categoryById, frameworkFor, visitTypeForQualification } from "../data/competencyFramework";
import { formatDate, formatDateTime } from "../lib/format";
import type { Goal } from "../types";
import {
  VisitIcon,
  EditIcon,
  TrendIcon,
  PlusIcon,
  ChevronRightIcon,
  TrashIcon,
  SearchIcon,
  DownloadIcon,
  NoteIcon,
} from "../components/icons";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getEmployee,
    deleteEmployee,
    visitsOf,
    goalsOf,
    addGoal,
    updateGoal,
    deleteGoal,
    notesOf,
    addNote,
    deleteNote,
  } = useStore();

  const employee = id ? getEmployee(id) : undefined;
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [trendMode, setTrendMode] = useState<"gesamt" | "dimensionen">("gesamt");
  const [noteDraft, setNoteDraft] = useState("");

  if (!employee) {
    return (
      <EmptyState
        icon={<SearchIcon size={26} strokeWidth={1.7} />}
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
  const notes = notesOf(employee.id);
  const latestVisit = visits[0];
  const scores = categoryScores(latestVisit);
  const avg = overallAverage(latestVisit);
  const trend = averageTrend(visits);
  const dimTrend = dimensionTrends(visits);

  function handleDelete() {
    if (confirm(`„${employee!.name}" und alle zugehörigen Visiten & Ziele wirklich löschen?`)) {
      deleteEmployee(employee!.id);
      navigate("/mitarbeiter");
    }
  }

  function saveNote() {
    const text = noteDraft.trim();
    if (!text) return;
    addNote({ employeeId: employee!.id, text });
    setNoteDraft("");
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
    <div className="space-y-7">
      <PageHeader
        title={employee.name}
        subtitle={`${employee.role}${employee.area ? ` · ${employee.area}` : ""}`}
      />

      <div className="card flex items-center gap-4 p-4">
        <Avatar name={employee.name} size="lg" />
        <div className="min-w-0 flex-1 space-y-0.5 text-sm text-slate-500">
          {employee.startDate && <p>Beschäftigt seit {formatDate(employee.startDate)}</p>}
          <p>
            {visits.length} Visiten · {goals.filter((g) => g.status !== "erreicht").length} offene
            Ziele
          </p>
          {avg !== null && (
            <p className="flex items-center gap-1.5 pt-1 font-semibold text-slate-800">
              <TrendIcon size={16} className="text-brand-500" /> Niveau {avg.toFixed(1)} / 5
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/visite/neu/${employee.id}`} className="btn-primary flex-1">
          <VisitIcon size={18} strokeWidth={2} /> Neue Visite
        </Link>
        <Link to={`/mitarbeiter/${employee.id}/bearbeiten`} className="btn-secondary">
          <EditIcon size={17} strokeWidth={2} /> Bearbeiten
        </Link>
      </div>

      {employee.notes && (
        <div className="card p-4 text-sm leading-relaxed text-slate-600">
          <p className="mb-1 font-semibold text-slate-700">Steckbrief</p>
          {employee.notes}
        </div>
      )}

      {/* Notizen */}
      <section>
        <h3 className="section-title">Notizen</h3>
        <div className="card space-y-3 p-4">
          <div className="flex flex-col gap-2">
            <textarea
              className="input min-h-[64px]"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Kurze Notiz festhalten…"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  saveNote();
                }
              }}
            />
            <button
              className="btn-primary self-end"
              onClick={saveNote}
              disabled={!noteDraft.trim()}
            >
              <PlusIcon size={17} strokeWidth={2.2} /> Notiz hinzufügen
            </button>
          </div>

          {notes.length === 0 ? (
            <EmptyState
              icon={<NoteIcon size={24} strokeWidth={1.7} />}
              title="Noch keine Notizen"
              hint="Halte kurze Beobachtungen oder Erinnerungen zu dieser Person fest."
            />
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
                      {n.text}
                    </p>
                    <button
                      className="shrink-0 text-slate-400 transition hover:text-red-600"
                      aria-label="Notiz löschen"
                      onClick={() => confirm("Notiz löschen?") && deleteNote(n.id)}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Skill-Matrix */}
      <section>
        <h3 className="section-title">
          Kompetenzprofil {latestVisit && `· ${formatDate(latestVisit.date)}`}
        </h3>
        {latestVisit ? (
          <div className="card space-y-4 p-4">
            <SkillMatrix scores={scores} />
            <ScaleLegend />
          </div>
        ) : (
          <EmptyState
            icon={<TrendIcon size={26} strokeWidth={1.7} />}
            title="Noch kein Kompetenzprofil"
            hint="Führe eine Visite durch, um die erste Standortbestimmung zu erfassen."
          />
        )}
      </section>

      {/* Kompetenz-Verlauf */}
      {visits.length > 0 && (
        <section>
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h3 className="section-title mb-0">Kompetenz-Verlauf</h3>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(["gesamt", "dimensionen"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTrendMode(m)}
                  className={`rounded-md px-2.5 py-1 transition ${
                    trendMode === m ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {m === "gesamt" ? "Gesamt" : "Dimensionen"}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-4">
            {trendMode === "gesamt" ? (
              <TrendChart points={trend} />
            ) : (
              <DimensionTrendChart trend={dimTrend} />
            )}
          </div>
        </section>
      )}

      {/* Ziele */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="section-title mb-0">Entwicklungsziele</h3>
          <button
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            onClick={() => setCreatingGoal(true)}
          >
            <PlusIcon size={16} strokeWidth={2.2} /> Ziel
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
                    <p className="mt-0.5 text-xs text-slate-500">
                      {categoryById(g.category)?.label ?? g.category}
                      {g.dueDate ? ` · bis ${formatDate(g.dueDate)}` : ""}
                    </p>
                  </div>
                  <StatusChip status={g.status} />
                </div>
                {g.measures && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.measures}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-slate-400">{g.progress}%</span>
                </div>
                <div className="mt-3 flex justify-end gap-4 text-xs font-medium">
                  <button
                    className="inline-flex items-center gap-1 text-slate-500 transition hover:text-brand-600"
                    onClick={() => setEditingGoal(g)}
                  >
                    <EditIcon size={14} /> Bearbeiten
                  </button>
                  <button
                    className="inline-flex items-center gap-1 text-slate-500 transition hover:text-red-600"
                    onClick={() => confirm("Ziel löschen?") && deleteGoal(g.id)}
                  >
                    <TrashIcon size={14} /> Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Visiten-Historie */}
      <section>
        <h3 className="section-title">Visiten-Historie</h3>
        {visits.length === 0 ? (
          <p className="px-1 text-sm text-slate-400">Noch keine Visiten dokumentiert.</p>
        ) : (
          <div className="space-y-2">
            {visits.map((v) => {
              const vAvg = overallAverage(v);
              return (
                <Link
                  key={v.id}
                  to={`/visite/${v.id}`}
                  className="card flex items-center gap-3 px-4 py-3 transition hover:shadow-card"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <VisitIcon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">{formatDate(v.date)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {v.summary || v.observations || "Visite"}
                    </p>
                  </div>
                  {vAvg !== null && (
                    <span className="chip bg-brand-50 text-brand-700">{vAvg.toFixed(1)}</span>
                  )}
                  <ChevronRightIcon size={18} className="shrink-0 text-slate-300" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {visits.length > 0 && (
        <button
          className="btn-secondary w-full"
          onClick={async () => {
            const { exportEmployeePdf } = await import("../lib/pdf");
            exportEmployeePdf(employee, visits);
          }}
        >
          <DownloadIcon size={17} strokeWidth={2} /> Gesamtbericht als PDF
        </button>
      )}

      <button
        className="btn-danger w-full"
        onClick={handleDelete}
      >
        <TrashIcon size={16} /> Mitarbeiter:in löschen
      </button>

      {(creatingGoal || editingGoal) && (
        <GoalEditor
          initial={editingGoal ?? undefined}
          categories={frameworkFor(visitTypeForQualification(employee.role))}
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
