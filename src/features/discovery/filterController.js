import { searchableDropdown } from "../../components/ui/searchableDropdown.js";
import { filterDiscovery } from '../../utils/discoveryFilters.js';
import { runtime } from "../../context/runtime.js";
import { brand, side } from "../../context/session.js";
import { openSheet, overlay } from "../../components/ui/overlays.js";
import { PLACES } from "../../config/locations.js";
import { categoryOptions } from "../../config/categories.js";
import { renderSelections } from "../../components/ui/MultiSelect.js";
import { CREATORS } from "../../mocks/creators.js";
import { CAMPAIGNS } from "../../mocks/campaigns.js";

export const listValue = v => Array.isArray(v) ? v : v ? [v] : [];
export function filterValues() {
  const f = runtime.S.filters[side()];
  return {
    city: listValue(f.city),
    category: listValue(f.category)
  };
}
export function openFilters(focusKey) {
  const f = filterValues();
  runtime.filterDraft = {
    city: [...f.city],
    category: [...f.category]
  };
  const group = (key, title) => `<div class="filter-group"><span class="lbl" id="filter-label-${key}">${title}</span><details class="multi-dropdown" id="filter-${key}"><summary aria-labelledby="filter-label-${key}"><span>Select ${key === 'city' ? 'locations' : 'categories'}…</span><span aria-hidden="true">⌄</span></summary><div class="multi-options" role="group" aria-labelledby="filter-label-${key}"></div></details><div class="chips selected-tags" data-selected="${key}" aria-live="polite"></div></div>`;
  openSheet(`<div class="ttl">Filters</div>${group('city', 'Location')}${group('category', 'Category')}<div class="dt-acts"><button class="btn ghost" data-act="clearfilters">Clear</button><button class="btn solid" data-act="applyfilters">Apply filters</button></div>`, 'filter-sheet');
  for (const key of ['city', 'category']) {
    const dropdown = overlay.querySelector('#filter-' + key),
      options = dropdown.querySelector('.multi-options');
    (key === 'city' ? PLACES : categoryOptions()).forEach(value => {
      const label = document.createElement('label');
      label.className = 'multi-option';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = value;
      input.checked = runtime.filterDraft[key].includes(value);
      input.addEventListener('change', () => {
        runtime.filterDraft[key] = input.checked ? [...runtime.filterDraft[key], value] : runtime.filterDraft[key].filter(v => v !== value);
        refreshFilterGroup(key);
      });
      const text = document.createElement('span');
      text.textContent = value;
      label.append(input, text);
      options.appendChild(label);
    });
    searchableDropdown(dropdown, key === 'city' ? 'Search locations…' : 'Search categories…');
    refreshFilterGroup(key);
  }
  if (focusKey) overlay.querySelector('#filter-' + focusKey + ' summary')?.focus({
    preventScroll: true
  });
}
export function refreshFilterGroup(key) {
  const dropdown = overlay.querySelector('#filter-' + key),
    tags = overlay.querySelector('[data-selected="' + key + '"]');
  dropdown.querySelectorAll('input[type=checkbox]').forEach(input => input.checked = runtime.filterDraft[key].includes(input.value));
  dropdown.querySelector('summary span').textContent = runtime.filterDraft[key].length ? runtime.filterDraft[key].length + ' selected' : key === 'city' ? 'Select locations…' : 'Select categories…';
  renderSelections(tags, runtime.filterDraft[key], value => {
    runtime.filterDraft[key] = runtime.filterDraft[key].filter(v => v !== value);
    refreshFilterGroup(key);
  });
}
export function discoveryFilterBar(scope) {
  const bar = scope.querySelector('.crow,.filters');
  if (!bar) return;
  bar.className = 'filter-summary';
  bar.replaceChildren();
  const values = filterValues();
  for (const key of ['city', 'category']) {
    const field = document.createElement('div');
    field.className = 'filter-summary-field';
    const label = document.createElement('span');
    label.className = 'lbl filter-summary-label';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip summary-pill' + (values[key].length ? ' on' : '');
    button.dataset.act = 'filters:' + key;
    const title = key === 'city' ? 'Location' : 'Category';
    label.textContent = title;
    button.textContent = values[key].length ? values[key].join(', ') : 'All';
    button.setAttribute('aria-label', 'Filter ' + title.toLowerCase() + ': ' + (values[key].join(', ') || 'All'));
    field.append(label, button);
    bar.appendChild(field);
  }
}
export function discoveryItems() {
  return filterDiscovery(brand() ? CREATORS : CAMPAIGNS, side(), filterValues());
}
