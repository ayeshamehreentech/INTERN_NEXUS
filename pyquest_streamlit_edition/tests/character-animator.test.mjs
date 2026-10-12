import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {CharacterAnimator} from '../web/character-animator.js';
import {animationCharacter,CharacterController} from '../web/characters.js';
import {ProgressionEvents} from '../web/progression.js';

function fixture(id='kai',options={}){
 let time=0,sequence=0;const timers=new Map(),rafs=new Map(),listeners=new Map(),renders=[];
 const host={dataset:{},replaceChildren(node){this.child=node}};
 const doc={hidden:false,createElement(){return {}},addEventListener(k,v){listeners.set(k,v)},removeEventListener(k){listeners.delete(k)}};
 const clock={now:()=>time,request:fn=>{const n=++sequence;rafs.set(n,fn);return n},cancel:n=>rafs.delete(n),later:(fn,delay)=>{const n=++sequence;timers.set(n,{fn,at:time+delay});return n},clear:n=>timers.delete(n)};
 const animator=new CharacterAnimator(host,{characterId:id,resolveCharacter:animationCharacter,renderStatic:(h,c,o,s)=>renders.push({c,o,s}),clock,document:doc,...options});
 const advance=ms=>{time+=ms;for(const [n,t] of [...timers])if(t.at<=time){timers.delete(n);t.fn()}const callbacks=[...rafs.values()];rafs.clear();for(const fn of callbacks)fn(time)};
 return {animator,host,doc,clock,renders,advance,timers,rafs,listeners};
}
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve()};

test('all characters reject retired animation states and never load their frames',async()=>{
 for(const id of ['kai','nova','mira','byte','zed']){
  const loads=[];const f=fixture(id,{loadImage:async url=>loads.push(url)});
  for(const state of ['talking','jump','celebrate']){
   f.animator.play(state,{force:true});await flush();
   assert.equal(f.animator.getState(),'idle');
   assert.equal(f.animator.config(state),null);
  }
  assert.deepEqual(loads,[]);f.animator.destroy();
 }
});

