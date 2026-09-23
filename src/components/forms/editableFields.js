import { setupTagFields } from "../../features/profile/tagController.js";
import { brand, side } from "../../context/session.js";
import { runtime } from "../../context/runtime.js";
import { BRAND_CATEGORIES } from "../../config/categories.js";
import { CREATORS } from "../../mocks/creators.js";
import { searchableDropdown } from "../ui/searchableDropdown.js";

export function editableFields(scope) {
  setupTagFields(scope);
  scope.querySelectorAll('.fld .in').forEach((el, i) => {
    if (/INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
    const fld = el.closest('.fld'),
      lbl = fld.querySelector('.lbl'),
      name = lbl ? lbl.textContent.trim() : 'Field ' + (i + 1);
    const key = side() + ':' + runtime.S.route + ':' + name + ':' + i;
    if (runtime.S.route === 'signup' && /^phone number$/i.test(name)) {
      const stored = runtime.S.forms[key] ?? el.textContent.trim();
      const parts = stored.match(/^(\+\d{1,3})\s+(.*)$/);
      const group = document.createElement('div');
      group.className = 'signup-phone-fields';
      const country = document.createElement('input');
      country.className = 'in';
      country.type = 'tel';
      country.name = 'countryCode';
      country.autocomplete = 'tel-country-code';
      country.setAttribute('aria-label', 'Country code');
      country.maxLength = 4;
      country.pattern = '\\+[1-9][0-9]{0,2}';
      country.placeholder = '+91';
      country.value = runtime.S.forms[key + ':country'] ?? parts?.[1] ?? '+91';
      const number = document.createElement('input');
      number.className = 'in';
      number.type = 'tel';
      number.inputMode = 'numeric';
      number.name = 'phoneNumber';
      number.id = 'field-' + i;
      number.autocomplete = 'tel-national';
      number.setAttribute('aria-label', 'Phone number, 10 digits');
      number.minLength = 10;
      number.maxLength = 10;
      number.pattern = '[0-9]{10}';
      number.placeholder = '10-digit number';
      number.value = (runtime.S.forms[key + ':number'] ?? parts?.[2] ?? stored).replace(/\D/g, '').slice(0, 10);
      const save = () => {
        runtime.S.forms[key + ':country'] = country.value;
        runtime.S.forms[key + ':number'] = number.value;
        runtime.S.forms[key] = country.value + ' ' + number.value;
      };
      country.addEventListener('input', () => {
        country.value = '+' + country.value.replace(/\D/g, '').slice(0, 3);
        save();
      });
      number.addEventListener('input', () => {
        number.value = number.value.replace(/\D/g, '').slice(0, 10);
        save();
      });
      if (lbl) {
        const label = document.createElement('label');
        label.className = lbl.className;
        label.htmlFor = number.id;
        label.textContent = name;
        lbl.replaceWith(label);
      }
      group.append(country, number);
      el.replaceWith(group);
      return;
    }
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
    if (input.tagName === 'SELECT') {
      const dropdown = document.createElement('details');
      dropdown.className = 'multi-dropdown';
      const summary = document.createElement('summary');
      summary.id = input.id;
      summary.textContent = input.value;
      summary.setAttribute('aria-label', name);
      const options = document.createElement('div');
      options.className = 'multi-options';
      Array.from(input.options).forEach(option => {
        const label = document.createElement('label');
        label.className = 'multi-option';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'choice-' + input.id;
        radio.checked = option.value === input.value;
        radio.addEventListener('change', () => {
          runtime.S.forms[key] = option.value;
          summary.textContent = option.textContent;
          dropdown.open = false;
          summary.focus();
        });
        label.append(radio, document.createTextNode(option.textContent));
        options.append(label);
      });
      dropdown.append(summary, options);
      input.replaceWith(dropdown);
      searchableDropdown(dropdown, 'Search ' + name.toLowerCase() + '…');
    }
  });
}
