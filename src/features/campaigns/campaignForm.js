import { runtime } from '../../context/runtime.js';
import { CAMPAIGNS, ARCHIVED_CAMPAIGNS } from '../../mocks/campaigns.js';
import { go } from '../../app/routes.js';

export function setupCampaignForm(root, route) {
  if (!['newcampaign','editcampaign'].includes(route)) return;
  const host = root.querySelector('.workspace') || root.querySelector('.body');
  if (!host) return;
  const id = route === 'editcampaign' ? runtime.S.ctx || runtime.S.previewCampaignId || 'c1' : 'new';
  runtime.S.campaignDrafts ||= {};
  const source = [...CAMPAIGNS,...ARCHIVED_CAMPAIGNS].find(c => c.id === id);
  const draft = runtime.S.campaignDrafts[id] ||= {title:source?.title || '', brief:source?.brief || '', location:source?.loc || '', start:source?.start || '', end:source?.end || '', budget:source?.approxBudget || '', deliverables:source?.del?.join(', ') || '', platforms:source?.plat?.split(/,\s*/) || [], images:source?.images || []};
  host.replaceChildren(); host.classList.add('campaign-form-host');
  const form = document.createElement('form'); form.className = 'surface campaign-form'; form.innerHTML = '<div class="panel-label">Campaign details</div><div class="campaign-form-grid"></div><p role="status"></p><div class="action-row"><button type="button" class="btn ghost">Cancel</button><button type="submit" class="btn solid"></button></div>';
  form.querySelector('[type=submit]').textContent = route === 'editcampaign' ? 'Save changes' : 'Publish campaign';
  form.querySelector('[type=button]').onclick = () => go('campaigns');
  const grid = form.querySelector('.campaign-form-grid');
  const field = (label,key,type='text',full=false) => {
    const wrap = document.createElement('label'); wrap.className = 'fld' + (full?' span-all':'');
    const caption = document.createElement('span'); caption.className='lbl';caption.textContent=label;
    const input=document.createElement(type==='textarea'?'textarea':'input');input.className='in'; if(type!=='textarea')input.type=type;
    input.value=draft[key]||''; input.setAttribute('aria-label',label);input.oninput=()=>draft[key]=input.value;
    wrap.append(caption,input);grid.append(wrap);return input;
  };
  field('Title','title','text',true).required=true;
  const uploads=document.createElement('div');uploads.className='span-all campaign-images';
  uploads.innerHTML='<span class="lbl">Campaign images</span><div class="image-previews"></div><label class="btn ghost">Add images<input type="file" accept="image/*" multiple hidden></label>';
  const uploadLabel=uploads.querySelector('label');uploadLabel.tabIndex=0;uploadLabel.setAttribute('role','button');uploadLabel.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();uploads.querySelector('input').click();}};
  const paint=()=>{const previews=uploads.querySelector('.image-previews');previews.replaceChildren();draft.images.forEach((file,index)=>{const tile=document.createElement('div');const img=document.createElement('img');img.src=file.url;img.alt=file.name;const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Remove ${file.name}`);remove.onclick=()=>{URL.revokeObjectURL(file.url);draft.images.splice(index,1);paint();};tile.append(img,remove);previews.append(tile);});};
  uploads.querySelector('input').onchange=e=>{for(const file of e.target.files)if(file.type.startsWith('image/'))draft.images.push({name:file.name,url:URL.createObjectURL(file)});e.target.value='';paint();};grid.append(uploads);paint();
  field('What you want','brief','textarea',true).required=true;
  const budget=field('Budget approx. (₹)','budget','number');budget.min='0';budget.placeholder='e.g. 20000';
  const timeline=document.createElement('div');timeline.className='fld';timeline.innerHTML='<span class="lbl">Timeline / shoot window</span><details class="multi-dropdown"><summary>Select date range</summary><div class="date-range-popup"><label>Start date<input type="date" required></label><label>End date<input type="date" required></label><button type="button">Apply dates</button></div></details>';grid.append(timeline);
  const dates=timeline.querySelectorAll('input');dates[0].value=draft.start||'';dates[1].value=draft.end||'';dates[1].min=dates[0].value;
  const setDates=()=>{draft.start=dates[0].value;draft.end=dates[1].value;dates[1].min=draft.start;timeline.querySelector('summary').textContent=draft.start&&draft.end?`${draft.start} — ${draft.end}`:'Select date range';};
  dates.forEach(input=>{input.onchange=setDates;input.oninvalid=()=>timeline.querySelector('details').open=true;});setDates();timeline.querySelector('button').onclick=()=>{if([...dates].every(input=>input.reportValidity()))timeline.querySelector('details').open=false;};
  field('Deliverables','deliverables').placeholder='e.g. 2 Reels, 3 Stories';
  const platforms=document.createElement('div');platforms.className='fld';platforms.innerHTML='<span class="lbl">Platforms</span><details class="multi-dropdown"><summary>Select platforms</summary><div class="multi-options"></div></details>';grid.append(platforms);
  for(const name of ['Instagram','YouTube','Facebook','TikTok','X','LinkedIn','Snapchat','Pinterest']){const label=document.createElement('label');label.className='multi-option';const check=document.createElement('input');check.type='checkbox';check.checked=draft.platforms.includes(name);check.onchange=()=>{draft.platforms=check.checked?[...draft.platforms,name]:draft.platforms.filter(p=>p!==name);platforms.querySelector('summary').textContent=draft.platforms.join(', ')||'Select platforms';};label.append(check,document.createTextNode(name));platforms.querySelector('.multi-options').append(label);}
  platforms.querySelector('summary').textContent=draft.platforms.join(', ')||'Select platforms';field('Location','location','text',true).placeholder='City or Remote';
  form.onsubmit=e=>{
    e.preventDefault();
    const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const campaign=source || {id:'c'+Date.now(),brand:'Chai Point',cat:'',hue:'#292d17',media:[]};
    Object.assign(campaign,{title:escape(draft.title),brief:escape(draft.brief),loc:escape(draft.location),start:draft.start,end:draft.end,approxBudget:draft.budget,budget:draft.budget?'₹'+Number(draft.budget).toLocaleString('en-IN'):'Not specified',time:draft.start+' — '+draft.end,window:draft.start+' — '+draft.end,del:draft.deliverables?draft.deliverables.split(',').map(item=>escape(item.trim())):[],plat:draft.platforms.join(', '),images:draft.images});
    if(!source)CAMPAIGNS.push(campaign);
    runtime.S.campaignDrafts[id]=undefined;
    go('campaigns');
  };
  host.append(form);
}
