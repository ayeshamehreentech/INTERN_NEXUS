import {selectedCompanion,characterArtwork} from './characters.js';

export class ProgressionEvents {
 constructor(storage=globalThis.sessionStorage){
  this.storage=storage; this.seen=new Set();
  try{this.seen=new Set(JSON.parse(storage?.getItem('pyquest:progression')||'[]'))}catch{}
 }
 consume(key){
  if(!key||this.seen.has(key))return false;
  this.seen.add(key);
  try{this.storage?.setItem('pyquest:progression',JSON.stringify([...this.seen]))}catch{}
  return true;
 }
 accept(value,receipt){
  const correct=value.correct===true;
  const completion=correct&&value.world_completion?.completed===true&&!!value.world_completion.completion_id;
  return {
   xp:correct&&value.xp_awarded>0&&this.consume('xp:'+receipt),
   completion:!!completion,
   celebrate:!!completion&&this.consume('complete:'+value.world_completion.completion_id),
   topic:correct&&value.topic_mastered===true,
  };
 }
}

export function presentProgression(host,value,events,{settings={},companion,audio,reducedMotion=false}={}){
 const add=(tag,text,parent=host)=>{const node=document.createElement(tag);node.textContent=text;parent.append(node);return node};
 if(value.correct&&value.xp_awarded>0){
  const badge=add('p',`✦ +${value.xp_awarded} XP`);badge.className='xp-gain';
  if(events.xp&&!reducedMotion)badge.className+=' progression-pop';
 }
 if(value.xp_total!==undefined)add('p',`Total XP: ${value.xp_total}`);
 if(events.topic)add('h3','✓ Topic Mastered');
 else if(value.topic_status)add('p',`Topic status: ${value.topic_status}`);
 if(!events.completion)return;
 const c=value.world_completion;
 const card=add('section','');card.className='level-complete';card.setAttribute('aria-label','Level Complete');
 add('h2','Level Complete!',card);add('h3',c.world_name,card);
 const {character,outfit}=selectedCompanion(settings);
 const portrait=add('div','',card);portrait.className='completion-portrait';
 portrait.innerHTML=characterArtwork(character,outfit.id,'happy');
 add('p',`${character.name}: Great work! Keep learning together.`,card);
 add('p',`Final score: ${c.final_score} · World XP earned: ${c.xp_gained} · World coins earned: ${c.coins_gained}`,card);
 add('p',`Topics completed: ${c.topics_mastered} / ${c.topics_total}`,card);
 for(const [topic,mastery] of Object.entries(c.mastery||{}))add('p',`${topic}: ${Math.round(mastery*100)}% mastery`,card);
 if(c.next_world_id&&c.next_world_id!=='W14'){const next=add('a','Next Level →',card);next.href='#world/'+encodeURIComponent(c.next_world_id)}
 const back=add('a','Back to Map',card);back.href='#home';
 if(events.celebrate){
  if(!reducedMotion){portrait.className+=' progression-pop';companion?.play('happy')}
  else companion?.animator?.play('happy',{static:true});
  companion?.say('Level complete! Wonderful work.');
  if(settings.sound_effects_enabled!==false)audio?.effect('mastered');
 }
}
