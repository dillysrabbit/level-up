import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";

const ROLE_SUGGESTIONS = [
  "Examinierte Pflegefachkraft",
  "Pflegehelfer:in",
  "Auszubildende:r",
  "Pflegehilfskraft",
  "Praktikant:in",
];

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, addEmployee, updateEmployee } = useStore();

  const existing = id ? getEmployee(id) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState(existing?.role ?? ROLE_SUGGESTIONS[0]);
  const [area, setArea] = useState(existing?.area ?? "");
  const [startDate, setStartDate] = useState(existing?.startDate ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const canSave = name.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const payload = { name: name.trim(), role, area: area.trim(), startDate, notes: notes.trim() };
    if (existing) {
      updateEmployee(existing.id, payload);
      navigate(`/mitarbeiter/${existing.id}`);
    } else {
      const created = addEmployee(payload);
      navigate(`/mitarbeiter/${created.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader title={existing ? "Mitarbeiter:in bearbeiten" : "Neue:r Mitarbeiter:in"} />

      <div className="card space-y-4 p-4">
        <div>
          <label className="label">Name *</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vor- und Nachname"
            autoFocus
          />
        </div>

        <div>
          <label className="label">Qualifikation / Rolle</label>
          <input
            className="input"
            list="roles"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <datalist id="roles">
            {ROLE_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="label">Wohnbereich / Station / Tour</label>
          <input
            className="input"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="z.B. Wohnbereich 2"
          />
        </div>

        <div>
          <label className="label">Beschäftigt seit</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Notizen</label>
          <textarea
            className="input min-h-[80px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hintergrund, Stärken, Besonderheiten…"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" className="btn-secondary flex-1" onClick={() => navigate(-1)}>
          Abbrechen
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={!canSave}>
          Speichern
        </button>
      </div>
    </form>
  );
}
