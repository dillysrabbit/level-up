import { Capacitor } from "@capacitor/core";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";

// App-Sperre: In der nativen App wird der Zugriff per Face ID / Touch ID
// (mit Geräte-Code als Fallback) geschützt. Im Browser gibt es keine Sperre.

const LOCK_KEY = "levelup.lock.enabled";

export const isNativeApp = () => Capacitor.isNativePlatform();

/** Ob die Sperre aktiv ist (Standard: an, sobald die App nativ läuft). */
export function isLockEnabled(): boolean {
  if (!isNativeApp()) return false;
  try {
    return localStorage.getItem(LOCK_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setLockEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(LOCK_KEY, enabled ? "on" : "off");
  } catch {
    // Einstellung nicht persistierbar – Sperre bleibt beim Standard.
  }
}

/**
 * Fordert Face ID / Touch ID an (Geräte-Code als Fallback).
 * Liefert true bei Erfolg, false bei Abbruch/Fehler.
 */
export async function unlock(): Promise<boolean> {
  try {
    await BiometricAuth.authenticate({
      reason: "LevelUp entsperren",
      cancelTitle: "Abbrechen",
      iosFallbackTitle: "Code verwenden",
      allowDeviceCredential: true,
    });
    return true;
  } catch {
    return false;
  }
}
