import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import type { AppData } from "../types";
import { exportData } from "../store/storage";

/**
 * Backup-Export: Im Browser als Datei-Download, in der nativen App über das
 * iOS-Share-Sheet (dort funktioniert kein Blob-Download).
 */
export async function exportBackup(data: AppData): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    exportData(data);
    return;
  }
  const stamp = new Date().toISOString().slice(0, 10);
  const path = `levelup-backup-${stamp}.json`;
  const file = await Filesystem.writeFile({
    path,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
    data: JSON.stringify(data, null, 2),
  });
  await Share.share({
    title: "LevelUp-Backup",
    files: [file.uri],
  });
}

/**
 * PDF-Ausgabe: Im Browser als Download, in der nativen App über das
 * iOS-Share-Sheet (Sichern in Dateien, AirDrop, Mail …).
 */
export async function sharePdf(base64: string, fileName: string, webSave: () => void): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    webSave();
    return;
  }
  const file = await Filesystem.writeFile({
    path: fileName,
    directory: Directory.Cache,
    data: base64, // ohne encoding = Base64-Rohdaten
  });
  await Share.share({ title: fileName, files: [file.uri] });
}
