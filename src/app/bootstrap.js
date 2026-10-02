import { setMode, sw, syncSwitcher } from "../dev/modeController.js";
import { runtime } from "../context/runtime.js";
import { closeAll, closeOverlay, closePop, overlay, popEl } from "../components/ui/overlays.js";
import { render } from "./render.js";
import { admin, fresh } from "../context/session.js";
import { onClick } from "./actions.js";
import { back, go, tab } from "./routes.js";
import { swipe } from "../features/discovery/deckController.js";
import { wideQ } from "../config/breakpoints.js";
import { openDetail } from "../components/details/detailsController.js";
import { AUTH } from '../config/navigationItems.js';

runtime.S = fresh();

sw.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  e.stopPropagation();
  if (t.classList.contains("msw-toggle")) {
    sw.classList.toggle("open");
    return;
  }
  if (t.dataset.mode) {
    syncSwitcher(t.dataset.mode);
    return;
  }
  if (t.dataset.screen) {
    sw.classList.remove("open");
    runtime.S.mode = sw.dataset.selectedMode || runtime.S.mode;
    runtime.S.adminAuthed = true;
    runtime.S.stack = [];
    runtime.S.route = t.dataset.screen;
    runtime.S.ctx = null;
    if (!admin()) {
      runtime.S.side = runtime.S.mode;
      runtime.S.pickSide = runtime.S.mode;
      runtime.S.authed = !AUTH.includes(runtime.S.route);
      runtime.S.subscribed = true;
      if (['convo', 'publicprofile'].includes(runtime.S.route)) runtime.S.ctx = runtime.S.mode === 'brand' ? 'u1' : 'c1';
      if (runtime.S.route === 'convo') runtime.S.openChat = runtime.S.ctx;
    }
    closeAll();
    render("fade");
    syncSwitcher();
    return;
  }
  if (t.dataset.restart) {
    const keep = sw.dataset.selectedMode || runtime.S.mode;
    runtime.S = fresh();
    runtime.S.mode = keep;
    if (keep === "admin") {
      runtime.S.mode = "admin";
      runtime.S.route = "a_login";
    } else {
      runtime.S.pickSide = keep;
    }
    closeAll();
    render("fade");
    syncSwitcher();
    sw.classList.remove("open");
  }
});
document.addEventListener("click", onClick);
document.addEventListener("keydown", e => {
  if(e.key==='Escape') {
    if(e.defaultPrevented)return;
    // Native dialogs own Escape; never navigate the page beneath them.
    if(document.querySelector('dialog[open]'))return;
    const dropdown=[...document.querySelectorAll('details[open]')].at(-1);
    if(dropdown){e.preventDefault();dropdown.open=false;return;}
    if(popEl.classList.contains('on')){e.preventDefault();closePop();return;}
    if(overlay.classList.contains('on')){e.preventDefault();closeOverlay();return;}
    if(e.target.closest('input,textarea,select,[contenteditable]'))return;
    back();return;
  }
  if (e.target.closest("input,textarea,select,[contenteditable]")) return;
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[role=button]")) {
    e.preventDefault();
    e.target.click();
    return;
  }

  if(document.querySelector('dialog[open]')||popEl.classList.contains('on')||document.querySelector('details[open]'))return;
  if(e.key==='ArrowDown'&&overlay.classList.contains('on')&&overlay.classList.contains('detail')){e.preventDefault();closeOverlay();return;}
  if (runtime.S.route === "discover" && !overlay.classList.contains("on") && !admin()) {
    if(e.key==='ArrowUp'){const card=runtime.root.querySelector('.cd.front[data-id]');if(card){e.preventDefault();openDetail(card.dataset.id,true);}return;}
    if (e.key === "ArrowLeft") swipe("left");
    if (e.key === "ArrowRight") swipe("right");
  }
});
wideQ.addEventListener("change", () => {
  closeAll();
  render("none");
});
export const _render = render;
window.__proto = {
  get S() {
    return runtime.S;
  },
  set S(v) {
    runtime.S = v;
  },
  render: a => {
    _render(a);
    syncSwitcher();
  },
  fresh,
  go,
  tab,
  openDetail,
  closeAll,
  swipe,
  setMode
};
render("none");
syncSwitcher();
