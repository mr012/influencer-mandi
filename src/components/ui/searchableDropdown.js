// Shared searchable popup for category and location choices.
export function searchableDropdown(dropdown, placeholder = 'Search options…') {
  const summary = dropdown.querySelector('summary');
  const options = dropdown.querySelector('.multi-options');
  const panel = document.createElement('div');
  panel.className = 'dropdown-panel';
  panel.setAttribute('popover', 'manual');
  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'dropdown-search';
  search.placeholder = placeholder;
  search.setAttribute('aria-label', placeholder);
  const empty = document.createElement('p');
  empty.className = 'dropdown-empty';
  empty.textContent = 'No matching options';
  empty.hidden = true;
  options.before(panel);
  panel.append(search, options, empty);
  const filter = () => {
    let count = 0;
    options.querySelectorAll('.multi-option').forEach(option => {
      option.hidden = !option.textContent.toLowerCase().includes(search.value.trim().toLowerCase());
      if (!option.hidden) count++;
    });
    empty.hidden = count > 0;
  };
  search.addEventListener('input', filter);
  const position = () => {
    const rect = summary.getBoundingClientRect();
    const viewport = window.visualViewport;
    const top = (viewport?.offsetTop || 0) + 8;
    const bottom = (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) - 8;
    const below = bottom - rect.bottom - 6;
    const above = rect.top - top - 6;
    const up = below < 290 && above > below;
    const height = Math.max(80, Math.min(290, up ? above : below));
    panel.style.width = Math.min(rect.width, innerWidth - 16) + 'px';
    panel.style.maxHeight = height + 'px';
    panel.style.left = Math.max(8, Math.min(rect.left, innerWidth - rect.width - 8)) + 'px';
    panel.style.top = (up ? Math.max(top, rect.top - panel.getBoundingClientRect().height - 6) : rect.bottom + 6) + 'px';
    dropdown.classList.toggle('opens-up', up);
  };
  const close = () => { dropdown.open = false; };
  const outside = event => { if (!dropdown.contains(event.target)) close(); };
  const scroll = event => { if (!panel.contains(event.target)) close(); };
  dropdown.addEventListener('toggle', () => {
    if (dropdown.open) {
      search.value = '';
      filter();
      panel.showPopover();
      position();
      document.addEventListener('pointerdown', outside);
      window.addEventListener('resize', close);
      document.addEventListener('scroll', scroll, true);
      window.visualViewport?.addEventListener('resize', position);
    } else {
      panel.hidePopover();
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', close);
      document.removeEventListener('scroll', scroll, true);
      window.visualViewport?.removeEventListener('resize', position);
    }
  });
  dropdown.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); summary.focus(); }
  });
}
