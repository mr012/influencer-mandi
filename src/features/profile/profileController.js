import { brand } from "../../context/session.js";
import { byId } from "../../mocks/mockApi.js";
import { openSheet } from "../../components/ui/overlays.js";
import { campCard, creaCard } from "../../components/cards/cardMarkup.js";
import { runtime } from "../../context/runtime.js";
import { isWide } from "../../config/breakpoints.js";

export function openProfileCard() {
  const id = brand() ? 'c1' : 'u1',
    x = byId(id);
  openSheet(`<div class="profile-card-preview">${brand() ? campCard(x, 'front') : creaCard(x, 'front')}</div><button class="btn solid profile-more" data-act="profiledetails:${id}">More details</button>`, 'profile-preview');
}
export function removeWaitingSection() {
  runtime.root.querySelectorAll('.lbl,.panel-label').forEach(label => {
    if (label.textContent.trim().toLowerCase() !== 'waiting on you') return;
    const section = label.closest('section');
    if (section) {
      section.remove();
      return;
    }
    let next = label.nextElementSibling;
    while (next && !next.matches('.lbl,.panel-label')) {
      const after = next.nextElementSibling;
      next.remove();
      next = after;
    }
    label.remove();
  });
}
export function fill_profile() {
  if (!isWide()) {
    const isBrand = brand();
    const subtitle = runtime.root.querySelector('.body > .row .tx small');
    if (subtitle) subtitle.textContent = isBrand
      ? 'Food & beverage · Mumbai · chaipoint.in'
      : '@ananyaeats · Food & cafe creator · Mumbai';

    const stats = runtime.root.querySelector('.body > .g2');
    if (stats) {
      stats.className = 'profile-detail-grid';
      stats.innerHTML = isBrand
        ? '<div class="box"><strong>2</strong><span>Live campaigns</span></div><div class="box"><strong>7</strong><span>Campaigns run</span></div><div class="box"><strong>24</strong><span>Creators worked with</span></div><div class="box"><strong>Aug 2026</strong><span>On Mandi since</span></div>'
        : '<div class="box"><strong>84.2K</strong><span>Audience</span></div><div class="box"><strong>5.1%</strong><span>Engagement</span></div><div class="box"><strong>IG · YT</strong><span>Platforms</span></div><div class="box"><strong>₹18K</strong><span>Per reel</span></div>';
      if (!isBrand) {
        const tags = document.createElement('div');
        tags.className = 'chips profile-tags';
        tags.innerHTML = '<span class="chip on">Food</span><span class="chip on">Cafe reviews</span><span class="chip on">Street food</span>';
        stats.after(tags);
      }
    }

    const weekLabel = [...runtime.root.querySelectorAll('.body > .lbl')].find(el => el.textContent.trim().toLowerCase() === 'your week');
    const week = weekLabel?.nextElementSibling;
    if (week) {
      week.className = 'profile-week-grid';
      week.innerHTML = isBrand
        ? '<div class="box"><strong>2</strong><span>Live</span></div><div class="box"><strong>19</strong><span>Interested</span></div><div class="box"><strong>3</strong><span>Matches</span></div>'
        : '<div class="box"><strong>3</strong><span>Matches</span></div><div class="box"><strong>5</strong><span>Interested</span></div><div class="box"><strong>6</strong><span>Liked</span></div>';
    }
  }
  runtime.root.querySelectorAll(".row").forEach(r => {
    const b = r.querySelector(".btn");
    if (!b) return;
    const t = b.textContent.trim().toLowerCase();
    b.dataset.act = t === "reply" ? "chat:" + (brand() ? "u1" : "c1") : t === "review" ? "go:likedby" : "detail:" + (brand() ? "u1" : "c1");
  });
}
