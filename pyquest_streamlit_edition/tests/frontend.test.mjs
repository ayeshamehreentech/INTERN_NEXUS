import './draft-saver.test.mjs';
import './difficulty-support.test.mjs';
import './companion-controller.test.mjs';
import './success-celebration.test.mjs';
import test from 'node:test';
import './concepts.test.mjs';
import './character-animator.test.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ProgressionEvents,presentProgression} from '../web/progression.js';

test('navigation and routes contain no competitive leaderboard',()=>{
 const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/leaderboard|top learners|global rank|weekly rank/i);
 assert.match(source,/page==='progress'/);
});

test('wrong answers cannot celebrate XP or completion',()=>{
 const e=new ProgressionEvents(null).accept({correct:false,xp_awarded:100,world_completion:{completed:true,completion_id:'c'}},'q');
 assert.equal(e.xp,false);assert.equal(e.completion,false);assert.equal(e.celebrate,false);
});
test('correct and topic mastered do not imply level complete',()=>{
 const p=new ProgressionEvents(null);
 assert.equal(p.accept({correct:true,xp_awarded:75},'q').completion,false);
 const e=p.accept({correct:true,topic_mastered:true},'q');assert.equal(e.topic,true);assert.equal(e.completion,false);
 assert.equal(p.accept({correct:true,world_completion:{completed:true}},'q').completion,false);
});
test('XP and completion receipts persist across controller recreation',()=>{
 const storage={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};
 const v={correct:true,xp_awarded:75,world_completion:{completed:true,completion_id:'completion-a'}};
 const first=new ProgressionEvents(storage).accept(v,'q');assert.equal(first.xp,true);assert.equal(first.celebrate,true);
 const again=new ProgressionEvents(storage).accept(v,'q');assert.equal(again.xp,false);assert.equal(again.celebrate,false);assert.equal(again.completion,true);
});
test('completion card preserves all selected outfits and backend numbers, navigation and motion/sound settings',()=>{
 const prior=globalThis.document;
 const node=()=>({children:[],append(n){this.children.push(n)},setAttribute(){},textContent:'',className:''});
 globalThis.document={createElement:node};
 try{
  for(const id of ['byte','kai','nova','mira','zed'])for(const outfit of ['outfit_01','outfit_02']){
   const host=node(),calls=[];
   const value={correct:true,xp_awarded:75,xp_total:275,topic_mastered:true,world_completion:{completed:true,completion_id:'c',world_name:'I/O Harbor',final_score:100,xp_gained:275,coins_gained:9,topics_mastered:3,topics_total:3,mastery:{INPUT:.9},next_world_id:'W02'}};
   presentProgression(host,value,{xp:true,topic:true,completion:true,celebrate:true},{settings:{selected_character:id,character_outfits:{[id]:outfit},sound_effects_enabled:false},reducedMotion:true,companion:{play(){calls.push('play')},say(){}},audio:{effect(){calls.push('sound')}}});
   const all=n=>[n,...n.children.flatMap(all)],nodes=all(host);
   assert.ok(nodes.some(n=>n.textContent.includes('275')&&n.textContent.includes('9')));
   const expectedArt=outfit==='outfit_01'?`/animated/${id}/${['kai','byte'].includes(id)?'happy':'idle'}/01.png`:`studio-${id}.`;
   assert.ok(nodes.some(n=>n.innerHTML?.includes(expectedArt)));
   assert.ok(nodes.some(n=>n.innerHTML?.includes(outfit==='outfit_01'?'Classic':'Explorer')));
   assert.ok(nodes.some(n=>n.href==='#world/W02'));assert.ok(nodes.some(n=>n.href==='#home'));
   assert.ok(nodes.every(n=>!n.className.includes('progression-pop')));assert.deepEqual(calls,[]);
  }
 }finally{globalThis.document=prior}
});
test('fresh completion plays selected companion and sound only once',()=>{
 const prior=globalThis.document;const node=()=>({append(){},setAttribute(){}});globalThis.document={createElement:node};
 try{const calls=[],p=new ProgressionEvents(null),v={correct:true,xp_awarded:50,world_completion:{completed:true,completion_id:'unique',mastery:{}}};
 const options={settings:{sound_effects_enabled:true},companion:{play(s){calls.push(s)},say(){}},audio:{effect(s){calls.push(s)}}};
 presentProgression(node(),v,p.accept(v,'q'),options);presentProgression(node(),v,p.accept(v,'q'),options);
 assert.deepEqual(calls,['happy','mastered']);
 }finally{globalThis.document=prior}
});
import {AudioController,CelebrationController} from '../web/audio.js';
import {CHARACTERS,selectedCompanion,characterArtwork,CharacterRegistry,resolveCharacterReaction,getCharacter,rewardAnimation} from '../web/characters.js';
import {buildResultPresentation,renderResult} from '../web/terminal.js';
test('frame-load fallback uses canonical studio artwork for every identity and outfit',()=>{
 for(const character of CHARACTERS)for(const outfit of ['outfit_01','outfit_02']){
  const art=characterArtwork(character,outfit,'thinking','body',true);
  assert.match(art,/<svg /);assert.ok(art.includes(character.image));
  assert.ok(art.includes(outfit==='outfit_01'?'Classic':'Explorer'));
  assert.doesNotMatch(art,/\/animated\//);
 }
});

test('practice resolves all ten saved character/outfit combinations to distinct artwork',()=>{
 for(const c of CHARACTERS){
  const renders=c.outfits.map(o=>{
   const selected=selectedCompanion({companion:c.id,character_outfits:{[c.id]:o.id}});
   assert.equal(selected.character.id,c.id);assert.equal(selected.outfit.id,o.id);
   const html=characterArtwork(selected.character,selected.outfit.id);
   assert.ok(html.includes(`${c.name}, ${o.name}, idle`));return html;
  });
  assert.notEqual(renders[0],renders[1]);
 }
 assert.equal(selectedCompanion({companion:'missing'}).character.id,'byte');
 assert.equal(selectedCompanion({companion:'kai',character_outfits:{kai:'missing'}}).outfit.id,'outfit_01');
});
import {resourceMatches,lessonMatches} from '../web/resources.js';

test('detailed resources preserve 56 lessons separately from the cheat sheet',()=>{
 const lessons=lessonMatches('');assert.equal(lessons.length,56);
 assert.equal(new Set(lessons.map(l=>l.group)).size,8);
 assert.equal(new Set(lessons.map(l=>l.id)).size,56);
 assert.equal(lessons[0].id,'name-input');
 const variables=lessons.find(l=>l.id==='variables');
 assert.match(variables.card[4],/Multiple assignments/);
 assert.match(variables.card[4],/One value, multiple names/);
 for(const lesson of lessons)assert.doesNotMatch(lesson.card[4],/<script|<style|onclick=|Doraemon|Nobita/);
 assert.equal(resourceMatches('').length,25);
});

test('resource search preserves all cards and filters without changing source data',()=>{
 const all=resourceMatches('');assert.equal(all.length,25);
 assert.equal(all[0].card[0],'Python basics');
 assert.equal(resourceMatches('  DICTIONARY METHODS ')[0].card[0],'Dictionary methods');
 assert.equal(resourceMatches('no-such-python-topic').length,0);
 assert.equal(resourceMatches('').length,25);
});

test('five original companions have two outfits and only the five supported poses',()=>{
 assert.equal(CHARACTERS.length,5);
 assert.equal(new Set(CHARACTERS.map(c=>c.id)).size,5);
 for(const c of CHARACTERS){assert.equal(c.outfits.length,2);assert.deepEqual(c.poses,['idle','blink','thinking','happy','motivating'])}
});
test('music is off by default and volume is bounded',()=>{
 const audio=new AudioController();assert.equal(audio.enabled,false);assert.equal(audio.context,null);
 audio.setVolume(2);assert.equal(audio.volume,1);audio.setVolume(-2);assert.equal(audio.volume,0);
 audio.tone(440); // No AudioContext is created by a passive render.
 assert.equal(audio.context,null);
});
test('incorrect answers never trigger reward audio or particles',()=>{
 const effects=[];const controller=new CelebrationController({effect:event=>effects.push(event)});
 controller.result({correct:false,coins_awarded:0},'wrong',null);
 assert.deepEqual(effects,[]);assert.equal(controller.particles.size,0);
});
test('reward sound follows backend coins and replay receipts are suppressed',()=>{
 globalThis.matchMedia=()=>({matches:true});
 const effects=[];const controller=new CelebrationController({effect:event=>effects.push(event)});
 controller.result({correct:true,coins_awarded:0},'a',null);
 controller.result({correct:true,coins_awarded:1},'b',null);
 controller.result({correct:true,coins_awarded:1},'b',null);
 assert.deepEqual(effects,['correct','coin']);
 assert.equal(controller.particles.size,0); // Reduced motion.
 delete globalThis.matchMedia;
});

test('selected Kai runs a thinking reaction before backend grading and resolves to happy or motivating afterward',()=>{
 const kai=CharacterRegistry.Kai;
 assert.equal(kai.reactions.idle.state,'idle');
 assert.equal(kai.reactions.thinking.state,'thinking');
 assert.equal(kai.reactions.happy.state,'happy');
 assert.equal(kai.reactions.motivating.state,'idle');
 assert.equal(kai.reactions.idle.asset,'/assets/characters/studio-kai.png');
 assert.equal(kai.reactions.thinking.asset,'/assets/characters/studio-kai.png');
 assert.equal(kai.reactions.happy.asset,'/assets/characters/studio-kai.png');
 assert.equal(kai.reactions.motivating.asset,'/assets/characters/studio-kai.png');
 assert.equal(resolveCharacterReaction('kai','thinking').state,'thinking');
 assert.equal(resolveCharacterReaction('kai','thinking').asset,'/assets/characters/studio-kai.png');
 assert.equal(resolveCharacterReaction('kai','happy').state,'happy');
 assert.equal(resolveCharacterReaction('kai','happy').asset,'/assets/characters/studio-kai.png');
 assert.equal(resolveCharacterReaction('kai','motivating').state,'idle');
 assert.equal(resolveCharacterReaction('kai','motivating').asset,'/assets/characters/studio-kai.png');
 assert.equal(characterArtwork(getCharacter('kai'),'outfit_01','thinking','face').includes('viewBox="1217 612 65 70"'),true);
 assert.notEqual(characterArtwork(getCharacter('kai'),'outfit_01','idle','face'),characterArtwork(getCharacter('kai'),'outfit_01','thinking','face'));
 assert.match(characterArtwork(getCharacter('kai'),'outfit_01','idle'),/src="\/assets\/characters\/animated\/kai\/blink\/01.png"/);
 assert.doesNotMatch(characterArtwork(getCharacter('kai'),'outfit_01','idle'),/studio-kai|<circle|<svg/);
 assert.match(characterArtwork(getCharacter('kai'),'outfit_02','idle'),/studio-kai/);
 const correct=buildResultPresentation({correct:true,message:'Great work!',score:90,tests_passed:3,tests_total:3});
 assert.equal(correct.heading,'Correct!');
 assert.equal(correct.message,'Great work!');
 assert.doesNotMatch(correct.message,/Kai ·/i);
 const incorrect=buildResultPresentation({correct:false,message:'Try again! Check how you are handling the input.',score:45});
 assert.equal(incorrect.heading,'Try again!');
 assert.ok(incorrect.message.includes('Try again'));
 assert.ok(!incorrect.message.includes('happy'));
});

test('character reactions remain character-specific and do not determine correctness',()=>{
 assert.equal(resolveCharacterReaction('nova','happy').state,'happy');
 assert.equal(resolveCharacterReaction('mira','happy').state,'happy');
 assert.equal(resolveCharacterReaction('zed','motivating').state,'idle');
 assert.equal(resolveCharacterReaction('byte','thinking').state,'thinking');
 assert.equal(buildResultPresentation({correct:true,message:'Correct!'}).heading,'Correct!');
 assert.equal(buildResultPresentation({correct:false,message:'Incorrect'}).heading,'Try again!');
});

test('visible reward badge uses backend coins_awarded and missing wallet is harmless',()=>{
 const previousDocument=globalThis.document;
 const added=[];
 const fakeDocument={
  body:{append(){},querySelector(){return null;}},
  createElement(tag){
   const node={tagName:tag.toUpperCase(),textContent:'',className:'',style:{},setAttribute(){},append(){},remove(){},animate(){return {finished:Promise.resolve()};},getAnimations(){return []}};
   added.push(node);return node;
  },
  querySelector(){return null;},
 };
 globalThis.document=fakeDocument;
 try{
  const rewardResult={correct:true,coins_awarded:7,message:'Correct!',events:[{event_id:'reward-1',payload:{coins_awarded:7,balance_after:42}}]};
  const summary=buildResultPresentation(rewardResult);
  assert.equal(summary.rewardAmount,7);
  const host={children:[],replaceChildren(){this.children=[];},append(node){this.children.push(node);}};
  renderResult(host,rewardResult);
  assert.ok(host.children.some(node=>String(node.textContent).includes('+7 Coins')));
  assert.doesNotThrow(()=>rewardAnimation(rewardResult,'reward-1',{getBoundingClientRect:()=>({left:0,top:0,width:10,height:10})}));
 } finally { globalThis.document=previousDocument; }
});
import './hardening.test.mjs';
import './character-assets.test.mjs';

import './question-reveal.test.mjs';

import './coin-audio.test.mjs';
