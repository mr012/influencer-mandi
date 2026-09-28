import { runtime } from "../context/runtime.js";
import { closeAll } from "../components/ui/overlays.js";
import { render } from "../app/render.js";
import { admin } from "../context/session.js";
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
export function syncSwitcher() {
  sw.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === runtime.S.mode)));
  const list = sw.querySelector(".msw-admin");
  list.hidden = false;
  list.innerHTML = `<span class="msw-t">${admin() ? 'Admin' : runtime.S.mode === 'brand' ? 'Brand' : 'Creator'} screens</span>` + screenShortcuts(runtime.S.mode).map(([route, label]) => `<button data-screen="${route}" class="${route === runtime.S.route ? 'on' : ''}" aria-current="${route === runtime.S.route ? 'page' : 'false'}">${label}</button>`).join('');
}
