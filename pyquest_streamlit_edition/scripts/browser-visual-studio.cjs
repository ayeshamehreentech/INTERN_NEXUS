const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={errors:[],provider:'HF token absent; isolated mock challenge provider'};page.on('pageerror',e=>result.errors.push(e.message));
 const noOverflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 try{
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){try{const response=await fetch('http://127.0.0.1:8503/_stcore/health',{signal:AbortSignal.timeout(1000)});if(response.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,500));}
  if(!ready)throw Error('Verification server health endpoint did not become ready.');
  await page.goto('http://127.0.0.1:8503/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click({timeout:30000});
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});await editor.waitFor();
  await editor.fill('print("wrong")');await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#active-companion .speech-bubble').getByText(/2 recent tries/).waitFor();result.repeatedDifficulty=true;
  const draft='name=input()\nprint("Welcome",name)';await editor.fill(draft);await editor.press('Tab');await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  const modal=page.locator('dialog.success-celebration');await modal.waitFor();result.celebration=true;
  await modal.getByRole('button',{name:'Stay on This Question',exact:true}).click();await modal.waitFor({state:'detached'});
  const wallet=await page.locator('#wallet').innerText();
  const latestDraft=draft+'\n# latest edit before navigation';await editor.fill(latestDraft);
  await page.evaluate(()=>{globalThis.qaPreviousView=[...document.querySelectorAll('*')].map(el=>el.shadowRoot?.querySelector('.pyquest-root')?._pyquest).find(Boolean);});
  await page.getByRole('link',{name:/Pythonist Pro-Tips Vault/}).click();
  await page.getByRole('heading',{name:'Pythonist Pro-Tips Vault',exact:true}).waitFor();result.nativeVault=true;
  result.previousViewDisposed=await page.evaluate(()=>qaPreviousView.disposed===true&&qaPreviousView.pending.size===0);
  const search=page.getByRole('textbox',{name:'Search tips',exact:true});await search.fill('enumerate');await search.press('Enter');
  await page.getByText('1 matching tips',{exact:true}).waitFor();
  await page.getByRole('heading',{name:'enumerate: index and value',exact:true}).waitFor();result.search=true;
  await page.getByText('Predict first, then reveal output · enumerate: index and value',{exact:true}).click();await page.getByText('1 Byte\n2 Kai',{exact:true}).waitFor();await page.waitForTimeout(300);result.revealExample=true;
  await page.screenshot({path:'qa-artifacts/pro-tips-desktop.png',fullPage:true});
  await search.fill('impossible-phrase-987');await search.press('Enter');await page.getByText(/No matches/).waitFor();result.emptySearch=true;
  await search.fill('');await search.press('Enter');
  await page.getByText('20 matching tips',{exact:true}).waitFor();
  await page.setViewportSize({width:390,height:844});await page.getByRole('heading',{name:'Pythonist Pro-Tips Vault',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:'qa-artifacts/pro-tips-mobile.png'});result.vaultMobileFits=await noOverflow();
  await page.getByRole('link',{name:/Visual Learning Studio/}).click();
  await page.getByRole('heading',{name:'Visual Learning Studio',exact:true}).waitFor();result.nativeStudio=true;
  result.videoControlsRetired=await page.getByRole('button',{name:'Generate video',exact:true}).count()===0;
  result.imageControlsRemoved=await page.getByRole('button',{name:'Generate Visual Explanation',exact:true}).count()===0;
  const topics=['Binary integer representation','Bitwise operators','Memory references','Stack and queue operations','Sorting algorithms','Binary search','Recursion','OOP concepts'];
  const diagramControl=['Integer','First integer','Operation','Add item C','Starting values','Search target','Factorial input','Increment object A'];
  result.diagrams=[];
  for(const title of topics){
   const concept=page.getByRole('combobox',{name:'Concept',exact:true});
   if(topics.indexOf(title)>0){
    await concept.scrollIntoViewIfNeeded();
    for(let attempt=0;attempt<4;attempt++){
     if(await concept.getAttribute('aria-expanded')!=='true')await concept.press('ArrowDown');
     if(await page.getByRole('option',{name:title,exact:true}).isVisible().catch(()=>false))break;
     await page.waitForTimeout(250);
    }
    await page.getByRole('option',{name:title,exact:true}).click();
   }
   await page.getByRole('heading',{name:'Explore the interactive diagram',exact:true}).waitFor();
   await page.getByText(diagramControl[topics.indexOf(title)],{exact:true}).first().waitFor();
   if(!(await noOverflow()))throw Error('Mobile overflow: '+title);
   result.diagrams.push(title);
   if(title==='Stack and queue operations'){await page.getByRole('button',{name:'Add item C',exact:true}).click();await page.locator('.visual-boxes').first().getByText('C',{exact:true}).waitFor();await page.getByRole('button',{name:'Stack pop',exact:true}).click();await page.getByText(/Removed: stack C/).waitFor();await page.getByRole('button',{name:'Queue dequeue',exact:true}).click();await page.getByText(/Removed: stack C · queue A/).waitFor();result.structures=true;}
   if(title==='OOP concepts'){await page.getByRole('button',{name:'Increment object A',exact:true}).click();await page.getByText('Object A · value 1',{exact:true}).waitFor();await page.getByText('Object B · value 0',{exact:true}).waitFor();result.objectsIndependent=true;}
  }
  await page.getByRole('heading',{name:'Explore the interactive diagram',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:'qa-artifacts/visual-studio-mobile.png'});result.studioMobileFits=await noOverflow();
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'qa-artifacts/visual-studio-desktop.png',fullPage:true});
  await page.getByRole('link',{name:/PyQuest Adventure/}).click();
  // Navigation may retain the practice hash. Otherwise resume through the existing concept route.
  if(!await editor.isVisible().catch(()=>false)){
   await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();
   await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
   await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();await editor.waitFor();
  }
  result.draftPreserved=await editor.inputValue()===latestDraft;result.readingNoRewards=(await page.locator('#wallet').innerText())===wallet;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();await page.waitForTimeout(400);
  result.noModalReplay=await modal.count()===0;result.noRewardReplay=(await page.locator('#wallet').innerText())===wallet;
  if(result.errors.length||!result.previousViewDisposed||!result.draftPreserved||!result.readingNoRewards||!result.noModalReplay||!result.noRewardReplay||!result.videoControlsRetired||!result.imageControlsRemoved||!result.vaultMobileFits||!result.studioMobileFits)throw Error('Visual Studio QA assertion failed');
 }catch(error){result.failure=error.message;result.options=await page.getByRole('option').allTextContents().catch(()=>[]);await page.screenshot({path:'qa-artifacts/visual-studio-failure.png',fullPage:true}).catch(()=>{});process.exitCode=1;}
 finally{fs.writeFileSync('docs/visual-studio-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
