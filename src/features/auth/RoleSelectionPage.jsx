import {useEffect,useRef} from 'react';
import '../../styles/landing.css';
export default function RoleSelectionPage(){
 const root=useRef(null);
 useEffect(()=>{
  const el=root.current, reduced=matchMedia('(prefers-reduced-motion:reduce)'), fine=matchMedia('(hover:hover) and (pointer:fine)');
  let angle=180, interval;
  const flip=()=>{if(!reduced.matches&&!document.hidden){angle+=180;el.querySelector('.lp-flip').style.transform=`perspective(4em) rotateX(${angle}deg)`}};
  const timer=setTimeout(()=>{flip();interval=setInterval(flip,5000)},1000);
  const cleanups=[];
  el.querySelectorAll('.lp-role').forEach(card=>{
   const move=e=>{if(!fine.matches||reduced.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transition='transform .08s ease,border-color .45s,background-color .45s';card.style.transform=`perspective(1200px) rotateY(${x*10}deg) rotateX(${-y*8}deg)`};
   const leave=()=>{card.style.transition='';card.style.transform=''};
   card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
   cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave)});
  });
  const sync=()=>el.querySelectorAll('.role-choice').forEach(c=>c.setAttribute('aria-pressed',String(c.classList.contains('chosen'))));
  const observer=new MutationObserver(sync);observer.observe(el,{attributes:true,attributeFilter:['data-side']});sync();
  return ()=>{clearTimeout(timer);clearInterval(interval);observer.disconnect();cleanups.forEach(fn=>fn())};
 },[]);
 return <div className="mock landing" ref={root} data-side="creator"><main className="lp-page"><div className="lp-glow lp-creator-glow"></div><div className="lp-glow lp-brand-glow"></div><section className="lp-hero"><div className="lp-logo" aria-label="Influencer Mandi"><span aria-hidden="true">Influencer</span><span className="lp-logo-line" aria-hidden="true"><span className="lp-flip"><span className="lp-face lp-en">Mandi</span><span className="lp-face lp-hi" lang="hi">मंडी</span></span></span></div><div className="lp-intro"><h1>Find your<br /> people.</h1><p>Creators find campaigns worth their time. Brands find creators worth their budget.</p><div className="lp-tagline">Creators. Brands. Ideas.</div></div><p className="lp-impact">Real people. Real stories. Real impact.</p></section><section className="lp-choices" aria-labelledby="pick-title"><span className="lp-eyebrow">Welcome to Influencer Mandi</span><h2 id="pick-title">Pick your side</h2><button className="lp-role lp-creator role-choice chosen" type="button" data-choice="creator" aria-pressed="true"><span className="lp-eyebrow">For the storytellers</span><h3>I'm a <em>creator</em></h3><p>Discover campaigns. Show your work. Connect with brands.</p><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="8.5" r="3.6"/><path d="M4.8 20c.9-3.6 3.7-5.5 7.2-5.5s6.3 1.9 7.2 5.5"/></svg></button><button className="lp-role lp-brand role-choice brand-choice" type="button" data-choice="brand" aria-pressed="false"><span className="lp-eyebrow">For the businesses</span><h3>I'm a <em>brand</em></h3><p>Find creators. Share your brief. Start a collaboration.</p><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4 10v4h3l7 4V6l-7 4H4zM18 9.2a4 4 0 010 5.6"/></svg></button><button className="lp-continue" data-act="go:signup" type="button">Continue</button><p className="lp-login">Already part of the mandi? <a href="#login" data-act="go:login">Log in</a></p></section><footer className="lp-mobile-footer"><p className="lp-tagline">Creators. Brands. Ideas.</p><p className="lp-impact">Real people. Real stories. Real impact.</p></footer></main></div>;
}
