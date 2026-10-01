// Keep the source intact; crop metadata can be sent with it to the backend.
export function applyMediaCrop(media, crop) {
  if (!crop) return;
  media.style.objectPosition = `${crop.x}% ${crop.y}%`;
  media.style.transformOrigin = `${crop.x}% ${crop.y}%`;
  media.style.transform = `scale(${crop.zoom})`;
}

export function cropMedia(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file), video = file.type.startsWith('video/');
    const dialog = document.createElement('dialog'); dialog.className = 'media-crop-dialog';
    dialog.setAttribute('aria-labelledby', 'media-crop-title');
    dialog.innerHTML = '<h3 id="media-crop-title">Crop your media</h3><p>4:5 portrait · Drag to reposition or use the controls.</p><div class="media-crop-frame"></div><p class="crop-error" role="status">Loading preview…</p><div class="crop-controls"></div><div class="crop-actions"><button type="button" data-cancel>Cancel</button><button type="button" data-save disabled>Use crop</button></div>';
    const frame = dialog.querySelector('.media-crop-frame');
    const media = document.createElement(video ? 'video' : 'img');
    const crop = {aspect: '4:5', x:50, y:50, zoom:1};
    media.draggable = false;
    if(video) {media.muted=true;media.loop=true;media.playsInline=true;media.preload='auto';}
    else media.alt='Crop preview';
    const inputs = {};
    const paint = () => {applyMediaCrop(media,crop);for(const key in inputs)inputs[key].value=crop[key];};
    for(const [key,label,min,max,step] of [['zoom','Zoom',1,3,.01],['x','Horizontal position',0,100,1],['y','Vertical position',0,100,1]]) {
      const wrap=document.createElement('label');wrap.textContent=label;
      const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=crop[key];
      input.oninput=()=>{crop[key]=Number(input.value);paint();};inputs[key]=input;wrap.append(input);dialog.querySelector('.crop-controls').append(wrap);
    }
    let drag, done=false;
    frame.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,cx:crop.x,cy:crop.y};frame.setPointerCapture(e.pointerId);};
    frame.onpointermove=e=>{if(!drag)return;const r=frame.getBoundingClientRect();crop.x=Math.max(0,Math.min(100,drag.cx-(e.clientX-drag.x)/r.width*100));crop.y=Math.max(0,Math.min(100,drag.cy-(e.clientY-drag.y)/r.height*100));paint();};
    frame.onpointerup=frame.onpointercancel=()=>{drag=null;};
    const finish = accepted => {if(done)return;done=true;media.pause?.();dialog.close();dialog.remove();if(!accepted)URL.revokeObjectURL(url);resolve(accepted?{name:file.name,url,video,crop:{...crop},file}:null);};
    dialog.querySelector('[data-cancel]').onclick=()=>finish(false);
    dialog.querySelector('[data-save]').onclick=()=>finish(true);
    dialog.addEventListener('cancel',e=>{e.preventDefault();finish(false);});
    dialog.addEventListener('keydown',e=>e.stopPropagation());
    const loaded=()=>{dialog.querySelector('.crop-error').textContent='';dialog.querySelector('[data-save]').disabled=false;if(video)media.play().catch(()=>{});};
    media.addEventListener(video?'loadeddata':'load',loaded,{once:true});
    media.onerror=()=>{dialog.querySelector('.crop-error').textContent='This file cannot be previewed. Please choose another file.';};
    frame.append(media);document.body.append(dialog);dialog.showModal();media.src=url;paint();
  });
}
