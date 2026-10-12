const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.goto(process.env.PYQUEST_QA_URL||'http://127.0.0.1:8503/');
  await page.getByRole('heading',{name:'Explore the worlds',exact:true}).waitFor({timeout:30000});
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});
  await editor.waitFor({timeout:60000});
  const draft='name=input()\nprint("Welcome",name)';
  await editor.fill(draft);
  await page.getByRole('button',{name:'Run ▶',exact:true}).click();
  await page.locator('#output').getByText('Welcome Nova',{exact:true}).waitFor();
  result.run=true;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  await page.getByRole('heading',{name:'Correct!',exact:true}).waitFor();result.check=true;
  await page.locator('#wallet').getByText(/2.*100 XP/).waitFor();result.rewards=true;
  await page.getByRole('button',{name:/Review Concept/}).click();
  await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();
  await editor.waitFor();result.reviewPreservesCode=await editor.inputValue()===draft;
  await editor.fill('');
  await page.getByRole('button',{name:/Review Concept/}).click();
  await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();
  await editor.waitFor();result.emptyDraftPreserved=await editor.inputValue()==='';
  const oldPrompt=await page.locator('.quest-task > p:not(.eyebrow)').first().innerText();
  await page.getByRole('button',{name:'Next Question →',exact:true}).click();
  await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  await page.getByText(oldPrompt,{exact:true}).waitFor({state:'detached'});
  result.next=true;
  await page.setViewportSize({width:390,height:844});
  await editor.scrollIntoViewIfNeeded();await page.screenshot({path:'qa-artifacts/original-ui-editor-mobile.png'});
  result.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  console.log(JSON.stringify(result));
  if(result.errors.length||!result.reviewPreservesCode||!result.emptyDraftPreserved||result.mobileOverflow)process.exitCode=1;
 }catch(e){result.failure=e.message;console.log(e.message);await page.screenshot({path:'qa-artifacts/original-ui-flow-failure.png',fullPage:true});process.exitCode=1;}
 finally{fs.writeFileSync('docs/original-ui-flow-results.json',JSON.stringify(result,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
