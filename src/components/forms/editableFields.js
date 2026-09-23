import { setupTagFields } from "../../features/profile/tagController.js";
import { brand, side } from "../../context/session.js";
import { runtime } from "../../context/runtime.js";
import { BRAND_CATEGORIES } from "../../config/categories.js";
import { CREATORS } from "../../mocks/creators.js";

export function editableFields(scope) {
  setupTagFields(scope);
  scope.querySelectorAll('.fld .in').forEach((el, i) => {
    if (/INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
    const fld = el.closest('.fld'),
      lbl = fld.querySelector('.lbl'),
      name = lbl ? lbl.textContent.trim() : 'Field ' + (i + 1);
    const key = side() + ':' + runtime.S.route + ':' + name + ':' + i;
    const isCategory = /^category$/i.test(name);
    const input = document.createElement(isCategory ? 'select' : /bio|brief|description|message|note/i.test(name) ? 'textarea' : 'input');
    if (isCategory) {
      const current = el.textContent.trim(),
        options = brand() ? BRAND_CATEGORIES : [...new Set(CREATORS.map(x => x.cat))];
      [...new Set([current, ...options])].forEach(value => input.add(new Option(value, value)));
    }
    input.className = el.className;
    input.classList.remove('ph2');
    input.id = 'field-' + i;
    input.setAttribute('aria-label', name);
    if (input.tagName === 'INPUT') input.type = /password/i.test(name) ? 'password' : /email/i.test(name) ? 'email' : /phone/i.test(name) ? 'tel' : 'text';
    input.value = runtime.S.forms[key] ?? el.textContent.trim();
    input.addEventListener('input', () => runtime.S.forms[key] = input.value);
    input.addEventListener('change', () => runtime.S.forms[key] = input.value);
    if (lbl) {
      const l = document.createElement('label');
      l.className = lbl.className;
      l.htmlFor = input.id;
      l.textContent = name;
      lbl.replaceWith(l);
    }
    el.replaceWith(input);
  });
}