test('animator starts idle without any frame loop for unavailable assets',()=>{
 const f=fixture();assert.equal(f.animator.getState(),'idle');assert.equal(f.rafs.size,0);assert.equal(f.timers.size,0);f.animator.destroy();
});
for(const id of ['kai','nova','mira','byte','zed'])test(`selected ${id} resolves its own registry and outfit`,()=>{
 const f=fixture(id,{outfit:'outfit_02'});assert.equal(f.animator.character,animationCharacter(id));
 for(const state of ['thinking','happy','motivating','celebrate'])f.animator.play(state,{force:true});
 assert.ok(f.renders.every(r=>r.c===id&&r.o==='outfit_02'));f.animator.destroy();
});
test('pending Check keeps thinking beyond the old 1.8 second timeout',()=>{
 const f=fixture();CharacterController.prototype.setReaction.call({play:(...a)=>f.animator.play(...a),say(){}},'thinking','Checking');
 f.advance(20000);assert.equal(f.animator.getState(),'thinking');assert.equal(f.timers.size,0);f.animator.destroy();
});
test('backend correct transitions thinking to happy then idle',()=>{
 const f=fixture();f.animator.play('thinking');f.animator.play('happy');assert.equal(f.animator.getState(),'happy');f.advance(1801);assert.equal(f.animator.getState(),'idle');f.animator.destroy();
});
test('backend wrong transitions thinking to motivating, never celebrate',()=>{
 const f=fixture('nova');f.animator.play('thinking');f.animator.play('motivating');assert.equal(f.animator.getState(),'motivating');
 assert.equal(f.host.dataset.renderedState,'idle');assert.ok(f.renders.every(r=>r.c==='nova'&&r.s!=='celebrate'));f.animator.destroy();
});
test('topic mastered semantic event is happy, not world completion',()=>{
 const calls=[];CharacterController.prototype.dispatch.call({play:(s)=>calls.push(s),say(){}},'TOPIC_MASTERED');assert.deepEqual(calls,['happy']);
 assert.equal(new ProgressionEvents(null).accept({correct:true,topic_mastered:true},'q').completion,false);
});
test('confirmed completion uses happy and duplicate completion cannot replay',()=>{
 const p=new ProgressionEvents(null),f=fixture('zed'),value={correct:true,world_completion:{completed:true,completion_id:'c'}};
 let count=0;for(let i=0;i<2;i++){if(p.accept(value,'q').celebrate){f.animator.play('happy');count++}}
 assert.equal(count,1);assert.equal(f.animator.getState(),'happy');f.animator.destroy();
});
test('idle and retired requests cannot interrupt an active happy reaction',()=>{
 const f=fixture();f.animator.play('happy');assert.equal(f.animator.play('idle'),false);assert.equal(f.animator.play('talking'),false);
 assert.equal(f.animator.getState(),'happy');f.advance(1801);assert.equal(f.animator.getState(),'idle');f.animator.destroy();
});
test('missing state falls back to same Nova static artwork',()=>{
 const f=fixture('nova',{resolveCharacter:()=>({...animationCharacter('nova'),staticStates:['idle']})});f.animator.play('celebrate');
 assert.deepEqual(f.renders.at(-1),{c:'nova',o:'outfit_01',s:'idle'});f.animator.destroy();
});
test('reduced motion uses representative state with no rapid loop',()=>{
 const f=fixture('mira',{reducedMotion:()=>true});f.animator.play('happy');assert.equal(f.rafs.size,0);assert.equal(f.host.dataset.motion,'reduced');assert.equal(f.renders.at(-1).s,'happy');f.animator.destroy();
});
test('pause/resume preserves one-shot remaining time and destroy cancels all work',()=>{
 const f=fixture();f.animator.play('happy');f.advance(500);f.animator.pause();f.advance(9000);assert.equal(f.animator.getState(),'happy');
 f.animator.resume();f.advance(1301);assert.equal(f.animator.getState(),'idle');f.animator.play('celebrate');f.animator.destroy();
 assert.equal(f.timers.size,0);assert.equal(f.rafs.size,0);assert.equal(f.listeners.size,0);assert.equal(f.animator.play('happy'),false);
});
test('switching character cancels previous reaction without resetting outfit',()=>{
 const f=fixture();f.animator.play('celebrate');f.animator.setCharacter('nova','outfit_02');f.advance(3000);
 assert.equal(f.animator.character.id,'nova');assert.equal(f.animator.outfit,'outfit_02');assert.equal(f.animator.getState(),'idle');f.animator.destroy();
});
test('animator does not calculate or mutate learning results',()=>{
 const result=Object.freeze({correct:false,xp_awarded:0,coins_awarded:0,new_mastery:.4});const f=fixture();f.animator.play('motivating',result);
 assert.deepEqual(result,{correct:false,xp_awarded:0,coins_awarded:0,new_mastery:.4});
 const code=readFileSync(new URL('../web/character-animator.js',import.meta.url),'utf8');assert.doesNotMatch(code,/xp_awarded|coins_awarded|new_mastery|correct\s*===|\/api\//);f.animator.destroy();
});
test('manifest includes all inspected sources and no unapproved production frames',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/characters/animated/manifest.json',import.meta.url)));
 for(const id of ['kai','nova','mira','byte','zed']){
  assert.ok(existsSync(new URL('../'+manifest.characters[id].source,import.meta.url)));
  assert.deepEqual(Object.keys(manifest.characters[id].states),['idle','blink','thinking','happy','motivating']);
  for(const state of ['idle','blink','thinking','happy','motivating']){
   const config=manifest.characters[id].states[state];
   if(id==='kai'&&['thinking','happy','motivating','blink'].includes(state)){assert.equal(config.status,'READY');assert.equal(config.frames.length,4);continue}
   if(id==='byte'||id!=='kai'&&state==='idle'){
    assert.equal(config.status,'READY');assert.equal(config.frames.length,state==='idle'?1:2);
    assert.ok(config.frames.every(path=>path.startsWith(`/assets/characters/animated/${id}/${state}/`)));continue;
   }
   assert.equal(config.status,'SOURCE_REQUIRES_CLEAN_ASSET');assert.deepEqual(config.frames,[]);assert.equal(config.fps,null);
  }
 }
});
// Synthetic frame URLs below exist only in mocked image-loader tests, not the production manifest.
function framed(state='idle',loop=true){return {...animationCharacter('kai'),animations:{outfit:'outfit_01',states:{[state]:{status:'READY',frames:['/assets/characters/animated/kai/test/01.png','/assets/characters/animated/kai/test/02.png'],fps:4,loop}}}}}
test('frame engine reuses one image node, obeys FPS, preloads URLs once',async()=>{
 const loads=[];const f=fixture('kai',{resolveCharacter:()=>framed(),loadImage:async url=>{loads.push(url);return {}}});await flush();
 const image=f.host.child;assert.equal(loads.length,2);f.advance(100);assert.equal(f.host.child,image);assert.match(image.src,/01.png$/);
 f.advance(160);assert.match(image.src,/02.png$/);assert.equal(f.host.child,image);await f.animator.preload('idle');assert.equal(loads.length,2);f.animator.destroy();
});
test('blink is scheduled only with real reviewed frames and returns to idle',async()=>{
 const f=fixture('kai',{resolveCharacter:()=>framed('blink',false),loadImage:async()=>({})});f.advance(6001);await flush();assert.equal(f.animator.getState(),'blink');f.advance(600);assert.equal(f.animator.getState(),'idle');f.animator.destroy();
});
test('new sheets cannot be loaded as gameplay frame URLs',async()=>{
 const c=framed();c.animations.states.idle.frames=['/assets/characters/animination/kai/kai.png'];let loads=0;
 const f=fixture('kai',{resolveCharacter:()=>c,loadImage:async()=>{loads++}});await flush();assert.equal(loads,0);assert.equal(f.host.dataset.renderMode,'static-css');f.animator.destroy();
});
test('Explorer never uses Classic production frames',async()=>{
 let loads=0;const f=fixture('kai',{outfit:'outfit_02',resolveCharacter:()=>framed(),loadImage:async()=>{loads++}});await flush();assert.equal(loads,0);assert.equal(f.renders.at(-1).o,'outfit_02');f.animator.destroy();
});
test('failed frame load keeps canonical same-character fallback',async()=>{
 const f=fixture('kai',{resolveCharacter:()=>framed(),loadImage:async()=>{throw Error('404')}});await flush();assert.equal(f.host.dataset.renderMode,'static-css');assert.equal(f.renders.at(-1).c,'kai');f.animator.destroy();
});
test('destroy during loading cannot resurrect image or animation loop',async()=>{
 let release;const pending=new Promise(r=>release=r);const f=fixture('kai',{resolveCharacter:()=>framed(),loadImage:()=>pending});f.animator.destroy();release({});await flush();assert.equal(f.host.child,undefined);assert.equal(f.rafs.size,0);
});
test('live reduced-motion change stops an active frame loop',async()=>{
 let reduced=false;const f=fixture('kai',{resolveCharacter:()=>framed(),loadImage:async()=>({}),reducedMotion:()=>reduced});await flush();f.advance(300);reduced=true;f.animator.refreshMotion();assert.equal(f.rafs.size,0);assert.match(f.host.child.src,/01.png$/);f.animator.destroy();
});

