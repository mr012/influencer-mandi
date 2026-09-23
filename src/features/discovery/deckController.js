import { discoveryItems } from "./filterController.js";
import { runtime } from "../../context/runtime.js";
import { brand, side } from "../../context/session.js";
import { campCard, creaCard } from "../../components/cards/cardMarkup.js";
import { imp } from "../../components/ui/dom.js";
import { openDetail } from "../../components/details/detailsController.js";
import { openLocked } from "../billing/subscriptionController.js";
import { reduced } from "../../config/breakpoints.js";
import { now } from "../../utils/formatDate.js";
import { toast } from "../../components/ui/toast.js";

const pinnedCardProperties = ["position", "inset", "left", "top", "width", "height", "z-index"];

function pinCardToViewport(card) {
  if (!card || card.dataset.viewportPinned === "true") return;
  const rect = card.getBoundingClientRect();
  card.dataset.viewportPinned = "true";
  imp(card, "position", "fixed");
  imp(card, "inset", "auto");
  imp(card, "left", `${rect.left}px`);
  imp(card, "top", `${rect.top}px`);
  imp(card, "width", `${rect.width}px`);
  imp(card, "height", `${rect.height}px`);
  imp(card, "z-index", "20");
}

function unpinCardFromViewport(card) {
  if (!card) return;
  delete card.dataset.viewportPinned;
  pinnedCardProperties.forEach(property => card.style.removeProperty(property));
}

