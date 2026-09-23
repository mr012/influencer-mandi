import { runtime } from "../../context/runtime.js";

export const toastEl = document.getElementById("toast");
export function toast(m) {
  toastEl.textContent = m;
  toastEl.classList.add("on");
  clearTimeout(runtime.tt);
  runtime.tt = setTimeout(() => toastEl.classList.remove("on"), 2400);
}
