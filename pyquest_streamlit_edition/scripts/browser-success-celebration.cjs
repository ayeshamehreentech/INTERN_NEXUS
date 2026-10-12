const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const result={errors:[],provider:'isolated mock questions; real execution/grading/rewards'};
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>result.errors.push(e.message));
 const modal=page.locator('dialog.success-celebration');
 const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});
 const check=()=>page.getByRole('button',{name:'Check Answer',exact:true}).click();
 const waitReady=()=>page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
 const draft='name=input()\nprint("Welcome",name)';
 try{
  await page.goto('http://127.0.0.1:8503/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click({timeout:30000});
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();await editor.waitFor();
  await page.evaluate(()=>{const root=document.querySelector('[class*=st-key-pyquest_original_ui]')?.shadowRoot?.querySelector('.pyquest-root')||[...document.querySelectorAll('*')].map(x=>x.shadowRoot?.querySelector('.pyquest-root')).find(Boolean);if(!root)throw Error('Component root not found');const state=root._pyquest;let emit=state.emit;globalThis.qaRequests=[];Object.defineProperty(state,'emit',{configurable:true,set(fn){emit=fn},get(){return function(name,data){qaRequests.push({name,path:data?.path,payload:data?.payload});if(globalThis.qaFailNext&&data?.path==='next'){globalThis.qaFailNext=false;const pending=state.pending.get(data.id);state.pending.delete(data.id);pending.reject(Object.assign(Error('Groq temporarily limited question requests. Your current challenge and code are preserved.'),{code:'QUESTION_GENERATION_UNAVAILABLE'}));return;}return emit(name,data);}}});});
  await editor.fill('print("wrong")');await check();await waitReady();
  result.incorrectNoModal=await modal.count()===0;
  await editor.fill(draft);await page.getByRole('button',{name:'Run ▶',exact:true}).click();await waitReady();
  result.runNoModal=await modal.count()===0;
  await check();await modal.waitFor({timeout:30000});
  result.correctModal=true;result.nativeModal=await modal.evaluate(d=>d.matches(':modal'));
  result.actualRewards=await modal.locator('.success-rewards').innerText();
  await page.waitForTimeout(1700);await modal.screenshot({path:'qa-artifacts/success-byte-desktop.png'});
  const hash=await page.evaluate(()=>location.hash);await page.mouse.click(220,45);
  result.backgroundBlocked=(await page.evaluate(()=>location.hash))===hash;
  await modal.getByRole('button',{name:'Continue Adventure →',exact:true}).focus();await page.keyboard.press('Shift+Tab');
  result.focusTrapped=await modal.getByRole('button',{name:'Stay on This Question',exact:true}).evaluate(b=>b.getRootNode().activeElement===b);
  await page.setViewportSize({width:390,height:844});await modal.screenshot({path:'qa-artifacts/success-byte-mobile.png'});
  result.mobileFits=await modal.evaluate(d=>{const r=d.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&d.scrollHeight<=d.clientHeight;});
  await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});
  result.escapePreservesCode=await editor.inputValue()===draft;
  const wallet=await page.locator('#wallet').innerText();await check();await waitReady();await page.waitForTimeout(300);
  result.repeatNoModal=await modal.count()===0;result.repeatNoRewards=(await page.locator('#wallet').innerText())===wallet;
  await page.getByRole('button',{name:'Review Concept',exact:true}).click();
  await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();await editor.waitFor();
  result.reviewPreservesCode=await editor.inputValue()===draft;
  await page.getByRole('button',{name:'Next Question →',exact:true}).click();await waitReady();
  await editor.fill(draft);await check();await modal.waitFor();
  const before=await page.evaluate(()=>qaRequests.filter(r=>r.path==='next').length);
  const completedHash=await page.evaluate(()=>location.hash);
  await modal.getByRole('button',{name:'Continue Adventure →',exact:true}).evaluate(b=>{b.click();b.click();});await modal.waitFor({state:'detached'});await page.waitForFunction(n=>qaRequests.filter(r=>r.path==='next').length>=n,before+1);await waitReady();
  result.continueExactlyOnce=(await page.evaluate(()=>qaRequests.filter(r=>r.path==='next').length))===before+1;
  const failureNotice=await page.locator('#notice').innerText();
  if(failureNotice){result.generationFailureType='actual mock question guard rejection';result.generationFailureMessage=failureNotice;}
  else{
   await editor.fill(draft);await check();await modal.waitFor();
   await page.evaluate(()=>globalThis.qaFailNext=true);
   await modal.getByRole('button',{name:'Continue Adventure →',exact:true}).click();await waitReady();
   await page.locator('#notice').getByText(/Groq temporarily limited/).waitFor();
   result.generationFailureType='simulated provider quota response';
  }
  result.generationFailurePreservesCode=await editor.inputValue()===draft&&(await page.evaluate(()=>location.hash))===completedHash;
  await check();await waitReady();result.failureNoDuplicateModal=await modal.count()===0;
  if(result.errors.length||!result.incorrectNoModal||!result.runNoModal||!result.correctModal||!result.backgroundBlocked||!result.focusTrapped||!result.mobileFits||!result.repeatNoModal||!result.repeatNoRewards||!result.continueExactlyOnce||!result.generationFailurePreservesCode)throw Error('Celebration QA assertion failed');
 }catch(error){result.failure=error.message;await page.screenshot({path:'qa-artifacts/success-failure.png',fullPage:true});process.exitCode=1;}
 finally{fs.writeFileSync('docs/success-celebration-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
