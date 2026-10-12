import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {inspectPng,inspectSequence,auditManifest} from '../tools/validate-character-assets.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const frame=readFileSync(new URL('../assets/characters/animated/kai/blink/01.png',import.meta.url));
test('sequence audit detects canvas, scale, center and foot-baseline drift',()=>{
 const a={width:640,height:768,centerX:320,baseline:720,visibleHeight:640};
 assert.deepEqual(inspectSequence([a,{...a,centerX:321,baseline:721}]).errors,[]);
 assert.deepEqual(inspectSequence([a,{...a,width:650,centerX:350,baseline:740,visibleHeight:660}]).errors,
  ['Inconsistent frame dimensions','Excessive center alignment drift','Excessive baseline drift','Excessive visible-height drift']);
 assert.deepEqual(inspectSequence([a]).errors,['Insufficient animation frames']);
});
test('asset inspector reports real alpha, geometry and canvas mismatches',()=>{
 const info=inspectPng(frame);
 assert.equal(info.rgba,true);
 assert.deepEqual(info.corners,[0,0,0,0]);
 assert.ok(info.visibleRatio>0&&info.visibleRatio<1);
 assert.ok(info.visibleHeight>0);
 assert.ok(info.baseline<info.height);
 assert.ok(inspectPng(frame,{width:1}).errors.includes('Unexpected canvas dimensions'));
 assert.ok(inspectPng(frame,{padding:10000}).errors.includes('Unsafe edge padding'));
 assert.throws(()=>inspectPng(Buffer.from('not png')),/Not PNG/);
});
test('manifest asset audit inspects every ready frame without changing assets',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/characters/animated/manifest.json',import.meta.url),'utf8'));
 const rows=auditManifest(root,manifest);
 const count=Object.values(manifest.characters).flatMap(c=>Object.values(c.states)).filter(s=>s.status==='READY').reduce((n,s)=>n+s.frames.length,0);
 assert.equal(rows.length,count);
 assert.ok(rows.length>=16);
 assert.ok(rows.every(r=>r.rgba));
});
test('asset audit rejects traversal, cross-character frames and empty ready sequences',()=>{
 const manifest=frames=>({characters:{kai:{states:{talking:{status:'READY',frames}}}}});
 assert.throws(()=>auditManifest(root,manifest([])),/insufficient/);
 for(const path of ['/assets/characters/animated/nova/talking/01.png','/assets/characters/animated/kai/talking/../../secret.png']) {
  assert.throws(()=>auditManifest(root,manifest([path,path])),/Invalid manifest path/);
 }
});
