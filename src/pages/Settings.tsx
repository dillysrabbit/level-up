import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/store";
import { useAuth } from "../store/auth";
import { supabase } from "../lib/supabase";
import { PageHeader } from "../components/ui";
import { exportData, importData } from "../store/storage";
import {
  PrivacyIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  UserIcon,
  TeamIcon,
  PlusIcon,
} from "../components/icons";

export default function Settings() {
  const { data, replaceAll, resetAll } = useStore();
  const { session, signOut, updatePassword } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  // Zugriffs-Allowlist (Tabelle allowed_emails)
  const ownEmail = session?.user.email?.toLowerCase() ?? "";
  const [admins, setAdmins] = useState<string[]>([]);
  const [adminInput, setAdminInput] = useState("");
  const [adminMsg, setAdminMsg] = useState<string | null>(null);
  const [adminBusy, setAdminBusy] = useState(false);

  async function loadAdmins() {
    const { data, error } = await supabase
      .from("allowed_emails")
      .select("email")
      .order("created_at");
    if (!error && data) setAdmins(data.map((r) => r.email as string));
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    const email = adminInput.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAdminMsg("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (admins.includes(email)) {
      setAdminMsg("Diese E-Mail ist bereits freigegeben.");
      return;
    }
    setAdminBusy(true);
    const { error } = await supabase.from("allowed_emails").insert({ email });
    setAdminBusy(false);
    if (error) {
      setAdminMsg(`Fehler: ${error.message}`);
      return;
    }
    setAdminInput("");
    setAdminMsg(`${email} freigegeben.`);
    loadAdmins();
  }

  async function removeAdmin(email: string) {
    if (email === ownEmail) return;
    if (!confirm(`Zugang für ${email} wirklich entfernen?`)) return;
    setAdminBusy(true);
    const { error } = await supabase.from("allowed_emails").delete().eq("email", email);
    setAdminBusy(false);
    if (error) {
      setAdminMsg(`Fehler: ${error.message}`);
      return;
    }
    setAdminMsg(`${email} entfernt.`);
    loadAdmins();
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) return;
    setBusy(true);
    const { error } = await updatePassword(newPassword);
    setBusy(false);
    setNewPassword("");
    setPwMessage(error ? `Fehler: ${error}` : "Passwort geändert.");
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

      <div className="card flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <UserIcon size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">Angemeldet</p>
            <p className="truncate text-xs text-slate-500">{session?.user.email}</p>
          </div>
        </div>
        <button className="btn-secondary shrink-0" onClick={() => signOut()}>
          Abmelden
        </button>
      </div>

      <form onSubmit={handlePasswordChange} className="card space-y-3 p-4">
        <p className="text-sm font-semibold text-slate-800">Passwort ändern</p>
        <input
          type="password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Neues Passwort (mind. 6 Zeichen)"
          autoComplete="new-password"
          minLength={6}
        />
        <button type="submit" className="btn-secondary w-full" disabled={busy || newPassword.length < 6}>
          Passwort aktualisieren
        </button>
        {pwMessage && (
          <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">{pwMessage}</p>
        )}
      </form>

      <div className="card space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <TeamIcon size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">Zugänge verwalten</p>
            <p className="text-xs text-slate-500">
              Freigegebene Konten mit vollem Zugriff (Anmeldung per Google).
            </p>
          </div>
        </div>

        {admins.length > 0 && (
          <ul className="space-y-1.5">
            {admins.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="min-w-0 truncate text-sm text-slate-700">
                  {email}
                  {email === ownEmail && (
                    <span className="ml-1.5 text-xs text-slate-400">(du)</span>
                  )}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-slate-400 transition enabled:hover:text-red-600 disabled:opacity-30"
                  aria-label="Zugang entfernen"
                  disabled={adminBusy || email === ownEmail}
                  onClick={() => removeAdmin(email)}
                >
                  <TrashIcon size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={addAdmin} className="flex gap-2">
          <input
            type="email"
            className="input min-w-0 flex-1"
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
            placeholder="email@beispiel.de"
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn-primary shrink-0"
            disabled={adminBusy || !adminInput.trim()}
          >
            <PlusIcon size={17} strokeWidth={2.2} /> Hinzufügen
          </button>
        </form>

        {adminMsg && (
          <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">{adminMsg}</p>
        )}
      </div>

      <div className="card flex gap-3 p-4 text-sm leading-relaxed text-slate-600">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <PrivacyIcon size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Sicher & geräteübergreifend</p>
          <p className="mt-0.5">
            Die Daten werden verschlüsselt in der EU (Frankfurt) gespeichert und sind nur nach
            Anmeldung zugänglich. Alle angemeldeten Geräte sehen denselben Datenbestand.
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

        <button className="btn-secondary w-full" onClick={() => exportData(data)} disabled={busy}>
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
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</p>
      )}

      <p className="px-1 text-center text-xs text-slate-400">
        LevelUp · v0.2 · Mitarbeitervisiten Pflege
      </p>
    </div>
  );
}
