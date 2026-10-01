import { byId } from "../../mocks/mockApi.js";
import { brand, side } from "../../context/session.js";
import { runtime } from "../../context/runtime.js";
import { esc, fillRows } from "../../components/ui/dom.js";
import { now } from "../../utils/formatDate.js";
import { replyFor } from "../../mocks/conversations.js";
import { isWide } from "../../config/breakpoints.js";
import { FILL } from "../../app/screenControllers.js";
import { attachmentMarkup, setupAttachments } from './attachments.js';
import { setupMessageMenu, closeMessageMenu } from './messageMenu.js';
import { updateThread } from './chatMotion.js';
import { accountState, restricted, chatRestriction, statusLabel, resumeAccount } from '../account/accountLifecycle.js';



export function paintThread(scope, id) {
  if (!scope) return;
  const th = scope.querySelector(".thread");
  if (!th) return;
  const x = byId(id);
  if (!x) {
    delete th.dataset.signature;
    delete th.dataset.chatId;
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
  closeMessageMenu();
  const threadChanged = updateThread(th, id, msgs, `<span class="chat-date">Matched · ${brand() ? runtime.S.camp : x.title}</span>` + msgs.map((m, k) => `<div data-message-index="${k}" class="bub ${m.me ? "me" : "them"}${m.deleted ? " message-deleted" : ""}">${attachmentMarkup(m.attachments)}${esc(m.t)}<small>${m.at}</small></div>`).join(""));
  if (threadChanged) setupMessageMenu(th, msgs, () => repaintThread(id));
  msgs.forEach(m => delete m.fresh);
  const comp = scope.querySelector(".comp");
  if (comp) {
    const box = comp.querySelector(".in");
    if (box && box.tagName !== "INPUT") {
      const inp = document.createElement("input");
      inp.className = box.className;
      inp.placeholder = "Write a message…";
      inp.addEventListener("keydown", e => {
        if (e.key === "Enter") send(comp.dataset.threadId, inp);
      });
      box.replaceWith(inp);
    }
    setupAttachments(comp, id);
    comp.paintAttachments();
    scope.querySelector('.chat-account-notice')?.remove();
    const restriction = chatRestriction(id) || (runtime.S.blockedChats?.includes(id) ? { status:'Blocked' } : null);
    comp.hidden = Boolean(restriction);
    if (restriction) {
      const banner = document.createElement('div'); banner.className = 'chat-account-notice';
      const heading = document.createElement('strong'); heading.textContent = restriction.status === 'Blocked' ? 'Account blocked' : statusLabel(restriction);
      const text = document.createElement('p');
      text.textContent = restricted(accountState()) ? 'Messaging is unavailable while your account is inactive. Your conversations remain here.' : restriction.deletionStatus === 'Pending' ? 'This account is pending deletion. Your conversation remains available for reporting.' : 'This account is temporarily paused. Your conversation will remain here, and you can continue chatting when they return.';
      banner.append(heading,text);
      if (accountState().status === 'Paused' && !['Pending','Under review'].includes(accountState().deletionStatus)) {
        const resume = document.createElement('button'); resume.textContent = 'Resume account'; resume.onclick = resumeAccount; banner.append(resume);
      }
      const report = document.createElement('button'); report.textContent = 'Report'; report.dataset.act = 'go:contact'; banner.append(report);
      const block = document.createElement('button'); block.textContent = 'Block'; block.onclick = () => { runtime.S.blockedChats ||= []; runtime.S.blockedChats.push(id); text.textContent = 'Account blocked. Messaging is unavailable.'; block.disabled = true; }; banner.append(block);
      comp.before(banner);
    }
    const btn = comp.querySelector(".btn");
    if (btn) {
      btn.dataset.act = "send";
      btn.dataset.v = id;
    }
  }
}
export function send(id, inp) {
  if (chatRestriction(id) || runtime.S.blockedChats?.includes(id)) return;
  inp = inp || runtime.root.querySelector(".comp input.in");
  if (!inp) return;
  const v = inp.value.trim();
  const comp = inp.closest('.comp');
  const attachments = comp.attachments || [];
  if (!v && !attachments.length) return;
  (runtime.S.threads[id] = runtime.S.threads[id] || []).push({
    me: true,
    t: v,
    attachments,
    sentAt: Date.now(),
    at: now(),
    fresh: true
  });
  inp.value = "";
  comp.attachments = [];
  const sentMessage = runtime.S.threads[id].at(-1);
  repaintThread(id);
  if (v) setTimeout(() => {
    if (sentMessage.deleted || chatRestriction(id) || runtime.S.blockedChats?.includes(id)) return;
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
  if (isWide()) FILL.chats.call(null);
  else if ((runtime.S.ctx || runtime.S.openChat) === id) paintThread(scope, id);
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
function chatSearchMatches(id) {
  const query = (runtime.S.chatSearch?.[side()] || '').trim().toLowerCase();
  if (!query) return true;
  const x = byId(id),
    messages = runtime.S.threads[id] || [],
    campaign = brand() ? id === 'u1' ? 'Monsoon menu' : 'Festive edit' : x.title;
  return [
    brand() ? x.name : x.brand,
    campaign,
    x.title,
    x.cat,
    ...(x.tags || []),
    ...messages.map(message => message.t)
  ].filter(Boolean).join(' ').toLowerCase().includes(query);
}
function ensureChatSearch() {
  const container = isWide() ? runtime.root.querySelector('.chat-list') : runtime.root.querySelector('.body');
  if (!container) return;
  runtime.S.chatSearch ||= { creator: '', brand: '' };
  let field = container.querySelector('.chat-search');
  if (!field) {
    field = isWide() ? container.querySelector('.fld') : null;
    if (!field) {
      field = document.createElement('div');
      field.innerHTML = '<span class="lbl">Search conversations</span>';
      container.prepend(field);
    }
    field.classList.add('fld', 'chat-search');
  }
  let input = field.querySelector('.chat-search-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'search';
    input.className = 'in chat-search-input';
    input.placeholder = 'Search name or campaign';
    input.setAttribute('aria-label', 'Search conversations');
    const placeholder = field.querySelector('.in');
    if (placeholder) placeholder.replaceWith(input); else field.appendChild(input);
    input.addEventListener('input', () => {
      runtime.S.chatSearch[side()] = input.value;
      fill_chats();
    });
  }
  if (input.value !== runtime.S.chatSearch[side()]) input.value = runtime.S.chatSearch[side()];
}
export function fill_chats() {
  ensureChatSearch();
  const list = runtime.S.matches[side()].filter(id => chatMatches(id) && chatSearchMatches(id));
  if (!runtime.S.openChat || !list.includes(runtime.S.openChat)) runtime.S.openChat = list[0] || null;
  const row = id => {
    const x = byId(id),
      th = runtime.S.threads[id] || [],
      last = th[th.length - 1];
    const name = brand() ? x.name : x.brand,
      sub = brand() ? `${x.followers} · ${x.tags[0]}` : x.title;
    const tagCamp = brand() ? id === "u1" ? "Monsoon menu" : "Festive edit" : "";
    return `<div class="row${isWide() && id === runtime.S.openChat ? " sel" : ""}" data-act="chat:${id}" role="button" tabindex="0"><div class="av">${name[0]}</div>
       <div class="tx"><b>${name}</b>${chatRestriction(id) ? `<span class="account-paused-badge">${statusLabel(chatRestriction(id))}</span>` : ''}<small>${esc(last ? last.t : sub).slice(0, 46)}</small>
       ${tagCamp ? `<span class="ctag">${tagCamp}</span>` : ""}</div><span class="meta">${last ? last.at : ""}</span></div>`;
  };
  const hasSearch = Boolean((runtime.S.chatSearch?.[side()] || '').trim());
  fillRows(isWide() ? runtime.root.querySelector(".chat-list") : runtime.root.querySelector(".body"), list.map(row).join(""), `<div class="ph-empty"><span class="mk">no chats here.</span><p>${hasSearch ? 'Try a different search.' : 'Try another filter, or discover more matches.'}</p></div>`);
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
    return `<div class="row" data-act="chat:${id}"><div class="av">${n[0]}</div><div class="tx"><b>${n}</b>${chatRestriction(id) ? `<span class="account-paused-badge">${statusLabel(chatRestriction(id))}</span>` : ''}
       <small>${brand() ? x.tags[0] : x.title}</small></div><span class="meta">Open</span></div>`;
  }).join("");
  fillRows(runtime.root.querySelector(".workspace") || runtime.root.querySelector(".body"), html);
}


