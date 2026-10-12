import {CharacterController} from './characters.js';

export class BlinkScheduler {
 constructor(visual,{later=(fn,ms)=>setTimeout(fn,ms),clear=id=>clearTimeout(id),random=Math.random,paused=()=>document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('reduce-motion')}={}){
  this.visual=visual;this.later=later;this.clear=clear;this.random=random;this.paused=paused;this.destroyed=false;this.arm();
 }
 arm(){
  if(this.destroyed)return;
  this.timer=this.later(()=>{
   if(!this.paused()&&this.visual.getState()==='idle')this.visual.play('blink');
   this.arm();
  },1200+Math.floor(Math.max(0,Math.min(1,this.random()))*1000));
 }
 destroy(){this.destroyed=true;this.clear(this.timer);}
}

export function companionOutcome(action,result){
 if(action==='check'&&result?.correct===true)return {state:'happy',message:result.message||'Correct! Explain why your solution works.'};
 if(action==='check'&&result?.correct===false)return {state:'motivating',message:result.message||'Compare your output with the example and try one small change.'};
 if(action==='run'&&result?.status==='ok')return {state:'happy',message:'Your code ran successfully. Check Answer will verify the challenge requirements.'};
 if(action==='run'&&result?.status==='learner_error')return {state:'motivating',message:result.message||'Read the error, check the indicated line, and try again.'};
 if(result?.status&&result.status!=='ok')return {state:'motivating',message:result.message||'Execution is unavailable. Your code remains saved.'};
 return {state:'idle',message:'Ready when you are.'};
}

export class CompanionController extends CharacterController {
 constructor(host,character='byte',outfit='outfit_01',options={}){
  super(host,character,outfit);this.pending=new Map();this.dead=false;this.blinks=new BlinkScheduler(this,options);
 }
 beginRequest(action){
  if(this.dead)return null;
  const token=Symbol(action);this.pending.set(token,action);
  const message={check:'Checking your code against the challenge tests…',run:'Running your Python code…',next:'Waiting for the challenge generator…',start:'Waiting for the challenge generator…',hint:'Preparing a hint…',query:'Waiting for the AI response…'}[action];
  if(message)this.setReaction('thinking',message);
  return token;
 }
 finishRequest(token,result,error=null){
  if(this.dead||!this.pending.has(token))return;
  const action=this.pending.get(token);this.pending.delete(token);
  if(this.pending.size)return;
  const outcome=error?{state:'motivating',message:'The request could not finish. Your code is saved; try again when the service is available.'}:companionOutcome(action,result);
  if(outcome.state==='idle'){this.play('idle',{force:true});this.say(outcome.message);}
  else this.setReaction(outcome.state,outcome.message);
 }
 destroy(){if(this.dead)return;this.dead=true;this.blinks?.destroy();this.pending?.clear();super.destroy();}
}
