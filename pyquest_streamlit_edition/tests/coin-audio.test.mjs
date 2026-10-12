import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioController} from '../web/audio.js';
test('coin sounds work after a click unlock with music off and music volume zero',async()=>{
 const oldContext=globalThis.AudioContext,oldDocument=globalThis.document;let starts=0,resumes=0,closes=0;
 globalThis.document={hidden:false};
 globalThis.AudioContext=class{
  currentTime=0;destination={};
  resume(){resumes++;return Promise.resolve();}close(){closes++;}
  createOscillator(){return {frequency:{value:0},connect(){},disconnect(){},start(){starts++;},stop(){}};}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 };
 try{
  const audio=new AudioController();audio.setVolume(0);
  assert.equal(audio.context,null);await audio.unlockEffects();audio.effect('coin');
  assert.equal(audio.enabled,false);assert.equal(audio.timer,null);assert.equal(starts,2);assert.equal(resumes,1);
  audio.destroy();assert.equal(closes,1);
 }finally{globalThis.AudioContext=oldContext;globalThis.document=oldDocument;}
});
test('muted effects never initialize audio or generate notes',()=>{
 const audio=new AudioController();audio.setEffectsEnabled(false);
 assert.equal(audio.unlockEffects(),undefined);audio.effect('coin');assert.equal(audio.context,null);
});
