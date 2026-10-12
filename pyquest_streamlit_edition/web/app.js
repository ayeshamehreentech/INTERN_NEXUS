import {sheetCards} from './cheatsheet-data.js';
import {mountResources} from './resources.js';
import {CharacterController,mountStudio,rewardAnimation,selectedCompanion} from './characters.js';
import {AudioController,CelebrationController} from './audio.js';
import {renderPractice,renderResult} from './terminal.js';
import {ProgressionEvents,presentProgression} from './progression.js';
import {requestJson,handleEditorKey} from './request.js';
import {mountConcept} from './concepts.js';
import {SuccessCelebration} from './success-celebration.js';
import {CompanionController} from './companion-controller.js';
import {difficultySupport} from './difficulty-support.js';
import {DraftSaver} from './draft-saver.js';
import {QuestionReveal} from './question-reveal.js';
const successCelebration=new SuccessCelebration({persist:requestJson});
const progression=new ProgressionEvents();
const audio=new AudioController(),celebrations=new CelebrationController(audio);
const app=document.querySelector('#app');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let worlds=[],stats={},session=null,epoch=0,companion=null,questionReveal=null;
const revealedQuestions=new Set();
const api=requestJson;
const drafts=new DraftSaver(payload=>api('draft',payload));
let nativeNavigationPending=false,nativePassThrough=false;
async function nativeNavigation(event){
 const link=event.composedPath?.().find(node=>node.tagName==='A')||event.target.closest?.('a');
 if(nativePassThrough||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!link||link.origin!==location.origin||!['/tips','/visual-studio'].includes(link.pathname.replace(/\/$/,'')))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(nativeNavigationPending)return;
 nativeNavigationPending=true;const href=link.href;
 try{
  if(document.querySelector('#code')){notice('Saving your draft before opening the page…');await saveDraft();}
  const current=[...globalThis.document.querySelectorAll('a')].find(node=>node.href===href);
  if(!current)throw Error('Your draft is saved. Select the page link again.');
  nativePassThrough=true;current.click();
 }catch(error){notice(error.message);}finally{nativePassThrough=false;nativeNavigationPending=false;}
}
globalThis.document.addEventListener('click',nativeNavigation,true);
document.body._pyquest.dispose=()=>{epoch++;questionReveal?.destroy();questionReveal=null;globalThis.document.removeEventListener('click',nativeNavigation,true);companion?.destroy();companion=null;successCelebration.destroy();celebrations.stop();audio.destroy();};
function notice(text){document.querySelector('#notice').textContent=text}
async function update(){
 stats=await api('progress');
 const wallet=document.querySelector('#wallet');
 if(wallet){wallet.textContent='🪙 '+stats.coins;}
 const background=stats.settings.background;
 document.body.style.backgroundImage='';
 document.documentElement.classList.toggle('reduce-motion',!!stats.settings.reduced_motion);
 audio.setEffectsEnabled(stats.settings.sound_effects_enabled??true);
 audio.setEffectVolume(stats.settings.sound_effect_volume??.2);
}
const top=['Home','Resources','Cheat Sheet'];
document.querySelector('#top').innerHTML=top.map(x=>'<a href="#'+x.toLowerCase().replaceAll(' ','')+'">'+x+'</a>').join('');
document.querySelector('#top').insertAdjacentHTML('beforeend','<a href="#characters">Character Studio</a><a href="/visual-studio">Diagrams</a>');
const worldCard=w=>'<article class="card world-card"><img src="'+w.image+'" alt="'+escape(w.name)+' artwork"><button class="marker" data-go="world/'+w.id+'" aria-label="Open '+escape(w.name)+'">'+w.number+'</button><h2>'+escape(w.name)+'</h2><a href="#world/'+w.id+'">Explore topics →</a></article>';
async function route(){
 questionReveal?.destroy();questionReveal=null;
 celebrations.stop();
 companion?.destroy();companion=null;
 const ticket=++epoch;notice('');const [page='home',id,reviewSid]=(location.hash.slice(1)||'home').split('/');
 document.body.classList.toggle('studio-page',page==='characters');
 document.body.classList.toggle('practice-page',['practice','learn'].includes(page));
 audio.setMode(['practice','learn'].includes(page)?'practice':'map');
 document.querySelectorAll('#top a').forEach(a=>a.classList.toggle('active',a.hash==='#'+(page==='map'?'home':page)));
 await update();if(ticket!==epoch)return;
 if(page==='home'||page==='map'){const p=id==='2'?1:0;app.innerHTML='<h1>Explore the worlds</h1><p>Every world is open. Choose your own learning path.</p><div class="grid">'+worlds.slice(p*7,p*7+7).map(worldCard).join('')+'</div><div class="pager"><button data-go="home/1" aria-label="Worlds 1 to 7">←</button><strong>Worlds '+(p?'8–13':'1–7')+'</strong><button data-go="home/2" aria-label="Worlds 8 to 13">→</button></div>'}
 else if(page==='world'){const w=worlds.find(w=>w.id===id);if(!w)throw Error('Unknown world');app.innerHTML='<a href="#map/'+(w.number>7?2:1)+'">← Back to worlds</a><h1>'+escape(w.name)+'</h1><div class="split"><img class="art" src="'+w.image+'" alt="'+escape(w.name)+'"><div class="grid">'+w.topics.map(t=>'<article class="panel"><button class="marker" data-topic="'+t.id+'">'+t.number+'</button><h2>'+escape(t.name)+'</h2><small>'+escape(t.content_status)+'</small><progress max="1" value="'+(stats.mastery[t.id]||0)+'"></progress></article>').join('')+'</div></div><div class="pager">'+(w.number>1?'<button data-go="world/'+worlds[w.number-2].id+'">← Previous World</button>':'')+(w.number<worlds.length?'<button data-go="world/'+worlds[w.number].id+'">Next World →</button>':'')+'</div>'}
 else if(page==='learn'||page==='concept'){await showConcept(id,ticket,reviewSid);return}
 else if(page==='practice'){session=await api('session/'+id);if(ticket!==epoch)return;practice()}
 else if(page==='progress')app.innerHTML='<h1>Your learning progress</h1><p>Real practice. Small steps. Steady growth.</p><div class="grid">'+[['Attempts',stats.attempts],['Correct answers',stats.correct],['Coins',stats.coins]].map(([k,v])=>'<article class="panel">'+k+'<div class="metric">'+v+'</div></article>').join('')+'</div><div class="split"><section class="panel"><h2>World progress</h2>'+worlds.map(w=>'<p><a href="#world/'+w.id+'">'+w.name+'</a> '+Math.round(stats.worlds[w.id]*100)+'%</p><progress max="1" value="'+stats.worlds[w.id]+'"></progress>').join('')+'</section><section class="panel"><h2>Recent activity</h2>'+(stats.recent.map(r=>'<p>'+escape(r.topic)+' · '+(r.correct?'Correct':'Practice')+' · '+escape(r.date)+'</p>').join('')||'<p>No activity yet. Start your journey!</p>')+'</section></div>';
 else if(page==='cheatsheet')mountResources(app,true);
 else if(page==='resources')mountResources(app);
 else if(page==='about')app.innerHTML='<h1>About Python</h1><article class="panel"><h2>A readable, general-purpose language</h2><p>Guido van Rossum began Python in 1989; the first public release appeared in 1991. Python is used for automation, web services, education, data analysis and scientific computing.</p><h2>How it runs</h2><p>CPython compiles source into bytecode and executes it in an interpreter. Values have types; variable names can be rebound to different values.</p><h2>Your first program</h2><pre>print("Hello, Python!")</pre><p>Explore input/output, variables, decisions, loops and collections before functions and objects.</p></article>';
 else if(page==='characters')companion=mountStudio(app,stats.settings,async settings=>{await api('settings',{settings});await update()});
 else if(page==='settings')app.innerHTML='<h1>Settings</h1><section class="panel settings-panel"><label><input type="checkbox" id="motion" '+(stats.settings.reduced_motion?'checked':'')+'> Reduce motion</label><label><input type="checkbox" id="effects" '+(stats.settings.sound_effects_enabled?'checked':'')+'> Sound effects</label><label>Sound effect volume <input type="range" id="effects-volume" min="0" max="1" step="0.05" value="'+(stats.settings.sound_effect_volume??.2)+'"></label><p>Your companion and audio choices are saved to this profile.</p></section>';
 else app.innerHTML='<h1>Page not found</h1><a href="#home">Return Home</a>';
 if(['world','progress'].includes(page))mountCompanion();
 bind();
}
function mountCompanion(){
 companion?.destroy();document.querySelector('#active-companion')?.remove();
 const host=document.createElement('section');host.id='active-companion';host.className='companion';
 const slot=document.querySelector('#companion-slot');if(slot)slot.append(host);else app.prepend(host);
 const {character,outfit}=selectedCompanion(stats.settings);
 companion=new CompanionController(host,character.id,outfit.id);
 if(slot){const label=document.createElement('p');label.className='practice-companion-label';label.textContent=character.name+' · '+outfit.name;host.prepend(label);host.style.setProperty('--companion-accent',character.color)}
}
function references(query){document.querySelector('#references').innerHTML=sheetCards.map((r,i)=>({r,i})).filter(({r})=>r.join(' ').toLowerCase().includes(query.toLowerCase())).map(({r,i})=>'<article class="panel"><h2>'+escape(r[0])+'</h2><p>'+escape(r[1])+'</p><pre>'+escape(r[2])+'</pre><button data-copy="'+i+'">Copy</button><p>'+escape(r[3])+'</p></article>').join('')}
function practice(){if(!worlds.some(w=>w.id===session.question.world_id)){app.innerHTML='<h1>This level is no longer available</h1><a href="#home">Choose another world</a>';return;}questionReveal?.destroy();questionReveal=null;companion?.destroy();companion=null;renderPractice(app,session,worlds,stats)}
async function showConcept(id,ticket,reviewSid){
 if(!worlds.some(w=>w.topics.some(t=>t.id===id))){app.innerHTML='<h1>This level is no longer available</h1><a href="#home">Choose another world</a>';return;}
 const state=await api('concept/'+id);if(ticket!==epoch)return;
 if(reviewSid){const saved=await api('session/'+reviewSid);if(ticket!==epoch)return;if(saved.question.subtopic_id!==id)throw Error('Topic mismatch');state.session_id=reviewSid}
 mountConcept(app,state,async()=>{
  await api('concept-complete',{topic:id});if(ticket!==epoch)return;
  let waiting=null,value;
  if(!reviewSid&&!state.session_id){
   const holder=document.createElement('section');holder.className='companion concept-request-companion';holder.setAttribute('aria-label','Challenge preparation companion');app.querySelector('.concept-footer').before(holder);
   const {character,outfit}=selectedCompanion(stats.settings);waiting=new CompanionController(holder,character.id,outfit.id);waiting.beginRequest('start');
  }
  try{value=reviewSid?await api('session/'+reviewSid):await api('concept-start',{topic:id});}finally{if(waiting){const holder=waiting.host;waiting.destroy();holder.remove();}}
  if(ticket!==epoch)return;
  localStorage.setItem('pyquest_session',value.session_id);location.hash='practice/'+value.session_id;
 });bind();
}
async function openTopic(id,ticket){
 const world=worlds.find(w=>w.topics.some(t=>t.id===id)),topic=world?.topics.find(t=>t.id===id);
 if(!topic)throw Error('Unknown topic');
 app.innerHTML='<a href="#world/'+world.id+'">← Back to '+escape(world.name)+'</a><h1>'+escape(topic.name)+' — Practice Terminal</h1><p id="topic-loading" role="status">Preparing your question…</p><section class="terminal"><div><label for="pending-code">Python code editor</label><textarea id="pending-code" disabled placeholder="Your editor will be ready when the question loads."></textarea></div><div><h2>Output</h2><pre>Waiting for your question.</pre></div></section><div class="actions"><button id="retry-topic" hidden>Try Again</button></div>';
 const retry=app.querySelector('#retry-topic');
 async function start(){
  retry.hidden=true;app.querySelector('#topic-loading').textContent='Preparing your question…';
  try{const value=await api('start',{topic:id});if(ticket!==epoch)return;localStorage.setItem('pyquest_session',value.session_id);location.hash='practice/'+value.session_id}
  catch(error){if(ticket!==epoch)return;app.querySelector('#topic-loading').textContent='Question could not load: '+error.message;retry.hidden=false}
 }
 retry.onclick=start;await start();
}
async function saveDraft(){if(!session||!document.querySelector('#code'))return;return drafts.save({session_id:session.session_id,question_id:session.question.question_id,code:document.querySelector('#code').value})}
function bind(){
 audio.disable();
 if(document.querySelector('#code')&&!document.querySelector('#active-companion')){mountCompanion();companion.dispatch('QUESTION_LOADED',{message:'Read the task, try your code, and check when you are ready.'})}
 if(document.querySelector('#code')&&!revealedQuestions.has(session.question.question_id)){
  const qid=session.question.question_id,ticket=epoch,visual=companion;
  const reduced=!!stats.settings.reduced_motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealedQuestions.add(qid);
  questionReveal=new QuestionReveal([...document.querySelectorAll('[data-question-text]')],{
   reduced,onStart:()=>{visual.setReaction('thinking','Reading the new question with you…');},
   onDone:()=>{if(ticket===epoch&&visual===companion){visual.dispatch('QUESTION_LOADED',{message:'Your turn. Write your code, then check your answer.'});}}
  });
 }

 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>location.hash=b.dataset.go);
 document.querySelectorAll('[data-topic]').forEach(b=>{
  const card=b.closest('article');
  card.classList.add('topic-node');card.tabIndex=0;card.setAttribute('role','link');
  card.setAttribute('aria-label','Open practice terminal: '+card.querySelector('h2').textContent);
  b.tabIndex=-1;
  const open=()=>{location.hash='learn/'+b.dataset.topic};
  card.onclick=open;card.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}};
 });
 const resume=document.querySelector('#resume');if(resume)resume.onclick=()=>location.hash=localStorage.getItem('pyquest_session')?'practice/'+localStorage.getItem('pyquest_session'):'map';
 const motion=document.querySelector('#motion');if(motion)motion.onchange=async()=>{try{await api('settings',{settings:{reduced_motion:motion.checked}});await update()}catch(e){notice(e.message)}};
 const effects=document.querySelector('#effects');if(effects)effects.onchange=async()=>{try{await api('settings',{settings:{sound_effects_enabled:effects.checked}});await update()}catch(e){notice(e.message)}};
 const effectsVolume=document.querySelector('#effects-volume');if(effectsVolume)effectsVolume.onchange=async()=>{try{await api('settings',{settings:{sound_effect_volume:Number(effectsVolume.value)}});await update()}catch(e){notice(e.message)}};
 const code=document.querySelector('#code');if(code){code.oninput=()=>{questionReveal?.finish();if(!companion?.pending.size)companion?.dispatch('QUESTION_LOADED',{message:'Take your time. I’m here while you write.'});};code.onblur=()=>saveDraft().catch(e=>notice(e.message));code.onkeydown=e=>handleEditorKey(e,code,()=>document.querySelector('[data-action=run]').click())}
 const review=document.querySelector('#review-concept');if(review)review.onclick=async()=>{try{await saveDraft();location.hash='concept/'+session.question.subtopic_id+'/'+session.session_id}catch(e){notice(e.message)}};
 const clear=document.querySelector('#clear');if(clear)clear.onclick=()=>document.querySelector('#output').textContent='';
 document.querySelectorAll('[data-action]').forEach(b=>b.onclick=async()=>{
  if(b.disabled)return;
  questionReveal?.finish();audio.unlockEffects()?.catch(()=>{});
  const action=b.dataset.action;if(action==='reveal'&&!confirm(`Spend ${session.question.solution_cost} coins to view the solution?`))return;
  const sid=session.session_id,qid=session.question.question_id,ticket=epoch;
  const requestCompanion=companion,requestToken=requestCompanion?.beginRequest(action);
  document.querySelectorAll('[data-action]').forEach(x=>x.disabled=true);
  const actionStatus=document.querySelector('#action-status');
  if(actionStatus){actionStatus.textContent=({check:'Checking your answer…',run:'Running your code…',hint:'Preparing a hint…',reveal:'Processing solution purchase…',next:'Generating the next question…'})[action];actionStatus.setAttribute('aria-busy','true')}
  let confirmedSuccess=null;
  try{await saveDraft();const value=await api(action,{session_id:sid,question_id:qid,code:code.value,confirmed:action==='reveal',operation_id:crypto.randomUUID(),inputs:document.querySelector('#inputs').value.split('\n')});
   if(ticket!==epoch)return;
   requestCompanion?.finishRequest(requestToken,value);
   if(action==='next'){session=value;practice();bind()}
   else if(action==='hint'){document.querySelector('#result').textContent=value.hint;companion?.dispatch('HINT_RECEIVED',{message:value.hint})}
   else if(action==='reveal'){code.value=value.solution;notice('Solution shown. This question will not award independent mastery.');companion?.dispatch('SOLUTION_RECEIVED',{message:'Read the solution and trace how each step works.'})}
   else {document.querySelector('#output').textContent=(value.outputs||[]).join('\n')||value.message||'';if(action==='check')document.querySelector('#result').textContent=value.correct!==undefined?((value.correct?'Correct':'Incorrect')+' · Marks '+value.marks_awarded+'/'+value.marks_possible+' · XP +'+value.xp_awarded+' · Coins +'+value.coins_awarded+' · Mastery '+Math.round(value.previous_mastery*100)+'% → '+Math.round(value.new_mastery*100)+'%'):value.message}
   if(action==='check'&&value.correct!==undefined){
    if(value.correct===true)confirmedSuccess=value;
    const progressReceipt=value.events?.find(event=>event.event_id)?.event_id||qid;
    const progressEvents=progression.accept(value,progressReceipt);
    const reducedMotion=!!stats.settings.reduced_motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderResult(document.querySelector('#result'),value,{animate:progressEvents.xp&&!reducedMotion});
    const reaction=value.correct?'happy':'motivating';
    companion?.setReaction(reaction,(value.correct?'':'😔 ')+(value.message || value.result_message || 'Good effort.'));
    const receipt=value.events?.find(event=>event.event_id)?.event_id||qid;
    rewardAnimation(value,receipt,document.querySelector('#result'));
    celebrations.result(value,receipt,document.querySelector('#result'));
    presentProgression(document.querySelector('#result'),value,progressEvents,{settings:stats.settings,companion,audio,reducedMotion});
    if(value.topic_mastered&&value.next_subtopic_id&&worlds.some(w=>w.topics.some(t=>t.id===value.next_subtopic_id))){const next=document.createElement('button');next.textContent='Continue to recommended topic →';next.onclick=()=>location.hash='learn/'+value.next_subtopic_id;document.querySelector('#result').append(next)}
   }
   await update();
   if(action==='check'&&value.correct===false){const support=difficultySupport(stats.recent,session.question.subtopic_id);if(support)companion?.setReaction('motivating','😔 '+support);}
  }catch(e){requestCompanion?.finishRequest(requestToken,null,e);if(ticket!==epoch)return;notice(e.message);if(action==='check'||action==='hint')companion?.setReaction('motivating','The request failed. Please try again.');if(e.code==='QUESTION_GENERATION_UNAVAILABLE'){const retry=document.querySelector('[data-action=next]');if(retry)retry.textContent='Try Again — Next Question'}}finally{if(ticket===epoch){document.querySelectorAll('[data-action]').forEach(x=>x.disabled=false);if(actionStatus){actionStatus.textContent='Ready';actionStatus.setAttribute('aria-busy','false')}if(confirmedSuccess)successCelebration.show(confirmedSuccess,{sid,qid,settings:stats.settings,isCurrent:()=>ticket===epoch&&session?.question.question_id===qid,onContinue:()=>document.querySelector('[data-action=next]')?.click()}).catch(error=>notice(error.message));}}
 });
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(b){try{await navigator.clipboard.writeText(sheetCards[Number(b.dataset.copy)][2]);b.textContent='Copied'}catch{notice('Copy unavailable; select the code to copy.')}}});
window.addEventListener('hashchange',()=>route().catch(e=>notice(e.message)));
const health=await api('health');
if(health.verification_mode){const banner=document.createElement('p');banner.className='verification-banner';banner.textContent='TEST SESSION — mock question provider, isolated verification data. Not live AI.';document.body.prepend(banner)}
worlds=await api('catalog');await route();
