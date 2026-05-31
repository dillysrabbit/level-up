import { useState } from "react";
import { useAuth } from "../store/auth";

function Logo() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-card">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="6" y="13" width="3" height="6" rx="1" fill="white" />
        <rect x="10.5" y="9" width="3" height="10" rx="1" fill="white" />
        <rect x="15" y="5" width="3" height="14" rx="1" fill="white" />
      </svg>
    </div>
  );
}

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === "signup") {
      setMessage(
        "Konto angelegt. Falls eine E-Mail-Bestätigung verlangt wird, bestätige bitte den Link in deinem Postfach – danach kannst du dich anmelden.",
      );
      setMode("signin");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">LevelUp</h1>
            <p className="text-sm text-slate-500">Mitarbeitervisiten Pflege</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-5">
          <h2 className="text-lg font-bold text-slate-900">
            {mode === "signin" ? "Anmelden" : "Konto anlegen"}
          </h2>

          <div>
            <label className="label">E-Mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@einrichtung.de"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label">Passwort</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          {message && (
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">{message}</p>
          )}

          <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
            {busy ? "Bitte warten…" : mode === "signin" ? "Anmelden" : "Konto anlegen"}
          </button>

          <button
            type="button"
            className="w-full text-center text-sm font-medium text-slate-500 transition hover:text-brand-600"
            onClick={() => {
              setMode((m) => (m === "signin" ? "signup" : "signin"));
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "signin"
              ? "Noch kein Konto? Jetzt anlegen"
              : "Schon ein Konto? Zur Anmeldung"}
          </button>
        </form>

        <p className="mt-6 px-2 text-center text-xs leading-relaxed text-slate-400">
          Daten werden verschlüsselt in der EU (Frankfurt) gespeichert und sind nur nach Anmeldung
          zugänglich.
        </p>
      </div>
    </div>
  );
}
