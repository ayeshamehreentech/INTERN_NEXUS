const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 fs.mkdirSync('qa-artifacts',{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const result={mock:{},live:{},errors:[]};
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>result.errors.push(e.message));
 await page.goto('http://127.0.0.1:8502/');
 await page.getByRole('button',{name:/Explore I\/O Harbor/}).waitFor({timeout:30000});
 result.mock.worlds=await page.getByRole('button',{name:/Explore /}).count();
 await page.screenshot({path:'qa-artifacts/home-desktop.png',fullPage:true});
 await page.getByRole('button',{name:/Explore I\/O Harbor/}).click();
 await page.getByRole('combobox',{name:'Subtopic',exact:true}).click();
 await page.getByRole('option',{name:'input()',exact:true}).click();
 await page.getByRole('button',{name:/Start challenge/}).waitFor();
 await page.screenshot({path:'qa-artifacts/concept-desktop.png',fullPage:true});
 await page.getByRole('button',{name:/Start challenge/}).click();
 const editor=page.getByRole('textbox',{name:'Python code',exact:true});await editor.waitFor({timeout:45000});
 const draft='# Browser draft survives reruns\nname=input()\nprint("Welcome",name)';
 await editor.fill(draft);await editor.press('Tab');
 await page.getByRole('button',{name:/Run code/}).click();
 await page.getByRole('button',{name:/Check answer/}).click();
 await page.getByText(/Correct! All checked outputs/).waitFor({timeout:30000});
 result.mock.correctFeedback=true;
 await page.getByRole('button',{name:/Review concept/}).click();
 await page.getByRole('button',{name:/Continue challenge/}).click();
 await editor.waitFor();if(await editor.inputValue()!==draft)throw Error('Draft lost');result.mock.draftPreserved=true;
 await page.setViewportSize({width:390,height:844});
 await editor.scrollIntoViewIfNeeded();await page.screenshot({path:'qa-artifacts/editor-mobile.png'});
 result.mock.editorOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.getByRole('button',{name:/Review concept/}).click();
 await page.getByRole('button',{name:/Continue challenge/}).waitFor();
 await page.getByRole('heading',{name:'Explore the concept',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:'qa-artifacts/concept-mobile.png'});
 result.mock.conceptOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 const live=await browser.newPage({viewport:{width:1440,height:1000}});live.on('pageerror',e=>result.errors.push(e.message));
 await live.goto('http://127.0.0.1:8501/');await live.getByRole('button',{name:/Explore I\/O Harbor/}).waitFor({timeout:30000});
 await live.getByRole('button',{name:/Explore I\/O Harbor/}).click();
 await live.getByRole('combobox',{name:'Subtopic',exact:true}).click();await live.getByRole('option',{name:'input()',exact:true}).click();
 await live.getByRole('button',{name:/Start challenge/}).click();
 try{
  const liveEditor=live.getByRole('textbox',{name:'Python code',exact:true});await liveEditor.waitFor({timeout:60000});
  result.live.generation=true;await liveEditor.fill('pass');await liveEditor.press('Tab');
  await live.getByRole('button',{name:/Run code/}).click();await live.getByRole('button',{name:/Check answer/}).click();
  await live.getByText(/Try again\./).first().waitFor({timeout:30000});result.live.incorrectFeedback=true;
  await live.getByRole('button',{name:/Review concept/}).click();await live.getByRole('button',{name:/Continue challenge/}).click();
  await liveEditor.waitFor();result.live.draftPreserved=await liveEditor.inputValue()==='pass';
 }catch(e){result.live.error=e.message}
 await live.goto('http://127.0.0.1:8501/');
 await live.getByRole('button',{name:/Explore Function Falls/}).click();
 await live.getByRole('button',{name:/Start challenge/}).click();
 await live.getByText(/Advanced challenges are unavailable/).first().waitFor({timeout:15000});
 result.live.advancedUnavailable=true;
 fs.writeFileSync('docs/browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(result.errors.length||result.mock.worlds!==14||result.mock.editorOverflow||result.mock.conceptOverflow||!result.mock.draftPreserved)process.exitCode=1;
 }catch(e){const pages=browser.contexts().flatMap(c=>c.pages());if(pages[0]){await pages[0].screenshot({path:'qa-artifacts/browser-failure.png',fullPage:true});console.log((await pages[0].locator('body').innerText()).slice(-2500))}throw e}
 finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
