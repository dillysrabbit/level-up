import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";
import { PlusIcon, CheckIcon, NoteIcon } from "../components/icons";

export default function NoteForm() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { data, addNote } = useStore();

  const [selectedEmployee, setSelectedEmployee] = useState(employeeId ?? "");
  const [text, setText] = useState("");

  const canSave = selectedEmployee !== "" && text.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    addNote({ employeeId: selectedEmployee, text: text.trim() });
    navigate(`/mitarbeiter/${selectedEmployee}`);
  }

  if (data.employees.length === 0) {
    return (
      <div>
        <PageHeader title="Neue Notiz" />
        <div className="card p-6 text-center text-slate-600">
          <p className="mb-3">Lege zuerst eine:n Mitarbeiter:in an, um eine Notiz zu speichern.</p>
          <button className="btn-primary" onClick={() => navigate("/mitarbeiter/neu")}>
            <PlusIcon size={17} strokeWidth={2.2} /> Mitarbeiter:in anlegen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PageHeader title="Neue Notiz" back={!!employeeId} />

      <div className="card space-y-4 p-4">
        <div>
          <label className="label">Mitarbeiter:in *</label>
          <select
            className="input"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
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
          <label className="label flex items-center gap-1.5">
            <NoteIcon size={15} className="text-brand-500" /> Notiz
          </label>
          <textarea
            className="input min-h-[140px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kurze Notiz zu dieser Person festhalten…"
            autoFocus
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn-secondary flex-1" onClick={() => navigate(-1)}>
          Abbrechen
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={!canSave}>
          <CheckIcon size={17} strokeWidth={2.4} /> Notiz speichern
        </button>
      </div>
    </form>
  );
}
