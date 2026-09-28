import { runtime } from "../context/runtime.js";
import { closeAll } from "../components/ui/overlays.js";
import { render } from "../app/render.js";
import { screenShortcuts } from './screenShortcuts.js';

export function pickSide(v) {
  runtime.S.pickSide = v;
  runtime.root.setAttribute("data-side", v);
  runtime.root.querySelectorAll(".role-choice").forEach(r => r.classList.toggle("chosen", r.dataset.act === "side:" + v));
  runtime.root.querySelectorAll('.body > .row[data-act^="side:"]').forEach(r => r.classList.toggle("sel", r.dataset.act === "side:" + v));
}
export function setMode(m) {
  closeAll();
  if (m === "admin") {
    runtime.S.mode = "admin";
    runtime.S.stack = [];
    runtime.S.route = runtime.S.adminAuthed ? "a_overview" : "a_login";
  } else {
    runtime.S.mode = m;
    runtime.S.side = m;
    runtime.S.pickSide = m;
    if (!runtime.S.authed) {
      runtime.S.authed = true;
      runtime.S.subscribed = true;
    }
    runtime.S.stack = [];
    runtime.S.route = "discover";
    runtime.S.openChat = null;
  }
  render("fade");
  syncSwitcher();
}
export const sw = document.getElementById("modeSw");
export function syncSwitcher(mode = runtime.S.mode) {
  sw.dataset.selectedMode = mode;
  sw.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  const list = sw.querySelector(".msw-admin");
  list.hidden = false;
  list.innerHTML = `<span class="msw-t">${mode === 'admin' ? 'Admin' : mode === 'brand' ? 'Brand' : 'Creator'} screens</span>` + screenShortcuts(mode).map(([route, label]) => {
    const active = mode === runtime.S.mode && route === runtime.S.route;
    return `<button data-screen="${route}" class="${active ? 'on' : ''}" aria-current="${active ? 'page' : 'false'}">${label}</button>`;
  }).join('');
  list.scrollTop = 0;
}
