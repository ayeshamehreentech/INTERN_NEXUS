const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderPractice(app,session,worlds,stats){
 const q=session.question,w=worlds.find(w=>w.id===q.world_id),topic=w.topics.find(t=>t.id===q.subtopic_id);
 const mastery=stats.mastery[q.subtopic_id]||0;
 app.innerHTML=`<a href="#world/${w.id}">← Back to ${escape(w.name)}</a>
  <button id="review-concept">Review Concept</button><div class="quest-meta"><span>${escape(w.name)} / ${escape(topic?.name||q.subtopic_id)}</span><span>${escape(q.difficulty)}</span><span>Mastery ${Math.round(mastery*100)}%</span></div>
  <section class="quest-header"><div id="companion-slot"></div><article class="panel quest-task"><p class="eyebrow">CODING QUEST</p><h1 data-question-text>${escape(q.title)}</h1><p data-question-text>${escape(q.prompt)}</p><h3>Requirements</h3><ul>${q.requirements.map(r=>`<li data-question-text>${escape(r)}</li>`).join('')}</ul><details open><summary>Example input / output</summary><div class="example-pair"><div><small>INPUT</small><pre>${escape(q.example.inputs.join('\n')||'(none)')}</pre></div><div><small>OUTPUT</small><pre>${escape(q.example.expected)}</pre></div></div></details></article></section>
  <section class="terminal"><div><label for="code">main.py</label><textarea id="code" spellcheck="false" aria-label="Python code editor">${escape(session.draft||q.starter_code)}</textarea><small>Tab moves focus · Ctrl+] indents · Ctrl+Enter runs</small></div><div><label for="inputs">Input — one value per line</label><textarea id="inputs">${escape(q.example.inputs.join('\n'))}</textarea><h2>Output</h2><pre id="output" aria-live="polite">Run your code to see output.</pre></div></section>
  <div class="actions terminal-actions"><button data-action="run">Run ▶</button><button id="clear">Clear</button><button data-action="check">Check Answer</button><button data-action="hint">Get Hint</button><button data-action="reveal">Use Coin for Solution</button><button data-action="next">Next Question →</button></div>
  <p id="action-status" role="status" aria-live="polite" aria-busy="false">Ready</p>
  <section id="result" class="panel" aria-live="polite">Your result will appear here.</section>`;
}

export function buildResultPresentation(value){
 const heading=value.correct?'Correct!':'Try again!';
 const message=(value.message || value.result_message || (value.correct?'Great work!':'Check how you are handling the input.')).trim();
 const scoreText=value.score!==undefined?`Score: ${value.score}`:value.tests_total?`Tests ${value.tests_passed} / ${value.tests_total}`:'';
 const details=[];
 if(value.tests_total){details.push(`Tests ${value.tests_passed} / ${value.tests_total}`)}
 if(value.marks_awarded!==undefined&&value.marks_possible!==undefined){details.push(`Marks ${value.marks_awarded} / ${value.marks_possible}`)}
 if(value.xp_awarded!==undefined){details.push(`XP +${value.xp_awarded}`)}
 if(value.coins_awarded!==undefined){details.push(`Coins +${value.coins_awarded}`)}
 if(value.previous_mastery!==undefined&&value.new_mastery!==undefined){details.push(`Mastery ${Math.round(value.previous_mastery*100)}% → ${Math.round(value.new_mastery*100)}%`)}
 const summary=details.join(' · ');
 const rewardAmount = Number(value.coins_awarded || value.events?.find(event => Number(event?.payload?.coins_awarded || 0) > 0)?.payload?.coins_awarded || 0 || 0);
 return {heading,message,summary,scoreText,rewardAmount};
}

export function renderResult(host,value,{animate=true}={}){
 host.replaceChildren();
 const {heading,message,summary,scoreText,rewardAmount}=buildResultPresentation(value);
 const title=document.createElement('h2');title.textContent=heading;host.append(title);
 const feedback=document.createElement('p');feedback.textContent=message;host.append(feedback);
 if(rewardAmount>0){
  const reward=document.createElement('p');reward.className='reward-badge';reward.textContent=`🪙 +${rewardAmount} Coins`;host.append(reward);
 }
 if(summary){const meta=document.createElement('p');meta.textContent=summary;host.append(meta)}
 if(scoreText){const score=document.createElement('p');score.textContent=scoreText;host.append(score)}
 if(value.new_mastery!==undefined){
  const bar=document.createElement('div');bar.className='mastery-track';bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(Math.round(value.new_mastery*100)));bar.setAttribute('aria-label','Topic mastery');
  const fill=document.createElement('span');fill.style.transform=`scaleX(${animate?(value.previous_mastery ?? 0):value.new_mastery})`;bar.append(fill);host.append(bar);if(animate)requestAnimationFrame(()=>requestAnimationFrame(()=>fill.style.transform=`scaleX(${value.new_mastery})`));
 }
 if(!value.correct){const retry=document.createElement('button');retry.textContent='Try Again';retry.onclick=()=>document.querySelector('#code').focus();host.append(retry)}
}
