const {chromium}=require('C:/Users/mdabd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const result={errors:[]};
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>result.errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8501/');
  await page.getByRole('heading',{name:'Explore the worlds',exact:true}).waitFor({timeout:30000});
  result.home=true;
  await page.screenshot({path:'qa-artifacts/original-ui-home.png',fullPage:true});
  await page.getByRole('link',{name:'Character Studio',exact:true}).click();
  await page.getByRole('heading',{name:'Character Studio',exact:true}).waitFor();
  await page.route('**/app/static/assets/characters/animated/mira/**',route=>route.abort());
  for(const name of ['Byte','Kai','Nova','Mira','Zed']){
   await page.getByRole('button',{name:'Preview '+name,exact:true}).click();
   await page.getByRole('button',{name:'Preview Classic outfit',exact:true}).click();
   await page.getByRole('button',{name:'Preview thinking',exact:true}).click();
   await page.getByRole('button',{name:'Preview happy',exact:true}).click();
   await page.getByRole('button',{name:'Preview motivating',exact:true}).click();
   if(name==='Mira'){
    await page.locator('#studio-companion .character-figure > svg').waitFor();
    result.staticFallback=true;
    await page.locator('.outfit-card > svg').nth(1).waitFor();
    if(await page.locator('.outfit-card > svg').count()!==2)throw Error('Failed-frame outfit fallback missing');
   }
   await page.getByRole('button',{name:'Preview Explorer outfit',exact:true}).click();
  }
  result.charactersVerified=5;
  await page.getByRole('button',{name:'Preview Nova',exact:true}).click();
  await page.getByRole('button',{name:'Preview Explorer outfit',exact:true}).click();
  await page.getByRole('button',{name:'Preview thinking',exact:true}).click();
  await page.getByRole('button',{name:/Save as My Companion/}).click();
  await page.getByText('Your companion and outfit are saved.',{exact:true}).waitFor({timeout:15000});
  result.saved=true;
  await page.screenshot({path:'qa-artifacts/original-ui-studio-desktop.png',fullPage:true});
  await page.getByRole('link',{name:'Home',exact:true}).click();
  await page.getByRole('link',{name:'Character Studio',exact:true}).click();
  await page.getByRole('heading',{name:'Nova',exact:true}).waitFor();
  result.persistence=await page.getByText('✓ ACTIVE COMPANION',{exact:true}).isVisible();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'qa-artifacts/original-ui-studio-mobile.png',fullPage:true});
  result.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.getByRole('link',{name:'Resources',exact:true}).click();
  await page.getByRole('heading',{name:'Learning Resources',exact:true}).waitFor();
  result.resources=true;
  console.log(JSON.stringify(result));
  if(result.errors.length||!result.saved||!result.persistence||result.mobileOverflow)process.exitCode=1;
 }catch(e){result.failure=e.message;await page.screenshot({path:'qa-artifacts/original-ui-failure.png',fullPage:true});console.log((await page.locator('body').innerText()).slice(-1500));process.exitCode=1;}
 finally{fs.writeFileSync('docs/original-ui-browser-results.json',JSON.stringify(result,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
