import { brand, side } from "../../context/session.js";
import { LABEL, TABS_B, TABS_C, TAB_OF } from "../../config/navigationItems.js";
import { runtime } from "../../context/runtime.js";
import { IC } from "../ui/icons.js";
import { isWide } from "../../config/breakpoints.js";

export function chrome() {
  const tabs = brand() ? TABS_B : TABS_C,
    on = TAB_OF[runtime.S.route];
  const nav = runtime.root.querySelector(".side .nav");
  if (nav) nav.innerHTML = tabs.map(t => `<span class="${t === on ? "on" : ""}" data-tab="${t}">${IC[t]}${LABEL[t]}</span>`).join("");
  let tb = runtime.root.querySelector(".tabs");
  if (!tb && !isWide() && runtime.S.authed && runtime.S.route !== "convo") {
    tb = document.createElement("nav");
    tb.className = "tabs";
    tb.setAttribute("aria-label", "Main navigation");
    runtime.root.appendChild(tb);
  }
  if (tb) tb.innerHTML = tabs.map(t => `<div class="${t === on ? "on" : ""}" data-tab="${t}">${IC[t]}${LABEL[t]}</div>`).join("");
  runtime.root.querySelectorAll(".topbar .mode, .top .mode").forEach(el => {
    el.dataset.act = "switch";
    el.innerHTML = `<span class="d"></span>${isWide() ? side() + " mode" : brand() ? "Brand" : "Creator"}`;
  });
  const header = runtime.root.querySelector(isWide() ? '.topbar' : '.top');
  if (header && !header.querySelector('.ava')) {
    const avatar = document.createElement('button');
    avatar.type = 'button';
    avatar.className = 'ava';
    header.appendChild(avatar);
  }
  runtime.root.querySelectorAll(".topbar .ava, .top .ava").forEach(el => {
    el.dataset.act = "acctmenu";
    el.setAttribute("aria-label", "Account menu");
    el.textContent = brand() ? "C" : "A";
  });
  runtime.root.querySelectorAll(".side-links span").forEach(el => {
    const t = el.textContent.trim().toLowerCase();
    if (t === "billing") el.dataset.act = "go:billing";
    if (t === "support") el.dataset.act = "go:help";
  });
  const bk = runtime.root.querySelector(".top .bk");
  if (bk) bk.dataset.act = "back";
}
