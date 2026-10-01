import { brand, side } from "../../context/session.js";
import { LABEL, TABS_B, TABS_C, TAB_OF } from "../../config/navigationItems.js";
import { runtime } from "../../context/runtime.js";
import { IC } from "../ui/icons.js";
import { isWide } from "../../config/breakpoints.js";

export function chrome() {
  const logo=runtime.root.querySelector('.side .logo');
  if(logo){logo.classList.add('mandi-sidebar-logo');logo.innerHTML='<svg class="mandi-mark" viewBox="-2 -2 114 104" aria-hidden="true"><rect x="0" y="30" width="22" height="70" fill="var(--side)"/><g fill="var(--side)"><rect x="-1.5" y="7.25" width="25" height="7.5" rx=".8" transform="rotate(45 11 11)"/><rect x="-1.5" y="7.25" width="25" height="7.5" rx=".8" transform="rotate(-45 11 11)"/></g><polygon fill="currentColor" points="30,100 30,0 54,0 70,44 86,0 110,0 110,100 88,100 88,46 76,80 64,80 52,46 52,100"/></svg><span class="mandi-wordmark">INFLUENCER<br><b>MANDI</b></span>';logo.setAttribute('aria-label','Influencer Mandi');}

  const tagline = runtime.root.querySelector('.side .tagline');
  if (tagline) tagline.innerHTML = '<span class="sidebar-creators-tagline">Creators. Brands. Ideas.</span>';
  const tabs = brand() ? TABS_B : TABS_C,
    on = TAB_OF[runtime.S.route];
  const nav = runtime.root.querySelector(".side .nav");
  const sidebarOn = ['billing', 'subscribe', 'refunds'].includes(runtime.S.route) ? 'billing'
    : ['help', 'contact'].includes(runtime.S.route) ? 'help' : on;
  if (nav) nav.innerHTML = tabs.map(t => `<span class="${t === sidebarOn ? "on" : ""}" data-tab="${t}"${t === sidebarOn ? ' aria-current="page"' : ''}>${IC[t]}${LABEL[t]}</span>`).join("");
  if (nav) {
    nav.insertAdjacentHTML('beforeend', `<span class="${sidebarOn === 'billing' ? 'on' : ''}" data-act="go:billing"${sidebarOn === 'billing' ? ' aria-current="page"' : ''}>${IC.campaigns}Billing</span><span class="${sidebarOn === 'help' ? 'on' : ''}" data-act="go:help"${sidebarOn === 'help' ? ' aria-current="page"' : ''}>${IC.chats}Support</span>`);
    runtime.root.querySelector('.side-links')?.remove();
  }
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
