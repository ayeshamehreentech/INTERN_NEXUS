import test from 'node:test';
import assert from 'node:assert/strict';
import {difficultySupport} from '../web/difficulty-support.js';
test('repeated difficulty uses actual attempt history, stops at success and is topic scoped',()=>{
 assert.equal(difficultySupport([{topic:'x',correct:false}],'x'),null);
 const failed=[{topic:'x',correct:false},{topic:'other',correct:false},{topic:'x',correct:false}];
 assert.match(difficultySupport(failed,'x'),/2 recent tries/);
 assert.equal(difficultySupport([{topic:'x',correct:true},...failed],'x'),null);
 assert.equal(difficultySupport(failed,'unused'),null);
});
