import { pickSide, setMode, sw, syncSwitcher } from "../dev/modeController.js";
import { closeAll, closeOverlay, closePop, popEl } from "../components/ui/overlays.js";
import { runtime } from "../context/runtime.js";
import { back, go, tab } from "./routes.js";
import { render } from "./render.js";
import { toast } from "../components/ui/toast.js";
import { brand, fresh, side } from "../context/session.js";
import { fillDeck, swipe } from "../features/discovery/deckController.js";
import { openDetail } from "../components/details/detailsController.js";
import { isWide, reduced } from "../config/breakpoints.js";
import { send } from "../features/chats/chatController.js";
import { openProfileCard } from "../features/profile/profileController.js";
import { openFilters, refreshFilterGroup } from "../features/discovery/filterController.js";
import { acctMenu } from "../components/account/accountController.js";
import { campPicker } from "../features/discovery/CampaignPicker.js";

export function onClick(e) {
  document.querySelectorAll('details.multi-dropdown[open]').forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.open = false;
  });
  if (sw.classList.contains("open") && !e.target.closest("#modeSw")) sw.classList.remove("open");
  if (popEl.classList.contains("on") && !e.target.closest("#pop") && !e.target.closest('[data-act="acctmenu"]')) closePop();
  const el = e.target.closest("[data-act],[data-tab]");
  if (!el) return;
  if (el.dataset.act === "close" && el.classList.contains("sheetwrap") && e.target !== el) return;
  if (el.dataset.tab) {
    if (!runtime.S.authed) return;
    return tab(el.dataset.tab);
  }
  const [a, v] = el.dataset.act.split(/:(.*)/s);
  switch (a) {
    case "go":
      if (v === "code" && runtime.S.route === "signup") {
        const password = runtime.root.querySelector('input[type="password"]');
        if (password && !password.checkValidity()) {
          password.focus();
          return toast("Use 8+ characters with uppercase, lowercase, a number and a special character.");
        }
      }
      return go(v);
    case "campaignpreview":
      runtime.S.previewCampaignId = v;
      return go("cardpreview");
    case "tab":
      return tab(v);
    case "back":
      return back();
    case "close":
      return closeAll();
    case "side":
      return pickSide(v);
    case "login":
      runtime.S.authed = true;
      runtime.S.side = runtime.S.pickSide;
      runtime.S.subscribed = true;
      runtime.S.stack = [];
      runtime.S.route = "discover";
      render("fade");
      return toast("Welcome back.");
    case "logout":
      closeAll();
      runtime.S = fresh();
      render("fade");
      return syncSwitcher();
    case "finish":
      runtime.S.authed = true;
      runtime.S.side = runtime.S.pickSide;
      runtime.S.stack = [];
      runtime.S.route = "subscribe";
      return render("fwd");
    case "pay":
      runtime.S.subscribed = true;
      runtime.S.stack = [];
      runtime.S.route = "discover";
      render("fade");
      return toast("You're in. One month, starts now.");
    case "switch":
      return setMode(brand() ? "creator" : "brand");
    case "swipe":
      return swipe(v);
    case "dswipe":
      closeOverlay();
      return setTimeout(() => swipe(v), 200);
    case "peek":
      {
        const f = runtime.root.querySelector(".deck .cd.front");
        if (f) openDetail(f.dataset.id, true);
        return;
      }
    case "detail":
      closePop();
      return openDetail(v, false);
    case "chat":
      if (!runtime.S.readChats.includes(v)) runtime.S.readChats.push(v);
      closeAll();
      runtime.S.openChat = v;
      if (isWide()) {
        if (runtime.S.route !== "chats") {
          runtime.S.stack = [];
          runtime.S.route = "chats";
          return render("tabR");
        }
        return render("none");
      }
      return go("convo", v);
    case "send":
      return send(el.dataset.v);
    case "restart":
      runtime.S.idx[side()] = 0;
      {
        const d = runtime.root.querySelector(".deck");
        if (d) fillDeck(d, true);
      }
      return;
    case "viewcard":
      return openProfileCard();
    case "profiledetails":
      return openDetail(v, false);
    case "saved":
      back();
      return toast("Changes saved");
    case "published":
      runtime.S.stack = [];
      runtime.S.route = "campaigns";
      render("fade");
      return toast("Campaign is live");
    case "status":
      el.parentElement.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === el));
      return toast("Status: " + el.textContent.trim());
    case "filters":
      return openFilters(v);
    case "applyfilters":
      {
        if (runtime.busy) return;
        runtime.S.filters[side()] = {
          city: [...runtime.filterDraft.city],
          category: [...runtime.filterDraft.category]
        };
        runtime.S.idx[side()] = 0;
        closeOverlay();
        render('none');
        return;
      }
    case "chatfilter":
      runtime.S.chatFilter[side()] = v;
      return render('none');
    case "clearfilters":
      runtime.filterDraft = {
        city: [],
        category: []
      };
      refreshFilterGroup('city');
      refreshFilterGroup('category');
      return;
    case "chip":
      el.classList.toggle("on");
      return;
    case "toast":
      return toast(v);
    case "acctmenu":
      return popEl.classList.contains("on") ? closePop() : acctMenu();
    case "camppick":
      return campPicker();
    case "setcamp":
      runtime.S.camp = v;
      closeOverlay();
      runtime.root.querySelectorAll(".camp-pick").forEach(c => c.firstChild.textContent = v);
      return toast("Interest now goes to " + v);
    case "gal":
      {
        const tr = el.closest(".mgal").querySelector(".mgal-track");
        tr.scrollBy({
          left: tr.clientWidth * +v,
          behavior: reduced ? "auto" : "smooth"
        });
        return;
      }
    case "adminlogin":
      runtime.S.adminAuthed = true;
      runtime.S.stack = [];
      runtime.S.route = "a_users";
      render("fade");
      return toast("Signed in to the admin console");
    case "adm":
      runtime.S.stack.push({
        r: runtime.S.route
      });
      runtime.S.route = v;
      closeAll();
      return render(isWide() ? "fade" : "fwd");
  }
}
