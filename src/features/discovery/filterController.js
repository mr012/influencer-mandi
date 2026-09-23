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
function filterIcon() {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('class', 'discovery-filter-icon');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.8');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3 4h18l-7 9v6l-4 2v-8L3 4z');
  icon.appendChild(path);
  return icon;
}

export function discoveryFilterBar(scope) {
  const bar = scope.querySelector('.crow,.filters');
  if (!bar) return;
  const values = filterValues();

  if (brand()) {
    scope.querySelector('.ph[data-side="brand"] > .sup')?.remove();
    scope.querySelector('.head p:has(.camp-pick)')?.remove();
    bar.className = 'brand-discovery-tools';
    bar.replaceChildren();

    const campaign = document.createElement('button');
    campaign.type = 'button';
    campaign.className = 'camp-pick brand-discovery-campaign';
    campaign.dataset.act = 'camppick';
    campaign.setAttribute('aria-label', 'Select campaign. Current campaign: ' + runtime.S.camp);
    const campaignValue = document.createElement('span');
    campaignValue.className = 'brand-campaign-value';
    campaignValue.textContent = runtime.S.camp;
    campaign.appendChild(campaignValue);
    const campaignArrow = document.createElement('span');
    campaignArrow.className = 'brand-campaign-arrow';
    campaignArrow.setAttribute('aria-hidden', 'true');
    campaignArrow.textContent = '▾';
    campaign.appendChild(campaignArrow);

    const selectedCount = values.city.length + values.category.length;
    const filters = document.createElement('button');
    filters.type = 'button';
    filters.className = 'brand-discovery-filter' + (selectedCount ? ' on' : '');
    filters.dataset.act = 'filters';
    filters.setAttribute('aria-label', `Open filters. ${selectedCount} selected`);
    const filterCount = document.createElement('span');
    filterCount.className = 'brand-filter-count';
    filterCount.textContent = String(selectedCount);
    filters.append(filterIcon(), filterCount);

    bar.append(campaign, filters);
    return;
  }

  if (!brand()) {
    const selectedCount = values.city.length + values.category.length;
    bar.className = 'creator-discovery-tools';
    bar.replaceChildren();

    const filters = document.createElement('button');
    filters.type = 'button';
    filters.className = 'brand-discovery-filter creator-discovery-filter' + (selectedCount ? ' on' : '');
    filters.dataset.act = 'filters';
    filters.setAttribute('aria-label', `Open filters. ${selectedCount} selected`);
    const filterContext = document.createElement('span');
    filterContext.className = 'creator-filter-context';
    const filterPrefix = document.createElement('span');
    filterPrefix.textContent = 'Location & category';
    const filterValue = document.createElement('strong');
    filterValue.textContent = selectedCount ? [...values.city, ...values.category].join(', ') : 'All';
    filterContext.append(filterPrefix, filterValue);
    const filterPill = document.createElement('span');
    filterPill.className = 'creator-filter-pill';
    filterPill.appendChild(filterIcon());
    if (selectedCount) {
      const filterCount = document.createElement('span');
      filterCount.className = 'brand-filter-count';
      filterCount.textContent = String(selectedCount);
      filterPill.appendChild(filterCount);
    }
    filters.append(filterContext, filterPill);

    bar.appendChild(filters);
    return;
  }

  bar.className = 'filter-summary';
  bar.replaceChildren();
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
