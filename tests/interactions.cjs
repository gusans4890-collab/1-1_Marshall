const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM, VirtualConsole} = require('../.qa/node_modules/jsdom');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const scripts = ['assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/vendor/swiper-bundle.min.js','script.js','sliders.js','assets/vendor/lenis.min.js','motion.js','footer.js'].map(f=>fs.readFileSync(f,'utf8'));
function boot(file, width=1440, systemReduce=false, noGsap=false) {
 const errors=[]; const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
 const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'http://localhost/'+file,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window;w.localStorage.setItem('marshall-reduce-motion','true');w.innerWidth=width;w.innerHeight=900;let scroll=0;
 Object.defineProperty(w,'scrollY',{get:()=>scroll});Object.defineProperty(w,'pageYOffset',{get:()=>scroll});
 const media=[];
 w.matchMedia=query=>{const listeners=[];const item={media:query,matches:query.includes('prefers-reduced-motion')?systemReduce:query.includes('min-width')?width>=701:query.includes('max-width')?width<=700:query.includes('hover')||query.includes('pointer'),addListener:fn=>listeners.push(fn),removeListener:()=>{},addEventListener:(type,fn)=>listeners.push(fn),removeEventListener:()=>{},listeners};media.push(item);return item;};
 w.scrollTo=(a,b)=>{scroll=typeof a==='object'?a.top||0:b||0;};
 w.HTMLElement.prototype.getBoundingClientRect=function(){return {top:0,left:0,right:400,bottom:700,width:400,height:700,x:0,y:0,toJSON(){}};};
 for(const key of ['offsetWidth','clientWidth'])Object.defineProperty(w.HTMLElement.prototype,key,{get:()=>400,configurable:true});
 Object.defineProperty(w.HTMLElement.prototype,'offsetHeight',{get(){return this.classList.contains('hero-scroll')?2610:700;},configurable:true});
 Object.defineProperty(w.HTMLElement.prototype,'scrollWidth',{get(){return this.classList.contains('sound-track')?1100:400;},configurable:true});
 Object.defineProperty(w.document.documentElement,'scrollHeight',{value:14000,configurable:true});
 w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
 w.IntersectionObserver=class{observe(target){this.callback([{target,isIntersecting:true}]);}unobserve(){}disconnect(){}constructor(callback){this.callback=callback;}};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 const style=w.document.createElement('style');style.textContent='.swiper{width:400px}.swiper-slide{width:300px;margin-right:0px;margin-left:0px}';w.document.head.append(style);if(!noGsap){w.eval(scripts[0]);w.eval(scripts[1]);w.eval(scripts[2]);}w.eval(scripts[3]);w.eval(scripts[4]);if(!noGsap)w.eval(scripts[5]);w.eval(scripts[6]);w.eval(scripts[7]);
 const q=s=>w.document.querySelector(s),qq=s=>[...w.document.querySelectorAll(s)];
 return {w,q,qq,errors,media,close:()=>{w.dispatchEvent(new w.Event('pagehide'));dom.window.close();}};
}
for(const width of [1440,390])for(const file of files){const app=boot(file,width);const {w,q,qq}=app;
 try{
  assert(q('main').textContent.trim().length>100,file+' static content');
  assert(w.ScrollTrigger.getAll().length>0,file+' ScrollTrigger initialized');
  if(q('.selection-scroll')){const horizontal=w.ScrollTrigger.getById('product-scroll');assert(horizontal,'vertical scroll controls the product track');assert(q('.selection').classList.contains('has-product-scroll'));assert(q('.selection-scroll').classList.contains('is-scroll-driven'));assert.equal(q('.selection-track').children.length,5);}
  qq('.desktop-nav a').forEach(a=>assert(a.getAttribute('href').endsWith('.html'),'header must navigate to a document')); assert.equal(q('.nav-trigger'),null);
  assert.equal(w.document.documentElement.classList.contains('lenis'),width>=701,'smooth wheel enabled on desktop only');
  const pointerMove=new w.MouseEvent('pointermove',{bubbles:true,clientX:210,clientY:180});q('.desktop-nav a').dispatchEvent(pointerMove);assert.equal(w.document.body.classList.contains('cursor-enabled'),width>=701);if(width>=701)assert.equal(q('.flow-pointer').dataset.mode,'link');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true}));assert(!w.document.body.classList.contains('cursor-enabled'));
  if(q('.selection-swiper')){q('.selection-image').dispatchEvent(new w.MouseEvent('pointermove',{bubbles:true,clientX:250,clientY:350}));if(width>=701){assert.equal(q('.flow-pointer').dataset.mode,'drag');const wheel=new w.WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:120});q('.selection-image').dispatchEvent(wheel);assert(wheel.defaultPrevented,'vertical carousel wheel must use Lenis');}}
  q('.menu-toggle').focus();q('.menu-toggle').click();assert(q('.menu').classList.contains('open'));assert.equal(q('main').inert,true);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(q('.menu-toggle').getAttribute('aria-expanded'),'false');assert.equal(q('main').inert,false);assert.equal(w.document.activeElement,q('.menu-toggle'));
  if(q('[data-gallery]')){qq('[data-gallery]').at(-1).click();assert.equal(q('#gallery-image').alt,qq('[data-gallery]').at(-1).getAttribute('aria-label'));q('#open-gallery').click();assert(q('.image-dialog').open);q('.dialog-next').click();assert.equal(q('#gallery-image').alt,qq('[data-gallery]')[0].getAttribute('aria-label'));q('.dialog-close').click();assert(!q('.image-dialog').open);assert(!w.document.body.classList.contains('dialog-open'));}
  if(q('[data-filter]')){q('[data-filter="earbuds"]').click();assert.equal(qq('.catalog-card').filter(c=>!c.hidden).length,1);assert.equal(q('.filter-status').textContent,'1개의 제품');q('[data-filter="all"]').click();assert.equal(qq('.catalog-card').filter(c=>!c.hidden).length,8);}
  if(q('.opening-swiper')){const carousel=q('.opening-swiper').swiper;carousel.slideNext(0);assert.equal(carousel.activeIndex,1);carousel.slidePrev(0);assert.equal(carousel.activeIndex,0);const wasRunning=carousel.autoplay.running;q('.opening-play').click();assert.equal(carousel.autoplay.running,!wasRunning);q('.opening-play').click();assert.equal(carousel.autoplay.running,wasRunning);const selected=q('.selection-swiper').swiper;selected.slideNext(0);assert(selected.activeIndex>0);}
  w.ScrollTrigger.getAll().forEach(t=>t.animation?.progress(1)); w.gsap.getTweensOf(qq('.reveal')).forEach(t=>t.progress(1));
  qq('.reveal').filter(el=>!el.hidden).forEach(el=>assert(Number(w.getComputedStyle(el).opacity)>0, file+' '+el.className+' reveal must finish visible: '+el.getAttribute('style')));
  assert.equal(q('.motion-toggle'),null);assert.equal(w.localStorage.getItem('marshall-reduce-motion'),null);
  const footerGroups=qq('.footer-group');assert.equal(footerGroups.length,4);
  assert(footerGroups.every(group=>group.open===(width>700)));
  if(width<=700){const first=footerGroups[0],second=footerGroups[1];first.querySelector('summary').click();assert(first.open);assert.equal(first.querySelector('summary').getAttribute('aria-expanded'),'true');second.querySelector('summary').click();assert(second.open);assert(!first.open);second.querySelector('summary').click();assert(!second.open);}else{footerGroups[0].querySelector('summary').click();assert(footerGroups.every(group=>group.open));}
  const preferences=app.media.filter(item=>item.media.includes('prefers-reduced-motion'));
  const changePreference=value=>{preferences.forEach(item=>item.matches=value);preferences.forEach(item=>item.listeners.forEach(fn=>fn({matches:value,media:item.media})));};
  changePreference(true);assert(w.document.body.classList.contains('motion-paused'));assert.equal(w.ScrollTrigger.getAll().length,0);assert(!w.document.documentElement.classList.contains('lenis'));assert(!w.document.body.classList.contains('cursor-enabled'));
  changePreference(false);assert(!w.document.body.classList.contains('motion-paused'));assert(w.ScrollTrigger.getAll().length>0);
  assert.deepEqual(app.errors.map(e=>e.message),[]);
  console.log(width+'px '+file+': static content, menus, interactions, GSAP, motion toggle OK');
 } finally {app.close();}
}
for(const noGsap of [false,true]){const app=boot('index.html',390,true,noGsap);assert(app.w.document.body.classList.contains('motion-paused'));if(!noGsap)assert.equal(app.w.ScrollTrigger.getAll().length,0);assert.equal(app.q('.opening-swiper'),null);assert.equal(app.q('.selection-swiper'),null);assert.equal(app.qq('.opening-scroll .opening-slide').length,3);assert.equal(app.qq('.selection-scroll .selection-slide').length,5);assert(app.qq('.opening-slide, .selection-slide').every(card=>!card.inert));app.close();console.log('Reduced motion '+(noGsap?'without libraries':'with GSAP')+': all eight products available in vertical flow');}
{const app=boot('collection.html',390,false,true);app.q('[data-filter="speakers"]').click();assert.equal(app.qq('.catalog-card').filter(c=>!c.hidden).length,2);app.q('.menu-toggle').click();assert.equal(app.q('.menu-toggle').getAttribute('aria-expanded'),'true');app.close();console.log('Library fallback: filters and menus work');}
{
 const app=boot('index.html',800);assert(app.qq('.footer-group').every(group=>group.open));
 const media=app.media.findLast(item=>item.media==='(max-width: 700px)');
 media.matches=true;media.listeners.forEach(fn=>fn({matches:true}));assert(app.qq('.footer-group').every(group=>!group.open));
 const group=app.q('.footer-group');group.querySelector('summary').click();assert(group.open);
 media.matches=false;media.listeners.forEach(fn=>fn({matches:false}));assert(app.qq('.footer-group').every(group=>group.open));
 media.matches=true;media.listeners.forEach(fn=>fn({matches:true}));assert(group.open);assert.equal(app.qq('.footer-group[open]').length,1);
 app.close();console.log('Footer: tablet, mobile accordion, resize state and desktop expansion OK');
}
console.log('PASS: DOM behavior checks (not a visual browser test).');
