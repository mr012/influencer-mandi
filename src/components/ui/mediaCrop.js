import { dims, fillScale, fitZoom, clamp, paintPhoto, paintFramed, cropRect as sourceCropRect } from './cropGeometry.js';
import styles from './mediaCrop.css?inline';
import markup from './mediaCropMarkup.html?raw';
import { cropVideo } from './videoCrop.js';
export { applyMediaCrop } from './videoCrop.js';

export async function cropMedia(file, aspect = '4:5') {
  if (file.type.startsWith('video/')) return cropVideo(file, aspect);
  const out = await cropPhotos([file], aspect === '1:1' ? 'logo' : 'creator');
  return out?.[0] || null;
}

// The reference editor is isolated from the app's similarly named CSS classes.
// Exported images are already cropped; cropData retains source-pixel metadata.
export function cropPhotos(files, mode = 'creator', initialStates = []) {
  return new Promise(resolve => {
    const opener = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', 'Edit media');
    dialog.style.cssText = 'position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;';
    const host = document.createElement('div'); dialog.append(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${styles}</style>${markup}`;
    document.body.append(dialog);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let finished = false, controller;
    function finish(value) {
      if (finished) return;
      finished = true; controller?.dispose(); dialog.close(); dialog.remove();
      document.body.style.overflow = overflow; opener?.focus(); resolve(value);
    }
    dialog.addEventListener('cancel', e => { e.preventDefault(); finish(null); });
    dialog.showModal();
    controller = setup();
    controller.start(files, mode).catch(() => { finish(null); window.alert('These photos could not be opened. Please try JPEG, PNG or WebP.'); });
    function setup() {

  const $ = (s) => root.querySelector(s);
  // One config per upload place. aspect = width / height of the saved photo.
  const MODES = {
    creator: { aspect: 4 / 5, out: [1080, 1350], multi: true, role: 'creator', title: ['Edit photo', 'Edit photos'],
      note: 'The first photo is your cover. Every photo is saved at 4:5.', guideNote: 'Shade the area the name and stats cover' },
    logo: { aspect: 1, out: [600, 600], multi: false, role: 'brand', title: ['Brand photo', 'Brand photo'],
      note: 'Used as your logo on every campaign card and on your profile.', guideNote: 'Show the rounded corners cards cut off' },
    campaign: { aspect: 4 / 5, out: [1080, 1350], multi: true, role: 'brand', title: ['Campaign photo', 'Campaign photos'],
      note: 'The first photo is the cover. The card shows its middle band; details show every photo in full.', guideNote: 'Mark the band the discovery card shows' },
  };
  const CARD_BAND = 0.58;   // campaign card: visible band of the 4:5 cover (shot height / photo height)
  const LOGO_RADIUS = 0.3;  // card logo corner radius / logo size (9px on 30px)
  let ASPECT = 4 / 5, OUT_W = 1080, OUT_H = 1350;
  const MAX_ZOOM = 5;                        // 5x past "fill"
  const GUIDE = 0.40;                        // share of the card the info panel covers
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ---------- Crop maths ----------
  // Each item: { src (image/canvas), name, rot, zoom, fx, fy, fit, saved }
  //   zoom: 1 = photo just fills the frame; <1 only allowed in Fit mode.
  //   fx, fy: point of the (rotated) photo at the centre of the frame, 0..1.
  const cropRect = it => sourceCropRect(it, ASPECT);
  function exportCrop(it) {
    const c = document.createElement('canvas'); c.width = OUT_W; c.height = OUT_H;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
    g.fillStyle = '#000'; g.fillRect(0, 0, OUT_W, OUT_H);
    paintFramed(g, it, 0, 0, OUT_W, OUT_H);
    return c.toDataURL('image/jpeg', .9);
  }

  // ---------- Editor ----------
  const stage = $('#stage'), sc = $('#stageCanvas'), pc = $('#previewCanvas');
  const zoomInput = $('#zoom');
  const editor = {
    open: false, items: [], cur: 0, guide: true, frame: null,
    get it() { return this.items[this.cur]; },

    start(items, mode = 'creator') {
      this.mode = mode; this.cfg = MODES[mode];
      ASPECT = this.cfg.aspect; [OUT_W, OUT_H] = this.cfg.out;
      if (!this.cfg.multi) items = items.slice(0, 1);
      root.host.dataset.role = this.cfg.role;
      $('.editor').dataset.mode = mode;
      $('#footNote').textContent = this.cfg.note;
      $('#guideNote').textContent = this.cfg.guideNote;
      $('#bgpick').classList.toggle('show', mode === 'logo');
      this.items = items.map((src, i) => ({ src, name: src.dataset?.name || `Photo ${i + 1}`, rot: 0, zoom: 1, fx: .5, fy: .5, fit: false, saved: false, bg: mode === 'logo' ? '#ffffff' : 'blur' }));
      this.syncBg();
      this.cur = 0; this.open = true;
      this.backup = null;
      $('#scrim').classList.add('on');

      $('#hint').classList.remove('gone');
      this.layout(); this.sync(); stage.focus({ preventScroll: true });
    },
    syncBg() {
      const it = this.it; if (!it) return;
      root.querySelectorAll('[data-bg]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.bg === it.bg)));
    },
    close() { this.open = false; finish(null); },
    layout() {
      const r = stage.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      sc.width = Math.round(r.width * dpr); sc.height = Math.round(r.height * dpr);
      const pad = Math.max(20, Math.min(r.width, r.height) * .07);
      let fh = r.height - pad * 2, fw = fh * ASPECT;
      if (fw > r.width - pad * 2) { fw = r.width - pad * 2; fh = fw / ASPECT; }
      this.frame = { x: (r.width - fw) / 2, y: (r.height - fh) / 2, w: fw, h: fh, dpr, W: r.width, H: r.height };
      const pr = pc.getBoundingClientRect(); pc.width = Math.round(pr.width * dpr) || 1; pc.height = Math.round(pr.height * dpr) || 1;
      this.draw();
    },
    draw() {
      if (!this.open || !this.frame) return;
      const f = this.frame, it = this.it, g = sc.getContext('2d');
      clamp(it, f.w, f.h);
      g.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
      g.clearRect(0, 0, f.W, f.H);
      // Whole photo, dimmed, so people see what falls outside the frame.
      g.save(); g.globalAlpha = .32; paintPhoto(g, it, f.x, f.y, f.w, f.h); g.restore();
      paintFramed(g, it, f.x, f.y, f.w, f.h);
      // Frame edge and corner marks
      const acc = getComputedStyle(root.host).getPropertyValue('--accent').trim() || '#ff3d00';
      g.strokeStyle = 'rgba(245,243,239,.85)'; g.lineWidth = 1; g.strokeRect(f.x + .5, f.y + .5, f.w - 1, f.h - 1);
      g.strokeStyle = acc; g.lineWidth = 3; const L = Math.min(26, f.w * .1);
      [[f.x, f.y, 1, 1], [f.x + f.w, f.y, -1, 1], [f.x, f.y + f.h, 1, -1], [f.x + f.w, f.y + f.h, -1, -1]].forEach(([x, y, sx, sy]) => {
        g.beginPath(); g.moveTo(x, y + sy * L); g.lineTo(x, y); g.lineTo(x + sx * L, y); g.stroke();
      });
      // Thirds grid while moving
      if (this.moving) {
        g.strokeStyle = 'rgba(245,243,239,.35)'; g.lineWidth = 1; g.beginPath();
        for (let k = 1; k < 3; k++) { g.moveTo(f.x + f.w * k / 3, f.y); g.lineTo(f.x + f.w * k / 3, f.y + f.h); g.moveTo(f.x, f.y + f.h * k / 3); g.lineTo(f.x + f.w, f.y + f.h * k / 3); }
        g.stroke();
      }
      const mode = this.mode;
      if (this.guide && mode === 'logo') {           // rounded-square logo: shade the corners cards cut off
        const r = f.w * LOGO_RADIUS;
        g.save(); g.beginPath(); g.rect(f.x, f.y, f.w, f.h);
        g.moveTo(f.x + r, f.y); g.arcTo(f.x, f.y, f.x, f.y + r, r); g.lineTo(f.x, f.y + f.h - r); g.arcTo(f.x, f.y + f.h, f.x + r, f.y + f.h, r);
        g.lineTo(f.x + f.w - r, f.y + f.h); g.arcTo(f.x + f.w, f.y + f.h, f.x + f.w, f.y + f.h - r, r); g.lineTo(f.x + f.w, f.y + r); g.arcTo(f.x + f.w, f.y, f.x + f.w - r, f.y, r); g.closePath();
        g.fillStyle = 'rgba(10,10,11,.62)'; g.fill('evenodd');
        g.setLineDash([5, 5]); g.strokeStyle = 'rgba(245,243,239,.55)'; g.stroke(); g.setLineDash([]); g.restore();
      }
      if (this.guide && mode === 'campaign') {      // middle band the split discovery card shows
        const bh = f.h * CARD_BAND, by = f.y + (f.h - bh) / 2;
        g.fillStyle = 'rgba(10,10,11,.55)'; g.fillRect(f.x, f.y, f.w, by - f.y); g.fillRect(f.x, by + bh, f.w, f.y + f.h - by - bh);
        g.setLineDash([5, 5]); g.strokeStyle = 'rgba(245,243,239,.6)'; g.beginPath(); g.moveTo(f.x, by); g.lineTo(f.x + f.w, by); g.moveTo(f.x, by + bh); g.lineTo(f.x + f.w, by + bh); g.stroke(); g.setLineDash([]);
        g.fillStyle = 'rgba(245,243,239,.8)'; g.font = '500 12px Inter, sans-serif'; g.textAlign = 'center';
        g.fillText(this.cur === 0 ? 'Shows on the discovery card' : 'Would show on the card if this were the cover', f.x + f.w / 2, by + 20);
        g.fillStyle = 'rgba(245,243,239,.55)'; g.fillText('Only in campaign details', f.x + f.w / 2, f.y + (by - f.y) / 2 + 4);
      }
      // Card guide: the area the name and stats cover on the discovery card
      if (this.guide && mode === 'creator') {
        const gy = f.y + f.h * (1 - GUIDE);
        const grad = g.createLinearGradient(0, gy - f.h * .06, 0, f.y + f.h);
        grad.addColorStop(0, 'rgba(10,10,11,0)'); grad.addColorStop(.3, 'rgba(10,10,11,.55)'); grad.addColorStop(1, 'rgba(10,10,11,.72)');
        g.fillStyle = grad; g.fillRect(f.x, gy - f.h * .06, f.w, f.h * GUIDE + f.h * .06);
        g.setLineDash([5, 5]); g.strokeStyle = 'rgba(245,243,239,.5)'; g.beginPath(); g.moveTo(f.x, gy); g.lineTo(f.x + f.w, gy); g.stroke(); g.setLineDash([]);
        g.fillStyle = 'rgba(245,243,239,.75)'; g.font = '500 12px Inter, sans-serif'; g.textAlign = 'center';
        g.fillText('Name and stats sit here on your card', f.x + f.w / 2, gy + 22);
      }
      // Live card preview
      if (mode === 'creator') {
        const p = pc.getContext('2d');
        p.setTransform(1, 0, 0, 1, 0, 0); p.clearRect(0, 0, pc.width, pc.height);
        paintFramed(p, it, 0, 0, pc.width, pc.height);
      } else if (mode === 'campaign') {
        // Same as the live card: object-fit cover + centred, so only the middle band is visible.
        const bc = $('#bandCanvas'), r = bc.getBoundingClientRect(), dpr = f.dpr;
        if (r.width) {
          bc.width = Math.round(r.width * dpr); bc.height = Math.round(r.height * dpr);
          const b = bc.getContext('2d'), fw = bc.width, fh = fw / ASPECT;
          b.fillStyle = '#111'; b.fillRect(0, 0, bc.width, bc.height);
          paintFramed(b, it, 0, (bc.height - fh) / 2, fw, fh);
        }
        $('#pvCampTitle').textContent = this.cur === 0 ? 'On the discovery card' : 'On the card, if this were the cover';
      } else {
        [['#logoSmall'], ['#logoBig']].forEach(([sel]) => { const c = $(sel), b = c.getContext('2d'); b.clearRect(0, 0, c.width, c.height); paintFramed(b, it, 0, 0, c.width, c.height); });
      }
      this.syncControls();
    },
    syncControls() {
      const it = this.it, f = this.frame, minZ = it.fit ? fitZoom(it, f.w, f.h) : 1;
      const t = (Math.log(it.zoom) - Math.log(minZ)) / (Math.log(MAX_ZOOM) - Math.log(minZ) || 1);
      zoomInput.value = Math.round(Math.max(0, Math.min(1, t)) * 1000);
      zoomInput.style.setProperty('--p', (zoomInput.value / 10) + '%');
      $('#zoomOut2').textContent = Math.round(it.zoom * 100) + '%';
      zoomInput.setAttribute('aria-valuetext', Math.round(it.zoom * 100) + ' percent');
      $('#fillBtn').setAttribute('aria-pressed', String(!it.fit));
      $('#fitBtn').setAttribute('aria-pressed', String(it.fit));
    },
    sync() {
      const n = this.items.length;
      $('#edCount').textContent = n > 1 ? `${this.cur + 1} of ${n}` : '';
      $('#edTitle').textContent = this.cfg.title[n > 1 ? 1 : 0];
      $('#saveBtn').textContent = n > 1 ? `Save ${n} photos` : 'Save photo';
      this.syncBg();
      $('#coverBtn').disabled = this.cur === 0;
      $('#removeBtn').disabled = n === 1;
      $('#guideBtn').setAttribute('aria-pressed', String(this.guide));
      $('#guideSwitch').checked = this.guide;
      const strip = $('#strip'); strip.innerHTML = '';
      this.items.forEach((it, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'thumb'; b.setAttribute('role', 'option');
        b.setAttribute('aria-current', String(i === this.cur)); b.setAttribute('aria-selected', String(i === this.cur));
        b.setAttribute('aria-label', `${it.name}${i === 0 ? ', cover' : ''}${it.saved ? ', edited' : ''}`);
        const c = document.createElement('canvas'); c.width = 116; c.height = 145;
        const g = c.getContext('2d'); const f = this.frame;
        if (f) clamp(it, f.w, f.h);
        paintFramed(g, it, 0, 0, 116, 145);
        b.append(c);
        if (i === 0) { const s = document.createElement('span'); s.className = 'cover'; s.textContent = 'Cover'; b.append(s); }
        if (it.touched) { const s = document.createElement('span'); s.className = 'done'; s.innerHTML = '<svg class="i" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>'; b.append(s); }
        b.addEventListener('click', () => { this.cur = i; this.sync(); this.draw(); });
        strip.append(b);
      });
      const add = document.createElement('button');
      add.type = 'button'; add.className = 'add-thumb'; add.setAttribute('aria-label', 'Add more photos');
      add.innerHTML = '<svg class="i" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
      add.addEventListener('click', () => $('#addMore').click());
      strip.append(add);
      this.draw();
    },
    touch() { this.it.touched = true; },
    refreshThumb() {
      const b = $('#strip').children[this.cur]; if (!b) return;
      const c = b.querySelector('canvas'); const g = c.getContext('2d'); g.clearRect(0, 0, 116, 145);
      paintFramed(g, this.it, 0, 0, 116, 145);
      if (!b.querySelector('.done')) { const s = document.createElement('span'); s.className = 'done'; s.innerHTML = '<svg class="i" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>'; b.append(s); }
    },
    // Move by screen pixels
    pan(dx, dy) {
      const it = this.it, f = this.frame, d = dims(it), s = fillScale(it, f.w, f.h) * it.zoom;
      it.fx -= dx / (d.w * s); it.fy -= dy / (d.h * s);
      this.touch(); this.draw();
    },
    // Zoom keeping the photo point under (px, py) — frame coordinates — still
    zoomAt(z, px, py) {
      const it = this.it, f = this.frame, d = dims(it);
      if (px == null) { px = f.w / 2; py = f.h / 2; }
      const s0 = fillScale(it, f.w, f.h) * it.zoom;
      const u = it.fx + (px - f.w / 2) / (d.w * s0), v = it.fy + (py - f.h / 2) / (d.h * s0);
      it.zoom = z; clamp(it, f.w, f.h);
      const s1 = fillScale(it, f.w, f.h) * it.zoom;
      it.fx = u - (px - f.w / 2) / (d.w * s1); it.fy = v - (py - f.h / 2) / (d.h * s1);
      this.touch(); this.draw(); this.hideHint();
    },
    animateTo(target) {
      const it = this.it, from = { zoom: it.zoom, fx: it.fx, fy: it.fy };
      if (reduced) { Object.assign(it, target); this.touch(); this.draw(); this.refreshThumb(); return; }
      const animation = this.animation = (this.animation || 0) + 1;
      const t0 = performance.now();
      const step = (t) => {
        if (!editor.open || editor.it !== it || editor.animation !== animation) return;
        const k = Math.min(1, (t - t0) / 220), e = 1 - Math.pow(1 - k, 3);
        it.zoom = from.zoom + (target.zoom - from.zoom) * e;
        it.fx = from.fx + (target.fx - from.fx) * e; it.fy = from.fy + (target.fy - from.fy) * e;
        this.draw();
        if (k < 1) requestAnimationFrame(step); else this.refreshThumb();
      };
      this.touch(); requestAnimationFrame(step);
    },
    hideHint() { $('#hint').classList.add('gone'); },
  };

  // ---------- Pointer: drag, pinch, wheel, double-click ----------
  const pts = new Map(); let pinch = null, last = null;
  const local = (e) => { const r = stage.getBoundingClientRect(), f = editor.frame; return { x: e.clientX - r.left - f.x, y: e.clientY - r.top - f.y }; };
  stage.addEventListener('pointerdown', (e) => {
    stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    editor.moving = true; stage.classList.add('dragging'); editor.hideHint();
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: editor.it.zoom }; }
    last = { x: e.clientX, y: e.clientY }; editor.draw();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()], r = stage.getBoundingClientRect(), f = editor.frame;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      editor.zoomAt(pinch.z * d / Math.max(1, pinch.d), (a.x + b.x) / 2 - r.left - f.x, (a.y + b.y) / 2 - r.top - f.y);
      return;
    }
    if (pts.size === 1 && last) { editor.pan(e.clientX - last.x, e.clientY - last.y); last = { x: e.clientX, y: e.clientY }; }
  });
  const end = (e) => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    if (pts.size === 1) last = [...pts.values()][0];
    if (!pts.size) { editor.moving = false; stage.classList.remove('dragging'); last = null; editor.draw(); editor.refreshThumb(); }
  };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  stage.addEventListener('wheel', (e) => {
    e.preventDefault(); const p = local(e);
    editor.zoomAt(editor.it.zoom * Math.exp(-e.deltaY * .0016), p.x, p.y);
    clearTimeout(editor.wt); editor.wt = setTimeout(() => editor.refreshThumb(), 200);
  }, { passive: false });
  stage.addEventListener('dblclick', (e) => {
    const it = editor.it, p = local(e), f = editor.frame, d = dims(it);
    const target = it.zoom > 1.4 ? 1 : 2;
    const s0 = fillScale(it, f.w, f.h) * it.zoom, u = it.fx + (p.x - f.w / 2) / (d.w * s0), v = it.fy + (p.y - f.h / 2) / (d.h * s0);
    const s1 = fillScale(it, f.w, f.h) * target;
    const t = { zoom: target, fx: u - (p.x - f.w / 2) / (d.w * s1), fy: v - (p.y - f.h / 2) / (d.h * s1) };
    const probe = { ...it, ...t }; clamp(probe, f.w, f.h);
    editor.animateTo({ zoom: probe.zoom, fx: probe.fx, fy: probe.fy });
  });

  // ---------- Controls ----------
  zoomInput.addEventListener('input', () => {
    const it = editor.it, f = editor.frame, minZ = it.fit ? fitZoom(it, f.w, f.h) : 1;
    const z = Math.exp(Math.log(minZ) + (zoomInput.value / 1000) * (Math.log(MAX_ZOOM) - Math.log(minZ)));
    editor.zoomAt(z);
  });
  zoomInput.addEventListener('change', () => editor.refreshThumb());
  $('#zoomIn').addEventListener('click', () => { editor.zoomAt(editor.it.zoom * 1.25); editor.refreshThumb(); });
  $('#zoomOut').addEventListener('click', () => { editor.zoomAt(editor.it.zoom / 1.25); editor.refreshThumb(); });
  $('#fillBtn').addEventListener('click', () => { const it = editor.it; it.fit = false; editor.animateTo({ zoom: Math.max(1, it.zoom < 1 ? 1 : it.zoom), fx: it.fx, fy: it.fy }); });
  $('#fitBtn').addEventListener('click', () => { const it = editor.it, f = editor.frame; it.fit = true; editor.animateTo({ zoom: fitZoom(it, f.w, f.h), fx: .5, fy: .5 }); });
  root.querySelectorAll('[data-bg]').forEach((b) => b.addEventListener('click', () => { editor.it.bg = b.dataset.bg; editor.syncBg(); editor.touch(); editor.draw(); editor.refreshThumb(); }));
  $('#rotateBtn').addEventListener('click', () => { const it = editor.it; it.rot = (it.rot + 90) % 360; it.zoom = it.fit ? 0 : 1; it.fx = it.fy = .5; editor.touch(); editor.draw(); editor.refreshThumb(); });
  $('#resetBtn').addEventListener('click', () => { Object.assign(editor.it, { rot: 0, zoom: 1, fx: .5, fy: .5, fit: false }); editor.draw(); editor.refreshThumb(); });
  const setGuide = (on) => { editor.guide = on; $('#guideBtn').setAttribute('aria-pressed', String(on)); $('#guideSwitch').checked = on; $('#previewInfo').style.opacity = on ? 1 : .35; editor.draw(); };
  $('#guideBtn').addEventListener('click', () => setGuide(!editor.guide));
  $('#guideSwitch').addEventListener('change', (e) => setGuide(e.target.checked));
  $('#coverBtn').addEventListener('click', () => { const [it] = editor.items.splice(editor.cur, 1); editor.items.unshift(it); editor.cur = 0; editor.sync(); });
  $('#removeBtn').addEventListener('click', () => { if (editor.items.length < 2) return; editor.items.splice(editor.cur, 1); editor.cur = Math.min(editor.cur, editor.items.length - 1); editor.sync(); });
  $('#previewToggle').addEventListener('click', (e) => {
    const on = !$('#side').classList.contains('show'); $('#side').classList.toggle('show', on); e.currentTarget.setAttribute('aria-pressed', String(on));
    if (on) requestAnimationFrame(() => editor.layout());
  });
  $('#closeBtn').addEventListener('click', () => editor.close());
  $('#cancelBtn').addEventListener('click', () => editor.close());
  $('#scrim').addEventListener('mousedown', (e) => { if (e.target === e.currentTarget) editor.close(); });
  $('#saveBtn').addEventListener('click', () => {
    try {
      const out = editor.items.map((it, i) => {
        const data = exportCrop(it), bytes = Uint8Array.from(atob(data.split(',')[1]), c => c.charCodeAt(0));
        const file = new File([bytes], it.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' });
        return { name: it.name, file, original: it.src.original, url: URL.createObjectURL(file), video: false,
          crop: { x: 50, y: 50, zoom: 1, aspect: editor.mode === 'logo' ? '1:1' : '4:5' },
          cropData: { mode: editor.mode, order: i, cover: i === 0, crop: cropRect(it), rotation: it.rot,
            fit: it.fit, background: it.bg, output: { width: OUT_W, height: OUT_H } },
          editorState: { rot: it.rot, zoom: it.zoom, fx: it.fx, fy: it.fy, fit: it.fit, bg: it.bg } };
      });
      finish(out);
    } catch { $('#cropStatus').textContent = 'Unable to save this crop. Try a smaller photo.'; }

  });

  stage.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 40 : 8;
    const map = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (map[e.key]) { e.preventDefault(); editor.pan(...map[e.key]); editor.refreshThumb(); }
  });
  root.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (!editor.open) return;
    if (e.target.matches('input[type=range]') && e.key.startsWith('Arrow')) return;
    if (e.key === 'Escape') { e.preventDefault(); editor.close(); }
    else if (e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); $('#saveBtn').click(); }
    else if (e.key === '+' || e.key === '=') { editor.zoomAt(editor.it.zoom * 1.15); editor.refreshThumb(); }
    else if (e.key === '-' || e.key === '_') { editor.zoomAt(editor.it.zoom / 1.15); editor.refreshThumb(); }
    else if (e.key === 'r' || e.key === 'R') $('#rotateBtn').click();
    else if (e.key === '0') $('#resetBtn').click();
    else if (e.key === 'Tab') { // keep focus inside the dialog
      const f = [...root.querySelectorAll('.editor button:not([disabled]), .editor input, .editor [tabindex="0"]')].filter((x) => x.offsetParent);
      if (!f.length) return; const i = f.indexOf(root.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  const observer = new ResizeObserver(() => editor.open && editor.layout()); observer.observe(stage);

  // ---------- Opening ----------
  async function loadFiles(files) {
    const images = await Promise.all([...files].filter(f => f.type.startsWith('image/')).map(file => new Promise(resolve => {
      const src = new Image(), url = URL.createObjectURL(file);
      src.onload = () => { URL.revokeObjectURL(url); src.dataset.name = file.name; src.original = file; resolve(src); };
      src.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      src.src = url;
    })));
    if (images.some(i => !i)) $('#cropStatus').textContent = 'Some photos could not be opened. Try JPEG, PNG or WebP.';
    return images.filter(Boolean);
  }
  $('#addMore').addEventListener('change', async (e) => {
    const l = await loadFiles(e.target.files); e.target.value = '';
    if (!editor.open) return;
    l.forEach((src) => editor.items.push({ src, name: src.dataset.name, rot: 0, zoom: 1, fx: .5, fy: .5, fit: false, bg: 'blur' }));
    if (l.length) { editor.cur = editor.items.length - l.length; editor.sync(); }
  });


  return { async start(files, mode) {
    const images = await loadFiles(files);
    if (finished) return;
    if (!images.length) throw new Error('No readable photos');
    editor.start(images, mode);
    editor.items.forEach(it => { const index = [...files].indexOf(it.src.original); if (initialStates[index]) Object.assign(it, initialStates[index]); });
    editor.sync();
  }, dispose() { editor.open = false; observer.disconnect(); clearTimeout(editor.wt); } };

    }
  });
}
