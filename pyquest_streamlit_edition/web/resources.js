import {proTips} from './pro-tips-data.js';
import {sheetCards} from './cheatsheet-data.js';
import {resourceLessons} from './resource-lessons.js';

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function resourceMatches(query){
 return sheetCards.map((card,index)=>({card,index})).filter(({card})=>card.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
}

export function lessonMatches(query){return resourceLessons.filter(({card})=>card.join(' ').toLowerCase().includes(query.trim().toLowerCase()))}
export function mountResources(host,cheatSheet=false){
 const tipCards=proTips.map(tip=>({group:'Pro-Tips · '+tip.category,card:[tip.title,tip.body,tip.code||tip.shortcut||'',tip.output||'',`<h2>${escape(tip.title)}</h2><p class="resource-eyebrow">${escape(tip.category)}</p><p>${escape(tip.body)}</p>${tip.code||tip.shortcut?'<pre><code>'+escape(tip.code||tip.shortcut)+'</code></pre>':''}${tip.output!==undefined?'<details><summary>Reveal output</summary><pre>'+escape(tip.output)+'</pre></details>':''}<a href="${escape(tip.source)}" target="_blank" rel="noopener noreferrer">Reference ↗</a>`]}));
 const search=cheatSheet?(query=>[...resourceMatches(query),...tipCards.filter(({card,group})=>(group+' '+card.slice(0,4).join(' ')).toLowerCase().includes(query.trim().toLowerCase()))]):lessonMatches;
 let matches=search(''),position=0;
 host.innerHTML=`<section class="resources-page"><h1>${cheatSheet?'Python Cheat Sheet':'Learning Resources'}</h1><p>${cheatSheet?'Quick syntax reminders, compact examples, and the Pythonist Pro-Tips Vault.':'Understand each topic with the original detailed explanations, worked examples, and tables.'}</p>
 ${cheatSheet?'<details class="panel"><summary>Watch the Python toolkit animation</summary><video controls preload="none" style="width:100%;max-width:900px" poster="/app/static/assets/learning/python-toolkit-poster.png"><source src="/app/static/assets/learning/python-toolkit.mp4" type="video/mp4"><track kind="captions" src="/app/static/assets/learning/python-toolkit.vtt" srclang="en" label="English" default></video></details>':''}<div class="resource-layout"><section class="resource-sidebar" aria-label="Learning topics"><h2>Explore topics</h2><input type="search" id="resource-search" placeholder="Find a topic…" aria-label="Search learning topics"><nav class="resource-topics" aria-label="Resource topics"></nav><a href="#${cheatSheet?'resources':'cheatsheet'}">${cheatSheet?'Open detailed Resources':'▤ Open Cheat Sheet'} →</a></section>
 <section class="resource-reader" aria-label="Topic cards"><div id="resource-card" aria-live="polite"></div>
 <div class="resource-navigation"><button id="resource-back">← Previous</button><span id="resource-count" role="status"></span><button id="resource-next">Next →</button></div>
 <label class="resource-slider-label" for="resource-slider">Slide through topics</label><input type="range" id="resource-slider" min="1" value="1" aria-label="Resource card slider">
 <p class="resource-note">These are reference examples. Some Python features are not yet supported by the restricted practice terminal.</p><a href="#map">← Back to adventure</a></section></div></section>`;
 const topics=host.querySelector('.resource-topics'),card=host.querySelector('#resource-card'),back=host.querySelector('#resource-back'),next=host.querySelector('#resource-next'),slider=host.querySelector('#resource-slider');
 function render(){
  topics.innerHTML=matches.map(({card,group},i)=>`${group&&group!==matches[i-1]?.group?'<h3 class="resource-group">'+escape(group)+'</h3>':''}<button class="resource-topic" data-resource="${i}" aria-current="${i===position?'true':'false'}">${escape(card[0])}</button>`).join('');
  topics.querySelectorAll('button').forEach(button=>button.onclick=()=>{position=Number(button.dataset.resource);render()});
  back.disabled=position===0;next.disabled=!matches.length||position===matches.length-1;
  slider.max=String(Math.max(1,matches.length));slider.value=String(position+1);slider.disabled=matches.length<2;
  host.querySelector('#resource-count').textContent=matches.length?`Card ${position+1} of ${matches.length}`:'0 matching topics';
  if(!matches.length){card.innerHTML='<article class="resource-card"><h2>No topics found</h2><p>Try another search or clear the search box to see every topic.</p></article>';return}
  const [title,description,code,tip,lessonHtml]=matches[position].card;
  card.innerHTML=lessonHtml?`<article class="resource-card resource-lesson">${lessonHtml}</article>`:`<article class="resource-card"><p class="resource-eyebrow">PYTHON CHEAT SHEET</p><h2>${escape(title)}</h2><section class="resource-concept"><h3>Concept / Explanation</h3><p>${escape(description)}</p></section><section><h3>Syntax &amp; Example</h3><pre><code>${escape(code)}</code></pre></section><section class="resource-tip"><h3>Key concept</h3><p>${escape(tip)}</p></section></article>`;
  topics.querySelector('[aria-current="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});
 }
 back.onclick=()=>{position=Math.max(0,position-1);render()};
 next.onclick=()=>{position=Math.min(matches.length-1,position+1);render()};
 slider.oninput=()=>{position=Number(slider.value)-1;render()};
 host.querySelector('#resource-search').oninput=event=>{matches=search(event.target.value);position=0;render()};
 render();
}
