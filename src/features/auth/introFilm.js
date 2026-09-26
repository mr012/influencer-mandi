

/*
 * Entry film for the role-selection screen.
 * One master clock: every tween is a Web Animation on the document timeline, so seek, pause,
 * skip and resize-rebuild all act on the same list. Only transform/translate/scale/rotate and
 * opacity animate. The brand mark is a clone of the live logo and lands at identity transform,
 * then hands over to the real element.
 */

const TOTAL = 7.4;
const E = {
 out: 'cubic-bezier(.16,1,.3,1)',
 inOut: 'cubic-bezier(.76,0,.24,1)',
 snap: 'cubic-bezier(.55,0,.1,1)',
 in: 'cubic-bezier(.6,0,.9,.4)',
 lin: 'linear',
 step: 'steps(1,end)'
};
// Authoring time -> screen time. Look/Swipe/Talk (2.3-4.3s) play 25% slower so the words land.
const RETIME = [[0, 0], [2.3, 2.3], [4.3, 4.8], [7.4, 8.0]];
const R = t => {
 for (let i = 1; i < RETIME.length; i++) {
  const [a0, b0] = RETIME[i - 1], [a1, b1] = RETIME[i];
  if (t <= a1 || i === RETIME.length - 1) return b0 + (t - a0) * (b1 - b0) / (a1 - a0);
 }
 return t;
};
const MOTION = new Set(['transform', 'translate', 'scale', 'rotate']);

const ICON = {
 heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.5 4.5 7 4.5c2 0 3.4 1 5 2.8 1.6-1.8 3-2.8 5-2.8 3.5 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
 bubble: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 funnel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 1v-7z"/></svg>',
 cursor: '<svg class="imf-cursor" viewBox="0 0 24 28" aria-hidden="true"><path d="M2 2v21l6-5.5 4 8.5 3.6-1.7-4-8.3H20z" fill="#f5f3ef" stroke="#090909" stroke-width="1.6" stroke-linejoin="round"/></svg>',
 skip: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 3l6 5-6 5zM12 3v10"/></svg>'
};

const masked = (text, cls = '') => `<span class="imf-mask ${cls}"><span>${text}</span></span>`;
const letters = text => [...text].map(ch => masked(ch)).join('');
const corners = '<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>';
const slot = (name, html) => `<div class="imf-slot imf-s-${name}" data-slot="${name}">${html}</div>`;

