import { PHOTO } from "../ui/icons.js";

const escapeAttr=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mediaMarkup(item){
 if(!item?.url)return '';
 const crop=item.crop||{x:50,y:50,zoom:1};
 const style='object-position:'+Number(crop.x)+'% '+Number(crop.y)+'%;transform-origin:'+Number(crop.x)+'% '+Number(crop.y)+'%;transform:scale('+Number(crop.zoom)+')';
 return item.video?'<video class="card-source-media" src="'+escapeAttr(item.url)+'" style="'+style+'" muted loop autoplay playsinline></video>':'<img class="card-source-media" src="'+escapeAttr(item.url)+'" alt="'+escapeAttr(item.name)+'" style="'+style+'">';
}
export function campCard(c, cls) {
  return `<div class="cd ${cls} split" data-id="${c.id}">
  <div class="shot" style="background:linear-gradient(152deg,${c.hue},#111012 64%)"><div class="gr"></div><div class="gl"></div>
    ${c.images?.length?mediaMarkup(c.images[0]):`<div class="ic">${PHOTO}<span>Campaign visual</span></div>`}</div>
  <div class="cbody"><div class="bl"><span class="lg">${c.brand[0]}</span><b>${c.brand} <span class="tick">✓</span></b></div>
    <div class="ttl">${c.title}</div><span class="sub">${c.cat}</span>
    <div class="stats"><div class="stat"><strong>${c.budget}</strong><span>Budget</span></div>
      <div class="stat"><strong>${c.time}</strong><span>Timeline</span></div>
      <div class="stat"><strong>${c.apply}</strong><span>Apply by</span></div></div>
    <div class="pills">${c.del.map(d => `<span class="pill">${d}</span>`).join("")}<span class="pill">${c.loc}</span><span class="pill">${c.min}+</span></div></div></div>`;
}
export function creaCard(u, cls) {
  return `<div class="cd ${cls} grad" data-id="${u.id}"><div class="vb">✓</div>
  <div class="shot" style="background:linear-gradient(152deg,${u.hue},#101210 64%)"><div class="gr"></div><div class="gl"></div>
    ${u.images?.length?mediaMarkup(u.images[0]):`<div class="ic">${PHOTO}<span>Creator photo</span></div>`}</div>
  <div class="cbody"><div class="ttl">${u.name}</div><span class="sub">${u.loc}</span>
    <div class="stats"><div class="stat"><strong>${u.followers}</strong><span>Audience</span></div>
      <div class="stat"><strong>${u.eng}</strong><span>Engagement</span></div>
      <div class="stat"><strong>${u.plat}</strong><span>Platforms</span></div></div>
    <div class="pills">${u.tags.map(t => `<span class="pill">${t}</span>`).join("")}</div></div></div>`;
}
