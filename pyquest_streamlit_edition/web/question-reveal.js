// Display animation only: text never enters generation, grading or reward code.
export class QuestionReveal {
 constructor(parts,{later=(fn,ms)=>setTimeout(fn,ms),clear=id=>clearTimeout(id),reduced=false,onStart=()=>{},onDone=()=>{}}={}){
  this.parts=parts.map(node=>({node,letters:Array.from(node.textContent)}));
  this.later=later;this.clear=clear;this.onDone=onDone;this.active=false;this.index=0;this.offset=0;
  const count=this.parts.reduce((sum,part)=>sum+part.letters.length,0);
  this.delay=Math.max(3,Math.min(16,4500/Math.max(1,count)));
  if(reduced||!count)return;
  this.active=true;
  for(const part of this.parts){part.node.setAttribute('aria-label',part.letters.join(''));part.node.textContent='';}
  onStart();this.tick();
 }
 tick(){
  if(!this.active)return;
  while(this.index<this.parts.length&&this.offset>=this.parts[this.index].letters.length){this.index++;this.offset=0;}
  if(this.index>=this.parts.length){this.finish();return;}
  const part=this.parts[this.index];part.node.textContent+=part.letters[this.offset++];
  this.timer=this.later(()=>this.tick(),this.delay);
 }
 finish(){
  if(!this.active)return;
  this.active=false;this.clear(this.timer);
  for(const part of this.parts)part.node.textContent=part.letters.join('');
  this.onDone();
 }
 destroy(){this.active=false;this.clear(this.timer);}
}
