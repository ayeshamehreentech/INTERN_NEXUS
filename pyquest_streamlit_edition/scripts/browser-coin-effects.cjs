const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});
 const result={provider:'isolated mock challenges',errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
 try{
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:8503/_stcore/health')).ok)break}catch{}await page.waitForTimeout(500);}
  await page.addInitScript(()=>{globalThis.qaSoundNotes=0;globalThis.qaAudioRunning=false;const create=AudioContext.prototype.createOscillator,resume=AudioContext.prototype.resume;AudioContext.prototype.createOscillator=function(...a){qaSoundNotes++;return create.apply(this,a)};AudioContext.prototype.resume=function(...a){return resume.apply(this,a).then(()=>{qaAudioRunning=this.state==='running'})};});
  await page.goto('http://127.0.0.1:8503/');await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).waitFor();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.getByRole('link',{name:'⚙ Settings',exact:true}).click();await page.locator('#motion').waitFor();
  if(await page.locator('#motion').isChecked())await page.locator('#motion').uncheck();
  await page.getByRole('link',{name:'Home',exact:true}).click();await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).waitFor();
  result.headerRemoved=!await page.locator('.st-key-native_navigation').isVisible();result.topXPRemoved=!/XP/.test(await page.locator('#wallet').innerText());
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();await page.getByRole('button',{name:'Start Challenge',exact:true}).click();
  const editor=page.getByRole('textbox',{name:'Python code editor',exact:true});await editor.waitFor();await editor.fill('name=input()\nprint("Welcome",name)');
  const figure=page.locator('#active-companion .character-figure');await figure.locator('img').first().waitFor();
  const before=Date.now();await page.locator('#active-companion .character-figure[data-state=blink]').waitFor({timeout:3500});result.fastBlink=Date.now()-before<3000;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();const modal=page.locator('dialog.success-celebration');await modal.waitFor();
  result.flyingCoins=await modal.locator('.success-flying-coin').count();result.soundNotes=await page.evaluate(()=>qaSoundNotes);result.audioRunning=await page.evaluate(()=>qaAudioRunning);
  result.musicOff=await page.getByRole('button',{name:'Music off',exact:true}).count()>0;
  await page.screenshot({path:'qa-artifacts/coin-flight-desktop.png'});
  await modal.getByRole('button',{name:'Stay on This Question',exact:true}).click();await modal.waitFor({state:'detached'});
  const wallet=await page.locator('#wallet').innerText(),notes=result.soundNotes;
  await page.getByRole('button',{name:'Check Answer',exact:true}).click();await page.locator('#action-status').getByText('Ready',{exact:true}).waitFor();
  result.noRewardReplay=wallet===await page.locator('#wallet').innerText();result.noSoundReplay=notes===await page.evaluate(()=>qaSoundNotes);
  await editor.fill('# saved before tips');await page.getByRole('link',{name:'Pro-Tips',exact:true}).click();await page.getByRole('heading',{name:'Pythonist Pro-Tips Vault',exact:true}).waitFor();
  await page.getByRole('link',{name:'← Back to PyQuest',exact:true}).click();
  if(!await editor.isVisible().catch(()=>false)){
   await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click();await page.getByRole('link',{name:'Open practice terminal: input()',exact:true}).click();await page.getByRole('button',{name:'Continue Challenge',exact:true}).click();
  }
  await editor.waitFor();result.navigationWorks=true;result.draftPreserved=await editor.inputValue()==='# saved before tips';result.profilePreserved=await page.locator('#wallet').innerText()===wallet;
  if(result.errors.length||!result.headerRemoved||!result.topXPRemoved||!result.fastBlink||result.flyingCoins<1||result.soundNotes<2||!result.audioRunning||!result.musicOff||!result.noSoundReplay||!result.noRewardReplay||!result.draftPreserved||!result.profilePreserved)throw Error('Coin effects QA assertion failed');
 }catch(error){result.failure=error.message;process.exitCode=1;await page.screenshot({path:'qa-artifacts/coin-effects-failure.png',fullPage:true}).catch(()=>{});}
 finally{fs.writeFileSync('docs/coin-effects-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
