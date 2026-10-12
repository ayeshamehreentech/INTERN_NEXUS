// Keep transport failures recoverable without exposing proxy/debug response bodies.
export async function requestJson(path,data,fetcher=fetch){
 let response;
 try{response=await fetcher('/api/'+path,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})}
 catch{throw Error('Connection unavailable. Your code is still here; please try again.')}
 let value;
 try{value=await response.json()}catch{throw Error('The server returned an unreadable response. Please try again.')}
 if(!response.ok){const error=Error(typeof value?.error==='string'?value.error:'The request failed. Please try again.');error.code=value?.code;throw error}
 return value;
}

export function handleEditorKey(event,editor,run){
 // Plain Tab and Shift+Tab retain native focus navigation: no keyboard trap.
 if(event.ctrlKey&&event.key===']'){
  event.preventDefault();editor.setRangeText('    ',editor.selectionStart,editor.selectionEnd,'end');
 }
 if(event.ctrlKey&&event.key==='Enter'){event.preventDefault();run()}
}
