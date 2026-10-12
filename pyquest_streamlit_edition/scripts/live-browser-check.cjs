// A test-only answer inferred from PUBLIC beginner input/output, not hidden fixtures.
const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:'live Groq',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 await page.goto('http://127.0.0.1:8501/');await page.getByRole('button',{name:/Explore I\/O Harbor/}).waitFor({timeout:30000});
 await page.getByRole('button',{name:/Explore I\/O Harbor/}).click();await page.getByRole('combobox',{name:'Subtopic',exact:true}).click();
 await page.getByRole('option',{name:'input()',exact:true}).click();await page.getByRole('button',{name:/Start challenge/}).click();
 const editor=page.getByRole('textbox',{name:'Python code',exact:true});await editor.waitFor({timeout:60000});
 const example=page.locator('[data-testid="stExpander"]').filter({hasText:'Example input / output'});
 const parts=await example.locator('code').allTextContents();
 if(parts.length!==2)throw Error('Unexpected public example layout');
 const values=parts[0].split('\n');let template=parts[1].replaceAll('{','{{').replaceAll('}','}}');
 values.forEach((value,index)=>{if(!value)throw Error('Empty public input cannot be templated');template=template.replaceAll(value,`{value_${index}}`)});
 const code=values.map((_,index)=>`value_${index} = input()`).join('\n')+'\nprint(f'+JSON.stringify(template)+')';
 await editor.fill(code);await editor.press('Tab');await page.getByRole('button',{name:/Run code/}).click();
 await page.getByRole('button',{name:/Check answer/}).click();await page.getByText(/Correct! All checked outputs/).waitFor({timeout:30000});
 result.generated=true;result.correctFeedback=true;
 await page.getByText('XP +100 · Coins +2 · Marks 100/100',{exact:true}).waitFor();result.rewardsVerified=true;
 await page.getByRole('button',{name:/Review concept/}).click();await page.getByRole('button',{name:/Continue challenge/}).click();await editor.waitFor();
 result.reviewPreservesCode=await editor.inputValue()===code;if(!result.reviewPreservesCode)throw Error('Draft lost');
 await page.getByRole('button',{name:/Check answer/}).click();await page.getByText('XP +0 · Coins +0 · Marks 0/100',{exact:true}).waitFor();result.rewardReplaySafe=true;
 await page.getByRole('button',{name:/Use coins/}).click();await page.getByRole('button',{name:'Confirm purchase',exact:true}).click();
 await page.getByText(/100 XP · 0 coins/).waitFor({timeout:30000});result.purchaseVerified=true;
 await page.setViewportSize({width:390,height:844});await editor.scrollIntoViewIfNeeded();
 result.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.screenshot({path:'qa-artifacts/live-editor-mobile.png'});
 await page.getByRole('button',{name:/Review concept/}).click();await page.getByRole('button',{name:/Continue challenge/}).waitFor();
 await page.getByRole('heading',{name:'Explore the concept',exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:'qa-artifacts/live-concept-mobile.png'});
 fs.writeFileSync('docs/live-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(result.errors.length||result.mobileOverflow)process.exitCode=1;
 }catch(error){const pages=browser.contexts().flatMap(context=>context.pages());if(pages[0]){await pages[0].screenshot({path:'qa-artifacts/live-browser-failure.png'});console.log((await pages[0].locator('body').innerText()).slice(-2500))}throw error}
 finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
