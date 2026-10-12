const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:'isolated mock question provider',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8503/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click({timeout:30000});
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});await editor.waitFor();
  await page.locator('#active-companion .character-figure[data-state=blink]').waitFor({timeout:5500});result.naturalBlink=true;
  await page.locator('#active-companion .character-figure[data-state=idle]').waitFor();result.returnedIdle=true;
  await editor.fill('print(');await page.getByRole('button',{name:'Run ▶',exact:true}).click();
  await page.locator('#active-companion .character-figure[data-state=motivating]').waitFor();result.syntaxMotivation=true;
  await editor.fill('name=input()\nprint("Welcome",name)');await page.getByRole('button',{name:'Run ▶',exact:true}).click();
  await page.locator('#active-companion .character-figure[data-state=happy]').waitFor();result.runHappy=true;
  result.runMessage=await page.locator('#active-companion .speech-bubble').innerText();result.noRunModal=await page.locator('dialog.success-celebration').count()===0;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  await page.locator('dialog.success-celebration').waitFor();result.successModalPreserved=true;
  await page.getByRole('button',{name:'Stay on This Question',exact:true}).click();
  await page.locator('dialog.success-celebration').waitFor({state:'detached'});
  await page.getByRole('button',{name:'Review Concept',exact:true}).click();await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();await editor.waitFor();
  result.draftPreserved=await editor.inputValue()==='name=input()\nprint("Welcome",name)';
  if(result.errors.length||!result.noRunModal||!result.draftPreserved||!result.runMessage.includes('Check Answer will verify'))throw Error('Companion foundation QA failed');
 }catch(error){result.failure=error.message;result.notice=await page.locator('#notice').innerText().catch(()=>null);result.page=await page.locator('#app').innerText().catch(()=>null);process.exitCode=1;}
 finally{fs.writeFileSync('docs/companion-foundation-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
