// Presentation only. No grading, reward, mastery or persistence dependencies.
export const STATE_PRIORITY=Object.freeze({idle:0,blink:1,thinking:3,happy:4,motivating:4});
const DURATION={blink:240,happy:1800,motivating:1800};
const FALLBACK={happy:['idle'],motivating:['idle'],thinking:['idle'],blink:['idle'],idle:[]};
const browserClock={now:()=>performance.now(),request:fn=>requestAnimationFrame(fn),cancel:id=>cancelAnimationFrame(id),later:(fn,ms)=>setTimeout(fn,ms),clear:id=>clearTimeout(id)};

export class CharacterAnimator {
 constructor(host,{characterId='byte',outfit='outfit_01',resolveCharacter,renderStatic,clock=browserClock,reducedMotion=()=>false,loadImage,document:doc=globalThis.document}={}){
  this.host=host;this.resolveCharacter=resolveCharacter;this.renderStatic=renderStatic;
  this.clock=clock;this.reducedMotion=reducedMotion;this.doc=doc;
  this.loadImage=loadImage||((url)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=url}));
  this.cache=new Map();this.generation=0;this.destroyed=false;this.paused=false;
  this.visibility=()=>{if(doc.hidden)this.pause();else this.resume()};
  doc?.addEventListener?.('visibilitychange',this.visibility);
  this.setCharacter(characterId,outfit);
 }
 getState(){return this.state}
 config(state){
  if(!(state in STATE_PRIORITY))return null;
  const entry=this.character.animations?.states?.[state];
  const frames=entry?.frames;
  // Only explicitly reviewed production files for this identity AND outfit.
  const prefix='/assets/characters/animated/'+this.character.id+'/';
  if(entry?.status!=='READY'||this.character.animations.outfit!==this.outfit||!Array.isArray(frames)||!frames.length||!frames.every(p=>typeof p==='string'&&p.startsWith(prefix)&&!p.includes('..')&&!p.includes('?')&&/\.(png|webp)$/.test(p)))return null;
  if(frames.length>1&&!(entry.fps>0&&entry.fps<=30))return null;
  return entry;
 }
 resolve(state){
  for(const candidate of [state,...(this.character.fallbacks?.[state]||FALLBACK[state]||['idle'])]){
   const config=this.config(candidate);if(config)return {state:candidate,config};
  }
  return {state:this.character.staticStates?.includes(state)?state:'idle',config:null};
 }
 preload(state){
  const config=this.config(state);if(!config)return Promise.resolve([]);
  return Promise.all(config.frames.map(url=>{
   if(!this.cache.has(url))this.cache.set(url,Promise.resolve().then(()=>this.loadImage(url)));
   return this.cache.get(url);
  }));
 }
 setCharacter(id,outfit=this.outfit||'outfit_01'){
  if(this.destroyed)return;
  const character=this.resolveCharacter(id);
  if(!character)throw new Error('Unknown companion: '+id);
  this.stop();this.character=character;this.outfit=outfit;this.cache.clear();
  this.state='idle';this.play('idle',{force:true});
  for(const s of ['idle','thinking','happy','motivating'])this.preload(s).catch(()=>{});
 }
 play(state,options={}){
  if(this.destroyed)return false;
  if(!(state in STATE_PRIORITY))state='idle';
  if(!options.force&&STATE_PRIORITY[state]<STATE_PRIORITY[this.state])return false;
  this.cancelWork();const generation=++this.generation;
  this.state=state;this.elapsed=0;this.last=null;this.frameIndex=-1;
  this.duration=options.duration??DURATION[state]??null;
  this.host.dataset.state=state;this.host.dataset.animator='true';
  const resolved=this.resolve(state);this.activeConfig=resolved.config;
  this.host.dataset.renderedState=resolved.state;
  this.renderStatic(this.host,this.character.id,this.outfit,resolved.state);
  this.host.dataset.renderMode='static-css';
  this.ready=false;this.frozen=!!options.static;
  if(resolved.config){
   this.preload(resolved.state).then(()=>{
    if(this.destroyed||generation!==this.generation)return;
    this.image=this.doc.createElement('img');this.image.alt=this.character.name+', '+state;
    this.image.className='character-frame';this.host.replaceChildren(this.image);
    this.image.src=resolved.config.frames[0];this.frameIndex=0;
    this.host.dataset.renderMode=resolved.config.frames.length>1?'frames':'static';
    this.ready=true;this.schedule();
   }).catch(()=>{
    if(this.destroyed||generation!==this.generation)return;
    this.activeConfig=null;this.ready=true;this.schedule();
   });
  }else{this.ready=true;this.schedule()}
  return true;
 }
 cancelWork(){
  if(this.raf!=null)this.clock.cancel(this.raf);
  if(this.timer!=null)this.clock.clear(this.timer);
  this.raf=null;this.timer=null;
 }
 schedule(){
  this.cancelWork();
  if(this.destroyed||this.paused||!this.ready)return;
  this.last=this.clock.now();
  const reduced=this.frozen||this.reducedMotion();
  this.host.dataset.motion=reduced?'reduced':'full';
  if(this.activeConfig?.frames.length>1&&!reduced){
   this.raf=this.clock.request(t=>this.tick(t));return;
  }
  if(this.duration!=null)this.timer=this.clock.later(()=>this.finish(),Math.max(0,this.duration-this.elapsed));
  else if(this.state==='idle'&&this.config('blink')&&!reduced)this.timer=this.clock.later(()=>this.play('blink'),6000);
 }
 tick(now){
  this.raf=null;
  if(this.destroyed||this.paused)return;
  this.elapsed+=Math.max(0,now-this.last);this.last=now;
  if(this.reducedMotion()){this.image.src=this.activeConfig.frames[0];this.schedule();return}
  const config=this.activeConfig,step=Math.floor(this.elapsed*config.fps/1000);
  if((!config.loop&&step>=config.frames.length)||(this.duration!=null&&this.elapsed>=this.duration)){this.finish();return}
  const index=step%config.frames.length;
  if(index!==this.frameIndex){this.image.src=config.frames[index];this.frameIndex=index}
  this.raf=this.clock.request(t=>this.tick(t));
 }
 finish(){if(!this.destroyed)this.play('idle',{force:true})}
 stop(){
  this.cancelWork();this.generation++;this.ready=false;
  if(this.host?.dataset)this.host.dataset.motion='paused';
 }
 pause(){
  if(this.destroyed||this.paused)return;
  if(this.last!=null)this.elapsed+=Math.max(0,this.clock.now()-this.last);
  this.paused=true;this.cancelWork();this.host.dataset.motion='paused';
 }
 resume(){if(this.destroyed||!this.paused)return;this.paused=false;this.schedule()}
 refreshMotion(){
  if(this.destroyed)return;
  if(this.activeConfig&&this.image&&this.reducedMotion())this.image.src=this.activeConfig.frames[0];
  this.schedule();
 }
 destroy(){
  if(this.destroyed)return;
  this.stop();this.destroyed=true;this.cache.clear();
  this.doc?.removeEventListener?.('visibilitychange',this.visibility);
  this.host.replaceChildren();
 }
}