function markup() {
 const bars = [22, 30, 26, 38, 34, 46, 41, 55, 50, 63, 58, 72, 84, 96].map(h => `<i style="--h:${h}%"></i>`).join('');
 const feed = [
  slot('note', `<div class="imf-tile imf-note"><span class="imf-dot"></span><p><b>Cutting Chai Co.</b> shortlisted you for <b>Monsoon menu launch</b></p><time>now</time></div>`),
  slot('ana', `<div class="imf-tile imf-ana"><div class="imf-row"><span class="imf-eb">Reach · 30 days</span><span class="imf-up">+38%</span></div><strong class="imf-big">1.24M</strong><div class="imf-bars">${bars}</div></div>`),
  slot('vf', `<div class="imf-tile imf-vf">${corners}<span class="imf-rec"><i></i>REC</span><span class="imf-tc">00:00:0<span class="imf-roll"><span>1<br>2<br>3<br>4</span></span></span><span class="imf-af"></span><span class="imf-exp">ISO 400 · 1/50 · f1.8</span></div>`),
  slot('reel', `<div class="imf-tile imf-reel" style="--g1:#5a3a24;--g2:#16110d"><div class="imf-segs"><i class="on"></i><i><b></b></i><i></i></div><div class="imf-reel-side">${ICON.heart}8.1K${ICON.bubble}312</div><div class="imf-reel-b"><div class="imf-row"><span class="imf-av" style="--c:#ff3d00">A</span><b>@ananyaeats</b></div><p>Bandra breakfast run</p></div></div>`),
  slot('reel2', `<div class="imf-tile imf-reel" style="--g1:#2c3320;--g2:#0f110c"><div class="imf-segs"><i class="on"></i><i class="on"></i><i><b></b></i></div><div class="imf-reel-side">${ICON.heart}22K${ICON.bubble}940</div><div class="imf-reel-b"><div class="imf-row"><span class="imf-av" style="--c:#c6ff00">K</span><b>@kabirshoots</b></div><p>Desk setup, take two</p></div></div>`),
  slot('like', `<div class="imf-tile imf-like">${ICON.heart}<div class="imf-count"><span class="imf-roll"><span>12,480<br>12,516<br>12,571<br>12,642<br>12,730<br>12,804</span></span></div><span class="imf-eb">Likes</span></div>`),
  slot('cmt', `<div class="imf-tile imf-cmt"><div class="imf-row"><span class="imf-av" style="--c:#6f6d69">M</span><b>@meerafits</b><time>2m</time></div><p>This needs a brand deal.</p><div class="imf-row imf-cmt-f"><span>Reply</span><span>♥ 214</span></div></div>`),
  slot('camp', `<div class="imf-tile imf-camp"><div class="imf-row"><span class="imf-lg">C</span><div><b>Cutting Chai Co. ✓</b><span>Food &amp; beverage</span></div><span class="imf-live">Live</span></div><strong>Monsoon menu launch</strong><div class="imf-stats3"><div><b>₹15K–25K</b><span>Budget</span></div><div><b>3 weeks</b><span>Timeline</span></div><div><b>Mumbai</b><span>City</span></div></div><div class="imf-pills"><span>2 Reels</span><span>3 Stories</span></div></div>`),
  slot('req', `<div class="imf-tile imf-req"><span class="imf-eb">Collab requests</span><strong>3 new</strong><div class="imf-stack"><span class="imf-av" style="--c:#c6ff00">N</span><span class="imf-av" style="--c:#f5f3ef">B</span><span class="imf-av" style="--c:#ff3d00">M</span></div></div>`),
  slot('srch', `<div class="imf-tile imf-srch">${ICON.funnel}<span class="q">Search creators</span><div class="imf-pills"><span>Food</span><span>Mumbai</span><span>20K+</span></div></div>`),
  slot('crt', `<div class="imf-tile imf-crt"><div class="imf-shot"><span class="imf-chip">Reel · 0:24</span><span class="imf-vb">✓</span></div><div class="imf-cbody"><b class="imf-name">Ananya Rao</b><span class="imf-sub">Food &amp; cafe creator · Mumbai</span><div class="imf-stats3"><div><b>84.2K</b><span>Audience</span></div><div><b>5.1%</b><span>Engagement</span></div><div><b>IG · YT</b><span>Platforms</span></div></div><div class="imf-acts"><span class="imf-pass">Pass</span><span class="imf-collab"><i class="imf-fill"></i><span class="imf-lbls"><span class="a">Collab</span><span class="b">Request sent</span></span></span></div></div></div>`)
 ].join('');

 const campaignCard = (cls = '') => `<div class="imf-ccard ${cls}"><div class="imf-cshot"></div><div class="imf-row"><span class="imf-lg">C</span><div><b>Cutting Chai Co.</b></div></div><strong>Monsoon menu launch</strong></div>`;

 const door = (side, label) => `<div class="imf-door ${side}"><div class="imf-dlabel"><b>${label}</b></div><div class="imf-hl"><p>${masked('It’s a')}${masked('match')}</p></div></div>`;

 return `<div class="imf-bg"></div>
<p class="imf-sr">Influencer Mandi. Creators and brands look, swipe and talk. It’s a match.</p>
<div class="imf-stage" aria-hidden="true">
 <section class="imf-scene imf-feed"><div class="imf-cam"><div class="imf-grid">${feed}</div>${ICON.cursor}</div></section>
 <section class="imf-scene imf-beats">
  <div class="imf-beat imf-look"><div class="imf-beat-in">
   <div class="imf-frame">${corners}</div><span class="imf-rec"><i></i>REC</span>
   <div class="imf-beat-grid"><div class="imf-word">${letters('Look')}</div><div class="imf-visual">${campaignCard()}<div class="imf-lock">${corners}</div></div></div>
   
  </div></div>
  <div class="imf-beat imf-swipe"><div class="imf-beat-in">
   <div class="imf-beat-grid"><div class="imf-word">${letters('Swipe')}</div><div class="imf-visual">${campaignCard('back')}${campaignCard('front').replace('</div>', '</div><span class="imf-stamp">Interested</span>')}</div></div>
   
  </div></div>
  <div class="imf-beat imf-talk"><div class="imf-beat-in">
   <div class="imf-beat-grid"><div class="imf-word">${letters('Talk')}</div><div class="imf-visual"><div class="imf-chat">
    <div class="imf-chat-h"><span class="imf-pair"><span class="imf-av" style="--c:#c6ff00">C</span><span class="imf-av">A</span></span><div><b>Cutting Chai Co. × Ananya</b></div></div>
    <div class="imf-bub">Loved your reel. Shoot Friday?</div>
    <div class="imf-bub me">I’m in.</div>
   </div></div></div>
   
  </div></div>
 </section>
 <div class="imf-markwrap"></div>
 <section class="imf-scene imf-match">${door('l', 'Creators')}${door('r', 'Brands')}</section>
</div>
<div class="imf-ui"><div class="imf-progress"><i></i></div><button class="imf-skip" type="button" aria-label="Skip intro"><span>Skip intro</span> ${ICON.skip}</button></div>`;
}

