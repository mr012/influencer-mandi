import { runtime } from "../../context/runtime.js";
import { brand } from "../../context/session.js";
import { wire } from "../../app/actionBindings.js";
import { bindGallery } from "../details/MediaGallery.js";
import { reduced } from "../../config/breakpoints.js";
import { T } from "../../app/templateMarkup.js";

export const overlay = document.getElementById("overlay");
export function openSheet(inner, cls) {
  clearTimeout(runtime.overlayCloseTimer);
  const b = brand();
  overlay.className = "on" + (cls ? " " + cls : "");
  overlay.innerHTML = `<div class="sheetwrap" data-act="close" style="--side:${b ? "var(--lime)" : "var(--orange)"};--srgb:${b ? "198,255,0" : "255,61,0"}">
    <div class="sheet"><div class="grab"></div><span class="xclose" data-act="close">×</span>${inner}</div></div>`;
  wire(overlay);
  bindGallery(overlay);
}
export function closeOverlay() {
  if (!overlay.classList.contains("on")) return;
  if (reduced) {
    overlay.className = "";
    overlay.innerHTML = "";
    return;
  }
  overlay.classList.add("closing");
  clearTimeout(runtime.overlayCloseTimer);
  runtime.overlayCloseTimer = setTimeout(() => {
    overlay.className = "";
    overlay.innerHTML = "";
  }, 230);
}
export const popEl = document.getElementById("pop");
export function openPop(html) {
  popEl.innerHTML = html;
  popEl.className = "on";
  wire(popEl);
  popEl.style.setProperty("--side", brand() ? "var(--lime)" : "var(--orange)");
  popEl.style.setProperty("--srgb", brand() ? "198,255,0" : "255,61,0");
}
export function closePop() {
  if (!popEl.classList.contains("on")) return;
  popEl.classList.add("closing");
  setTimeout(() => {
    popEl.className = "";
    popEl.innerHTML = "";
  }, 180);
}
export function closeAll() {
  closeOverlay();
  closePop();
}
export function sheetFrom(name) {
  const tmp = document.createElement("div");
  tmp.innerHTML = T[name].m;
  const sh = tmp.querySelector(".sheet");
  if (!sh) return "";
  const g = sh.querySelector(".grab");
  if (g) g.remove();
  return sh.innerHTML;
}
