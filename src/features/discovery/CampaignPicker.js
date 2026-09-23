import { openSheet } from "../../components/ui/overlays.js";
import { BRAND_CAMPS } from "../../mocks/campaigns.js";
import { runtime } from "../../context/runtime.js";

export function campPicker() {
  openSheet(`<div class="ttl">Finding creators for</div><span class="sub">Interest you send goes to this campaign.</span>
    <div class="pick-list">${BRAND_CAMPS.map(c => `<div class="row${c === runtime.S.camp ? " sel" : ""}" data-act="setcamp:${c}"><div class="tx"><b>${c}</b>
      <small>${c === runtime.S.camp ? "Selected" : "Tap to switch"}</small></div>${c === runtime.S.camp ? '<span class="meta">✓</span>' : ""}</div>`).join("")}</div>`);
}
