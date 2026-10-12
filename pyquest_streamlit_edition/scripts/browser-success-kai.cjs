const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:390,height:844}});
 const result={errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.route('**/characters/animated/kai/happy/**',route=>route.abort());
  await page.goto('http://127.0.0.1:8503/');
  await page.getByRole('link',{name:'Character Studio',exact:true}).click({timeout:30000});
  await page.getByRole('button',{name:'Preview Kai',exact:true}).click();
  await page.getByRole('button',{name:/Save as My Companion/}).click();
  await page.getByText('Your companion and outfit are saved.',{exact:true}).waitFor();
  await page.getByRole('link',{name:'Home',exact:true}).click();
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();
  await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();
  await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});await editor.waitFor();
  await editor.fill('name=input()\nprint("Welcome",name)');
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();
  const modal=page.locator('dialog.success-celebration');await modal.waitFor();
  await page.waitForTimeout(1900);
  result.kaiSelected=await modal.locator('.character-figure').evaluate(f=>f.innerHTML.includes('Kai')||f.innerHTML.includes('kai'));
  result.staticFallback=await modal.locator('.character-figure').evaluate(f=>f.dataset.renderMode==='static-css'||!!f.querySelector('svg'));
  await modal.screenshot({path:'qa-artifacts/success-kai-fallback-mobile.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  result.reducedMotion=await modal.locator('.success-character').evaluate(el=>getComputedStyle(el).animationName==='none');
  await modal.getByRole('button',{name:'Stay on This Question',exact:true}).click();
  const oldPrompt=await page.locator('.quest-task > p:not(.eyebrow)').first().innerText();
  await page.getByRole('button',{name:'Next Question →',exact:true}).click();
  await page.getByText(oldPrompt,{exact:true}).waitFor({state:'detached'});
  await editor.fill('name=input()\nprint("Welcome",name)');await page.getByRole('button',{name:'Check Answer',exact:true}).click();await modal.waitFor();
  result.reducedClass=await modal.evaluate(d=>d.classList.contains('celebration-reduced'));
  result.noConfetti=await modal.locator('.success-confetti i').count()===0;
  await modal.getByRole('button',{name:'Stay on This Question',exact:true}).click();
  await page.evaluate(()=>location.hash='home');await page.getByRole('heading',{name:'Explore the worlds',exact:true}).waitFor();
  await page.reload();await page.getByRole('heading',{name:'Explore the worlds',exact:true}).waitFor();
  result.refreshNoReplay=await modal.count()===0;
  if(result.errors.length||!result.kaiSelected||!result.staticFallback||!result.reducedMotion||!result.reducedClass||!result.noConfetti||!result.refreshNoReplay)throw Error('Kai/reduced-motion QA failed');
 }catch(error){result.failure=error.message;process.exitCode=1;}
 finally{fs.writeFileSync('docs/success-kai-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