export function fillDeck(deck, fadeNewBack) {
  const items = discoveryItems(),
    i = runtime.S.idx[side()];
  const layers = ["back2", "back", "front"];
  if (i >= items.length) {
    deck.innerHTML = `<div class="ph-empty rise-fade" style="height:100%"><span class="mk">${items.length ? "that's everyone." : "no matches."}</span>
      <p>${items.length ? 'You have viewed every result.' : 'Try changing or clearing your filters.'}</p>
      <span class="btn ghost" data-act="restart" style="margin-top:6px">Start over</span></div>`;
    return;
  }
  deck.innerHTML = layers.map((cls, k) => {
    const it = items[i + (layers.length - 1 - k)];
    if (!it) return "";
    return brand() ? creaCard(it, cls) : campCard(it, cls);
  }).join("");
  if (fadeNewBack) {
    const last = deck.querySelector(".cd");
    if (last && !last.classList.contains("front")) last.classList.add("arrive");
  }
  bindDeck(deck);
}
export function bindDeck(deck) {
  const front = deck.querySelector(".cd.front");
  if (!front) return;
  front.insertAdjacentHTML("beforeend", '<span class="stamp no">Pass</span><span class="stamp yes">Like</span>');
  const no = front.querySelector(".stamp.no"),
    yes = front.querySelector(".stamp.yes");
  front.tabIndex = 0;
  front.setAttribute('role', 'button');
  front.setAttribute('aria-label', 'View details');
  let x0 = null,
    y0 = 0,
    dx = 0,
    moved = false,
    cancelled = false;
  function resetDrag() {
    front.classList.remove('dragging');
    front.style.removeProperty('transform');
    unpinCardFromViewport(front);
    no.style.opacity = 0;
    yes.style.opacity = 0;
    const next = deck.querySelector('.cd.back');
    if (next) next.style.removeProperty('transform');
  }
  front.addEventListener('pointerdown', e => {
    if (runtime.busy || e.isPrimary === false || e.pointerType === 'mouse' && e.button !== 0) return;
    x0 = e.clientX;
    y0 = e.clientY;
    dx = 0;
    moved = false;
    cancelled = false;
    pinCardToViewport(front);
    front.classList.add('dragging');
    try {
      front.setPointerCapture(e.pointerId);
    } catch (_) {}
  });
  front.addEventListener('pointermove', e => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    const dy = e.clientY - y0;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) moved = true;
    if (!moved || Math.abs(dy) > Math.abs(dx)) return;
    const t = Math.min(1, Math.abs(dx) / 110);
    imp(front, 'transform', `translate3d(${dx}px,${Math.abs(dx) * .05}px,0) rotate(${dx / 22}deg)`);
    no.style.opacity = dx < 0 ? t : 0;
    yes.style.opacity = dx > 0 ? t : 0;
    const next = deck.querySelector('.cd.back');
    if (next) {
      const k = Math.min(1, Math.abs(dx) / 160);
      imp(next, 'transform', `translateY(${14 - 14 * k}px) scale(${.94 + .06 * k})`);
    }
  });
  front.addEventListener('pointerup', e => {
    if (x0 === null) return;
    x0 = null;
    front.classList.remove('dragging');
    const dy = e.clientY - y0;
    if (moved && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 100) {
      swipe(dx > 0 ? 'right' : 'left');
      return;
    }
    resetDrag();
  });
  front.addEventListener('pointercancel', () => {
    x0 = null;
    cancelled = true;
    moved = true;
    resetDrag();
  });
  front.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if (runtime.busy || cancelled || moved && e.detail !== 0) return;
    openDetail(front.dataset.id, true);
  });
}
export function swipe(dir) {
  const deck = runtime.root && runtime.root.querySelector(".deck"),
    front = deck && deck.querySelector(".cd.front");
  if (!runtime.S.subscribed) {
    if (front) {
      front.style.removeProperty("transform");
      unpinCardFromViewport(front);
      front.querySelectorAll(".stamp").forEach(s => s.style.opacity = 0);
    }
    const b = deck && deck.querySelector(".cd.back");
    if (b) b.style.removeProperty("transform");
    openLocked();
    return;
  }
  if (runtime.busy || !front) return;
  runtime.busy = true;
  const w = Math.max(window.innerWidth, 700);
  pinCardToViewport(front);
  front.classList.add("flying");
  imp(front, "transform", `translate3d(${dir === "right" ? w : -w}px,90px,0) rotate(${dir === "right" ? 30 : -30}deg)`);
  imp(front, "opacity", "0");
  const st = front.querySelector(dir === "right" ? ".stamp.yes" : ".stamp.no");
  if (st) st.style.opacity = 1;
  const b = deck.querySelector(".cd.back"),
    b2 = deck.querySelector(".cd.back2");
  if (b) {
    b.classList.add("rising");
    imp(b, "transform", "none");
    imp(b, "filter", "none");
    imp(b, "opacity", "1");
  }
  if (b2) {
    b2.classList.add("rising");
    imp(b2, "transform", "translateY(14px) scale(.94)");
    imp(b2, "filter", "brightness(.72)");
  }
  setTimeout(() => {
    runtime.busy = false;
    commit(dir);
  }, reduced ? 0 : 340);
}
export function commit(dir) {
  const items = discoveryItems(),
    it = items[runtime.S.idx[side()]];
  if (!it) return;
  if (dir === "right") {
    const L = runtime.S.liked[side()];
    if (!L.includes(it.id)) L.unshift(it.id);
    runtime.S.likesSince[side()]++;
    if (runtime.S.likesSince[side()] % 2 === 1 && !runtime.S.matches[side()].includes(it.id)) {
      runtime.S.matches[side()].unshift(it.id);
      runtime.S.threads[it.id] = [{
        me: false,
        t: brand() ? `Hi! Thanks for the interest — happy to talk about ${runtime.S.camp}.` : "Hey! We'd love to have you on this one. Got a minute?",
        at: now()
      }];
      toast(`It's a match — ${brand() ? it.name : it.brand}. Say hi in Chats.`);
    }
  }
  runtime.S.idx[side()]++;
  const deck = runtime.root.querySelector(".deck");
  if (deck) fillDeck(deck, true);
}
export function fill_discover() {
  const deck = runtime.root.querySelector(".deck");
  if (!deck) return;
  deck.dataset.layers = "3";
  fillDeck(deck, false);
  runtime.root.querySelectorAll(".dact.pass,.acts .pass").forEach(el => el.dataset.act = "swipe:left");
  runtime.root.querySelectorAll(".dact.like,.acts .like").forEach(el => el.dataset.act = "swipe:right");
  runtime.root.querySelectorAll(".dacts > .dact:not(.pass):not(.like),.acts > b:not(.pass):not(.like)").forEach(el => el.dataset.act = "peek");
  runtime.root.querySelectorAll(".camp-pick").forEach(el => {
    el.dataset.act = "camppick";
    el.firstChild.textContent = runtime.S.camp;
  });
}
