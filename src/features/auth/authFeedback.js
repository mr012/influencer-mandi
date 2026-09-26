export const PASSWORD_PATTERN = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}';

export function passwordRequirements(value) {
 return [
  {key:'length', label:'8+ characters', met:value.length >= 8},
  {key:'lowercase', label:'Lowercase letter', met:/[a-z]/.test(value)},
  {key:'uppercase', label:'Capital letter', met:/[A-Z]/.test(value)},
  {key:'number', label:'Number', met:/[0-9]/.test(value)},
  {key:'special', label:'Special character', met:/[^A-Za-z0-9]/.test(value)}
 ];
}

export function passwordStrength(value) {
 if (!value || /^[•●]+$/.test(value)) return {score:0,label:'Enter a password'};
 const met=passwordRequirements(value).filter(rule=>rule.met).length;
 const score=met===5?4:Math.max(1,Math.min(3,Math.ceil(met*3/5)));
 return {score,label:met===5?'Strong':['','Weak','Fair','Good'][score]};
}
export function setupAuthFeedback(scope, route) {
 if (!['signup','reset','onboard'].includes(route)) return;
 scope.querySelectorAll('input[type="password"]').forEach((input,index)=>{
  if (/confirm/i.test(input.getAttribute('aria-label')||'')) return;
  const meter=document.createElement('div');meter.className='password-feedback';
  meter.innerHTML='<div class="password-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="password-status" aria-live="polite"></span><ul class="password-rules"></ul>';
  const text=meter.querySelector('span');text.id='password-strength-'+index;
  input.setAttribute('aria-describedby',((input.getAttribute('aria-describedby')||'')+' '+text.id).trim());
  input.required=true;
  input.minLength=8;
  input.pattern=PASSWORD_PATTERN;
  input.title='Use at least 8 characters with a capital letter, lowercase letter, number, and special character.';
  input.after(meter);
  const update=()=>{
   const {score,label}=passwordStrength(input.value),rules=passwordRequirements(input.value);
   meter.dataset.score=score;
   text.textContent='Password strength: '+label;
   meter.querySelectorAll('i').forEach((bar,i)=>bar.classList.toggle('on',i<score));
   meter.querySelector('.password-rules').innerHTML=rules.map(rule=>`<li class="${rule.met?'met':''}"><span aria-hidden="true">${rule.met?'✓':'–'}</span>${rule.label}</li>`).join('');
  };
  input.addEventListener('input',update);update();
 });
 if(route==='reset')return;
 const host=scope.querySelector('.formcard')||scope.querySelector('.body');if(!host)return;
 const fields=[...host.querySelectorAll('.fld')].filter(f=>!(scope.dataset.side==='brand'&&f.classList.contains('creator-only')));
 if(!fields.length)return;
 const progress=document.createElement('div');progress.className='auth-completion';
 progress.innerHTML='<div class="completion-label"><span>Profile completion</span><span class="completion-value"></span></div><div class="completion-track" role="progressbar" aria-label="Profile completion" aria-valuemin="0" aria-valuemax="100"><div></div></div><span class="completion-detail"></span>';
 const first=host.querySelector('.signup-role-row')||host.querySelector('.auth-heading-row')||host.querySelector('h3');if(first)first.after(progress);else host.prepend(progress);
 const complete=field=>{
  const dropdown=field.querySelector('.multi-dropdown:not(.country-code-dropdown)');if(dropdown)return !!dropdown.querySelector('input:checked');
  const controls=[...field.querySelectorAll('input.in,textarea.in,select.in')];
  if(controls.length)return controls.every(input=>{const v=input.value.trim();return !!v&&!/^[•●]+$/.test(v)&&input.checkValidity()});
  return !!field.querySelector('.chip.on');
 };
 const update=()=>{const count=fields.filter(complete).length,percent=Math.round(count/fields.length*100);progress.querySelector('.completion-value').textContent=percent+'%';progress.querySelector('[role=progressbar]').setAttribute('aria-valuenow',percent);progress.querySelector('.completion-track>div').style.width=percent+'%';progress.querySelector('.completion-detail').textContent=count+' of '+fields.length+' fields completed on this step'};
 host.addEventListener('input',update);host.addEventListener('change',update);update();
}
