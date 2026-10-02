import { brand } from '../../context/session.js';
import { runtime } from "../../context/runtime.js";

export const toastEl = document.getElementById("toast");
export function toast(m) {
  toastEl.style.background = brand() ? 'var(--lime)' : 'var(--orange)';
  toastEl.textContent = m;
  toastEl.classList.add("on");
  clearTimeout(runtime.tt);
  runtime.tt = setTimeout(() => toastEl.classList.remove("on"), 2400);
}
