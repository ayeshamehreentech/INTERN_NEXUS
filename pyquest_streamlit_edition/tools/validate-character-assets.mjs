// Development-only PNG inspection. Pixel checks do not certify artistic quality.
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {resolve, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

export function inspectPng(bytes, {padding=1, width, height}={}) {
 if (!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw Error('Not PNG');
 let w,h,rgba=false; const chunks=[];
 for(let p=8;p<bytes.length;){
  const n=bytes.readUInt32BE(p), type=bytes.toString('ascii',p+4,p+8);
  if(p+12+n>bytes.length) throw Error('Truncated PNG');
  const data=bytes.subarray(p+8,p+8+n);
  if(type==='IHDR') {w=data.readUInt32BE(0);h=data.readUInt32BE(4);rgba=data[8]===8&&data[9]===6&&data[10]===0&&data[11]===0&&data[12]===0;}
  if(type==='IDAT') chunks.push(data);
  p+=12+n;
 }
 if(!rgba||!w||!h||w*h>16000000) throw Error('Expected bounded, non-interlaced 8-bit RGBA PNG');
 const stride=w*4, raw=inflateSync(Buffer.concat(chunks),{maxOutputLength:(stride+1)*h});
 if(raw.length!==(stride+1)*h) throw Error('Invalid scanline length');
 const pixels=Buffer.alloc(stride*h);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<h;y++) {
  const filter=raw[y*(stride+1)]; if(filter>4) throw Error('Invalid PNG filter');
  for(let x=0;x<stride;x++) {
   const i=y*stride+x,a=x>=4?pixels[i-4]:0,b=y?pixels[i-stride]:0,c=y&&x>=4?pixels[i-stride-4]:0;
   pixels[i]=(raw[y*(stride+1)+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;
  }
 }
 let left=w,right=-1,top=h,bottom=-1,visible=0,partial=0;
 for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
  const a=pixels[(y*w+x)*4+3];
  if(a) {visible++;if(a<255) partial++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 }
 const errors=[];
 if(width!==undefined&&w!==width||height!==undefined&&h!==height) errors.push('Unexpected canvas dimensions');
 if(!visible) errors.push('Empty image');
 const corners=[0,w-1,(h-1)*w,h*w-1].map(i=>pixels[i*4+3]);
 if(corners.some(a=>a!==0)) errors.push('Nontransparent corner');
 if(left<padding||top<padding||w-1-right<padding||h-1-bottom<padding) errors.push('Unsafe edge padding');
 const ratio=visible/(w*h);
 if(ratio<0.01||ratio>0.9) errors.push('Implausible visible-pixel ratio');
 return {width:w,height:h,rgba,corners,bbox:{left,top,right,bottom},visibleWidth:right-left+1,visibleHeight:bottom-top+1,centerX:(left+right)/2,baseline:bottom,padding:{left,top,right:w-1-right,bottom:h-1-bottom},visibleRatio:ratio,partialAlphaPixels:partial,errors};
}

// Conservative screen-space checks; intentional large gestures need visual review.
// Include every nonzero-alpha pixel so stray haze is not silently discarded.
export function inspectSequence(frames,{maxCenterDrift=12,maxBaselineDrift=6,maxHeightDrift=12}={}) {
 const errors=[];
 if(frames.length<2)return {errors:['Insufficient animation frames']};
 const first=frames[0];
 if(frames.some(f=>f.width!==first.width||f.height!==first.height))errors.push('Inconsistent frame dimensions');
 const range=key=>Math.max(...frames.map(f=>f[key]))-Math.min(...frames.map(f=>f[key]));
 const centerDrift=range('centerX'),baselineDrift=range('baseline'),heightDrift=range('visibleHeight');
 if(centerDrift>maxCenterDrift)errors.push('Excessive center alignment drift');
 if(baselineDrift>maxBaselineDrift)errors.push('Excessive baseline drift');
 if(heightDrift>maxHeightDrift)errors.push('Excessive visible-height drift');
 return {centerDrift,baselineDrift,heightDrift,errors};
}

export function auditManifest(root,manifest) {
 const rows=[];
 for(const [character,entry] of Object.entries(manifest.characters)) for(const [state,config] of Object.entries(entry.states)) {
  if(config.status!=='READY') continue;
  if(!Array.isArray(config.frames)||config.frames.length<(state==='idle'?1:2)) throw Error(`${character}/${state}: insufficient animation frames`);
  let dimensions;
  for(const url of config.frames) {
   if(!new RegExp(`^/assets/characters/animated/${character}/${state}/[0-9]+\\.png$`).test(url)) throw Error(`Invalid manifest path: ${url}`);
   const path=resolve(root,'.'+url), rel=relative(root,path);
   if(rel.startsWith('..'+sep)||rel==='..') throw Error('Path escapes project');
   const result=inspectPng(readFileSync(path),dimensions);
   dimensions={width:result.width,height:result.height};
   rows.push({character,state,path:url,...result});
  }
 }
 return rows;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
 const rows=process.argv.length>2?process.argv.slice(2).map(path=>({path,...inspectPng(readFileSync(path))})):auditManifest(root,JSON.parse(readFileSync(resolve(root,'assets/characters/animated/manifest.json'),'utf8')));
 console.log(JSON.stringify(rows,null,2));
 if(rows.some(row=>row.errors.length)) process.exitCode=1;
}
