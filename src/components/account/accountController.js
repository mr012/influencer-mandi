import { T } from "../../app/templateMarkup.js";
import { isWide } from "../../config/breakpoints.js";
import { brand } from "../../context/session.js";
import { openPop, openSheet } from "../ui/overlays.js";

export function acctMenu() {
  const tmp = document.createElement("div");
  tmp.innerHTML = T["Account menu"][isWide() ? "d" : "m"];
  const m = tmp.querySelector(isWide() ? ".acct-menu" : ".acct-list");
  if (!m) return;
  if (brand()) {
    const b = m.querySelector(".acct-head .tx b"),
      sm = m.querySelector(".acct-head .tx small"),
      av = m.querySelector(".acct-head .av");
    if (b) b.textContent = "Chai Point";
    if (sm) sm.textContent = "team@chaipoint.in";
    if (av) av.textContent = "C";
  }
  const routes = {
    "account settings": "account",
    "billing": "billing",
    "help center": "help",
    "support policy": "terms"
  };
  const logout = document.createElement("div");
  logout.className = "acct-item logout-item";
  logout.dataset.act = "logout";
  logout.innerHTML = '<div class="tx"><b>Log out</b></div><i aria-hidden="true">›</i>';
  m.appendChild(logout);
  m.querySelectorAll(".acct-item").forEach(it => {
    const k = it.querySelector("b").textContent.trim().toLowerCase();
    if (routes[k]) it.dataset.act = "go:" + routes[k];
  });
  if (isWide()) openPop(m.outerHTML);else openSheet(m.outerHTML);
}
