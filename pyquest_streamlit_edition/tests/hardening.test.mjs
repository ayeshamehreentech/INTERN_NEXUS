import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson,handleEditorKey} from '../web/request.js';

test('network and non-JSON failures offer safe retry messages',async()=>{
 await assert.rejects(requestJson('check',{},async()=>{throw Error('private debug details')}),/Connection unavailable/);
 await assert.rejects(requestJson('check',{},async()=>({json:async()=>{throw Error('Python traceback')}})),/unreadable response/);
});
test('API failure preserves recoverable code and successful authoritative values',async()=>{
 await assert.rejects(requestJson('next',{},async()=>({ok:false,json:async()=>({error:'Please retry.',code:'QUESTION_GENERATION_UNAVAILABLE'})})),e=>e.code==='QUESTION_GENERATION_UNAVAILABLE');
 const value={xp_awarded:75,new_mastery:.075};assert.equal(await requestJson('check',{},async()=>({ok:true,json:async()=>value})),value);
});
test('Tab and Shift Tab escape the editor; explicit shortcuts still work',()=>{
 let prevented=0,indented=0,ran=0;
 const editor={selectionStart:0,selectionEnd:0,setRangeText(){indented++}};
 for(const shiftKey of [false,true])handleEditorKey({key:'Tab',shiftKey,preventDefault(){prevented++}},editor,()=>ran++);
 assert.equal(prevented,0);assert.equal(indented,0);
 for(const key of [']','Enter'])handleEditorKey({key,ctrlKey:true,preventDefault(){prevented++}},editor,()=>ran++);
 assert.equal(prevented,2);assert.equal(indented,1);assert.equal(ran,1);
});
