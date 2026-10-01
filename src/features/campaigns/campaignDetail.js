import { campCard } from '../../components/cards/cardMarkup.js';
import { gallery, bindGallery } from '../../components/details/MediaGallery.js';
import { openDetail } from '../../components/details/detailsController.js';
import { runtime } from '../../context/runtime.js';
import { CAMPAIGNS, ARCHIVED_CAMPAIGNS } from '../../mocks/campaigns.js';
import { CREATORS } from '../../mocks/creators.js';
import { campaignStatus, setCampaignStatus } from './campaignState.js';
import { go } from '../../app/routes.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const audience=value=>parseFloat(value)*(String(value).includes('M')?1000000:String(value).includes('K')?1000:1);
export function setupCampaignDetail(root,route){
 if(route!=='campaign')return;
 const c=[...CAMPAIGNS,...ARCHIVED_CAMPAIGNS].find(c=>c.id===(runtime.S.ctx||runtime.S.previewCampaignId))||CAMPAIGNS[0];
 runtime.S.previewCampaignId=c.id;
 const host=root.querySelector('.workspace')||root.querySelector('.body');if(!host)return;
 root.querySelector('.head')?.remove();host.classList.add('campaign-experience');
 runtime.S.campaignPeople ||= {};
 const people=runtime.S.campaignPeople[c.id] ||= CREATORS.slice(0,5).map((p,i)=>({id:p.id,state:i===1?'matched':i===2?'shortlisted':'interested'}));
 let filter='all',query='',sort='recent',view='card';
 const confirm=(label,next)=>{const d=document.createElement('dialog');d.className='campaign-confirm';d.innerHTML=`<h3>${esc(label)} campaign?</h3><p>${next==='Deleted'?'This removes the campaign from discovery. Existing conversation history remains available.':'This changes whether creators can discover this campaign.'}</p><div class="action-row"><button class="btn ghost">Cancel</button><button class="btn ${next==='Deleted'?'campaign-danger':'solid'}">${esc(label)}</button></div>`;document.body.append(d);d.showModal();const close=()=>{d.close();d.remove();};d.oncancel=e=>{e.preventDefault();close();};d.onkeydown=e=>e.stopPropagation();d.querySelectorAll('button')[0].onclick=close;d.querySelectorAll('button')[1].onclick=()=>{setCampaignStatus(c,next);close();draw();};};
 const draw=()=>{
 const status=campaignStatus(c),locked=['Removed by admin','Deleted'].includes(status);
 host.innerHTML=`<button class="ce-back">‹ All campaigns</button><header class="ce-header"><div><h2>${esc(c.title)}</h2><div class="ce-meta"><span class="campaign-status-tag ${status==='Live'?'is-live':''}">${esc(status)}</span><span>${esc(c.window||c.time)}</span><span>${esc(c.cat)}</span></div></div><div class="ce-controls"></div></header><section class="ce-panel"><div class="ce-panel-heading"><h3>Preview</h3><div class="ce-switch" role="tablist" aria-label="Campaign preview"><button role="tab" data-view="card">Card</button><button role="tab" data-view="details">Details view</button></div></div><div class="ce-previews" data-view="${view}"><div class="ce-card-pane" role="tabpanel"><p class="ce-label">Card in Discover</p><div class="ce-card">${campCard(c,'front')}</div></div><div class="ce-details-pane" role="tabpanel"><p class="ce-label">Details view</p><article class="ce-detail"><div class="ce-gallery">${gallery(c.images?.length?c.images:c.media||[])}</div><div class="ce-info"><h3>${esc(c.title)}</h3><p class="ce-sub">${esc(c.brand)} · ${esc(c.cat)}</p><p class="ce-brief">${esc(c.brief)}</p>${[['Budget',c.budget],['Timeline',c.window||c.time],['Deliverables',c.del?.join(', ')],['Platforms',c.plat],['Location',c.loc]].map(([label,value])=>`<div class="kv"><span>${label}</span><b>${esc(value)}</b></div>`).join('')}</div></article></div></div></section><section class="ce-panel"><div class="ce-panel-heading"><h3>Creators</h3><span class="ce-total"></span></div><div class="ce-filters" role="tablist" aria-label="Filter creators"></div><div class="ce-toolbar"><input class="in" type="search" aria-label="Search creators" placeholder="Search name, city or content tags"><select class="in" aria-label="Sort creators"><option value="recent">Newest first</option><option value="audience">Most followers</option></select></div><div class="ce-people" aria-live="polite"></div></section>`;
 host.querySelector('.ce-back').onclick=()=>go('campaigns');
 const addControl=(text,action,danger=false)=>{const b=document.createElement('button');b.className='btn ghost'+(danger?' campaign-danger':'');b.textContent=text;b.onclick=action;host.querySelector('.ce-controls').append(b);};
 if(!locked){addControl('Edit',()=>go('editcampaign',c.id));if(status!=='Closed'){addControl(status==='Paused'?'Resume':'Pause',()=>confirm(status==='Paused'?'Resume':'Pause',status==='Paused'?'Live':'Paused'));addControl('Close',()=>confirm('Close','Closed'));}}
 if(status!=='Deleted')addControl('Delete',()=>confirm('Delete','Deleted'),true);
 const preview=host.querySelector('.ce-previews');
 const updateView=()=>{preview.dataset.view=view;host.querySelectorAll('[data-view].ce-switch button,.ce-switch [data-view]').forEach(b=>{const selected=b.dataset.view===view;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});};
 host.querySelectorAll('.ce-switch button').forEach(b=>{b.onclick=()=>{if(view===b.dataset.view)return;view=b.dataset.view;updateView();const pane=host.querySelector(view==='card'?'.ce-card-pane':'.ce-details-pane');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)pane.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});};b.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=b.parentElement.querySelector(`[data-view="${b.dataset.view==='card'?'details':'card'}"]`);next.click();next.focus();}};});updateView();
 bindGallery(host.querySelector('.ce-gallery'));
 host.querySelectorAll('.ce-gallery [data-act]').forEach(b=>{const direction=b.classList.contains('prev')?-1:1;delete b.dataset.act;b.setAttribute('role','button');b.tabIndex=0;const move=()=>{const track=host.querySelector('.mgal-track');track.scrollBy({left:track.clientWidth*direction,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};b.onclick=e=>{e.stopPropagation();move();};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();move();}};});
 const search=host.querySelector('input');search.value=query;search.oninput=()=>{query=search.value;paintPeople();};const select=host.querySelector('select');select.value=sort;select.onchange=()=>{sort=select.value;paintPeople();};paintPeople();
 };
 const paintPeople=()=>{
 const filters=host.querySelector('.ce-filters');filters.replaceChildren();
 for(const state of ['all','interested','shortlisted','matched']){const b=document.createElement('button');b.className='ce-filter '+state;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(filter===state));const count=people.filter(p=>state==='all'||p.state===state).length;b.innerHTML=`<i></i>${state[0].toUpperCase()+state.slice(1)} <span>${count}</span>`;b.onclick=()=>{filter=state;paintPeople();};filters.append(b);}
 const matches=people.map((p,i)=>({...CREATORS.find(u=>u.id===p.id),state:p.state,position:i})).filter(p=>(filter==='all'||p.state===filter)&&[p.name,p.loc,...p.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 if(sort==='audience')matches.sort((a,b)=>audience(b.followers)-audience(a.followers));
 host.querySelector('.ce-total').textContent=`${matches.length} shown`;
 const list=host.querySelector('.ce-people');list.replaceChildren();
 if(!matches.length){list.innerHTML='<p class="ce-empty">No creators match these filters.</p>';return;}
 for(const p of matches){const row=document.createElement('article');row.className='ce-person';row.innerHTML=`<div class="ce-avatar">${esc(p.name[0])}</div><button class="ce-person-open"><b>${esc(p.name)}</b><span class="ce-person-meta"><span>♙ ${esc(p.followers)}</span><span>⌖ ${esc(p.loc)}</span><span class="ce-state ${p.state}">${p.state[0].toUpperCase()+p.state.slice(1)}</span></span></button><div class="ce-person-actions"></div>`;row.querySelector('.ce-person-open').onclick=()=>openDetail(p.id);const actions=row.querySelector('.ce-person-actions');const action=(label,fn)=>{const b=document.createElement('button');b.className='btn ghost';b.textContent=label;b.onclick=fn;actions.append(b);};const remove=()=>{people.splice(people.findIndex(u=>u.id===p.id),1);paintPeople();};
 if(p.state==='interested'){action('Like back',()=>{people.find(u=>u.id===p.id).state='matched';if(!runtime.S.matches.brand.includes(p.id))runtime.S.matches.brand.push(p.id);runtime.S.threads[p.id] ||= [];paintPeople();});action('Pass',remove);}else if(p.state==='shortlisted')action('Remove',remove);else action('Open chat',()=>{runtime.S.threads[p.id] ||= [];if(!runtime.S.matches.brand.includes(p.id))runtime.S.matches.brand.push(p.id);runtime.S.openChat=p.id;go('convo',p.id);});list.append(row);}
 };
 draw();
}
