import { useCallback, useEffect, useRef, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import App from "./App";
import { StoreProvider } from "./store/store";
import { isLockEnabled, isNativeApp, unlock } from "./lib/applock";

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [busy, setBusy] = useState(false);

  const tryUnlock = useCallback(async () => {
    setBusy(true);
    const ok = await unlock();
    setBusy(false);
    if (ok) onUnlock();
  }, [onUnlock]);

  // Beim Anzeigen direkt Face ID anstoßen – der Button bleibt als Wiederholung.
  useEffect(() => {
    tryUnlock();
  }, [tryUnlock]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
      <img src="/logo-mark.png" alt="" aria-hidden className="h-16 w-auto select-none" draggable={false} />
      <div>
        <h1 className="display text-3xl text-slate-900">LevelUp</h1>
        <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Gesperrt
        </p>
      </div>
      <button className="btn-primary" onClick={tryUnlock} disabled={busy}>
        {busy ? "Bitte warten…" : "Mit Face ID entsperren"}
      </button>
    </div>
  );
}

/** Schützt die App in der nativen Version per Face ID / Geräte-Code. */
export default function Root() {
  const [locked, setLocked] = useState(() => isLockEnabled());
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  // Beim Wechsel in den Hintergrund wieder sperren.
  useEffect(() => {
    if (!isNativeApp()) return;
    const sub = CapApp.addListener("appStateChange", ({ isActive }) => {
      if (!isActive && isLockEnabled() && !lockedRef.current) setLocked(true);
    });
    return () => {
      sub.then((s) => s.remove());
    };
  }, []);

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />;

  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
