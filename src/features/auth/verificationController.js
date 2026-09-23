import { runtime } from "../../context/runtime.js";
import { side } from "../../context/session.js";

export function setupCodeScreen() {
  const input = runtime.root.querySelector('input.in');
  if (!input) return;
  input.classList.add('otp-input');
  input.closest('.fld').classList.add('otp-field');
  input.setAttribute('aria-label', 'One-time code');
  input.autocomplete = 'one-time-code';
  input.maxLength = 6;
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'characters');
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
  });
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
  input.closest('.fld').before(message);
}
