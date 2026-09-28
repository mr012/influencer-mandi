import { esc } from '../../components/ui/dom.js';
import { reduceChatMotion } from './chatMotion.js';

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
  let menuAnimation;
  const close = () => {
    if (add.getAttribute('aria-expanded') !== 'true') return;
    add.setAttribute('aria-expanded', 'false');
    menuAnimation?.cancel();
    if (reduceChatMotion()) { menu.hidden = true; return; }
    menuAnimation = menu.animate([{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(6px) scale(.97)' }], { duration: 140, easing: 'ease-in' });
    menuAnimation.onfinish = () => { menu.hidden = true; };
  };
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
    ['Document', '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>', '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip', false],
    ['Photos & videos', '<rect x="5" y="3" width="16" height="15" rx="2"/><path d="m5 14 5-5 4 4 3-3 4 4M2 8v12a1 1 0 0 0 1 1h13"/><circle cx="16" cy="7" r="1"/>', 'image/*,video/*', false],
    ['Camera', '<path d="M8 6 9.5 3h5L16 6h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="4"/>', 'image/*', true]
  ]) {
    const button = document.createElement('button');
    button.type = 'button'; button.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>${label}`;
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
  add.onclick = () => {
    if (add.getAttribute('aria-expanded') === 'true') return close();
    menuAnimation?.cancel(); menu.hidden = false; add.setAttribute('aria-expanded', 'true');
    if (!reduceChatMotion()) menuAnimation = menu.animate([{ opacity: 0, transform: 'translateY(8px) scale(.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' });
    menu.querySelector('button').focus();
  };
  comp.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { event.stopPropagation(); close(); add.focus(); } });
  comp.addEventListener('focusout', event => { if (!comp.contains(event.relatedTarget)) close(); });
  comp.prepend(add); comp.append(menu, preview);
}
