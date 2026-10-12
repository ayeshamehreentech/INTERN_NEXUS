const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:'isolated mock challenges',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8503/_stcore/health')).ok)break}catch{}await page.waitForTimeout(500);}
  await page.goto('http://127.0.0.1:8503/');await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});await editor.waitFor();
  const title=page.locator('.quest-task h1');
  result.initialPartial=await title.evaluate(e=>e.textContent.length<(e.getAttribute('aria-label')||'').length);
  await page.locator('#active-companion .character-figure[data-state=thinking]').waitFor();result.revealThinking=true;
  for(let i=0;i<150;i++){if(await page.locator('[data-question-text]').evaluateAll(nodes=>nodes.every(n=>n.textContent===n.getAttribute('aria-label'))))break;await page.waitForTimeout(100);}
  result.fullText=await page.locator('[data-question-text]').evaluateAll(nodes=>nodes.every(n=>n.textContent===n.getAttribute('aria-label')));
  await page.locator('#active-companion .character-figure[data-state=idle]').waitFor();result.readyIdle=true;
  await editor.fill('print("wrong")');await page.locator('#active-companion .character-figure[data-state=idle]').waitFor();result.writingIdle=true;
  await page.evaluate(()=>{const root=[...document.querySelectorAll('*')].map(e=>e.shadowRoot?.querySelector('.pyquest-root')).find(Boolean);const state=root._pyquest;let emit=state.emit;Object.defineProperty(state,'emit',{configurable:true,set(fn){emit=fn},get(){return function(name,data){if(data?.path==='check'){setTimeout(()=>emit(name,data),500);return;}return emit(name,data);}}});});
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#active-companion .character-figure[data-state=thinking]').waitFor();result.checkThinking=true;
  await page.locator('#active-companion .character-figure[data-state=motivating]').waitFor();result.wrongAnswerReaction=true;
  await page.locator('#active-companion .speech-bubble').getByText(/😔/).waitFor();result.sadFeedbackCue=true;
  await page.screenshot({path:'qa-artifacts/question-wrong-reaction.png'});
  await editor.fill('name=input()\nprint("Welcome",name)');await page.locator('#active-companion .character-figure[data-state=idle]').waitFor();result.editingResetsReaction=true;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();const modal=page.locator('dialog.success-celebration');await modal.waitFor();result.correctCelebration=true;
  await modal.getByRole('button',{name:'Stay on This Question',exact:true}).click();await modal.waitFor({state:'detached'});
  await page.getByRole('button',{name:'Next Question →',exact:true}).click();
  await page.getByText('Reading the new question with you…',{exact:true}).waitFor();result.nextRevealThinking=true;
  result.nextPartial=await page.locator('[data-question-text]').evaluateAll(nodes=>nodes.some(n=>n.textContent!==n.getAttribute('aria-label')));
  await editor.fill('# my draft');await page.locator('#active-companion .character-figure[data-state=idle]').waitFor();
  result.editingCompletesReveal=await page.locator('[data-question-text]').evaluateAll(nodes=>nodes.every(n=>n.textContent===n.getAttribute('aria-label')));
  await page.getByRole('button',{name:'Review Concept',exact:true}).click();await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();await editor.waitFor();result.draftPreserved=await editor.inputValue()==='# my draft';
  if(result.errors.length||!result.initialPartial||!result.fullText||!result.nextPartial||!result.editingCompletesReveal||!result.draftPreserved)throw Error('Question reveal QA assertion failed');
 }catch(error){result.failure=error.message;process.exitCode=1;await page.screenshot({path:'qa-artifacts/question-reveal-failure.png',fullPage:true}).catch(()=>{});}
 finally{fs.writeFileSync('docs/question-reveal-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
