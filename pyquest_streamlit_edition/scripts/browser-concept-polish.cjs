const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const result={errors:[]};page.on('pageerror',error=>result.errors.push(error.message));
 try{
  await page.goto('http://127.0.0.1:8501/');
  await page.getByRole('button',{name:'Open I/O Harbor',exact:true}).click({timeout:30000});
  await page.getByRole('link',{name:'Open practice terminal: print()',exact:true}).click();
  await page.getByText('Make Python say hello',{exact:true}).waitFor();
  result.reference=await page.getByText(/Adapted from your codewithharry/).isVisible();
  await page.screenshot({path:'qa-artifacts/concept-beige-desktop.png',fullPage:true});
  await page.locator('.toolkit-explainer summary').click();
  await page.getByRole('button',{name:'Watch animated explainer',exact:true}).click();
  const video=page.locator('#toolkit-video-player video');
  await video.waitFor({timeout:30000});
  await video.evaluate(v=>new Promise((resolve,reject)=>{if(v.readyState>=1)resolve();else{v.onloadedmetadata=resolve;v.onerror=()=>reject(Error('Video failed to load'));}}));
  result.duration=await video.evaluate(v=>v.duration);
  await video.evaluate(async v=>{v.muted=true;await v.play();});
  await page.waitForTimeout(1000);
  result.playing=await video.evaluate(v=>!v.paused&&v.currentTime>0);
  await video.evaluate(v=>{v.pause();v.currentTime=44;});
  await page.waitForTimeout(300);
  await video.screenshot({path:'qa-artifacts/toolkit-framework-frame.png'});
  result.captions=await video.evaluate(v=>v.textTracks.length===1);
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'qa-artifacts/concept-beige-mobile.png',fullPage:true});
  result.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  result.startButton=await page.getByRole('button',{name:'Start Challenge',exact:true}).isVisible();
  if(result.errors.length||result.mobileOverflow||!result.playing||result.duration<69||!result.reference)throw Error('Concept QA assertion failed');
 }catch(error){result.failure=error.message;process.exitCode=1;}
 finally{fs.writeFileSync('docs/concept-polish-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
})();