const production=JSON.parse(readFileSync(new URL('../assets/characters/animated/manifest.json',import.meta.url)));
const productionCharacter=id=>({...animationCharacter(id),animations:production.characters[id]});
const readProduction=url=>readFileSync(new URL('..'+url,import.meta.url));

for(const state of ['happy','motivating','blink']){
 test(`production ${state} loads all frames and finishes without looping`,async()=>{
  const config=production.characters.kai.states[state];
  assert.equal(config.loop,false);
  for(const url of config.frames){const b=readProduction(url);assert.equal(b.readUInt32BE(20),760);assert.equal(b[25],6)}
  const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>readProduction(url)});
  f.animator.play(state);await flush();
  for(let i=0;i<4;i++){assert.equal(f.host.child.src,config.frames[i]);f.advance(1000/config.fps+0.01)}
  assert.equal(f.animator.getState(),'idle');f.animator.destroy();
 });
 test(`production ${state} respects reduced motion and Explorer isolation`,async()=>{
  const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>readProduction(url),reducedMotion:()=>true});
  f.animator.play(state);await flush();assert.equal(f.rafs.size,0);assert.equal(f.host.child.src,production.characters.kai.states[state].frames[0]);f.animator.destroy();
  let loads=0;const e=fixture('kai',{outfit:'outfit_02',resolveCharacter:productionCharacter,loadImage:async()=>{loads++}});
  e.animator.play(state);await flush();assert.equal(loads,0);e.animator.destroy();
 });
}
test('production blink cannot interrupt pending Check or happy',async()=>{
 const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>readProduction(url)});
 for(const state of ['thinking','happy']){f.animator.play(state,{force:true});await flush();assert.equal(f.animator.play('blink'),false);assert.equal(f.animator.getState(),state)}
 f.animator.destroy();
});
test('Kai thinking production files are four distinct equal-canvas RGBA PNGs',()=>{
 const config=production.characters.kai.states.thinking;
 assert.equal(config.status,'READY');assert.equal(config.loop,true);assert.equal(config.fps,2);
 const bytes=config.frames.map(readProduction);
 assert.equal(new Set(bytes.map(b=>b.toString('base64'))).size,4);
 for(const b of bytes){assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),543);assert.equal(b.readUInt32BE(20),760);assert.equal(b[25],6)}
});
for(const response of ['happy','motivating'])test(`real Kai files loop while pending then stop for ${response}`,async()=>{
 const loads=[];const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>{loads.push(url);return readProduction(url)}});
 f.animator.play('thinking');await flush();
 const expected=production.characters.kai.states.thinking.frames;
 for(let i=0;i<9;i++){assert.equal(f.host.child.src,expected[i%4]);f.advance(500)}
 assert.equal(f.animator.getState(),'thinking');assert.equal(loads.filter(p=>p.includes('/thinking/')).length,4);
 f.animator.play(response);assert.equal(f.rafs.size,0);assert.equal(f.host.dataset.renderMode,'static-css');assert.equal(f.renders.at(-1).c,'kai');f.animator.destroy();
});
for(const id of ['nova','mira','byte','zed'])test(`${id} never loads Kai production frames`,async()=>{
 const loads=[];const f=fixture(id,{resolveCharacter:productionCharacter,loadImage:async url=>{loads.push(url);return readProduction(url)}});
 f.animator.play('thinking');await flush();
 const expected=id==='byte'?['idle/01','thinking/01','thinking/02','happy/01','happy/02','motivating/01','motivating/02']:['idle/01'];
 assert.deepEqual(loads,expected.map(frame=>`/assets/characters/animated/${id}/${frame}.png`));
 assert.equal(loads.some(url=>url.includes('/kai/')),false);
 assert.equal(f.renders.at(-1).c,id);
 assert.equal(f.host.dataset.renderedState,id==='byte'?'thinking':'idle');
 assert.equal(f.host.dataset.renderMode,id==='byte'?'frames':'static');
 assert.equal(f.host.child.src,`/assets/characters/animated/${id}/${id==='byte'?'thinking':'idle'}/01.png`);
 f.animator.destroy();
});

