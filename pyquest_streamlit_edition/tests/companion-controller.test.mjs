import test from 'node:test';
import assert from 'node:assert/strict';
import {BlinkScheduler,companionOutcome} from '../web/companion-controller.js';
test('blinks wait 1.2–2.2 seconds and never interrupt higher priority states',()=>{
 let callback,delay,state='idle',played=[],cleared=false;
 const scheduler=new BlinkScheduler({getState:()=>state,play:state=>played.push(state)}, {random:()=>.5,paused:()=>false,later:(fn,ms)=>{callback=fn;delay=ms;return 1},clear:()=>{cleared=true}});
 assert.equal(delay,1700);callback();assert.deepEqual(played,['blink']);
 for(state of ['thinking','happy','motivating','blink'])callback();
 assert.deepEqual(played,['blink']);scheduler.destroy();assert.equal(cleared,true);
});
test('reduced motion or hidden views do not blink',()=>{
 let callback,played=0;
 const scheduler=new BlinkScheduler({getState:()=> 'idle',play:()=>played++},{paused:()=>true,random:()=>0,later:(fn,ms)=>{callback=fn;assert.equal(ms,1200);return 1},clear:()=>{}});
 callback();assert.equal(played,0);scheduler.destroy();
});
test('execution happiness does not imply correctness or an earned reward',()=>{
 const run=companionOutcome('run',{status:'ok'});assert.equal(run.state,'happy');assert.match(run.message,/Check Answer will verify/);
 assert.equal(companionOutcome('run',{status:'learner_error',message:'Syntax error'}).state,'motivating');
 assert.equal(companionOutcome('run',{status:'sandbox_unavailable'}).state,'motivating');
 assert.equal(companionOutcome('check',{correct:false}).state,'motivating');
 assert.equal(companionOutcome('check',{correct:true}).state,'happy');
 assert.equal(companionOutcome('check',{status:'ok'}).state,'idle');
});
