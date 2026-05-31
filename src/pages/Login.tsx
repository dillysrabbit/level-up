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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.07-1.47-.22-2.12H12v3.85h6.32c-.13 1.02-.82 2.55-2.35 3.58l-.02.14 3.41 2.64.24.02c2.17-2 3.46-4.95 3.46-8.11z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.71-1.02 7.61-2.78l-3.63-2.8c-.97.67-2.27 1.14-3.98 1.14-3.04 0-5.62-2-6.54-4.78l-.13.01-3.55 2.74-.05.13C3.62 21.3 7.52 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.46 14.78c-.24-.71-.38-1.47-.38-2.28s.14-1.57.37-2.28l-.01-.15-3.6-2.79-.11.06A11.97 11.97 0 0 0 .54 12.5c0 1.94.46 3.77 1.27 5.41l3.65-2.83z"
      />
      <path
        fill="#EB4335"
        d="M12 4.74c2.15 0 3.6.93 4.43 1.71l3.23-3.16C17.7 1.48 15.1.5 12 .5 7.52.5 3.62 3.2 1.81 7.09l3.64 2.83C6.38 7.14 8.96 4.74 12 4.74z"
      />
    </svg>
  );
}

export default function Login() {
  const { signIn, signInWithGoogle, signUp } = useAuth();
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

          <button
            type="button"
            className="btn-secondary w-full py-3"
            disabled={busy}
            onClick={async () => {
              setError(null);
              const { error } = await signInWithGoogle();
              if (error) setError(error);
            }}
          >
            <GoogleIcon /> Mit Google anmelden
          </button>

          <div className="flex items-center gap-3 py-1 text-xs font-medium text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> oder mit E-Mail{" "}
            <span className="h-px flex-1 bg-slate-200" />
          </div>

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
