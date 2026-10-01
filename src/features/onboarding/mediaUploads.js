import { CREATORS } from '../../mocks/creators.js';
import { cropMedia, applyMediaCrop } from '../../components/ui/mediaCrop.js';
import { runtime } from '../../context/runtime.js';

export function setupOnboardingMedia(root, route) {
  if (route !== 'onboard' || root.dataset.side !== 'creator') return;
  const old = root.querySelector('.upl');
  if (!old) return;
  const items = runtime.S.onboardingMedia ||= [];
  const row = document.createElement('div'); row.className = 'onboarding-media';
  row.setAttribute('aria-label', 'Portfolio images and videos');
  const input = document.createElement('input'); input.type = 'file';
  input.accept = 'image/*,video/*'; input.multiple = true; input.hidden = true;
  const upload = document.createElement('button'); upload.type = 'button';
  upload.className = 'onboarding-upload'; upload.innerHTML = '<span aria-hidden="true">+</span><span>Upload</span><small>Photos / videos</small>';
  upload.onclick = () => input.click();
  const paint = () => {
    CREATORS[0].images=items;
    row.replaceChildren();
    items.forEach((item, index) => {
      const tile = document.createElement('div'); tile.className = 'onboarding-media-tile';
      const media = document.createElement(item.video ? 'video' : 'img');
      media.src = item.url;applyMediaCrop(media,item.crop);
      if (item.video) { media.controls = true; media.preload = 'metadata'; media.playsInline = true; }
      else media.alt = item.name;
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'onboarding-media-remove'; remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
      remove.setAttribute('aria-label', 'Remove ' + item.name);
      remove.onclick = () => { URL.revokeObjectURL(item.url); items.splice(index, 1); paint(); };
      tile.append(media, remove); row.append(tile);
    });
    row.append(upload, input);
  };
  input.onchange = async () => {
    for (const file of [...input.files]) {
      if (/^(image|video)\//.test(file.type)) {const result=await cropMedia(file);if(result)items.push(result);}
    }
    input.value = ''; paint();
    requestAnimationFrame(() => row.scrollTo({left:row.scrollWidth, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  };
  old.replaceWith(row); paint();
}
