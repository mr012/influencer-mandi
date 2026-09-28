const easing = 'cubic-bezier(.22,1,.36,1)';
export const reduceChatMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function updateThread(thread, id, messages, markup) {
  const signature = JSON.stringify([id, messages.map(m => [m.t, m.at, m.deleted, m.attachments])]);
  if (thread.dataset.signature === signature) return false;
  const switching = thread.dataset.chatId !== id;
  const previous = [...thread.querySelectorAll('.bub')];
  const positions = previous.map(el => el.getBoundingClientRect().top);
  const nearBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 70;
  const scroll = thread.scrollTop;
  thread.dataset.signature = signature;
  thread.dataset.chatId = id;
  if (switching) thread.innerHTML = markup;
  else {
    // Keep existing media nodes mounted so new messages don't restart playback.
    const template = document.createElement('template');
    template.innerHTML = markup;
    const next = [...template.content.querySelectorAll('.bub')];
    next.forEach((bubble, index) => {
      if (!previous[index]) thread.append(bubble);
      else if (previous[index].classList.contains('message-deleted') !== bubble.classList.contains('message-deleted')) previous[index].replaceWith(bubble);
    });
  }
  const incoming = messages.slice(previous.length);
  const follow = switching || nearBottom || incoming.some(m => m.me);
  thread.scrollTop = follow ? thread.scrollHeight : scroll;
  if (!reduceChatMotion()) {
    if (switching) {
      thread.getAnimations().forEach(a => a.cancel());
      thread.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing });
    } else {
      thread.querySelectorAll('.bub').forEach((bubble, index) => {
        const delta = positions[index] == null ? 18 : positions[index] - bubble.getBoundingClientRect().top;
        if (Math.abs(delta) < 1) return;
        bubble.getAnimations().forEach(a => a.cancel());
        bubble.animate([{ transform: `translateY(${delta}px)`, opacity: positions[index] == null ? 0 : 1 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 340, easing });
      });
    }
  }
  return true;
}
