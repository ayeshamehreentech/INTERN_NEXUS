// Original synthesized tones: no remote audio, autoplay, or learning authority.
export class AudioController{
 constructor(){this.context=null;this.enabled=false;this.effectsEnabled=true;this.volume=.15;this.effectVolume=.2;this.mode='map';this.timer=null;this.step=0}
 async enable(){
  this.context??=new AudioContext();await this.context.resume();this.enabled=true;
  if(!this.timer){this.beat();this.timer=setInterval(()=>this.beat(),900)}
 }
 disable(){this.enabled=false;clearInterval(this.timer);this.timer=null;}
 unlockEffects(){if(!this.effectsEnabled)return;this.context??=new AudioContext();return this.context.resume()}
 destroy(){this.disable();this.context?.close();this.context=null;}
 setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)||0))}
 setEffectsEnabled(value){this.effectsEnabled=Boolean(value)}
 setEffectVolume(value){this.effectVolume=Math.max(0,Math.min(1,Number(value)||0))}
 setMode(mode){this.mode=mode}
 tone(frequency,duration=.3,offset=0,gain=.08,effect=false){
  if((!effect&&!this.enabled)||!this.context||document.hidden)return;
  const oscillator=this.context.createOscillator(),envelope=this.context.createGain();
  const now=this.context.currentTime+offset;
  oscillator.type='sine';oscillator.frequency.value=frequency;
  envelope.gain.setValueAtTime(0,now);envelope.gain.linearRampToValueAtTime(gain*(effect?1:this.volume),now+.03);
  envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
  oscillator.connect(envelope);envelope.connect(this.context.destination);
  oscillator.start(now);oscillator.stop(now+duration+.02);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect()};
 }
 beat(){const notes=this.mode==='practice'?[220,261.63,329.63,261.63]:[261.63,329.63,392,329.63,293.66,349.23,440,349.23];this.tone(notes[this.step++%notes.length],.75,0,.04)}
 effect(event){
    if(!this.effectsEnabled)return;
  const notes={correct:[523.25,659.25,783.99],coin:[987.77,1318.51],mastered:[523.25,659.25,783.99,1046.5]}[event]||[];
    notes.forEach((note,index)=>this.tone(note,.22,index*.1,.12*this.effectVolume/.2,true));
 }
}

export class CelebrationController{
 constructor(audio){this.audio=audio;this.particles=new Set();const storage=typeof sessionStorage==='undefined'?null:sessionStorage;this.receiptStorage=storage;this.receipts=new Set(JSON.parse(storage?.getItem('pyquest:celebration-receipts')||'[]'))}
 result(value,receipt,origin){
  const committedReward=Boolean(value && value.correct && Number(value.coins_awarded || 0) > 0);
  if(!committedReward || this.receipts.has(receipt))return;
  this.receipts.add(receipt);this.audio.effect(value.topic_mastered?'mastered':'correct');
  this.receiptStorage?.setItem('pyquest:celebration-receipts',JSON.stringify([...this.receipts]));
  this.audio.effect('coin');
  if(!origin || typeof origin.getBoundingClientRect!=='function')return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion'))return;
  const box=origin.getBoundingClientRect();
  for(let i=0;i<8;i++){
   const particle=document.createElement('span');particle.className='celebration-particle';particle.textContent='✦';particle.setAttribute('aria-hidden','true');
   particle.style.left=box.left+box.width/2+'px';particle.style.top=box.top+'px';document.body.append(particle);this.particles.add(particle);
   const angle=i*Math.PI/4;
   const animation=particle.animate([{transform:'translate(0,0) scale(.5)',opacity:1},{transform:`translate(${Math.cos(angle)*100}px,${Math.sin(angle)*65-35}px) scale(0)`,opacity:0}],{duration:850});
   const cleanup=()=>{particle.remove();this.particles.delete(particle)};
   animation.finished.then(cleanup,cleanup);
  }
 }
 stop(){for(const particle of this.particles){particle.getAnimations().forEach(a=>a.cancel());particle.remove()}this.particles.clear()}
}
