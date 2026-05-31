import { useState } from "react";
import { COMPETENCY_FRAMEWORK } from "../data/competencyFramework";
import type { Goal, GoalStatus } from "../types";

export interface GoalDraft {
  title: string;
  category: string;
  measures: string;
  dueDate?: string;
  status: GoalStatus;
  progress: number;
}

export default function GoalEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Goal;
  onSave: (draft: GoalDraft) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? COMPETENCY_FRAMEWORK[0].id);
  const [measures, setMeasures] = useState(initial?.measures ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [status, setStatus] = useState<GoalStatus>(initial?.status ?? "offen");
  const [progress, setProgress] = useState(initial?.progress ?? 0);

  function submit() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, measures: measures.trim(), dueDate, status, progress });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-b-none rounded-t-3xl p-5 sm:rounded-3xl">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          {initial ? "Ziel bearbeiten" : "Neues Entwicklungsziel"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="label">Ziel *</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Sicherheit in der Wunddokumentation"
              autoFocus
            />
          </div>

          <div>
            <label className="label">Kompetenzbereich</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {COMPETENCY_FRAMEWORK.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Vereinbarte Maßnahmen</label>
            <textarea
              className="input min-h-[80px]"
              value={measures}
              onChange={(e) => setMeasures(e.target.value)}
              placeholder="z.B. Hospitation bei Wundmanager:in, interne Schulung im Mai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Zieltermin</label>
              <input
                type="date"
                className="input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
              >
                <option value="offen">Offen</option>
                <option value="in_arbeit">In Arbeit</option>
                <option value="erreicht">Erreicht</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Fortschritt: {progress}%</label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="btn-secondary flex-1" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="btn-primary flex-1" onClick={submit} disabled={!title.trim()}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
