const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const result={errors:[]};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>result.errors.push(e.message));
  await page.goto('http://127.0.0.1:8501/');
  await page.getByRole('button',{name:/Explore I\/O Harbor/}).waitFor({timeout:30000});
  const images=page.getByRole('img',{name:/world landscape/});
  await page.waitForFunction(()=>document.querySelectorAll('img[alt$="world landscape"]').length===14);
  result.worldImages=await images.count();
  await images.last().scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('img[alt$="world landscape"]')].every(i=>i.complete&&i.naturalWidth>0));
  result.imagesLoaded=true;
  await page.getByRole('button',{name:/Explore I\/O Harbor/}).scrollIntoViewIfNeeded();
  await page.screenshot({path:'qa-artifacts/worlds-styled-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  result.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.screenshot({path:'qa-artifacts/worlds-styled-mobile.png'});
  if(process.argv.includes('--worlds-only')){
    fs.writeFileSync('docs/world-artwork-results.json',JSON.stringify(result,null,2));
    console.log(JSON.stringify(result));
    if(result.worldImages!==14||!result.imagesLoaded||result.mobileOverflow||result.errors.length)process.exitCode=1;
    return;
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button',{name:/Explore I\/O Harbor/}).click();
  await page.getByRole('combobox',{name:'Subtopic',exact:true}).click();
  await page.getByRole('option',{name:'input()',exact:true}).click();
  await page.getByRole('button',{name:/Start challenge/}).click();
  await page.getByRole('textbox',{name:'Python code',exact:true}).waitFor({timeout:60000});
  const before=await page.locator('[data-testid="stMain"] h3').first().innerText();
  await page.getByRole('button',{name:/Next challenge/}).click();
  await page.waitForFunction(old=>{
    const title=document.querySelector('[data-testid="stMain"] h3')?.innerText;
    return (title&&title!==old)||document.body.innerText.includes('Groq temporarily limited')||document.body.innerText.includes('could not be prepared')||document.body.innerText.includes('The request failed.');
  },before,{timeout:60000});
  const body=await page.locator('body').innerText();
  result.rateLimited=body.includes('Groq temporarily limited');
  result.nextGenerated=!result.rateLimited&&!body.includes('could not be prepared');
  result.failureMessage=body.includes('could not be prepared')?'guard or provider rejected':body.includes('The request failed.')?'unexpected failure':null;
  if(result.failureMessage)result.nextGenerated=false;
  fs.writeFileSync('docs/browser-next-results.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
  if(result.worldImages!==14||!result.imagesLoaded||result.mobileOverflow||result.errors.length||!result.nextGenerated)process.exitCode=1;
 }catch(e){
   result.failure=e.message;
   fs.writeFileSync('docs/browser-next-results.json',JSON.stringify(result,null,2));
   throw e;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
