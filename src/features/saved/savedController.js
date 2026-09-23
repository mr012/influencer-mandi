import { runtime } from "../../context/runtime.js";
import { brand, side } from "../../context/session.js";
import { byId } from "../../mocks/mockApi.js";
import { fillRows } from "../../components/ui/dom.js";
import { isWide } from "../../config/breakpoints.js";

export function fill_liked() {
  if (brand()) {
    const title = runtime.root.querySelector('.head h2,.top .t');
    if (title) title.textContent = 'Liked';
    if (!isWide()) {
      runtime.root.querySelector('.top .bk')?.remove();
      const top = runtime.root.querySelector('.top');
      if (top && !top.querySelector('[data-act="acctmenu"]')) {
        const account = document.createElement('button');
        account.type = 'button';
        account.className = 'ava';
        account.dataset.act = 'acctmenu';
        account.setAttribute('aria-label', 'Account menu');
        account.textContent = 'C';
        top.appendChild(account);
      }
    }
  }
  const ids = runtime.S.liked[side()];
  const html = ids.map(id => {
    const x = byId(id),
      matched = runtime.S.matches[side()].includes(id);
    return brand() ? `<div class="row" data-act="detail:${id}"><div class="av">${x.name[0]}</div><div class="tx"><b>${x.name}</b>
          <small>${x.followers} · ${x.tags[0]} · ${x.loc}</small><span class="ctag">${matched ? "Matched" : "Waiting"}</span></div></div>` : `<div class="row" data-act="detail:${id}"><div class="tx"><b>${x.title}</b>
          <small>${x.brand} · ${x.budget}</small><span class="ctag">${matched ? "Matched" : "Waiting"}</span></div></div>`;
  }).join("");
  fillRows(runtime.root.querySelector(".workspace") || runtime.root.querySelector(".body"), html, `<div class="ph-empty"><span class="mk">nothing yet.</span><p>Anything you mark interested lands here.</p></div>`);
}
