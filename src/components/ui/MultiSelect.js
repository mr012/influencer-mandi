

export function renderSelections(container, values, remove) {
  container.replaceChildren();
  values.forEach(value => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip on selected-tag';
    button.textContent = value + ' ×';
    button.setAttribute('aria-label', 'Remove ' + value);
    button.addEventListener('click', () => remove(value));
    container.appendChild(button);
  });
}
export function populateSelect(select, options, values, placeholder) {
  select.replaceChildren(new Option(placeholder, ''));
  options.filter(v => !values.includes(v)).forEach(v => select.add(new Option(v, v)));
  select.value = '';
}
