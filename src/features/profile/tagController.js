import { searchableDropdown } from "../../components/ui/searchableDropdown.js";
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
    if (/^(category|niche)$/i.test(field.querySelector('.lbl')?.textContent.trim() || '')) field.remove();
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
    const inputs = [...new Set([...(brand() ? BRAND_CATEGORIES : CREATOR_TAGS), 'Other'])].map(value => {
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
    searchableDropdown(select, 'Search categories…');
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
    const other = document.createElement('div'); other.className = 'fld other-categories';
    const otherLabel = document.createElement('label'); otherLabel.textContent = 'Other categories';
    const otherInput = document.createElement('input'); otherInput.className = 'in'; otherInput.placeholder = 'Type your remaining categories'; otherInput.value = runtime.S.forms[key + ':other'] || '';
    otherInput.oninput = () => runtime.S.forms[key + ':other'] = otherInput.value;
    otherLabel.append(otherInput); other.append(otherLabel);
    const update = () => {
      const count = runtime.S.forms[key].length;
      summary.textContent = count ? `${count} ${count === 1 ? 'category' : 'categories'} selected` : 'Select categories…';
      inputs.forEach(input => input.checked = runtime.S.forms[key].includes(input.value));
      other.hidden = !runtime.S.forms[key].some(value => /^others?$/i.test(value));
      renderSelections(chips, runtime.S.forms[key], value => {
        runtime.S.forms[key] = runtime.S.forms[key].filter(v => v !== value);
        update();
      });
    };
    group.append(label, select, chips, other);
    group.classList.add('category-layout');
    if (!brand()) {
      const grid = group.closest('.form-grid') || group.parentElement;
      if (runtime.S.route === 'onboard') {
        const addField = (name, value) => {
          const field = document.createElement('div'); field.className = 'fld';
          const caption = document.createElement('span'); caption.className = 'lbl'; caption.textContent = name;
          const input = document.createElement('div'); input.className = 'in'; input.textContent = value;
          field.append(caption, input); group.before(field); return field;
        };
        const names = [...grid.querySelectorAll('.lbl')].map(el => el.textContent.trim());
        if (!names.includes('City')) addField('City', 'Mumbai');
        if (!names.includes('Average views per reel')) addField('Average views per reel', '25000');
        if (!names.includes('Per reel price (₹)')) addField('Per reel price (₹)', '18000');
        const bio = addField('Bio', 'Cafe hopping across Mumbai. I shoot and edit my own content.');
        bio.classList.add('span-all'); group.after(bio);
      }
      group.classList.remove('category-layout'); group.classList.add('creator-category');
      group.after(chips, other);
      chips.style.gridColumn = other.style.gridColumn = '1 / -1';
    }
    update();
  });
}
