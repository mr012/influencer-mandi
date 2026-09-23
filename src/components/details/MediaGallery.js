import { PHOTO, PLAY } from "../ui/icons.js";

export function gallery(media) {
  return `<div class="mgal"><span class="marrow prev" data-act="gal:-1" aria-label="Previous">‹</span><span class="marrow next" data-act="gal:1" aria-label="Next">›</span>
    <div class="mgal-track">${media.map(m => `<div class="mslide${m.type === "Reel" ? " vid" : ""}" data-type="${m.type}" style="background:linear-gradient(152deg,${m.hue},#101012 66%)">
      ${m.type === "Reel" ? PLAY : PHOTO}<span class="mcap">${m.cap}</span></div>`).join("")}</div>
    <span class="mcount">1 / ${media.length}</span>
    <div class="mdots">${media.map((_, j) => `<i class="${j ? "" : "on"}"></i>`).join("")}</div></div>
    <p class="mswipe">${media.length > 1 ? "ontouchstart" in window ? "Swipe or tap the arrows" : "Use the arrows to see more" : "&nbsp;"}</p>`;
}
export function bindGallery(scope) {
  const tr = scope.querySelector(".mgal-track");
  if (!tr) return;
  const upd = () => {
    const k = Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth)),
      n = tr.children.length;
    scope.querySelectorAll(".mdots i").forEach((d, j) => d.classList.toggle("on", j === k));
    const c = scope.querySelector(".mcount");
    if (c) c.textContent = `${k + 1} / ${n}`;
    const ty = scope.querySelector(".mtype");
    const sl = tr.children[k];
    if (ty && sl) ty.textContent = sl.dataset.type;
    const p = scope.querySelector(".marrow.prev"),
      nx = scope.querySelector(".marrow.next");
    if (p) p.classList.toggle("off", k <= 0);
    if (nx) nx.classList.toggle("off", k >= n - 1);
  };
  tr.addEventListener("scroll", upd, {
    passive: true
  });
  upd();
  if (!("ontouchstart" in window)) tr.style.overflowX = "hidden";
}
