const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:'live Groq',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8501/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).waitFor({timeout:30000});
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});
  await editor.waitFor({timeout:90000});result.generated=true;
  await editor.fill('pass');await page.getByRole('button',{name:'Run ▶',exact:true}).click();
  await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  await page.getByRole('heading',{name:'Try again!',exact:true}).waitFor();result.feedback=true;
  await page.getByRole('button',{name:/Review Concept/}).click();
  await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();
  await editor.waitFor();result.reviewPreservesCode=await editor.inputValue()==='pass';
  const oldPrompt=await page.locator('.quest-task > p:not(.eyebrow)').first().innerText();
  await page.getByRole('button',{name:'Next Question →',exact:true}).click();
  await page.getByText(oldPrompt,{exact:true}).waitFor({state:'detached',timeout:90000});
  result.nextGenerated=true;
  await page.screenshot({path:'qa-artifacts/original-ui-live-next.png',fullPage:true});
  console.log(JSON.stringify(result));
 }catch(e){result.failure=e.message;result.message=await page.locator('#concept-status').innerText().catch(()=>null)||await page.locator('#notice').innerText().catch(()=>null);console.log(JSON.stringify(result));process.exitCode=1;}
 finally{fs.writeFileSync('docs/original-ui-live-results.json',JSON.stringify(result,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
