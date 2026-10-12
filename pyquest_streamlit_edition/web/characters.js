// User-supplied studio artwork. SVG viewports reuse it without generated sprites.
import {CharacterAnimator} from './character-animator.js';
const definitions=[
 ['byte','Byte','Friendly & Intelligent','Let’s learn Python together and explore amazing possibilities!','#16b9ff'],
 ['nova','Nova','Creative & Cheerful','Let’s learn Python together and create amazing things!','#ab5bff'],
 ['kai','Kai','Curious & Determined','Let’s explore Python together and take on exciting challenges!','#ff5265'],
 ['mira','Mira','Calm & Supportive','Let’s learn Python together and grow step by step!','#43d999'],
 ['zed','Zed','Cool & Analytical','Let’s dive into Python, analyze problems, and build amazing projects!','#a967ff']
];
export const CHARACTERS=definitions.map(([id,name,role,tagline,color])=>({
 id,name,role,tagline,color,image:`/assets/characters/studio-${id}.${id==='zed'?'jpeg':'png'}`,
 outfits:[{id:'outfit_01',name:'Classic',x:1080},{id:'outfit_02',name:'Explorer',x:1294}],
 poses:['idle','blink','thinking','happy','motivating']
}));
const actualCharacterAsset=(character)=>`/assets/characters/studio-${character.id}.${character.id==='zed'?'jpeg':'png'}`;
export const CharacterRegistry=Object.freeze(Object.fromEntries(CHARACTERS.map(character=>[
  character.name,
  {
   id:character.id,
   name:character.name,
   image:actualCharacterAsset(character),
   outfits:character.outfits,
   manifestUrl:'/assets/characters/animated/manifest.json',
   animations:{outfit:'outfit_01',states:{}},
   staticStates:['idle','thinking','happy'],
   fallbacks:{happy:['idle'],motivating:['idle'],thinking:['idle'],blink:['idle'],idle:[]},
   reactions:{
    idle:{state:'idle',asset:actualCharacterAsset(character)},
    thinking:{state:'thinking',asset:actualCharacterAsset(character)},
    happy:{state:'happy',asset:actualCharacterAsset(character)},
    motivating:{state:'idle',asset:actualCharacterAsset(character)},
   }
  }
])));
export const getCharacter=id=>CHARACTERS.find(c=>c.id===id)||CHARACTERS[0];
export const animationCharacter=id=>Object.values(CharacterRegistry).find(c=>c.id===id);
let manifestRequest;
function loadAnimations(){
 if(!manifestRequest)manifestRequest=fetch('/assets/characters/animated/manifest.json').then(r=>{if(!r.ok)throw Error('Animation manifest unavailable');return r.json()}).then(data=>{
  if(data.version!==1)throw Error('Unsupported animation manifest');
  for(const c of Object.values(CharacterRegistry))if(data.characters?.[c.id])c.animations=data.characters[c.id];
 }).catch(()=>{}); // Existing canonical artwork is always available as fallback.
 return manifestRequest;
}
export function resolveCharacterReaction(characterId,reaction='idle'){
 const character=getCharacter(characterId);
 const registry=CharacterRegistry[character.name];
 const mapped=registry?.reactions?.[reaction] || {state:'idle',asset:character.image};
 return mapped.state === 'motivating' ? {state:'idle',asset:character.image} : mapped;
}
export function selectedCompanion(settings={}){
 const character=getCharacter(settings.selected_character||settings.companion);
 const outfit=character.outfits.find(o=>o.id===settings.character_outfits?.[character.id])||character.outfits[0];
 return {character,outfit};
}
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion');

export function characterArtwork(character,outfitId='outfit_01',pose='idle',kind='body',staticFallback=false){
 const outfit=character.outfits.find(o=>o.id===outfitId)||character.outfits[0];
 // Source-sheet columns keep their original order, independently of controls.
 const index=({idle:0,blink:0,happy:1,thinking:2,motivating:0})[pose]??0;
 if(!staticFallback&&character.id==='kai'&&outfit.id==='outfit_01'&&kind==='body'){
  const state=['thinking','happy','motivating'].includes(pose)?pose:'blink';
  return `<img class="character-frame" data-static-character="kai" data-static-pose="${pose}" src="/assets/characters/animated/kai/${state}/01.png" alt="Kai, Classic, ${pose}">`;
 }
 if(!staticFallback&&outfit.id==='outfit_01'&&kind==='body'&&['byte','nova','mira','zed'].includes(character.id)){
  const state=character.id==='byte'&&['blink','thinking','happy','motivating'].includes(pose)?pose:'idle';
  return `<img class="character-frame" data-static-character="${character.id}" data-static-pose="${pose}" src="/assets/characters/animated/${character.id}/${state}/01.png" alt="${character.name}, Classic, ${pose}">`;
 }
 const box=kind==='face'?`${1075+index*71} 612 65 70`:`${outfit.x} 254 198 290`;
 // Mask the baked selection marker in the supplied Classic reference. Actual
 // selection indicators are DOM state, never inferred from the artwork.
 const marker=kind==='body'&&outfitId==='outfit_01'?'<circle cx="1179" cy="519" r="23" fill="#e1eeff"/>':'';
 return `<svg viewBox="${box}" role="img" aria-label="${character.name}, ${outfit.name}, ${pose}"><image href="${character.image}" width="1536" height="1024"/>${marker}</svg>`;
}

