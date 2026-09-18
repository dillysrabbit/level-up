import { useRef, useState } from "react";
import { useStore } from "../store/store";
import { PageHeader } from "../components/ui";
import { importData } from "../store/storage";
import { exportBackup } from "../lib/backup";
import { isLockEnabled, isNativeApp, setLockEnabled, unlock } from "../lib/applock";
import { PrivacyIcon, DownloadIcon, UploadIcon, TrashIcon } from "../components/icons";

export default function Settings() {
  const { data, replaceAll, resetAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lockOn, setLockOn] = useState(() => isLockEnabled());

  async function toggleLock() {
    if (lockOn) {
      // Deaktivieren nur nach erfolgreicher Authentifizierung
      const ok = await unlock();
      if (!ok) return;
      setLockEnabled(false);
      setLockOn(false);
    } else {
      setLockEnabled(true);
      setLockOn(true);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importData(file);
      if (
        confirm(
          `Backup importieren? Der gesamte Datenbestand wird ersetzt.\n\n${imported.employees.length} Mitarbeiter, ${imported.visits.length} Visiten, ${imported.goals.length} Ziele.`,
        )
      ) {
        setBusy(true);
        await replaceAll(imported);
        setBusy(false);
        setMessage("Backup erfolgreich importiert.");
      }
    } catch {
      setBusy(false);
      setMessage("Fehler: Datei konnte nicht gelesen werden.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleReset() {
    if (confirm("Wirklich ALLE Daten unwiderruflich löschen?")) {
      setBusy(true);
      await resetAll();
      setBusy(false);
      setMessage("Alle Daten wurden gelöscht.");
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Daten & Datenschutz" back={false} />

      <div className="card flex gap-3 p-4 text-sm leading-relaxed text-slate-600">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <PrivacyIcon size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Nur auf diesem Gerät</p>
          <p className="mt-0.5">
            Alle Daten liegen ausschließlich lokal auf diesem Gerät und verlassen es nicht. Sie
            werden über das normale Geräte-Backup (iCloud/Finder) mitgesichert – zusätzlich empfiehlt
            sich ein regelmäßiger JSON-Export.
          </p>
        </div>
      </div>

      {isNativeApp() && (
        <div className="card flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">App-Sperre</p>
            <p className="text-xs text-slate-500">
              Face ID / Geräte-Code beim Öffnen und nach dem Wechsel in den Hintergrund.
            </p>
          </div>
          <button
            className={lockOn ? "btn-primary shrink-0" : "btn-secondary shrink-0"}
            onClick={toggleLock}
          >
            {lockOn ? "Aktiv" : "Aus"}
          </button>
        </div>
      )}

      <div className="card space-y-3 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Gespeicherte Datensätze</span>
          <span className="font-medium text-slate-800">
            {data.employees.length} MA · {data.visits.length} Visiten · {data.goals.length} Ziele
          </span>
        </div>

        <button className="btn-secondary w-full" onClick={() => exportBackup(data)} disabled={busy}>
          <DownloadIcon size={17} strokeWidth={2} /> Backup exportieren (JSON)
        </button>

        <button
          className="btn-secondary w-full"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
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

      <button className="btn-danger w-full" onClick={handleReset} disabled={busy}>
        <TrashIcon size={16} /> Alle Daten löschen
      </button>

      {message && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</p>
      )}

      <p className="px-1 text-center text-xs text-slate-400">
        LevelUp · v0.3 · Mitarbeitervisiten Pflege
      </p>
    </div>
  );
}
