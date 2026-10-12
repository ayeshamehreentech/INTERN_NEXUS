import {CharacterController} from './characters.js';

// Presentation identity is challenge identity, not a new check request ID.
export class SuccessEvents {
 constructor(storage=globalThis.sessionStorage){
  this.storage=storage;this.seen=new Set();
  try{this.seen=new Set(JSON.parse(storage?.getItem('pyquest:success-events')||'[]'));}catch{}
 }
 claim(value,sid,qid){
  if(value?.correct!==true||!sid||!qid)return null;
  const key=`${sid}:${qid}`;
  if(this.seen.has(key))return null;
  this.seen.add(key);
  try{this.storage?.setItem('pyquest:success-events',JSON.stringify([...this.seen]));}catch{}
  return key;
 }
}
export const successRewards=value=>({
 xp:Number.isFinite(value.xp_awarded)?value.xp_awarded:null,
 coins:Number.isFinite(value.coins_awarded)?value.coins_awarded:null,
});
export const successCharacter=settings=>['byte','kai'].includes(settings.selected_character||settings.companion)?(settings.selected_character||settings.companion):'byte';

export class SuccessCelebration {
 constructor({events=new SuccessEvents(),persist=async()=>({show:true})}={}){this.events=events;this.persist=persist;this.active=null;}
 destroy(){this.cleanupCurrent?.();this.cleanupCurrent=null;}
 async show(value,{sid,qid,settings={},onContinue=()=>{},isCurrent=()=>true}={}){
  const key=this.events.claim(value,sid,qid);if(!key||this.active)return false;
  const wasInert=document.body.inert;document.body.inert=true;
  let claim;try{claim=await this.persist('celebration-claim',{event_id:key});}finally{document.body.inert=wasInert;}
  if(claim.show===false||!isCurrent())return false;
  const previous=document.body.getRootNode().activeElement||document.activeElement;
  const dialog=document.createElement('dialog');dialog.className='success-celebration';
  const reduced=!!settings.reduced_motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)dialog.classList.add('celebration-reduced');
  dialog.setAttribute('aria-labelledby','success-title');dialog.setAttribute('aria-describedby','success-message');
  dialog.innerHTML='<div class="success-confetti" aria-hidden="true"></div><p class="success-label">CHALLENGE COMPLETED</p><div class="success-character" aria-hidden="true"></div><h2 id="success-title">HOORAY! 🎉</h2><p id="success-message">You wrote the correct Python code!</p><p class="success-support">Amazing work! You’ve successfully completed this challenge.</p><div class="success-rewards"></div><button class="success-continue">Continue Adventure →</button><button class="success-stay">Stay on This Question</button>';
  const rewardHost=dialog.querySelector('.success-rewards'),reward=successRewards(value);
  for(const [label,amount] of [['XP',reward.xp],['Coins',reward.coins]])if(amount!==null){const badge=document.createElement('span');badge.textContent=`${label==='XP'?'✦':'🪙'} +${amount} ${label}`;rewardHost.append(badge);}
  if(reward.xp===0&&reward.coins===0){const note=document.createElement('p');note.className='success-repeat-note';note.textContent='No additional rewards were awarded for this submission.';rewardHost.after(note);}
  if(!reduced)for(let i=0;i<18;i++){const piece=document.createElement('i');piece.style.setProperty('--particle',i);dialog.querySelector('.success-confetti').append(piece);}
  document.body.append(dialog);this.active=dialog;
  const character=successCharacter(settings),controller=new CharacterController(dialog.querySelector('.success-character'),character,'outfit_01');
  controller.say('');controller.play('happy',{static:reduced});
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  let acknowledged=false;
  this.cleanupCurrent=()=>{acknowledged=true;controller.destroy();dialog.close();dialog.remove();this.active=null;document.body.style.overflow=oldOverflow;};
  const close=async(advance=false)=>{
   if(acknowledged)return;acknowledged=true;
   dialog.querySelectorAll('button').forEach(b=>b.disabled=true);
   // Serialize component triggers: acknowledgement finishes before Next saves a draft.
   try{await this.persist('celebration-ack',{event_id:key});}catch{}
   if(!dialog.isConnected)return;
   controller.destroy();dialog.close();dialog.remove();this.active=null;document.body.style.overflow=oldOverflow;
   if(previous?.isConnected)previous.focus();
   if(advance)onContinue();
  };
  dialog.querySelector('.success-continue').onclick=()=>close(true);
  dialog.querySelector('.success-stay').onclick=()=>close(false);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close(false);});
  dialog.addEventListener('keydown',event=>{
   if(event.key!=='Tab')return;
   const buttons=[...dialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
   const focused=dialog.getRootNode().activeElement||document.activeElement;
   if(event.shiftKey&&focused===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&focused===last){event.preventDefault();first.focus();}
  });
  dialog.showModal();dialog.querySelector('.success-continue').focus();
  if(!reduced&&reward.coins>0){
   const box=dialog.getBoundingClientRect(),source=dialog.querySelector('.success-character').getBoundingClientRect(),target=rewardHost.getBoundingClientRect();
   for(let i=0;i<5;i++){
    const coin=document.createElement('span');coin.className='flying-coin success-flying-coin';coin.textContent='🪙';coin.setAttribute('aria-hidden','true');
    Object.assign(coin.style,{position:'absolute',left:(source.left-box.left+source.width/2)+'px',top:(source.top-box.top+source.height/2)+'px',zIndex:'200',fontSize:'28px',pointerEvents:'none'});dialog.append(coin);
    const dx=target.left+target.width/2-source.left-source.width/2+(i-2)*12,dy=target.top-source.top-source.height/2;
    const animation=coin.animate([{transform:'translate(0,0) scale(.6)',opacity:0},{transform:`translate(${(i-2)*25}px,-35px) scale(1.1)`,opacity:1,offset:.3},{transform:`translate(${dx}px,${dy}px) scale(.5) rotate(360deg)`,opacity:0}],{duration:950,delay:i*70,easing:'ease-in-out'});
    animation.finished.then(()=>coin.remove(),()=>coin.remove());
   }
  }
  return true;
 }
}
