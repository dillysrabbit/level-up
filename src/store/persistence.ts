import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import type { AppData } from "../types";
import { emptyData, loadData, saveData } from "./storage";

// Lokale Persistenz: In der nativen App liegt der Datenbestand als JSON-Datei
// im App-Dokumentenverzeichnis (wird ins iOS-Backup einbezogen). Im Browser
// dient localStorage als Ablage. Es gibt bewusst keinen Cloud-Sync.

const FILE_NAME = "levelup-data.json";

const isNative = () => Capacitor.isNativePlatform();

function normalize(parsed: Partial<AppData>): AppData {
  return {
    version: parsed.version ?? emptyData.version,
    employees: parsed.employees ?? [],
    visits: parsed.visits ?? [],
    goals: parsed.goals ?? [],
    notes: parsed.notes ?? [],
    smokeBreaks: parsed.smokeBreaks ?? [],
  };
}

/** Lädt den Datenbestand vom Gerät (Datei nativ, sonst localStorage). */
export async function loadPersisted(): Promise<AppData> {
  if (!isNative()) return loadData();
  try {
    const res = await Filesystem.readFile({
      path: FILE_NAME,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    return normalize(JSON.parse(res.data as string));
  } catch {
    // Datei existiert noch nicht (Erststart) – ggf. WebView-Daten übernehmen.
    return loadData();
  }
}

/** Schreibt den Datenbestand aufs Gerät. Wirft bei Fehlern, damit der Store sie melden kann. */
export async function persist(data: AppData): Promise<void> {
  if (!isNative()) {
    saveData(data);
    return;
  }
  await Filesystem.writeFile({
    path: FILE_NAME,
    directory: Directory.Data,
    encoding: Encoding.UTF8,
    data: JSON.stringify(data),
  });
}
