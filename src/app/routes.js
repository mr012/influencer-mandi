import { runtime } from "../context/runtime.js";
import { closeAll, overlay, popEl } from "../components/ui/overlays.js";
import { render } from "./render.js";
import { admin, brand } from "../context/session.js";
import { TAB_ORDER } from "../config/navigationItems.js";
import { MAP } from "../config/routes.js";

export function go(r, ctx) {
  runtime.S.stack.push({
    r: runtime.S.route,
    ctx: runtime.S.ctx
  });
  runtime.S.route = r;
  runtime.S.ctx = ctx === undefined ? null : ctx;
  closeAll();
  render("fwd");
}
export function back() {
  if (overlay.classList.contains("on") || popEl.classList.contains("on")) {
    closeAll();
    return;
  }
  const p = runtime.S.stack.pop() || {
    r: admin() ? "a_users" : runtime.S.authed ? "discover" : "pick",
    ctx: null
  };
  runtime.S.route = p.r;
  runtime.S.ctx = p.ctx;
  closeAll();
  render("back");
}
export function tab(r) {
  if (r === runtime.S.route) {
    closeAll();
    return;
  }
  const dir = TAB_ORDER(r) >= TAB_ORDER(runtime.S.route) ? "fwd" : "back";
  runtime.S.stack = [];
  runtime.S.route = r;
  runtime.S.ctx = null;
  closeAll();
  render(dir === "fwd" ? "tabR" : "tabL");
}
export function tplName() {
  const m = MAP[runtime.S.route];
  return typeof m === "string" ? m : m[brand() ? "b" : "c"];
}
