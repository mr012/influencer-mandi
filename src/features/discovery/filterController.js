import { campaignStatus } from '../campaigns/campaignState.js';
import { filterDiscovery } from '../../utils/discoveryFilters.js';
import { runtime } from "../../context/runtime.js";
import { brand, side } from "../../context/session.js";
import { openSheet, overlay } from "../../components/ui/overlays.js";
import { PLACES } from "../../config/locations.js";
import { categoryOptions } from "../../config/categories.js";
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
  const f=filterValues();runtime.filterDraft={city:[...f.city],category:[...f.category]};
  openSheet('<div class="discovery-menu-content"></div><div class="dt-acts"><button class="btn ghost" data-act="clearfilters">Clear</button><button class="btn solid" data-act="applyfilters">Apply filters</button></div>','filter-sheet discovery-menu');
  runtime.discoveryFilterField=focusKey||null;
  paintFilterMenu();
  const anchor=runtime.root.querySelector('[data-act="filters"]');
  if(innerWidth>700&&anchor){const rect=anchor.getBoundingClientRect();const sheet=overlay.querySelector('.sheet');sheet.style.position='fixed';sheet.style.width='280px';sheet.style.left=Math.max(12,Math.min(rect.right-280,innerWidth-292))+'px';sheet.style.top=Math.max(12,Math.min(rect.bottom+8,innerHeight-420))+'px';}
}
function paintFilterMenu(){
 const host=overlay.querySelector('.discovery-menu-content');if(!host)return;
 host.replaceChildren();const key=runtime.discoveryFilterField;
 if(!key){
  for(const [field,title] of [['category','Category'],['city','Location']]){const button=document.createElement('button');button.className='discovery-field-row';const label=document.createElement('b');label.textContent=title;const value=document.createElement('span');const selected=runtime.filterDraft[field];value.textContent=selected.length?selected.length===1?selected[0]:selected.length+' selected':'Any';const arrow=document.createElement('i');arrow.textContent='›';button.append(label,value,arrow);button.onclick=()=>{runtime.discoveryFilterField=field;paintFilterMenu();};host.append(button);}return;
 }
 const back=document.createElement('button');back.className='discovery-field-back';back.textContent='‹  '+(key==='city'?'Location':'Category');back.onclick=()=>{runtime.discoveryFilterField=null;paintFilterMenu();};host.append(back);
 const search=document.createElement('input');search.type='search';search.className='discovery-option-search';search.placeholder=key==='city'?'Search locations…':'Search categories…';search.setAttribute('aria-label',search.placeholder);host.append(search);
 const list=document.createElement('div');list.className='discovery-option-list';host.append(list);
 const options=key==='city'?PLACES:categoryOptions();
 for(const value of options){const label=document.createElement('label');label.className='discovery-option';const input=document.createElement('input');input.type='checkbox';input.value=value;input.checked=runtime.filterDraft[key].includes(value);input.onchange=()=>{runtime.filterDraft[key]=input.checked?[...runtime.filterDraft[key],value]:runtime.filterDraft[key].filter(v=>v!==value);};const text=document.createElement('span');text.textContent=value;label.append(input,text);list.append(label);}
 const empty=document.createElement('p');empty.textContent='No matching options';empty.hidden=true;list.append(empty);
 search.oninput=()=>{let count=0;list.querySelectorAll('label').forEach(label=>{label.hidden=!label.textContent.toLowerCase().includes(search.value.trim().toLowerCase());if(!label.hidden)count++;});empty.hidden=count>0;};
}
export function refreshFilterGroup(){paintFilterMenu();}
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
  const withClear = filters => {
    if (!(values.city.length + values.category.length)) return filters;
    const group = document.createElement('div'); group.className = 'filter-with-clear';
    const clear = document.createElement('button'); clear.type = 'button';
    clear.className = 'discovery-clear-icon'; clear.dataset.act = 'clearfiltersmain';
    clear.setAttribute('aria-label', 'Clear filters'); clear.title = 'Clear filters';
    clear.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
    group.append(filters, clear); return group;
  };
  const topbar = scope.querySelector('.main > .topbar');
  const heading = scope.querySelector('.main > .head');
  if (topbar && heading) {
    heading.querySelector('p')?.remove();
    const accountControls = document.createElement('div');
    accountControls.className = 'discovery-account-controls';
    accountControls.append(...topbar.childNodes);
    topbar.append(heading, accountControls);
  }

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

    bar.append(campaign, withClear(filters));
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
    filterValue.textContent = [values.city.join(', '), values.category.join(', ')].filter(Boolean).join(' | ') || 'All';
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

    bar.appendChild(withClear(filters));
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
  return filterDiscovery(brand() ? CREATORS : CAMPAIGNS.filter(c=>campaignStatus(c)==='Live'), side(), filterValues());
}
