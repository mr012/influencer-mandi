import { byId } from "../../mocks/mockApi.js";
import { brand, side } from "../../context/session.js";
import { runtime } from "../../context/runtime.js";
import { esc, fillRows } from "../../components/ui/dom.js";
import { now } from "../../utils/formatDate.js";
import { replyFor } from "../../mocks/conversations.js";
import { isWide } from "../../config/breakpoints.js";
import { FILL } from "../../app/screenControllers.js";

export function paintThread(scope, id) {
  if (!scope) return;
  const th = scope.querySelector(".thread");
  if (!th) return;
  const x = byId(id);
  if (!x) {
    th.innerHTML = `<div class="ph-empty"><span class="mk">pick a chat.</span></div>`;
    return;
  }
  if (scope.classList.contains("conversation")) {
    const head = scope.querySelector(".row .tx b");
    if (head) head.innerHTML = `${brand() ? x.name : x.brand} <span class="tick">✓</span>`;
    const small = scope.querySelector(".row .tx small");
    if (small) small.textContent = "Re: " + (brand() ? runtime.S.camp : x.title);
  }
  const msgs = runtime.S.threads[id] || [];
  th.innerHTML = `<span class="chat-date">Matched · ${brand() ? runtime.S.camp : x.title}</span>` + msgs.map((m, k) => `<div class="bub ${m.me ? "me" : "them"}${m.fresh ? " pop" : ""}">${esc(m.t)}<small>${m.at}</small></div>`).join("");
  msgs.forEach(m => delete m.fresh);
  th.scrollTop = th.scrollHeight;
  const comp = scope.querySelector(".comp");
  if (comp) {
    const box = comp.querySelector(".in");
    if (box && box.tagName !== "INPUT") {
      const inp = document.createElement("input");
      inp.className = box.className;
      inp.placeholder = "Write a message…";
      inp.addEventListener("keydown", e => {
        if (e.key === "Enter") send(id, inp);
      });
      box.replaceWith(inp);
    }
    const btn = comp.querySelector(".btn");
    if (btn) {
      btn.dataset.act = "send";
      btn.dataset.v = id;
    }
  }
}
export function send(id, inp) {
  inp = inp || runtime.root.querySelector(".comp input.in");
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) return;
  (runtime.S.threads[id] = runtime.S.threads[id] || []).push({
    me: true,
    t: v,
    at: now(),
    fresh: true
  });
  inp.value = "";
  repaintThread(id);
  setTimeout(() => {
    (runtime.S.threads[id] = runtime.S.threads[id] || []).push({
      me: false,
      t: replyFor(v),
      at: now(),
      fresh: true
    });
    if (["chats", "convo"].includes(runtime.S.route)) repaintThread(id);
  }, 1100);
}
export function repaintThread(id) {
  const scope = isWide() ? runtime.root.querySelector(".conversation") : runtime.root;
  paintThread(scope, id);
  if (isWide()) FILL.chats.call(null);
  const inp = runtime.root.querySelector(".comp input.in");
  if (inp && !("ontouchstart" in window)) inp.focus();
}
export function chatMatches(id) {
  const f = runtime.S.chatFilter[side()] || 'All';
  if (f === 'All') return true;
  if (f === 'Unread') return !runtime.S.readChats.includes(id);
  const x = byId(id);
  const campaign = x.title || (/Food|Baking/.test(x.cat) ? 'Monsoon menu' : /Fashion/.test(x.cat) ? 'Festive edit' : 'Airdopes');
  return campaign.toLowerCase().includes(f.toLowerCase());
}
export function fill_chats() {
  const list = runtime.S.matches[side()].filter(id => chatMatches(id));
  if (!runtime.S.openChat || !list.includes(runtime.S.openChat)) runtime.S.openChat = list[0] || null;
  const row = id => {
    const x = byId(id),
      th = runtime.S.threads[id] || [],
      last = th[th.length - 1];
    const name = brand() ? x.name : x.brand,
      sub = brand() ? `${x.followers} · ${x.tags[0]}` : x.title;
    const tagCamp = brand() ? id === "u1" ? "Monsoon menu" : "Festive edit" : "";
    return `<div class="row${isWide() && id === runtime.S.openChat ? " sel" : ""}" data-act="chat:${id}"><div class="av">${name[0]}</div>
       <div class="tx"><b>${name}</b><small>${esc(last ? last.t : sub).slice(0, 46)}</small>
       ${tagCamp ? `<span class="ctag">${tagCamp}</span>` : ""}</div><span class="meta">${last ? last.at : ""}</span></div>`;
  };
  fillRows(isWide() ? runtime.root.querySelector(".chat-list") : runtime.root.querySelector(".body"), list.map(row).join(""), `<div class="ph-empty"><span class="mk">no chats here.</span><p>Try another filter, or discover more matches.</p></div>`);
  if (isWide()) paintThread(runtime.root.querySelector(".conversation"), runtime.S.openChat);
}
export function fill_convo() {
  const id = runtime.S.ctx || runtime.S.openChat;
  const x = byId(id);
  if (!x) return;
  const t = runtime.root.querySelector(".top .t");
  if (t) t.textContent = brand() ? x.name : x.brand;
  const sup = runtime.root.querySelector(".sup");
  if (sup) sup.textContent = "Re: " + (brand() ? runtime.S.camp : x.title);
  paintThread(runtime.root, id);
}
export function fill_matches() {
  const html = runtime.S.matches[side()].map(id => {
    const x = byId(id);
    const n = brand() ? x.name : x.brand;
    return `<div class="row" data-act="chat:${id}"><div class="av">${n[0]}</div><div class="tx"><b>${n}</b>
       <small>${brand() ? x.tags[0] : x.title}</small></div><span class="meta">Open</span></div>`;
  }).join("");
  fillRows(runtime.root.querySelector(".workspace") || runtime.root.querySelector(".body"), html);
}
