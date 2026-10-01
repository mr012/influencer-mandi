// Source-pixel geometry and rendering from the supplied media crop reference.
const MAX_ZOOM = 5;
export const dims = (it) => {
    const w = it.src.naturalWidth || it.src.width, h = it.src.naturalHeight || it.src.height;
    return it.rot % 180 ? { w: h, h: w } : { w, h };
  };
export const fillScale = (it, fw, fh) => { const d = dims(it); return Math.max(fw / d.w, fh / d.h); };
export const fitZoom = (it, fw, fh) => { const d = dims(it); return Math.min(fw / d.w, fh / d.h) / fillScale(it, fw, fh); };
export function clamp(it, fw, fh) {
    const minZ = it.fit ? fitZoom(it, fw, fh) : 1;
    it.zoom = Math.min(MAX_ZOOM, Math.max(minZ, it.zoom));
    const d = dims(it), s = fillScale(it, fw, fh) * it.zoom;
    const hx = fw / (2 * d.w * s), hy = fh / (2 * d.h * s);   // half the frame, in photo units
    it.fx = hx >= .5 ? .5 : Math.min(1 - hx, Math.max(hx, it.fx));
    it.fy = hy >= .5 ? .5 : Math.min(1 - hy, Math.max(hy, it.fy));
  }
  // Draw the photo into a frame of size fw x fh at (ox, oy) on ctx.
export function paintPhoto(ctx, it, ox, oy, fw, fh) {
    const d = dims(it), s = fillScale(it, fw, fh) * it.zoom;
    const cx = ox + fw / 2 + (.5 - it.fx) * d.w * s, cy = oy + fh / 2 + (.5 - it.fy) * d.h * s;
    const sw = it.src.naturalWidth || it.src.width, sh = it.src.naturalHeight || it.src.height;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(it.rot * Math.PI / 180); ctx.scale(s, s);
    ctx.drawImage(it.src, -sw / 2, -sh / 2);
    ctx.restore();
  }
  // Blurred copy behind the photo, used when Fit leaves gaps.
export function paintBackdrop(ctx, it, ox, oy, fw, fh) {
    const copy = { ...it, zoom: 1, fx: .5, fy: .5 };
    ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, fw, fh); ctx.clip();
    if ('filter' in ctx) ctx.filter = `blur(${Math.round(fw / 18)}px) brightness(.6)`;
    paintPhoto(ctx, copy, ox - fw * .05, oy - fh * .05, fw * 1.1, fh * 1.1);
    ctx.filter = 'none';
    if (!('filter' in ctx)) { ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(ox, oy, fw, fh); }
    ctx.restore();
  }
export function paintFramed(ctx, it, ox, oy, fw, fh) {
    const d = dims(it), s = fillScale(it, fw, fh) * it.zoom;
    const gaps = d.w * s < fw - .5 || d.h * s < fh - .5;
    if (it.bg && it.bg !== 'blur') { ctx.fillStyle = it.bg; ctx.fillRect(ox, oy, fw, fh); }  // also under transparent logos
    else if (gaps) paintBackdrop(ctx, it, ox, oy, fw, fh);
    ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, fw, fh); ctx.clip(); paintPhoto(ctx, it, ox, oy, fw, fh); ctx.restore();
  }
  // Crop rectangle in source pixels (after rotation) — the data the backend needs.
export function cropRect(it, ASPECT = 4 / 5) {
    const d = dims(it), s = it.zoom * Math.max(1 / d.w, (1 / ASPECT) / d.h); // frame width = 1 unit
    const w = 1 / s, h = (1 / ASPECT) / s;
    return { x: Math.round(it.fx * d.w - w / 2), y: Math.round(it.fy * d.h - h / 2), width: Math.round(w), height: Math.round(h) };
  }
