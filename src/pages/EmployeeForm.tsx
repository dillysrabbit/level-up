import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";
import { DEFAULT_QUALIFICATION, QUALIFICATIONS } from "../data/qualifications";
import { AREAS, DEFAULT_AREA } from "../data/areas";

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, addEmployee, updateEmployee } = useStore();

  const existing = id ? getEmployee(id) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState(existing?.role ?? DEFAULT_QUALIFICATION);
  const [area, setArea] = useState(existing?.area || DEFAULT_AREA);
  const [notes, setNotes] = useState(existing?.notes ?? "");

  // Falls ein bestehender Wert nicht zu den Vorgaben passt, bleibt er als Option erhalten.
  const isKnownQualification = QUALIFICATIONS.some((q) => q.label === role);
  const isKnownArea = AREAS.includes(area);

  const canSave = name.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const payload = { name: name.trim(), role, area, notes: notes.trim() };
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
          <label className="label">Qualifikationsniveau</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            {QUALIFICATIONS.map((q) => (
              <option key={q.id} value={q.label}>
                {q.label}
              </option>
            ))}
            {!isKnownQualification && <option value={role}>{role}</option>}
          </select>
        </div>

        <div>
          <label className="label">Wohnbereich</label>
          <select className="input" value={area} onChange={(e) => setArea(e.target.value)}>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
            {!isKnownArea && area && <option value={area}>{area}</option>}
          </select>
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
