import { runtime } from "../../context/runtime.js";
import { side } from "../../context/session.js";

export function setupCodeScreen() {
  const target = runtime.root.querySelector('.code-box') || runtime.root.querySelector('input.in');
  if (!target) return;
  const field = target.closest('.fld') || target;
  const group = document.createElement('div');
  group.className = 'otp-slots';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Six-character verification code');
  const key = side() + ':verification-code';
  const stored = runtime.S.forms[key] || '';
  const boxes = Array.from({length:6}, (_, index) => {
    const box = document.createElement('input');
    box.type = 'text'; box.className = 'otp-slot'; box.placeholder = '-';
    box.maxLength = 6; box.spellcheck = false;
    box.autocomplete = index === 0 ? 'one-time-code' : 'off';
    box.setAttribute('autocapitalize', 'characters');
    box.setAttribute('aria-label', 'Code character ' + (index + 1));
    box.value = (stored[index] || '').trim();
    group.appendChild(box);
    return box;
  });
  const save = () => { runtime.S.forms[key] = boxes.map(box => box.value || ' ').join(''); };
  const enter = (index, value) => {
    const chars = value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6 - index);
    boxes[index].value = chars[0] || '';
    [...chars].forEach((char, offset) => boxes[index + offset].value = char);
    save();
    if (chars.length) { const next = boxes[Math.min(index + chars.length, 5)]; next.focus(); next.select(); }
  };
  boxes.forEach((box,index) => {
    box.addEventListener('focus', () => box.select());
    box.addEventListener('input', () => enter(index, box.value));
    box.addEventListener('paste', event => { event.preventDefault(); enter(index, event.clipboardData.getData('text')); });
    box.addEventListener('keydown', event => {
      if (event.key === 'Backspace' && !box.value && index > 0) { event.preventDefault(); boxes[index-1].value = ''; boxes[index-1].focus(); save(); }
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); boxes[index-1].focus(); }
      if (event.key === 'ArrowRight' && index < 5) { event.preventDefault(); boxes[index+1].focus(); }
    });
  });
  field.replaceWith(group);
  const email = Object.entries(runtime.S.forms).find(([key]) => key.startsWith(side() + ':signup:Email:'))?.[1] || 'ananya@example.com';
  runtime.root.querySelectorAll('.sup,.formcard p').forEach(el => {
    if (el.textContent.includes('@')) el.remove();
  });
  const message = document.createElement('p');
  message.className = 'code-delivery';
  message.append(document.createTextNode('We sent an email to '));
  const address = document.createElement('b');
  address.className = 'code-email';
  address.textContent = email;
  message.appendChild(address);
  group.before(message);
}
