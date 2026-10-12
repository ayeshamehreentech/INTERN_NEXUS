import test from 'node:test';
import assert from 'node:assert/strict';
import {SuccessEvents,SuccessCelebration,successRewards,successCharacter} from '../web/success-celebration.js';
import {readFileSync} from 'node:fs';
test('success events require authoritative correctness and deduplicate question identity across reruns',()=>{
 const entries=new Map(),storage={getItem:key=>entries.get(key),setItem:(key,value)=>entries.set(key,value)};
 const events=new SuccessEvents(storage);
 assert.equal(events.claim({status:'ok'},'session','q1'),null);
 assert.equal(events.claim({correct:false},'session','q1'),null);
 assert.equal(events.claim({correct:'true'},'session','q1'),null);
 assert.equal(events.claim({correct:true},'session','q1'),'session:q1');
 assert.equal(events.claim({correct:true},'session','q1'),null);
 assert.equal(new SuccessEvents(storage).claim({correct:true},'session','q1'),null);
 assert.equal(events.claim({correct:true},'session','q2'),'session:q2');
});
test('reward amounts are backend values, including zero; missing rewards are omitted',()=>{
 assert.deepEqual(successRewards({xp_awarded:100,coins_awarded:2}),{xp:100,coins:2});
 assert.deepEqual(successRewards({xp_awarded:0,coins_awarded:0}),{xp:0,coins:0});
 assert.deepEqual(successRewards({}),{xp:null,coins:null});
 assert.equal(successCharacter({selected_character:'kai'}),'kai');
 assert.equal(successCharacter({companion:'byte'}),'byte');
 assert.equal(successCharacter({companion:'nova'}),'byte');
});
test('run or incorrect feedback cannot open a modal or call presentation persistence',async()=>{
 let calls=0;const modal=new SuccessCelebration({events:new SuccessEvents(null),persist:()=>{calls++;}});
 assert.equal(await modal.show({status:'ok'},{sid:'s',qid:'q'}),false);
 assert.equal(await modal.show({correct:false},{sid:'s',qid:'q'}),false);
 assert.equal(calls,0);
});
test('modal styling respects reduced motion, limits confetti and uses native modal focus behavior',()=>{
 const css=readFileSync(new URL('../assets/success-celebration.css',import.meta.url),'utf8');
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/100dvh/);assert.match(css,/backdrop-filter:blur\(8px\)/);
 const js=readFileSync(new URL('../web/success-celebration.js',import.meta.url),'utf8');
 assert.match(js,/showModal\(\)/);assert.match(js,/acknowledged\)return/);assert.match(js,/i<18/);
 assert.doesNotMatch(js,/api\(['"]check|requestJson\(['"]check/);
});
