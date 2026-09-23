import { runtime } from "../context/runtime.js";
import { discoveryFilterBar } from "../features/discovery/filterController.js";
import { admin, brand, side } from "../context/session.js";
import { overlay } from "../components/ui/overlays.js";

export const label = el => el.textContent.replace(/\s+/g, " ").trim().toLowerCase();
export function tag(scope, match, act) {
  const found = [...scope.querySelectorAll(".btn,span,a,button,b,p,div,i")].filter(el => {
    const t = label(el);
    if (t.length > 48) return false;
    return typeof match === "string" ? t === match : match.test(t);
  });
  found.filter(el => !found.some(o => o !== el && el.contains(o))).forEach(el => {
    if (!el.dataset.act) el.dataset.act = act;
  });
}
export function wire(scope) {
  const r = runtime.S.route;
  scope.querySelectorAll('.bk').forEach(el => {
    el.dataset.act = 'back';
    el.setAttribute('aria-label', 'Back');
  });
  if (scope === runtime.root && r === 'discover') discoveryFilterBar(scope);
  if (scope === runtime.root && r === 'chats') {
    let crow = scope.querySelector('.crow');
    if (!crow) {
      crow = document.createElement('div');
      crow.className = 'crow';
      const container = scope.querySelector('.chat-list') || scope.querySelector('.body');
      const search = container.querySelector('.chat-search');
      if (search) search.after(crow); else container.prepend(crow);
    }
    const options = brand() ? ['All', 'Monsoon menu', 'Festive edit', 'Airdopes'] : ['All', 'Unread'];
    crow.innerHTML = options.map(v => `<span class="chip ${runtime.S.chatFilter[side()] === v ? 'on' : ''}" data-act="chatfilter:${v}">${v}</span>`).join('');
  }
  scope.querySelectorAll('[data-act], [data-tab]').forEach(el => {
    if (!/INPUT|TEXTAREA|BUTTON|SELECT/.test(el.tagName)) {
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
    }
  });
  if (admin()) {
    if (r === "a_login") tag(scope, "log in", "adminlogin");
    tag(scope, "review", "adm:a_verify");
    tag(scope, "billing", "adm:a_subs");
    tag(scope, /^verify( handle)?$/, "toast:Handle verified");
    tag(scope, "reject", "toast:Request rejected");
    tag(scope, "approve", "toast:Campaign approved");
    tag(scope, "request changes", "toast:Changes requested");
    tag(scope, "mark reviewed", "toast:Marked reviewed");
    tag(scope, "keep open", "toast:Kept open");
    return;
  }
  if (r === "pick") {
    scope.querySelectorAll(".role-choice").forEach(el => {
      el.dataset.act = "side:" + (el.classList.contains("brand-choice") ? "brand" : "creator");
      el.classList.toggle('chosen', el.dataset.act === 'side:' + runtime.S.pickSide);
    });
    scope.querySelectorAll(".body > .row").forEach(el => {
      if (/i[’']m a brand/i.test(el.textContent)) el.dataset.act = "side:brand";else if (/i[’']m a creator/i.test(el.textContent)) el.dataset.act = "side:creator";
      el.classList.toggle('sel', el.dataset.act === 'side:' + runtime.S.pickSide);
    });
    tag(scope, "continue", "go:signup");
    tag(scope, "log in", "go:login");
  }
  if (r === "signup") {
    const activeRole = side();
    scope.querySelectorAll('[data-signup-role-label]').forEach(roleLabel => {
      roleLabel.textContent = activeRole === 'brand' ? 'Brand' : 'Creator';
    });
    scope.querySelectorAll('[data-signup-switch]').forEach(roleSwitch => {
      const roleName = activeRole === 'brand' ? 'Brand' : 'Creator';
      roleSwitch.textContent = `Not a ${roleName}?`;
      roleSwitch.dataset.act = 'go:pick';
      roleSwitch.setAttribute('aria-label', `Choose a different role instead of ${roleName}`);
    });
    tag(scope, "create account", "go:code");
    tag(scope, "log in", "go:login");
    tag(scope, "terms", "go:terms");
  }
  if (r === "login") {
    tag(scope, "log in", "login");
    tag(scope, /^forgot/, "go:forgot");
    tag(scope, "create an account", "go:pick");
  }
  if (r === "code") {
    tag(scope, /^verify/, "go:onboard");
    tag(scope, /^resend/, "toast:Code sent again");
    tag(scope, "change email", "back");
  }
  if (r === "forgot") {
    tag(scope, "send reset link", "go:reset");
    tag(scope, "back to log in", "go:login");
  }
  if (r === "reset") {
    tag(scope, /^save and log in|^reset password$/, "login");
  }
  if (r === "onboard") {
    tag(scope, "continue", "finish");
    tag(scope, /first campaign/, "finish");
  }
  if (r === "subscribe") {
    tag(scope, /pay with razorpay/, "pay");
    tag(scope, /look around|keep looking/, "go:discover");
  }
  if (r === "billing") {
    tag(scope, /^renew/, "toast:Renewed until 14 Nov");
    tag(scope, /refund/, "go:refunds");
  }
  if (r === "profile") {
    tag(scope, "view card", "viewcard");
    tag(scope, /^edit (profile|brand)$/, "go:editprofile");
  }
  if (r === "editprofile") {
    tag(scope, /^save/, "saved");
    tag(scope, "cancel", "back");
  }
  if (r === "publicprofile") {
    tag(scope, "back to discovery", "back");
    tag(scope, "interested", "toast:Interest sent");
    tag(scope, "view campaign", "detail:c1");
  }
  if (r === "account") {
    tag(scope, "save changes", "toast:Account details saved");
    tag(scope, "update password", "toast:Password updated");
  }
  if (r === "help") {
    tag(scope, "contact support", "go:contact");
  }
  if (r === "contact") {
    tag(scope, "send message", "toast:Message sent — we reply within a day");
  }
  if (r === "matches") {
    tag(scope, "open conversation", "chat:" + (runtime.S.matches[side()][0] || ""));
  }
  if (r === "likedby") {
    tag(scope, "view full profile", "go:publicprofile");
    tag(scope, "interested", "toast:Interest sent");
  }
  if (r === "campaigns") {
    tag(scope, "new campaign", "go:newcampaign");
    tag(scope, "view", "go:campaign");
  }
  if (r === "campaign") {
    tag(scope, /see creators who liked|view all interested/, "go:likedby");
    tag(scope, "edit campaign", "go:editcampaign");
    tag(scope, "preview card", "go:cardpreview");
  }
  if (r === "newcampaign") {
    tag(scope, "continue", "published");
    tag(scope, "save draft", "toast:Draft saved");
  }
  if (r === "editcampaign") {
    tag(scope, /^save/, "saved");
    tag(scope, /discard|cancel/, "back");
    tag(scope, /preview campaign card/, "go:cardpreview");
  }
  if (r === "cardpreview") {
    tag(scope, /back to campaign/, "back");
    tag(scope, "edit details", "go:editcampaign");
  }
  if (r === "discover") {
    tag(scope, "filters", "filters");
  }
  if (r === "liked") {
    tag(scope, /keep discovering|discover more/, "tab:discover");
    tag(scope, "view matches", "go:matches");
  }
  tag(scope, /^subscribe/, "go:subscribe");
  tag(scope, "keep looking", "close");
  tag(scope, /^apply( filters)?$/, "applyfilters");
  tag(scope, "clear", "clearfilters");
  if (scope === overlay) scope.querySelectorAll(".chip").forEach(c => {
    if (!c.dataset.act) c.dataset.act = "chip";
  });
}
