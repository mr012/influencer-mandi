import { esc } from '../../components/ui/dom.js';

export function attachmentMarkup(files = []) {
  return files.map(file => `<div class="chat-file">${file.type.startsWith('image/') ? `<img src="${file.url}" alt="${esc(file.name)}">` : file.type.startsWith('video/') ? `<video src="${file.url}" controls preload="metadata"></video>` : ''}<a href="${file.url}" download="${esc(file.name)}">${esc(file.name)}</a></div>`).join('');
}

export function setupAttachments(comp, id) {
  if (comp.dataset.threadId !== id) {
    (comp.attachments || []).forEach(file => URL.revokeObjectURL(file.url));
    comp.attachments = [];
    comp.dataset.threadId = id;
    const input = comp.querySelector('input.in');
    if (input) input.value = '';
  }
  if (comp.querySelector('.chat-add')) return;
  const add = document.createElement('button');
  add.type = 'button'; add.className = 'chat-add';
  add.setAttribute('aria-label', 'Add media');
  add.setAttribute('aria-expanded', 'false');
  add.textContent = '+';
  const menu = document.createElement('div');
  menu.className = 'chat-attach-menu'; menu.hidden = true;
  const preview = document.createElement('div');
  preview.className = 'chat-attach-preview'; preview.hidden = true;
  const close = () => { menu.hidden = true; add.setAttribute('aria-expanded', 'false'); };
  comp.paintAttachments = () => {
    preview.replaceChildren();
    preview.hidden = !comp.attachments.length;
    comp.attachments.forEach((file, index) => {
      const item = document.createElement('div');
      item.innerHTML = attachmentMarkup([file]);
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.onclick = () => { URL.revokeObjectURL(file.url); comp.attachments.splice(index, 1); comp.paintAttachments(); };
      item.append(remove); preview.append(item);
    });
  };
  for (const [label, icon, accept, capture] of [
    ['Camera', '◎', 'image/*', true],
    ['Document', '▤', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip', false],
    ['Images / Video', '▧', 'image/*,video/*', false]
  ]) {
    const button = document.createElement('button');
    button.type = 'button'; button.innerHTML = `<span aria-hidden="true">${icon}</span>${label}`;
    const picker = document.createElement('input');
    picker.type = 'file'; picker.accept = accept; picker.hidden = true; picker.multiple = !capture;
    if (capture) picker.setAttribute('capture', 'environment');
    picker.onchange = () => {
      for (const file of picker.files) comp.attachments.push({ name: file.name, type: file.type, url: URL.createObjectURL(file) });
      picker.value = ''; comp.paintAttachments();
    };
    button.onclick = () => { close(); picker.click(); };
    menu.append(button, picker);
  }
  add.onclick = () => { menu.hidden = !menu.hidden; add.setAttribute('aria-expanded', String(!menu.hidden)); if (!menu.hidden) menu.querySelector('button').focus(); };
  comp.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { event.stopPropagation(); close(); add.focus(); } });
  comp.addEventListener('focusout', event => { if (!comp.contains(event.relatedTarget)) close(); });
  comp.prepend(add); comp.append(menu, preview);
}
