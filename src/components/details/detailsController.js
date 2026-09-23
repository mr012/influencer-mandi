import { byId } from "../../mocks/mockApi.js";
import { openSheet } from "../ui/overlays.js";
import { isWide } from "../../config/breakpoints.js";
import { gallery } from "./MediaGallery.js";

export const KV = (k, v) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`;
export function openDetail(id, fromDeck) {
  const x = byId(id);
  if (!x) return;
  const acts = fromDeck ? `<div class="dt-acts"><div class="btn ghost" data-act="dswipe:left">Pass</div><div class="btn solid" data-act="dswipe:right">Interested</div></div>` : `<div class="dt-acts"><div class="btn ghost" data-act="close">Close</div></div>`;
  const head = x.title ? `<div class="ttl">${x.title}</div><span class="sub">${x.brand} <span class="tick">✓</span> · ${x.cat}</span>` : `<div class="ttl">${x.name} <span class="tick">✓</span></div><span class="sub">${x.handle} · ${x.cat} · ${x.loc}</span>`;
  const facts = x.title ? `<p class="para">${x.brief}</p>${KV("Budget", x.budget)}${KV("Shoot window", x.window)}${KV("Apply by", x.apply)}${KV("Deliverables", x.del.join(", "))}${KV("Platforms", x.plat)}${KV("Location", x.loc)}${KV("Minimum audience", x.min)}${KV("Usage rights", x.rights)}` : `<p class="para">${x.bio}</p>${KV("Instagram", x.ig)}${KV("YouTube", x.yt)}${KV("Engagement", x.eng)}${KV("Reel", x.reel)}${KV("Post", x.post)}${KV("Content tags", x.tags.join(", "))}`;
  openSheet(`<div class="dt">${isWide() ? `<div class="dt-media">${gallery(x.media)}</div><div class="dt-info">${head}${facts}${acts}</div>` : `${head}${gallery(x.media)}${facts}${acts}`}</div>`, "detail");
}
