const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:process.env.PYQUEST_QA_URL?'isolated mock':'live Groq',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.goto(process.env.PYQUEST_QA_URL||'http://127.0.0.1:8501/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click({timeout:30000});
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});
  await editor.waitFor({timeout:45000});result.generated=true;
  const examples=await page.locator('.example-pair pre').allTextContents(),values=examples[0].split('\n');
  // Test answer inferred solely from the public greeting example. No hidden fixtures or purchased solution.
  let text=examples[1].replaceAll('{','{{').replaceAll('}','}}');
  [...values.keys()].sort((a,b)=>values[b].length-values[a].length).forEach(index=>{if(values[index])text=text.replaceAll(values[index],`{value_${String.fromCharCode(97+index)}}`);});
  const code=values.map((_,index)=>`value_${String.fromCharCode(97+index)} = input()`).join('\n')+'\nprint(f'+JSON.stringify(text)+')';
  await editor.fill(code);await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  const modal=page.locator('dialog.success-celebration');
  await modal.waitFor({timeout:15000});result.authoritativeCorrectModal=true;
  result.rewards=await modal.locator('.success-rewards').innerText();
  await page.waitForTimeout(1700);await page.screenshot({path:process.env.PYQUEST_QA_URL?'qa-artifacts/success-mock-desktop.png':'qa-artifacts/success-live-desktop.png',fullPage:true});
  const oldPrompt=await page.locator('.quest-task > p:not(.eyebrow)').first().innerText();
  if(process.env.PYQUEST_QA_FAIL_NEXT)await page.evaluate(()=>{const root=[...document.querySelectorAll('*')].map(x=>x.shadowRoot?.querySelector('.pyquest-root')).find(Boolean);const state=root._pyquest;let emit=state.emit;Object.defineProperty(state,'emit',{configurable:true,set(fn){emit=fn},get(){return function(name,data){if(data?.path==='next'){const pending=state.pending.get(data.id);state.pending.delete(data.id);pending.reject(Object.assign(Error('Groq temporarily limited question requests. Your current challenge and code are preserved.'),{code:'QUESTION_GENERATION_UNAVAILABLE'}));return;}return emit(name,data);}}});});
  await modal.getByRole('button',{name:'Continue Adventure →',exact:true}).click();
  await modal.waitFor({state:'detached'});
  await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  result.nextGenerated=(await page.locator('.quest-task > p:not(.eyebrow)').first().innerText())!==oldPrompt;
  if(!result.nextGenerated){result.nextBlocker=await page.locator('#notice').innerText();result.completedCodePreserved=await editor.inputValue()===code;}
  if(process.env.PYQUEST_QA_FAIL_NEXT){result.providerFailure='simulated quota error, not a live provider failure';await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();result.noReplay=await modal.count()===0;}
 }catch(error){result.failure=error.message;result.message=await page.locator('#concept-status').innerText().catch(()=>null)||await page.locator('#notice').innerText().catch(()=>null)||await page.locator('#result').innerText().catch(()=>null);}
 finally{fs.writeFileSync(process.env.PYQUEST_QA_FAIL_NEXT?'docs/success-quota-browser-results.json':process.env.PYQUEST_QA_URL?'docs/success-continue-browser-results.json':'docs/success-live-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
