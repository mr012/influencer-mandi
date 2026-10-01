const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const fromISO = value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d); };
export const rangeLabel = (start,end) => start && end ? `${fromISO(start).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})} – ${fromISO(end).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}` : 'Select date range';

export function openDateRange({start='',end='',onApply}) {
  const dialog=document.createElement('dialog');dialog.className='date-range-dialog';
  dialog.setAttribute('aria-label','Select campaign date range');
  dialog.innerHTML='<div class="range-heading"><h3>Campaign timeline</h3><button type="button" aria-label="Close calendar">×</button></div><p class="range-hint" aria-live="polite"></p><div class="range-month-nav"><button type="button" data-prev aria-label="Previous month">‹</button><span>Choose a start and end date</span><button type="button" data-next aria-label="Next month">›</button></div><div class="range-months"></div><p class="range-selection" aria-live="polite"></p><div class="range-actions"><button type="button" data-clear>Clear</button><button type="button" data-apply>Apply dates</button></div>';
  let first=start,last=end, month=start?fromISO(start):new Date();month=new Date(month.getFullYear(),month.getMonth(),1);
  const render = () => {
    const months=dialog.querySelector('.range-months');months.replaceChildren();
    dialog.querySelector('.range-hint').textContent=first&&!last?'Choose your end date.':'Choose your start date, then your end date.';
    for(let offset=0;offset<2;offset++) {
      const date=new Date(month.getFullYear(),month.getMonth()+offset,1);
      const section=document.createElement('section');const heading=document.createElement('h4');heading.textContent=date.toLocaleDateString(undefined,{month:'long',year:'numeric'});
      const grid=document.createElement('div');grid.className='range-days';
      for(const day of ['Mo','Tu','We','Th','Fr','Sa','Su']) {const label=document.createElement('span');label.textContent=day;grid.append(label);}
      for(let i=0;i<(date.getDay()+6)%7;i++)grid.append(document.createElement('span'));
      const days=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
      for(let day=1;day<=days;day++) {
        const value=iso(new Date(date.getFullYear(),date.getMonth(),day));const b=document.createElement('button');b.type='button';b.textContent=day;
        b.setAttribute('aria-label',fromISO(value).toLocaleDateString(undefined,{dateStyle:'full'}));
        const selected=value===first||value===last;b.className=selected?'endpoint':first&&last&&value>first&&value<last?'in-range':'';b.setAttribute('aria-pressed',String(selected));
        b.onclick=()=>{if(!first||last){first=value;last='';}else if(value<first){last=first;first=value;}else last=value;render();dialog.querySelector(`[data-date="${value}"]`)?.focus();};b.dataset.date=value;grid.append(b);
      }
      section.append(heading,grid);months.append(section);
    }
    dialog.querySelector('.range-selection').textContent=first&&last?rangeLabel(first,last):first?'Start: '+rangeLabel(first,first).split(' – ')[0]:'No dates selected';
    dialog.querySelector('[data-apply]').disabled=!(first&&last);
  };
  const close=()=>{dialog.close();dialog.remove();};
  dialog.querySelector('[aria-label="Close calendar"]').onclick=close;
  dialog.oncancel=e=>{e.preventDefault();close();};dialog.onkeydown=e=>e.stopPropagation();
  for(const [selector,delta] of [['[data-prev]',-1],['[data-next]',1]])dialog.querySelector(selector).onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+delta,1);render();};
  dialog.querySelector('[data-clear]').onclick=()=>{first='';last='';render();};
  dialog.querySelector('[data-apply]').onclick=()=>{onApply(first,last);close();};
  document.body.append(dialog);render();dialog.showModal();
}
