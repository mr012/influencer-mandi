import { campCard } from '../../components/cards/cardMarkup.js';
import { runtime } from '../../context/runtime.js';
import { CAMPAIGNS, ARCHIVED_CAMPAIGNS } from '../../mocks/campaigns.js';
import { CREATORS } from '../../mocks/creators.js';
import { campaignStatus, setCampaignStatus } from './campaignState.js';
import { go } from '../../app/routes.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function setupCampaignDetail(root,route){
 if(route!=='campaign')return;
 const c=[...CAMPAIGNS,...ARCHIVED_CAMPAIGNS].find(c=>c.id===(runtime.S.ctx||runtime.S.previewCampaignId))||CAMPAIGNS[0];
 runtime.S.previewCampaignId=c.id;
 const host=root.querySelector('.workspace')||root.querySelector('.body');if(!host)return;
 const heading=root.querySelector('.head h2');if(heading)heading.textContent=c.title;
 let filter='All';
 const people=CREATORS.slice(0,4).map((person,i)=>({...person,relationship:person.id==='u2'?'Matched':'Interested'}));
 const draw=()=>{
 const status=campaignStatus(c),locked=['Removed by admin','Deleted'].includes(status);
 const subtitle=root.querySelector('.head p');if(subtitle)subtitle.textContent=status;
 host.innerHTML=`<div class="two-col campaign-detail-layout"><section class="surface campaign-creators-panel"><div class="panel-label">Creators</div><div class="chips campaign-people-tabs"></div><div class="campaign-people"></div></section><section class="surface campaign-controls-panel"><div class="campaign-inline-card">${campCard(c,"front")}</div><div class="panel-label">Campaign controls</div><span class="campaign-status-tag ${locked?'danger-text':status==='Live'?'is-live':''}">${esc(status)}</span><div class="campaign-control-actions"></div>${[['Budget approx.',c.budget],['Shoot window',c.window||c.time],['Deliverables',c.del?.join(', ')],['Platforms',c.plat],['Location',c.loc]].map(([label,value])=>`<div class="kv"><span>${label}</span><b>${esc(value)}</b></div>`).join('')}<div class="action-row campaign-detail-links"></div></section></div>`;
 for(const name of ['All','Interested','Matched']){const button=document.createElement('button');button.className='chip'+(name===filter?' sel':'');button.textContent=`${name} · ${people.filter(p=>name==='All'||p.relationship===name).length}`;button.setAttribute('aria-pressed',String(name===filter));button.onclick=()=>{filter=name;draw();};host.querySelector('.campaign-people-tabs').append(button);}
 const shown=people.filter(p=>filter==='All'||p.relationship===filter);
 host.querySelector('.campaign-people').innerHTML=shown.map(p=>`<div class="row"><div class="av">${esc(p.name[0])}</div><div class="tx"><b>${esc(p.name)}</b><p>${esc(p.followers)} · ${esc(p.loc)}</p><span class="campaign-status-tag">${p.relationship}</span></div></div>`).join('');
 const button=(label,action,danger=false)=>{const b=document.createElement('button');b.className='btn ghost'+(danger?' campaign-danger':'');b.textContent=label;b.onclick=action;return b;};
 const controls=host.querySelector('.campaign-control-actions');
 if(!locked)controls.append(button(status==='Paused'?'Resume campaign':'Pause campaign',()=>{setCampaignStatus(c,status==='Paused'?'Live':'Paused');draw();}));
 if(status!=='Deleted')controls.append(button('Delete campaign',()=>{
 const d=document.createElement('dialog');d.className='campaign-confirm';d.innerHTML='<h3>Delete campaign?</h3><p>This campaign will no longer appear in discovery. Existing conversation history stays available.</p><div class="action-row"><button class="btn ghost">Cancel</button><button class="btn campaign-danger">Delete campaign</button></div>';document.body.append(d);d.showModal();const close=()=>{d.close();d.remove();};d.oncancel=e=>{e.preventDefault();close();};d.onkeydown=e=>e.stopPropagation();d.querySelectorAll('button')[0].onclick=close;d.querySelectorAll('button')[1].onclick=()=>{setCampaignStatus(c,'Deleted');close();draw();};
 },true));
 const links=host.querySelector('.campaign-detail-links');if(!locked)links.append(button('Edit campaign',()=>go('editcampaign',c.id)));
 };draw();
}
