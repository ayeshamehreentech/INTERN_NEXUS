import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {conceptMarkup} from '../web/concepts.js';
test('concept renderer escapes content and offers saved-session continuation',()=>{
 const lesson={world_id:'W01',title:'<script>unsafe</script>',learning_objective:'Learn',simple_explanation:'Definition',why_it_matters:'Use',worked_examples:[{code:'print("x")',output:'x'}],common_mistakes:['Mistake'],remember:['Remember'],practice_prompt:'Try'};
 const html=conceptMarkup({lesson,completed:true,session_id:'saved'});
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
 assert.ok(html.includes('Continue Challenge'));assert.ok(html.includes('Expected output'));
});
test('concept routes save drafts and reuse the existing generation flow',()=>{
 const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
 assert.match(source,/await saveDraft\(\);location.hash='concept\/'/);
 assert.match(source,/api\('concept-start'/);assert.match(source,/page==='learn'\|\|page==='concept'/);
 const css=readFileSync(new URL('../web/concepts.css',import.meta.url),'utf8');
 assert.match(css,/max-width:700px/);assert.match(css,/:focus-visible/);
});
