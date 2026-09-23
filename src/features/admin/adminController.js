import { runtime } from "../../context/runtime.js";
import { ADMIN_NAV } from "../../config/navigationItems.js";
import { isWide } from "../../config/breakpoints.js";
import { IC } from "../../components/ui/icons.js";

export function adminChrome() {
  runtime.root.querySelectorAll(".side .nav span, .nav span").forEach(el => {
    const k = el.textContent.trim().toLowerCase();
    const r = ADMIN_NAV[k];
    if (r) {
      el.dataset.act = "adm:" + r;
      el.classList.toggle("on", r === runtime.S.route);
    }
  });
  if (!isWide() && runtime.S.route !== 'a_login') {
    const items = [
      ['a_users', 'Users', IC.profile],
      ['a_verify', 'Verification', IC.liked],
      ['a_mod', 'Moderation', IC.campaigns],
      ['a_subs', 'Subscriptions', IC.discover],
      ['a_reports', 'Reports', IC.chats]
    ];
    let tabs = runtime.root.querySelector('.tabs');
    if (!tabs) {
      tabs = document.createElement('nav');
      tabs.className = 'tabs admin-tabs';
      tabs.setAttribute('aria-label', 'Admin navigation');
      runtime.root.appendChild(tabs);
    }
    tabs.innerHTML = items.map(([route, label, icon]) => `<div class="${route === runtime.S.route ? 'on' : ''}" data-act="adm:${route}">${icon}${label}</div>`).join('');
  }
  const bk = runtime.root.querySelector(".top .bk");
  if (bk) bk.dataset.act = "back";
}
export function fill_a_verify() {
  runtime.root.querySelectorAll(".row").forEach(r => {
    r.dataset.act = "toast:Opened for review";
  });
}