// Direct artwork (outfit thumbnails and completion cards) also needs a fallback.
// Animated controllers handle their own preload failures separately.
globalThis.document?.addEventListener?.('error',event=>{
 const image=event.target,id=image?.dataset?.staticCharacter;
 if(!id||image.tagName!=='IMG'||!CHARACTERS.some(character=>character.id===id))return;
 const holder=document.createElement('div');
 holder.innerHTML=characterArtwork(getCharacter(id),'outfit_01',image.dataset.staticPose,'body',true);
 image.replaceWith(holder.firstElementChild);
},true);

export class CharacterController{
 constructor(host,character='byte',outfit='outfit_01'){
  this.host=host;
  host.innerHTML='<div class="character-figure"></div><p class="speech-bubble" aria-live="polite"></p>';
  this.figure=host.querySelector('.character-figure');this.bubble=host.querySelector('.speech-bubble');
  this.character=getCharacter(character);this.outfit=outfit;
  this.animator=new CharacterAnimator(this.figure,{characterId:this.character.id,outfit,resolveCharacter:animationCharacter,reducedMotion:reduced,
   renderStatic:(figure,id,outfit,pose)=>{const c=getCharacter(id);figure.innerHTML=characterArtwork(c,outfit,pose,'body',true)+(pose!=='idle'?'<span class="expression-inset">'+characterArtwork(c,outfit,pose,'face')+'</span>':'')}});
  this.say(this.character.tagline);
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  this.motionChanged=()=>this.animator.refreshMotion();this.motion.addEventListener?.('change',this.motionChanged);
  this.observer=new MutationObserver(this.motionChanged);this.observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  loadAnimations().then(()=>{if(!this.animator.destroyed){for(const state of ['idle','thinking','happy','motivating'])this.animator.preload(state).catch(()=>{});if(this.animator.getState()==='idle')this.play('idle')}});
 }
 setCharacter(id,outfit='outfit_01'){
  this.character=getCharacter(id);this.outfit=outfit;this.animator.setCharacter(this.character.id,outfit);this.say(this.character.tagline);
 }
 setOutfit(id){this.setCharacter(this.character.id,id)}
 setPose(pose){this.play(pose,{force:true})}
 setReaction(reaction,message){
  // Explicit request lifecycle transitions can start a new check immediately.
  this.play(reaction,{force:reaction==='thinking'});
  if(message!==undefined&&message!==null&&message!=='')this.say(message);
 }
 say(message){this.bubble.textContent=message}
 play(state,options={}){return this.animator.play(state,options)}
 getState(){return this.animator.getState()}
 dispatch(event,payload={}){
  const state={QUESTION_LOADED:'idle',CHECK_PENDING:'thinking',ANSWER_CORRECT:'happy',ANSWER_INCORRECT:'motivating',
   HINT_REQUESTED:'thinking',HINT_RECEIVED:'idle',SOLUTION_RECEIVED:'idle',DIALOGUE_FINISHED:'idle',TOPIC_MASTERED:'happy'}[event];
  if(state)this.play(state,{force:['QUESTION_LOADED','CHECK_PENDING','HINT_REQUESTED','HINT_RECEIVED','SOLUTION_RECEIVED','DIALOGUE_FINISHED'].includes(event)});
  if(payload.message)this.say(payload.message);
 }
 destroy(){this.observer?.disconnect();this.motion?.removeEventListener?.('change',this.motionChanged);this.animator.destroy();this.host.replaceChildren()}
}

