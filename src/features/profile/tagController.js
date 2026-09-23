import { runtime } from "../../context/runtime.js";
import { brand, side } from "../../context/session.js";
import { renderSelections } from "../../components/ui/MultiSelect.js";
import { BRAND_CATEGORIES, CREATOR_TAGS } from "../../config/categories.js";

export function setupTagFields(scope) {
  if (!['onboard', 'editprofile'].includes(runtime.S.route)) return;
  const groups = brand() ? [...scope.querySelectorAll('[data-brand-categories]')] : [...scope.querySelectorAll('.fld,.span-all')].filter(el => /^Content tags/i.test(el.querySelector('.lbl')?.textContent || ''));
  scope.querySelectorAll('.chips').forEach(chips => {
    if (chips.textContent.includes('Add a tag') && !groups.some(g => g.contains(chips))) groups.push(chips);
  });
  if (groups.length && !brand()) scope.querySelectorAll('.fld').forEach(field => {
    if (/^(category|followers)$/i.test(field.querySelector('.lbl')?.textContent.trim() || '')) field.remove();
  });
  groups.forEach((group, index) => {
    const key = side() + ':' + runtime.S.route + ':tags:' + index;
    const initial = [...group.querySelectorAll('.chip.on')].map(el => el.textContent.trim());
    if (!Array.isArray(runtime.S.forms[key])) runtime.S.forms[key] = initial;
    group.replaceChildren();
    group.className = 'fld tag-field';
    if (group.parentElement.classList.contains('span-all')) group.parentElement.style.gridColumn = '1 / -1';
    const label = document.createElement('label');
    label.className = 'lbl';
    label.htmlFor = 'tags-' + index;
    label.textContent = 'Category';
    const select = document.createElement('details');
    select.className = 'multi-dropdown';
    const summary = document.createElement('summary');
    summary.id = label.htmlFor;
    summary.setAttribute('aria-label', 'Select categories');
    const options = document.createElement('div');
    options.className = 'multi-options';
    const inputs = (brand() ? BRAND_CATEGORIES : CREATOR_TAGS).map(value => {
      const option = document.createElement('label');
      option.className = 'multi-option';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = value;
      input.addEventListener('change', () => {
        runtime.S.forms[key] = input.checked
          ? [...new Set([...runtime.S.forms[key], value])]
          : runtime.S.forms[key].filter(v => v !== value);
        update();
      });
      option.append(input, document.createTextNode(value));
      options.append(option);
      return input;
    });
    select.append(summary, options);
    select.addEventListener('toggle', () => {
      if (!select.open) return;
      const rect = summary.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const upward = below < 220 && above > below;
      select.classList.toggle('opens-up', upward);
      options.style.maxHeight = Math.max(48, Math.min(220, upward ? above : below)) + 'px';
    });
    select.addEventListener('keydown', event => {
      if (event.key === 'Escape') { select.open = false; summary.focus(); }
    });
    select.addEventListener('focusout', event => {
      // A label click briefly clears focus before focusing its checkbox.
      // Keep the popup mounted throughout that native activation sequence.
      if (event.relatedTarget && !select.contains(event.relatedTarget)) select.open = false;
    });
    const chips = document.createElement('div');
    chips.className = 'chips selected-tags';
    const update = () => {
      const count = runtime.S.forms[key].length;
      summary.textContent = count ? `${count} ${count === 1 ? 'category' : 'categories'} selected` : 'Select categories…';
      inputs.forEach(input => input.checked = runtime.S.forms[key].includes(input.value));
      renderSelections(chips, runtime.S.forms[key], value => {
        runtime.S.forms[key] = runtime.S.forms[key].filter(v => v !== value);
        update();
      });
    };
    group.append(label, select, chips);
    update();
  });
}
