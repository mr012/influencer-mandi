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
    sw.classList.remove("open");
    setMode(t.dataset.mode);
    return;
  }
  if (t.dataset.adm) {
    sw.classList.remove("open");
    runtime.S.adminAuthed = true;
    runtime.S.stack = [];
    runtime.S.route = t.dataset.adm;
    closeAll();
    render("fade");
    syncSwitcher();
    return;
  }
  if (t.dataset.restart) {
    const keep = runtime.S.mode;
    runtime.S = fresh();
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
  if (e.target.closest("input,textarea,select,[contenteditable]")) return;
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[role=button]")) {
    e.preventDefault();
    e.target.click();
    return;
  }
  if (e.key === "Escape") {
    if (popEl.classList.contains("on")) closePop();else if (overlay.classList.contains("on")) closeOverlay();else back();
  }
  if (runtime.S.route === "discover" && !overlay.classList.contains("on") && !admin()) {
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