const receiptStorage=typeof sessionStorage==='undefined'?null:sessionStorage;
const animatedReceipts=new Set(JSON.parse(receiptStorage?.getItem('pyquest:coin-receipts')||'[]'));
export function rewardAnimation(result,receipt,origin){
 if(!result || Number(result.coins_awarded || 0) <= 0 || !receipt || animatedReceipts.has(receipt))return;
 animatedReceipts.add(receipt);
 receiptStorage?.setItem('pyquest:coin-receipts',JSON.stringify([...animatedReceipts]));
 const wallet=document.querySelector('#wallet');
 if(!wallet || reduced())return;
 if(!origin || typeof origin.getBoundingClientRect!=='function')return;
 const source=origin.getBoundingClientRect(),target=wallet.getBoundingClientRect();
 const coin=document.createElement('span');coin.className='flying-coin';coin.textContent='🪙';coin.setAttribute('aria-hidden','true');
 coin.style.left=source.left+source.width/2+'px';coin.style.top=source.top+'px';document.body.append(coin);
 const dx=target.left-source.left-source.width/2,dy=target.top-source.top;
 const animation=coin.animate([{transform:'translate(0,0) scale(.6)',opacity:0},
  {transform:'translate(0,-30px) scale(1.1)',opacity:1,offset:.2},
  {transform:`translate(${dx}px,${dy}px) scale(.4) rotate(360deg)`,opacity:0}],{duration:850,easing:'ease-in-out'});
 animation.finished.then(()=>{coin.remove();wallet.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:300})}).catch(()=>coin.remove());
}

export function mountStudio(host,settings,save){
 let preview=settings.companion||'byte';
 const outfits={...settings.character_outfits};
 let outfit=outfits[preview]||'outfit_01';
 host.innerHTML=`<div class="studio-title"><div><p class="eyebrow">MAKE THE JOURNEY YOURS</p><h1>Character Studio</h1></div><span class="free-badge">✦ All companions are free</span></div>
 <div class="studio-layout"><section class="studio-panel companion-picker"><h2>Choose Your Companion</h2><div class="character-carousel" aria-label="Choose a character to preview"></div></section>
 <section class="studio-stage"><div class="stage-heading"><h2 id="character-name"></h2><p id="character-role"></p></div><div id="studio-companion" class="companion large"></div><div class="glowing-platform" aria-hidden="true"></div><p id="active-label"></p></section>
 <section class="studio-panel studio-customize"><h2>Preview Expressions</h2><div id="pose-controls" class="pose-grid"></div><button id="choose-character" class="save-companion">▣ Save as My Companion</button><p id="studio-status" role="status"></p></section></div>
 <div class="studio-benefits"><article><span>🎨</span><div><h3>Personalize</h3><p>Choose your favourite companion.</p></div></article><article><span>✦</span><div><h3>Free for Everyone</h3><p>All characters are completely free.</p></div></article><article><span>⚙</span><div><h3>Supports Learning</h3><p>Your companion stays with you throughout your Python journey.</p></div></article><article><span>♥</span><div><h3>Motivating Experience</h3><p>Friendly reactions that celebrate your progress.</p></div></article></div>`;
 const controller=new CharacterController(host.querySelector('#studio-companion'),preview,outfit);
 const carousel=host.querySelector('.character-carousel');
 for(const c of CHARACTERS){
  const b=document.createElement('button');b.className='companion-card';b.style.setProperty('--card-color',c.color);b.dataset.character=c.id;
  b.innerHTML=characterArtwork(c,'outfit_01','idle','face')+`<span><strong>${c.name}</strong><small>${c.role}</small></span><span aria-hidden="true">›</span>`;
  b.setAttribute('aria-label',`Preview ${c.name}`);
  b.onclick=()=>{preview=c.id;outfit=outfits[preview]||'outfit_01';render();controller.play('happy')};carousel.append(b);
 }
 function render(){
  const c=getCharacter(preview);controller.setCharacter(preview,outfit);
  host.style.setProperty('--companion-accent',c.color);
  host.querySelector('#character-name').textContent=c.name;host.querySelector('#character-role').textContent=c.role;
  const active=(settings.companion||'byte')===preview&&(settings.character_outfits?.[preview]||'outfit_01')===outfit;
  host.querySelector('#active-label').textContent=active?'✓ ACTIVE COMPANION':'Preview only — save to use on your journey';
  host.querySelector('#choose-character').textContent=active?'✓ Saved as My Companion':'▣ Save as My Companion';
  carousel.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.character===preview)));
  const poses=host.querySelector('#pose-controls');poses.replaceChildren();
  for(const pose of c.poses){const b=document.createElement('button');b.innerHTML=characterArtwork(c,outfit,pose,'face')+'<span>'+pose[0].toUpperCase()+pose.slice(1)+'</span>';b.setAttribute('aria-label','Preview '+pose);b.setAttribute('aria-pressed',String(pose==='idle'));b.onclick=()=>{controller.setPose(pose);poses.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))};poses.append(b)}

 }
 async function commit(){
  const status=host.querySelector('#studio-status');
  outfits[preview]=outfit;
  try{
   const change={character_outfits:{...outfits},companion:preview};
   host.querySelector('#choose-character').disabled=true;
   await save(change);Object.assign(settings,change);render();status.textContent='Your companion is saved.';
  }catch(e){status.textContent=e.message}finally{host.querySelector('#choose-character').disabled=false}
 }
 host.querySelector('#choose-character').onclick=commit;
 render();return controller;
}
