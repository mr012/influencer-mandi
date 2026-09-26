import { runtime } from "../../context/runtime.js";
import { side } from "../../context/session.js";

export function setupCodeScreen() {
  const target = runtime.root.querySelector('.code-box') || runtime.root.querySelector('input.in');
  if (!target) return;
  const key = side() + ':verification-code';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'otp-input';
  input.placeholder = '- - - - - -';
  input.value = (runtime.S.forms[key] || '').replace(/\s/g, '').slice(0, 6);
  input.maxLength = 6;
  input.spellcheck = false;
  input.autocomplete = 'one-time-code';
  input.inputMode = 'text';
  input.setAttribute('autocapitalize', 'characters');
  input.setAttribute('aria-label', 'Six-character verification code');
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
    runtime.S.forms[key] = input.value;
  });
  const field = target.closest('.fld');
  if (field) {
    field.classList.add('otp-field');
    target.replaceWith(input);
  } else target.replaceWith(input);
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
  input.before(message);
}