test('every READY production manifest frame exists as a same-character PNG',()=>{
 for(const [id,character] of Object.entries(production.characters))for(const [state,config] of Object.entries(character.states)){
  if(config.status!=='READY'){assert.deepEqual(config.frames,[]);continue}
  assert.ok(config.frames.length>0,`${id}/${state}`);
  for(const url of config.frames){
   assert.ok(url.startsWith(`/assets/characters/animated/${id}/${state}/`));
   const bytes=readProduction(url);
   assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
   assert.ok(bytes.readUInt32BE(16)>0);assert.ok(bytes.readUInt32BE(20)>0);
  }
 }
});
test('real Kai thinking reduced motion holds first frame without RAF',async()=>{
 const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>readProduction(url),reducedMotion:()=>true});
 f.animator.play('thinking');await flush();const src=f.host.child.src;f.advance(10000);assert.equal(f.rafs.size,0);assert.equal(f.host.child.src,src);assert.equal(f.animator.getState(),'thinking');f.animator.destroy();
});
test('one failed production frame leaves same Kai fallback without broken image',async()=>{
 const f=fixture('kai',{resolveCharacter:productionCharacter,loadImage:async url=>{if(url.endsWith('03.png'))throw Error('unavailable');return readProduction(url)}});
 f.animator.play('thinking');await flush();assert.equal(f.host.dataset.renderMode,'static-css');assert.equal(f.renders.at(-1).c,'kai');assert.equal(f.rafs.size,0);f.animator.destroy();
});
