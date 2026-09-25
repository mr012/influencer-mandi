import { setupAuthFeedback } from '../features/auth/authFeedback.js';
import {mountScreen, unmountScreen} from './mountScreen.jsx';
import { runtime } from "../context/runtime.js";
import { isWide, reduced } from "../config/breakpoints.js";
import { tplName } from "./routes.js";
import { admin, side } from "../context/session.js";
import { AUTH } from "../config/navigationItems.js";
import { chrome } from "../components/navigation/ResponsiveNav.js";
import { adminChrome } from "../features/admin/adminController.js";
import { FILL } from "./screenControllers.js";
import { editableFields } from "../components/forms/editableFields.js";
import { setupCodeScreen } from "../features/auth/verificationController.js";
import { removeWaitingSection } from "../features/profile/profileController.js";
import { wire } from "./actionBindings.js";

export const stage = document.getElementById("stage");
export function render(anim) {
  if (runtime.S.route === "convo" && isWide()) {
    runtime.S.openChat = runtime.S.ctx || runtime.S.openChat;
    runtime.S.route = "chats";
  }
  const wrap = document.createElement("div");
  wrap.className = "scr";
  mountScreen(wrap, tplName(), isWide());
  const old = [...stage.querySelectorAll(".scr:not(.leaving)")];
  stage.appendChild(wrap);
  runtime.root = wrap.querySelector(".mock,.dsplit,.ph");
  runtime.root.dataset.route = runtime.S.route;
  if (!admin()) runtime.root.setAttribute("data-side", side());
  if (!admin() && !AUTH.includes(runtime.S.route)) chrome();
  if (admin()) adminChrome();
  const fill = FILL[runtime.S.route];
  if (fill) fill();
  editableFields(runtime.root);
  if (runtime.S.route === 'code') setupCodeScreen();
  if (runtime.S.route === 'profile') removeWaitingSection();
  // Desktop authentication shares one back control in the right-hand form panel.
  if (!admin() && AUTH.includes(runtime.S.route) && runtime.S.route !== 'pick') {
    const panel = runtime.root.querySelector('.formside');
    if (panel && !panel.querySelector('.auth-desktop-back')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'auth-desktop-back';
      button.dataset.act = 'back';
      button.setAttribute('aria-label', 'Go back');
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';
      const heading = panel.querySelector('.formcard > h3');
      if (heading) {
        const row = document.createElement('div'); row.className = 'auth-heading-row';
        heading.before(row); row.append(button, heading);
      } else (panel.querySelector('.formcard') || panel).prepend(button);
    }
  }
  setupAuthFeedback(runtime.root, runtime.S.route);
  wire(runtime.root);
  const a = reduced ? "none" : anim || "none";
  if (a !== "none") {
    wrap.classList.add("entering");
    const body = runtime.root.querySelector(".main") || runtime.root.querySelector(".body") || runtime.root.querySelector(".formside") || runtime.root;
    const riseClass = "rise-" + a;
    body.classList.add(riseClass);
    const clearEntryAnimation = event => {
      if (event && event.target !== body) return;
      body.classList.remove(riseClass);
      wrap.classList.remove("entering");
      body.removeEventListener("animationend", clearEntryAnimation);
      body.removeEventListener("animationcancel", clearEntryAnimation);
    };
    body.addEventListener("animationend", clearEntryAnimation);
    body.addEventListener("animationcancel", clearEntryAnimation);
  }
  old.forEach(o => {
    if (a === "none") {
      unmountScreen(o);
      return;
    }
    o.classList.add("leaving");
    setTimeout(() => unmountScreen(o), 240);
  });
}
