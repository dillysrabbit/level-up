import { useEffect, useState } from "react";
import App from "./App";
import Login from "./pages/Login";
import { useAuth } from "./store/auth";
import { StoreProvider } from "./store/store";
import { supabase } from "./lib/supabase";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
    </div>
  );
}

function AccessDenied({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      </div>
      <div>
        <h1 className="font-serif text-2xl font-medium text-slate-900">Kein Zugriff</h1>
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
          Das Konto <span className="font-medium text-slate-700">{email}</span> ist nicht für
          LevelUp freigegeben. Bitte wende dich an die Administration, um freigeschaltet zu werden.
        </p>
      </div>
      <button className="btn-secondary" onClick={onSignOut}>
        Abmelden
      </button>
    </div>
  );
}

/** Entscheidet anhand von Session und Freigabe, ob Login, Sperrhinweis oder die App erscheint. */
export default function Root() {
  const { session, loading, signOut } = useAuth();
  const [allowed, setAllowed] = useState<"checking" | "yes" | "no">("checking");

  useEffect(() => {
    if (!session) {
      setAllowed("checking");
      return;
    }
    let active = true;
    supabase.rpc("is_allowed_user").then(({ data, error }) => {
      if (!active) return;
      setAllowed(!error && data === true ? "yes" : "no");
    });
    return () => {
      active = false;
    };
  }, [session]);

  if (loading) return <Splash />;
  if (!session) return <Login />;
  if (allowed === "checking") return <Splash />;
  if (allowed === "no") return <AccessDenied email={session.user.email} onSignOut={signOut} />;

  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
