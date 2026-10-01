import test from 'node:test';
import assert from 'node:assert/strict';
import { dims, fillScale, fitZoom, clamp, cropRect } from '../src/components/ui/cropGeometry.js';
const item=(w,h,extra={})=>({src:{width:w,height:h},rot:0,zoom:1,fx:.5,fy:.5,fit:false,...extra});
test('Fill never exposes gaps even after extreme panning, zoom and rotation',()=>{
 for(const [w,h] of [[1600,900],[900,1600],[800,800]]) for(const rot of [0,90,180,270]) for(const aspect of [.8,1]) for(const zoom of [.01,1,2,10]) {
  const it=item(w,h,{rot,zoom,fx:-10,fy:10}); clamp(it,400,400/aspect);
  const d=dims(it),s=fillScale(it,400,400/aspect)*it.zoom;
  assert.ok(d.w*s>=400-1e-6 && d.h*s>=400/aspect-1e-6);
  const c=cropRect(it,aspect);assert.ok(c.x>=0 && c.y>=0);assert.ok(c.x+c.width<=d.w+1 && c.y+c.height<=d.h+1);
 }
});
test('Fit preserves the entire landscape with centered background margins',()=>{
 const it=item(1600,900,{fit:true,zoom:0,fx:0,fy:1});clamp(it,400,500);
 assert.equal(it.zoom,fitZoom(it,400,500));assert.equal(it.fx,.5);assert.equal(it.fy,.5);
 assert.deepEqual(cropRect(it),{x:0,y:-550,width:1600,height:2000});
});
test('90-degree rotation swaps source axes; logo exports a square',()=>{
 const it=item(1600,900,{rot:90});clamp(it,400,400);
 assert.deepEqual(dims(it),{w:900,h:1600});assert.deepEqual(cropRect(it,1),{x:0,y:350,width:900,height:900});
});
