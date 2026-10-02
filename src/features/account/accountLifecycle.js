import { side } from '../../context/session.js';
import { render } from '../../app/render.js';
const KEY = 'mandi:demo:lifecycle:v2';
export const notice = 'Your account is scheduled for deletion in 90 days. Unresolved reports or disputes may require review before deletion is completed.';
export function accountState(role = side()) { try { return JSON.parse(localStorage.getItem(KEY) || '{}')[role] || {status:'Active', deletionStatus:'None'}; } catch { return {status:'Active', deletionStatus:'None'}; } }
export const restricted = s => s.status !== 'Active' || ['Pending','Under review'].includes(s.deletionStatus);
export const statusLabel = s => s.deletionStatus === 'Under review' ? 'Deletion pending review' : s.deletionStatus === 'Pending' ? 'Account pending deletion' : 'Account paused';
function save(s) { const records = JSON.parse(localStorage.getItem(KEY) || '{}'); records[side()] = {...s, updatedAt:new Date().toISOString()}; localStorage.setItem(KEY, JSON.stringify(records)); render('none'); }
export function chatRestriction(id) {
  if (restricted(accountState())) return accountState();
  if ((side() === 'brand' && id === 'u1') || (side() === 'creator' && id === 'c1')) {
    const other = accountState(side() === 'brand' ? 'creator' : 'brand'); if (restricted(other)) return other;
  }
  return null;
}
export function resumeAccount() { save({...accountState(),status:'Active'}); }
function dialog(title, description, label, action) {
  const d = document.createElement('dialog'); d.className = 'account-delete-dialog';
  if(label==='Pause account')d.classList.add('is-pause');
  if(label==='Continue to verification'||label==='Verify & request deletion')d.classList.add('is-destructive');
  d.style.setProperty('--side',side()==='brand'?'#d5ff4b':'#ff4d16');
  d.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.close();}};
  d.oncancel=e=>{e.preventDefault();d.close();};
  d.innerHTML = '<form><h3></h3><p class="description"></p><div class="extra"></div><p role="alert"></p><div class="lifecycle-actions"><button type="button" data-cancel>Cancel</button><button type="submit" class="confirm"></button></div></form>';
  d.querySelector('h3').textContent = title; d.querySelector('.description').textContent = description; d.querySelector('.confirm').textContent = label;
  d.querySelector('[data-cancel]').onclick = () => d.close(); d.onclose = () => {clearInterval(d.timer); d.remove();};
  d.querySelector('form').onsubmit = e => {e.preventDefault(); try {action(d);} catch {d.querySelector('[role=alert]').textContent='Could not save. Please try again.';}};
  document.body.append(d); d.showModal(); return d;
}
function pause() { dialog('Pause your account?', 'Your profile will be hidden and new matches will stop. Messaging will stop for both sides until you resume. Existing conversations, reports and commitments remain. Inform ongoing collaborators before pausing.', 'Pause account', d => {save({...accountState(),status:'Paused'}); d.close();}); }
function requestDelete() {
  dialog('Delete your account?', 'After verification, your profile will be hidden and new collaborations and messages will stop. Existing conversations remain available for reporting. You can cancel deletion during the 90-day waiting period.', 'Continue to verification', d => {
    d.close();
    const otp = dialog('Verify your identity', 'Enter the 6-digit code sent to your registered email. The 90-day waiting period starts after verification.', 'Verify & request deletion', form => {
      // Prototype only: replace with server OTP verification and server timestamps.
      if (!/^\d{6}$/.test(form.querySelector('input').value)) return;
      const now = Date.now(); save({...accountState(),deletionStatus:'Pending',requestedAt:new Date(now).toISOString(),deleteAt:new Date(now+90*86400000).toISOString()}); form.close();
    });
    otp.querySelector('.extra').innerHTML = '<label>Verification code<input aria-label="Verification code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required placeholder="------"></label><button type="button" class="resend">Resend code</button>';
    const input = otp.querySelector('input'); input.oninput=()=>{input.value=input.value.replace(/\D/g,'');}; input.focus();
    const resend=otp.querySelector('.resend'); const countdown=()=>{clearInterval(otp.timer);let n=30;resend.disabled=true;resend.textContent=`Resend code in ${n}s`;otp.timer=setInterval(()=>{n--;resend.disabled=n>0;resend.textContent=n?`Resend code in ${n}s`:'Resend code';if(!n)clearInterval(otp.timer);},1000);};resend.onclick=countdown;countdown();
  });
}
export function setupAccountLifecycle(root,route) {
  if (!['profile','account'].includes(route)) return;
  const container=root.querySelector('.workspace')||root.querySelector('.body');if(!container)return;
  const state=accountState(), pending=['Pending','Under review'].includes(state.deletionStatus);
  const section=document.createElement('section');section.className='account-lifecycle surface';
  section.innerHTML='<h3>Manage account</h3><p class="lifecycle-status"></p><p class="description"></p><div class="lifecycle-actions"></div>';container.append(section);
  section.querySelector('.lifecycle-status').textContent=pending?statusLabel(state):`Account ${state.status.toLowerCase()}`;
  section.querySelector('.description').textContent=pending?(state.deletionStatus==='Under review'?'An unresolved report or dispute requires review before deletion can be completed. Contact support for help.':`${notice} Scheduled date: ${new Date(state.deleteAt).toLocaleDateString()}. Signing in does not cancel your request.`):state.status==='Paused'?'Your profile is hidden. Resume your account to send and receive new messages. Your matches and chat history remain available.':'Pause temporarily, or request deletion after a 90-day waiting period.';
  const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(label==='Pause account')b.classList.add('account-pause-action');b.onclick=fn;section.querySelector('.lifecycle-actions').append(b);return b;};
  if(pending){button('Cancel deletion request',()=>dialog('Cancel deletion request?','Your account will remain paused if it was paused before the request.','Keep my account',d=>{save({status:state.status,deletionStatus:'Cancelled'});d.close();}));button('Contact support',()=>{}).dataset.act='go:contact';}
  else {button(state.status==='Paused'?'Resume account':'Pause account',state.status==='Paused'?resumeAccount:pause);button('Delete account',requestDelete).classList.add('account-delete-action');}
}
