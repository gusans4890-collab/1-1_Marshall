const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const {JSDOM}=require('../.qa/node_modules/jsdom');
const base=path.resolve('.'),out=path.join(base,'figma-handoff','images'),render=path.join(base,'figma-handoff','render');
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(render,{recursive:true});
const sources=['index','major-v','monitor-iii-anc','minor-iv','emberton-iii','middleton-ii','kilburn-iii','stanmore-iii','woburn-iii'];
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile=path.join(base,'figma-handoff','export-profile');
const results=[];
for(const [i,slug] of sources.entries()){
 const dom=new JSDOM(fs.readFileSync(slug+'.html','utf8')),d=dom.window.document;
 d.querySelectorAll('script,iframe,.menu,.image-dialog,.back-top,.hover-cursor,.flow-pointer').forEach(n=>n.remove());
 d.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{
  const href=link.getAttribute('href');if(/^https?:/.test(href))return;
  const css=fs.readFileSync(path.join(base,href.split('?')[0]),'utf8').replace(/([\d.]+)(svh|dvh|vh)\b/g,(_,v)=>Number(v)*10+'px');
  const style=d.createElement('style');style.textContent=css;link.replaceWith(style);
 });
 const root=d.createElement('base');root.href='file:///'+base.replaceAll('\\','/')+'/';d.head.prepend(root);
 d.querySelectorAll('img').forEach(img=>{img.loading='eager';img.removeAttribute('fetchpriority');});
 const staticStyle=d.createElement('style');staticStyle.textContent='*{animation:none!important;transition:none!important}.reveal,.will-reveal{opacity:1!important;transform:none!important}.header{position:absolute!important}.cinema-stage{position:relative!important}.cinema-poster{transform:none!important}.opening-scroll{overflow:hidden!important}.opening-slide:not(:first-child){display:none!important}.product-hero-scene{height:auto!important}.page-curtain,.back-top-dock{display:none!important}';d.head.append(staticStyle);
 const measure=d.createElement('script');measure.textContent="addEventListener('load',()=>{document.fonts.ready.then(()=>{document.documentElement.setAttribute('data-render-height',Math.ceil(document.documentElement.scrollHeight))})})";d.body.append(measure);
 const filename=path.join(render,slug+'.html');fs.writeFileSync(filename,dom.serialize());dom.window.close();
 const url='file:///'+filename.replaceAll('\\','/');
 const args=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--hide-scrollbars','--force-device-scale-factor=1','--user-data-dir='+profile,'--virtual-time-budget=5000','--window-size=1440,1000'];
 const measured=spawnSync(chrome,[...args,'--dump-dom',url],{encoding:'utf8',maxBuffer:30*1024*1024,timeout:60000,windowsHide:true});
 const match=measured.stdout?.match(/data-render-height="(\d+)"/);
 if(!match)throw new Error('Failed to measure '+slug+': '+measured.stderr?.slice(-1000));
 const height=Number(match[1]),png=path.join(out,String(i+1).padStart(2,'0')+'-'+slug+'.png');
 const result=spawnSync(chrome,[...args.filter(a=>!a.startsWith('--window-size=')),'--window-size=1440,'+height,'--screenshot='+png,url],{encoding:'utf8',maxBuffer:1024*1024,timeout:60000,windowsHide:true});
 if(!fs.existsSync(png))throw new Error('Screenshot failed '+slug+': '+result.stderr?.slice(-1000));
 results.push({page:slug,file:path.basename(png),width:1440,height,bytes:fs.statSync(png).size});
 console.log(JSON.stringify(results.at(-1)));
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(results,null,2));
console.log('COMPLETE: '+results.length+' page images');
