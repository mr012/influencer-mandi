import { openSheet, sheetFrom } from "../../components/ui/overlays.js";

export function openLocked() {
  openSheet(sheetFrom("Locked"));
}
