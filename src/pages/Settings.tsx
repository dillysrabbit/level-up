import { useRef, useState } from "react";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";
import { exportData, importData } from "../store/storage";
import { PrivacyIcon, DownloadIcon, UploadIcon, TrashIcon } from "../components/icons";

export default function Settings() {
  const { data, replaceAll, resetAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importData(file);
      if (
        confirm(
          `Backup importieren? Die aktuellen Daten werden ersetzt.\n\n${imported.employees.length} Mitarbeiter, ${imported.visits.length} Visiten, ${imported.goals.length} Ziele.`,
        )
      ) {
        replaceAll(imported);
        setMessage("Backup erfolgreich importiert.");
      }
    } catch {
      setMessage("Fehler: Datei konnte nicht gelesen werden.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleReset() {
    if (confirm("Wirklich ALLE Daten unwiderruflich löschen?")) {
      resetAll();
      setMessage("Alle Daten wurden gelöscht.");
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Daten & Datenschutz" back={false} />

      <div className="card flex gap-3 p-4 text-sm leading-relaxed text-slate-600">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <PrivacyIcon size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Lokal & privat</p>
          <p className="mt-0.5">
            Alle Daten bleiben ausschließlich auf diesem Gerät. Es werden keine Daten an einen Server
            gesendet. Erstelle regelmäßig ein Backup – z.B. beim Gerätewechsel oder bevor du den
            Browser-Speicher leerst.
          </p>
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Gespeicherte Datensätze</span>
          <span className="font-medium text-slate-800">
            {data.employees.length} MA · {data.visits.length} Visiten · {data.goals.length} Ziele
          </span>
        </div>

        <button className="btn-secondary w-full" onClick={() => exportData(data)}>
          <DownloadIcon size={17} strokeWidth={2} /> Backup exportieren (JSON)
        </button>

        <button className="btn-secondary w-full" onClick={() => fileRef.current?.click()}>
          <UploadIcon size={17} strokeWidth={2} /> Backup importieren
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      <button className="btn-danger w-full" onClick={handleReset}>
        <TrashIcon size={16} /> Alle Daten löschen
      </button>

      {message && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</p>
      )}

      <p className="px-1 text-center text-xs text-slate-400">
        LevelUp · v0.1 · Mitarbeitervisiten Pflege
      </p>
    </div>
  );
}
