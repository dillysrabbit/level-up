/**
 * Datei-Ausgabe, die auch in mobilem Safari zuverlässig funktioniert.
 *
 * Klassische Blob-Downloads (unsichtbarer <a download>-Klick) sind auf
 * iOS heikel: Im normalen Safari landen sie versteckt im Download-Manager,
 * und in der vom Home-Bildschirm installierten Web-App (Standalone-PWA)
 * schlagen sie komplett still fehl. Auf iOS nutzen wir daher das native
 * Share-Sheet (Web Share API) – damit lassen sich PDF und Backup direkt
 * in "Dateien" sichern, per AirDrop teilen oder mailen. Desktop-Browser
 * bekommen weiterhin den gewohnten Download.
 */

const isIOS = (): boolean =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  // iPadOS meldet sich als "MacIntel", hat aber Touch
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandalone = (): boolean =>
  window.matchMedia?.("(display-mode: standalone)").matches === true ||
  // iOS-eigenes Flag für "Zum Home-Bildschirm" installierte Web-Apps
  (navigator as { standalone?: boolean }).standalone === true;

/** Übergibt eine Datei an den Nutzer: Share-Sheet auf iOS, sonst Download. */
export async function deliverFile(blob: Blob, fileName: string): Promise<void> {
  if (isIOS() || isStandalone()) {
    const file = new File([blob], fileName, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        // Abbruch durch den Nutzer ist kein Fehler
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Sonst auf den Download-Fallback zurückfallen
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  // Die URL erst verzögert freigeben – ein sofortiges revoke bricht den
  // Download in Safari ab, weil die Datei noch nicht gelesen wurde.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
