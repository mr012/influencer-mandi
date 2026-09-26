import { runtime } from "../../context/runtime.js";
import { side } from "../../context/session.js";

export function setupCodeScreen() {
  const target = runtime.root.querySelector('.code-box') || runtime.root.querySelector('input.in');
  if (!target) return;
  const key = side() + ':verification-code';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'otp-input';
  input.value = (runtime.S.forms[key] || '').replace(/\s/g, '').slice(0, 6);
  input.maxLength = 6;
  input.spellcheck = false;
  input.autocomplete = 'one-time-code';
  input.inputMode = 'text';
  input.setAttribute('autocapitalize', 'characters');
  input.setAttribute('aria-label', 'Six-character verification code');
  const wrapper = document.createElement('div');
  wrapper.className = 'otp-input-wrap';
  const visual = document.createElement('div');
  visual.className = 'otp-visual';
  visual.setAttribute('aria-hidden', 'true');
  const render = () => {
    const characters = [...input.value];
    visual.innerHTML = Array.from({length:6}, (_, index) =>
      `<span class="${characters[index] ? 'filled' : 'empty'}">${characters[index] || '-'}</span>`
    ).join('');
  };
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
    runtime.S.forms[key] = input.value;
    render();
  });
  wrapper.append(visual, input);
  render();
  const field = target.closest('.fld');
  if (field) {
    field.classList.add('otp-field');
    target.replaceWith(wrapper);
  } else target.replaceWith(wrapper);
  const email = Object.entries(runtime.S.forms).find(([key]) => key.startsWith(side() + ':signup:Email:'))?.[1] || 'ananya@example.com';
  runtime.root.querySelectorAll('.sup,.formcard p').forEach(el => {
    if (el.textContent.includes('@')) el.remove();
  });
  const message = document.createElement('p');
  message.className = 'code-delivery';
  message.append(document.createTextNode('We sent an email to '));
  const address = document.createElement('span');
  address.className = 'code-email';
  address.textContent = email;
  message.appendChild(address);
  wrapper.before(message);
  if (runtime.root.matches('.ph')) {
    const changeEmail = document.createElement('button');
    changeEmail.type = 'button';
    changeEmail.className = 'btn ghost';
    changeEmail.textContent = 'Change email';
    runtime.root.querySelector('.body').appendChild(changeEmail);
  }
}