export function createIntro(landing, {onStart, onEnd} = {}) {
 const reduceQ = matchMedia('(prefers-reduced-motion: reduce)');
 const root = document.createElement('div');
 root.className = 'imf';
 root.setAttribute('role', 'region');
 root.setAttribute('aria-label', 'Intro film');
 root.innerHTML = markup();
 const q = s => root.querySelector(s);
 const qa = s => [...root.querySelectorAll(s)];
 const page = landing.querySelector('.lp-page');
 const logo = landing.querySelector('.lp-logo');
 let anims = [], clock = null, state = 'idle', resizeTimer = 0, reduced = false;

 function uiTargets() {
  return [landing.querySelector('.lp-intro'), landing.querySelector('.lp-hero > .lp-impact'), ...landing.querySelectorAll('.lp-choices > *'), landing.querySelector('.lp-mobile-footer'), landing.querySelector('.lp-replay')]
   .filter(el => el && getComputedStyle(el).display !== 'none');
 }

 // Builds the whole timeline for the current viewport. Safe to call again (resize) and seek.
 function build() {
  anims.forEach(a => a.cancel());
  anims = [];
  const seen = new WeakMap();
  const T = (el, props, at, dur, ease = E.out, opts = {}) => {
   if (!el) return;
   const done = seen.get(el) || new Set();
   seen.set(el, done);
   for (const [prop, values] of Object.entries(props)) {
    if (reduced && MOTION.has(prop)) continue;
    const fill = done.has(prop) ? 'forwards' : 'both';
    done.add(prop);
    const frames = values.map((v, i) => ({[prop]: v, ...(opts.offsets ? {offset: opts.offsets[i]} : {}), ...(opts.easings && opts.easings[i] ? {easing: opts.easings[i]} : {})}));
    const start = R(at), end = R(at + dur);
    anims.push(el.animate(frames, {delay: start * 1000, duration: Math.max(1, (end - start) * 1000), easing: ease, fill}));
   }
  };
  // A hard cut: the element exists only between `from` and `to`.
  const cut = (el, from, to = TOTAL + 1) => {
   T(el, {opacity: [0, 1]}, from, 0.001, E.lin);
   if (to <= TOTAL) T(el, {opacity: [1, 0]}, to, 0.001, E.lin);
  };
  // Masked reveal: content slides out from behind its own clipping edge. Fades when motion is reduced.
  const reveal = (el, at, dur, from = '0 105%', ease = E.out) => {
   if (reduced) T(el, {opacity: [0, 1]}, at, Math.min(dur, .25), E.lin);
   else T(el, {translate: [from, '0 0']}, at, dur, ease);
  };
  const vw = innerWidth, vh = innerHeight;
  // Measure everything before any tween applies its backwards fill.
  const shot = q('.imf-shot').getBoundingClientRect();
  const btn = q('.imf-collab').getBoundingClientRect();
  const lr = logo.getBoundingClientRect();
  const word = logo.firstElementChild.getBoundingClientRect();
  const enFace = logo.querySelector('.lp-en');
  const enW = enFace ? enFace.getBoundingClientRect().width : 0;
  const ui = uiTargets();
  root.style.setProperty('--vw', vw + 'px');
  root.style.setProperty('--vh', vh + 'px');

  // ---------- Scene 1: the feed assembles (0 – 2.30s) ----------
  const feed = q('.imf-feed'), cam = q('.imf-cam');
  cut(feed, 0, 2.3);
  const order = ['crt', 'note', 'ana', 'reel', 'vf', 'cmt', 'like', 'camp', 'reel2', 'req', 'srch'];
  const dirs = {crt: '0 105%', note: '0 -105%', ana: '105% 0', reel: '0 105%', vf: '-105% 0', cmt: '0 105%', like: '-105% 0', camp: '0 105%', reel2: '0 -105%', req: '105% 0', srch: '0 105%'};
  order.forEach((name, i) => {
   const tile = q(`[data-slot="${name}"] .imf-tile`);
   reveal(tile, 0.06 + i * 0.065, 0.62, dirs[name]);
  });
  qa('.imf-bars i').forEach((bar, i) => T(bar, {scale: ['1 0', '1 1']}, 0.55 + i * 0.03, 0.5));
  qa('.imf-segs i b').forEach(b => T(b, {transform: ['scaleX(0)', 'scaleX(1)']}, 0.3, 2.0, E.lin));
  const roll = (strip, steps, at, every) => {
   const n = steps - 1;
   T(strip, {translate: Array.from({length: steps}, (_, k) => `0 ${-k * 1.15}em`)}, at, every * n, E.lin,
    {offsets: Array.from({length: steps}, (_, k) => k / n), easings: Array.from({length: steps}, () => 'cubic-bezier(.3,1.3,.5,1)')});
  };
  roll(q('.imf-like .imf-roll > span'), 6, 0.62, 0.22);
  roll(q('.imf-vf .imf-roll > span'), 4, 0.4, 0.5);
  qa('.imf-rec i').forEach(dot => T(dot, {opacity: [1, 0, 1, 0, 1]}, 0, 2.3, E.lin, {easings: [E.step, E.step, E.step, E.step]}));
  const af = q('.imf-af');
  T(af, {scale: [1.35, 1]}, 0.95, 0.28, E.snap);
  T(af, {opacity: [0, 1]}, 0.95, 0.001, E.lin);

  // Camera: slow push, then a cursor clicks Collab, then a dolly into the creator's photo.
  const push = 1.028;
  const pushT = `translate(${(vw / 2) * (1 - push)}px, ${(vh / 2) * (1 - push)}px) scale(${push})`;
  const zoom = Math.max(vw / shot.width, vh / shot.height) * 1.04;
  const zx = vw / 2 - zoom * (shot.left + shot.width / 2), zy = vh / 2 - zoom * (shot.top + shot.height / 2);
  T(cam, {transform: ['translate(0px, 0px) scale(1)', pushT, pushT, `translate(${zx}px, ${zy}px) scale(${zoom})`]}, 0, 2.3, E.lin,
   {offsets: [0, 1.72 / 2.3, 1.74 / 2.3, 1], easings: ['cubic-bezier(.2,.6,.3,1)', E.lin, 'cubic-bezier(.8,0,.25,1)']});
  const cursor = q('.imf-cursor');
  const bx = btn.left + btn.width * 0.58, by = btn.top + btn.height * 0.45;
  if (reduced) T(cursor, {opacity: [0, 0]}, 0, 0.001, E.lin);
  else {
   T(cursor, {translate: [`${bx + Math.min(260, vw * .22)}px ${by + Math.min(200, vh * .2)}px`, `${bx}px ${by}px`]}, 1.02, 0.46, 'cubic-bezier(.3,.1,.1,1)');
   T(cursor, {opacity: [0, 1]}, 1.02, 0.12, E.lin);
   T(cursor, {scale: [1, .82, 1]}, 1.5, 0.2, E.out, {offsets: [0, .35, 1]});
  }
  T(q('.imf-fill'), {transform: ['scaleX(0)', 'scaleX(1)']}, 1.56, 0.2, E.snap);
  qa('.imf-lbls > span').forEach(l => T(l, {translate: ['0 0', '0 -100%']}, 1.58, 0.24, E.snap));

  // ---------- Scene 2: LOOK / SWIPE / TALK (2.30 – 4.30s) ----------
  const look = q('.imf-look'), swipe = q('.imf-swipe'), talk = q('.imf-talk');
  cut(look, 2.3, 3.2);
  T(q('.imf-look .imf-frame'), {scale: [1.06, 1]}, 2.3, 0.22, E.snap);
  qa('.imf-look .imf-word .imf-mask > span').forEach((s, i) => reveal(s, 2.33 + i * 0.03, 0.38));
  reveal(q('.imf-look .imf-ccard'), 2.4, 0.42, '0 18%');
  T(q('.imf-look .imf-ccard'), {opacity: [0, 1]}, 2.4, 0.14, E.lin);
  T(q('.imf-look .imf-lock'), {scale: [1.25, 1]}, 2.6, 0.22, E.snap);
  T(q('.imf-look .imf-lock'), {opacity: [0, 1]}, 2.6, 0.001, E.lin);
  T(q('.imf-look .imf-cap'), {opacity: [0, 1]}, 2.46, 0.2, E.lin);

  // Masked wipe from the right, following the swipe direction.
  const wipe = (beat, at, axis) => {
   const from = axis === 'x' ? ['100% 0', '-100% 0'] : ['0 100%', '0 -100%'];
   if (reduced) return;
   T(beat, {translate: [from[0], '0 0']}, at, 0.24, 'cubic-bezier(.7,0,.2,1)');
   T(beat.firstElementChild, {translate: [from[1], '0 0']}, at, 0.24, 'cubic-bezier(.7,0,.2,1)');
  };
  cut(swipe, 2.96, 3.84);
  wipe(swipe, 2.96, 'x');
  qa('.imf-swipe .imf-word .imf-mask > span').forEach((s, i) => reveal(s, 3.04 + i * 0.028, 0.34, '-105% 0'));
  T(q('.imf-swipe .imf-cap'), {opacity: [0, 1]}, 3.12, 0.2, E.lin);
  const front = q('.imf-swipe .front'), stamp = q('.imf-stamp');
  T(stamp, {opacity: [0, 1]}, 3.16, 0.001, E.lin);
  T(stamp, {scale: [1.4, 1]}, 3.16, 0.16, E.snap);
  T(front, {transform: ['translate(0,0) rotate(0deg)', `translate(${Math.min(vw * .6, 720)}px, -3%) rotate(14deg)`]}, 3.3, 0.32, E.in);
  if (reduced) T(front, {opacity: [1, 0]}, 3.35, 0.2, E.lin);
  T(q('.imf-swipe .back'), {scale: [.94, 1]}, 3.4, 0.3, E.out);

  cut(talk, 3.6, 4.3);
  wipe(talk, 3.6, 'y');
  qa('.imf-talk .imf-word .imf-mask > span').forEach((s, i) => reveal(s, 3.68 + i * 0.03, 0.34));
  T(q('.imf-talk .imf-cap'), {opacity: [0, 1]}, 3.76, 0.2, E.lin);
  reveal(q('.imf-chat-h'), 3.7, 0.3, '0 30%');
  T(q('.imf-chat-h'), {opacity: [0, 1]}, 3.7, 0.16, E.lin);
  qa('.imf-bub').forEach((b, i) => {
   const at = 3.8 + i * 0.13;
   T(b, {opacity: [0, 1]}, at, 0.1, E.lin);
   T(b, {translate: ['0 14px', '0 0']}, at, 0.28, E.out);
   T(b, {scale: [.94, 1]}, at, 0.28, E.out);
  });

  // ---------- Scene 3: the match (4.30 – 6.00s) ----------
  const match = q('.imf-match'), dl = q('.imf-door.l'), dr = q('.imf-door.r');
  cut(match, 4.3);
  if (reduced) {
   T(dl, {opacity: [0, 1]}, 4.3, 0.2, E.lin); T(dr, {opacity: [0, 1]}, 4.3, 0.2, E.lin);
   T(dl, {opacity: [1, 0]}, 5.5, 0.3, E.lin); T(dr, {opacity: [1, 0]}, 5.5, 0.3, E.lin);
  } else {
   // Doors slam in, overlap by a hair on impact, settle, hold, then part.
   const k = [0, .36, .44, .52, .69, 1];
   const ease = [E.snap, 'cubic-bezier(.3,0,.5,1)', E.out, E.lin, E.inOut];
   T(dl, {translate: ['-100% 0', '0.6% 0', '0.6% 0', '0 0', '0 0', '-101% 0']}, 4.3, 1.72, E.lin, {offsets: k, easings: ease});
   T(dr, {translate: ['100% 0', '0 0', '0 0', '0 0', '0 0', '101% 0']}, 4.3, 1.72, E.lin, {offsets: k, easings: ease});
  }
  T(q('.imf-match'), {scale: [1.014, 1]}, 4.93, 0.22, E.out);
  [dl, dr].forEach(d => {
   d.querySelectorAll('.imf-hl .imf-mask > span').forEach((s, i) => reveal(s, 4.86 + i * 0.07, 0.36));
   T(d.querySelector('.imf-dlabel'), {opacity: [0, 1]}, 4.72, 0.18, E.lin);
   T(d.querySelector('.imf-dfoot'), {opacity: [0, 1]}, 4.78, 0.18, E.lin);
  });

  // ---------- Scene 4: brand mark and handoff (5.45 – 7.40s) ----------
  const wrap = q('.imf-markwrap');
  wrap.textContent = '';
  const mark = logo.cloneNode(true);
  mark.classList.add('imf-mark');
  mark.removeAttribute('aria-label');
  const flip = mark.querySelector('.lp-flip');
  if (flip) flip.style.transform = 'perspective(4em) rotateX(360deg)';
  Object.assign(mark.style, {left: lr.left + 'px', top: lr.top + 'px', width: lr.width + 'px', fontSize: getComputedStyle(logo).fontSize});
  wrap.append(mark); Object.assign(mark.style,{fontFamily:'Anton, sans-serif',lineHeight:'1',textTransform:'uppercase'});
  const inkW = Math.max(word.width, enW), inkH = lr.height;
  const S = Math.min((vw < 700 ? .84 : .64) * vw / inkW, .5 * vh / inkH);
  // Origin is the logo's top-left; place the ink centre of the scaled mark at the viewport centre.
  const cx = word.left - lr.left + inkW / 2, cy = inkH / 2;
  const hero = s => `translate(${vw / 2 - lr.left - s * cx}px, ${vh / 2 - lr.top - s * cy}px) scale(${s})`;
  cut(wrap, 5.44);
  if (reduced) {
   T(mark, {opacity: [0, 1]}, 5.5, 0.3, E.lin);
   T(mark, {opacity: [1, 0]}, 6.6, 0.3, E.lin);
  } else {
   T(mark, {transform: [hero(S * 1.05), hero(S), hero(S), 'translate(0px, 0px) scale(1)']}, 5.44, 1.56, E.lin,
    {offsets: [0, .44, .5, 1], easings: [E.out, E.lin, 'cubic-bezier(.7,0,.12,1)']});
  }
  const handT = reduced ? 6.6 : 7.0;
  T(logo, {opacity: [0, 1]}, handT, reduced ? 0.3 : 0.001, E.lin);
  T(wrap, {opacity: [1, 0]}, reduced ? 6.9 : 7.0, 0.001, E.lin);
  T(q('.imf-bg'), {opacity: [1, 0]}, 6.3, 0.5, E.lin);
  T(match, {opacity: [1, 0]}, 6.3, 0.001, E.lin);
  ui.forEach((el, i) => {
   T(el, {opacity: [0, 1]}, 6.5 + i * 0.045, 0.4, E.lin);
   if (!reduced) T(el, {translate: ['0 16px', '0 0']}, 6.5 + i * 0.045, 0.7, E.out);
  });
  T(q('.imf-ui'), {opacity: [1, 0]}, 6.4, 0.3, E.lin);
  T(q('.imf-progress i'), {transform: ['scaleX(0)', 'scaleX(1)']}, 0, TOTAL, E.lin);
  clock = root.animate([{opacity: 1}, {opacity: 1}], {duration: R(TOTAL) * 1000});
  anims.push(clock);
  clock.finished.then(() => { if (state === 'playing') finish(); }, () => {});
 }

 const seek = t => anims.forEach(a => { a.currentTime = t * 1000; });
 const now = () => (clock && clock.currentTime != null ? clock.currentTime / 1000 : 0);

 function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
   if (state !== 'playing') return;
   const t = now();
   build();
   seek(t);
  }, 120);
 }
 const onVisibility = () => {
  if (state !== 'playing') return;
  // play() on an animation parked at its end would rewind it, so only resume unfinished ones.
  anims.forEach(a => {
   if (document.hidden) a.pause();
   else if (a.currentTime < a.effect.getComputedTiming().endTime) a.play();
  });
 };
 const onKey = e => { if (e.key === 'Escape' && state === 'playing') { e.stopPropagation(); skip(); } };

 function teardown() {
  clearTimeout(resizeTimer);
  removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibility);
  document.removeEventListener('keydown', onKey, true);
  anims.forEach(a => a.cancel());
  anims = [];
  root.remove();
  if (page) page.inert = false;
  landing.classList.remove('imf-playing');
 }
 function finish() {
  if (state !== 'playing' && state !== 'skipping') return;
  state = 'done';
  teardown();
  onEnd && onEnd();
 }
 // Skip: freeze the film, jump the page to its final state underneath, and fade the film away.
 function skip() {
  if (state !== 'playing') return;
  state = 'skipping';
  anims.forEach(a => a.pause());
  const fade = root.animate([{opacity: 1}, {opacity: 0}], {duration: reduced ? 1 : 280, easing: 'ease-out', fill: 'forwards'});
  landing.querySelectorAll('.lp-logo, .lp-intro, .lp-impact, .lp-choices > *, .lp-mobile-footer, .lp-replay').forEach(el => el.getAnimations().forEach(a => a.finish()));
  fade.finished.then(finish, finish);
 }

 root.querySelector('.imf-skip').addEventListener('click', skip);

 async function play() {
  reduced = reduceQ.matches;
  state = 'playing';
  landing.classList.add('imf-playing');
  document.body.append(root);
  if (page) page.inert = true;
  onStart && onStart();
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('keydown', onKey, true);
  // Wait for the brand faces so measurements and the first frames use final metrics.
  try {
   await Promise.race([Promise.all([document.fonts.load('400 40px Anton'), document.fonts.load('600 16px Inter')]).then(() => document.fonts.ready), new Promise(r => setTimeout(r, 1500))]);
  } catch {}
  if (state !== 'playing') return;
  try { build(); } catch (error) { console.error(error); finish(); return; }
  if (document.hidden) anims.forEach(a => a.pause());
 }

 return {
  play,
  skip,
  destroy() { if (state === 'playing' || state === 'skipping') { state = 'done'; teardown(); } },
  get state() { return state; },
  // QA hooks: freeze the film at a moment (seconds) for inspection.
  seek(t) { anims.forEach(a => a.pause()); seek(t); },
  get duration() { return R(TOTAL); }
 };
}
