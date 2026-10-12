import test from 'node:test';
import assert from 'node:assert/strict';
import {DraftSaver} from '../web/draft-saver.js';
test('blur and navigation share one draft request, and later edits preserve write order',async()=>{
 const sent=[];let finish;
 const saver=new DraftSaver(payload=>{sent.push(payload.code);return new Promise(resolve=>{finish=resolve;});});
 const first=saver.save({code:'old'});assert.equal(saver.save({code:'old'}),first);
 const last=saver.save({code:'latest'});await Promise.resolve();await Promise.resolve();
 assert.deepEqual(sent,['old']);finish();await first;await Promise.resolve();
 assert.deepEqual(sent,['old','latest']);finish();await last;assert.equal(saver.pending.size,0);
});
test('a failed draft can be retried without duplicating grading or navigation actions',async()=>{
 let calls=0;const saver=new DraftSaver(async()=>{if(++calls===1)throw Error('offline');return {saved:true};});
 await assert.rejects(saver.save({code:'kept'}),/offline/);
 assert.deepEqual(await saver.save({code:'kept'}),{saved:true});assert.equal(calls,2);
});
