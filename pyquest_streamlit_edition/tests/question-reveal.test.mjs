import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestionReveal} from '../web/question-reveal.js';
const node=text=>({textContent:text,setAttribute(){}});
test('question text reveals sequentially, preserving Unicode and exact content',()=>{
 const parts=[node('Hi 👋'),node('print(13)')],queue=[];let started=0,done=0;
 const reveal=new QuestionReveal(parts,{later:fn=>(queue.push(fn),queue.length),clear(){},onStart:()=>started++,onDone:()=>done++});
 assert.equal(started,1);assert.equal(parts[0].textContent,'H');assert.equal(parts[1].textContent,'');
 while(queue.length)queue.shift()();
 assert.deepEqual(parts.map(n=>n.textContent),['Hi 👋','print(13)']);assert.equal(done,1);assert.equal(reveal.active,false);
});
test('editing can finish immediately; stale timer callbacks cannot fire completion twice',()=>{
 const part=node('Full question'),queue=[];let done=0;
 const reveal=new QuestionReveal([part],{later:fn=>(queue.push(fn),1),clear(){},onDone:()=>done++});
 reveal.finish();while(queue.length)queue.shift()();
 assert.equal(part.textContent,'Full question');assert.equal(done,1);
});
test('destroy cancels old views without changing a new question or dispatching completion',()=>{
 const part=node('Old question'),queue=[];let done=0,cleared=0;
 const reveal=new QuestionReveal([part],{later:fn=>(queue.push(fn),1),clear:()=>cleared++,onDone:()=>done++});
 reveal.destroy();part.textContent='New question';while(queue.length)queue.shift()();
 assert.equal(part.textContent,'New question');assert.equal(done,0);assert.equal(cleared,1);
});
test('reduced motion keeps full text and starts no reveal or timers',()=>{
 let calls=0;const part=node('Read immediately');
 new QuestionReveal([part],{reduced:true,later:()=>calls++,onStart:()=>calls++});
 assert.equal(part.textContent,'Read immediately');assert.equal(calls,0);
});
