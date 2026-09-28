import { canDeleteMessage, deleteMessage, DELETE_WINDOW_MS } from './messageDeletion.js';

let cleanup;
export function closeMessageMenu() { cleanup?.(); }

export function setupMessageMenu(thread, messages, onDelete) {
  thread.querySelectorAll('[data-message-index]').forEach(bubble => {
    const message = messages[Number(bubble.dataset.messageIndex)];
    if (!canDeleteMessage(message)) return;
    bubble.tabIndex = 0;
    bubble.classList.add('message-actions');
    let hold, origin, held = false;
    const cancelHold = () => { clearTimeout(hold); };
    const open = (x, y) => {
      closeMessageMenu();
      if (!bubble.isConnected || !canDeleteMessage(message)) return;
      const menu = document.createElement('div');
      menu.className = 'chat-message-menu'; menu.setAttribute('role', 'menu');
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = 'Delete'; button.setAttribute('role', 'menuitem');
      menu.append(button); document.body.append(menu);
      menu.style.left = `${Math.max(8, Math.min(x, innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.top = `${Math.max(8, Math.min(y, innerHeight - menu.offsetHeight - 8))}px`;
      const events = new AbortController();
      const timer = setTimeout(closeMessageMenu, Math.max(1, message.sentAt + DELETE_WINDOW_MS - Date.now()));
      cleanup = () => { events.abort(); clearTimeout(timer); menu.remove(); cleanup = null; };
      button.onclick = () => { closeMessageMenu(); if (deleteMessage(message)) onDelete(); };
      document.addEventListener('pointerdown', e => { if (!menu.contains(e.target)) closeMessageMenu(); }, { signal: events.signal });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.stopPropagation(); closeMessageMenu(); bubble.focus(); }
        if (e.key === 'Tab') closeMessageMenu();
      }, { capture: true, signal: events.signal });
      window.addEventListener('resize', closeMessageMenu, { signal: events.signal });
      document.addEventListener('scroll', closeMessageMenu, { capture: true, signal: events.signal });
      button.focus({ preventScroll: true });
    };
    bubble.oncontextmenu = e => { if (canDeleteMessage(message)) { e.preventDefault(); cancelHold(); open(e.clientX, e.clientY); } };
    bubble.onpointerdown = e => {
      if (e.pointerType === 'mouse' || !canDeleteMessage(message)) return;
      held = false; origin = [e.clientX, e.clientY];
      hold = setTimeout(() => { held = true; open(...origin); }, 500);
    };
    bubble.onpointermove = e => { if (origin && Math.hypot(e.clientX - origin[0], e.clientY - origin[1]) > 10) cancelHold(); };
    bubble.onpointerup = cancelHold;
    bubble.onpointercancel = cancelHold;
    bubble.onpointerleave = cancelHold;
    bubble.addEventListener('click', e => { if (held) { e.preventDefault(); e.stopPropagation(); held = false; } }, true);
    bubble.onkeydown = e => {
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
        e.preventDefault(); const rect = bubble.getBoundingClientRect(); open(rect.left, rect.bottom);
      }
    };
  });
}
