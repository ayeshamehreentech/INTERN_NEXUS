// Serialize/coalesce draft writes before crossing a native Streamlit page boundary.
export class DraftSaver {
 constructor(send){this.send=send;this.pending=new Map();this.tail=Promise.resolve();}
 save(payload){
  const key=JSON.stringify(payload);
  if(this.pending.has(key))return this.pending.get(key);
  const promise=this.tail.catch(()=>{}).then(()=>this.send(payload));
  this.tail=promise;this.pending.set(key,promise);
  const clear=()=>this.pending.delete(key);promise.then(clear,clear);
  return promise;
 }
}
