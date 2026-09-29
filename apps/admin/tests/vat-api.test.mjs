import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
const { default: client } = await import('../src/app/apiClient.js');
const api = await import('../src/features/vat/api/vat.api.js');
const sid='68ad00000000000000000010', cid='68ad00000000000000000011';
const service={id:sid,client:cid,version:0,serviceCode:'VAT_RETURN_FILING',details:{vat:{stage:'AWAITING_DOCUMENTS'}},packagePrice:{$numberDecimal:'500.05'}};
async function stub(method, response, run) {
 const original=client[method]; const calls=[];
 client[method]=(...args)=>{calls.push(args);return Promise.resolve({data:response});};
 try {await run(calls);} finally {client[method]=original;}
}
test('VAT list and company list use their different pagination and cancellation signal',async()=>{
 const controller=new AbortController();
 await stub('get',{data:[service],page:{number:1,limit:25,hasMore:true}},async(calls)=>{
  const result=await api.listVat({page:1,client:cid},controller.signal);
  assert.equal(result.data[0].packagePrice,'500.05'); assert.equal(result.page.hasMore,true);
  assert.deepEqual(calls[0],['/api/v1/client/services',{params:{page:1,client:cid,serviceCode:'VAT_RETURN_FILING'},signal:controller.signal}]);
 });
 await stub('get',{data:[],page:{page:1,limit:20,total:0,totalPages:0}},async(calls)=>{await api.listCompanies({page:1,search:'Firm'},controller.signal);assert.equal(calls[0][1].params.client,undefined);});
});
test('detail/create/PATCH/action/next-period envelopes normalize separately',async()=>{
 await stub('get',{data:{service,documents:[],reminder:null}},async()=>assert.equal((await api.detailVat(sid)).service.id,sid));
 await stub('post',{data:service},async(calls)=>{assert.equal((await api.createVat(cid,{company:'company-id'})).id,sid);assert.equal(calls[0][0],`/api/v1/client/${cid}/service`);assert.equal(calls[0][2].vatWrite,true);});
 await stub('patch',{data:service},async(calls)=>{assert.equal((await api.commandVat(sid,'fee',{expectedVersion:0,packagePrice:'1.05'})).service.packagePrice,'500.05');assert.deepEqual(calls[0][1],{expectedVersion:0,packagePrice:'1.05'});});
 await stub('post',{data:{service}},async(calls)=>{await api.commandVat(sid,'request-review',{expectedVersion:0});assert.equal(calls[0][0],`/api/v1/client/service/${sid}/vat/request-review`);});
 await stub('post',{data:{service,nextService:{...service,id:'next'}}},async()=>assert.equal((await api.commandVat(sid,'create-next-period',{expectedVersion:0})).nextService.id,'next'));
});
test('uploads send one plural documents field, retained IDs, no version or multipart header',async()=>{
 const file=new File(['first'],'evidence.txt');
 await stub('post',{data:{id:'retained'}},async(calls)=>{
  assert.equal((await api.uploadVat(service,'SOURCE',file)).id,'retained');
  const form=calls[0][1]; assert.equal(form.getAll('documents').length,1);assert.equal(form.get('service'),sid);assert.equal(form.get('purpose'),'SOURCE');assert.equal(form.has('expectedVersion'),false);assert.equal(calls[0][2].headers['Content-Type'],undefined);
  await api.uploadVat(service,'SOURCE',file);assert.equal(calls.length,2); // Explicit replacements get new uploads; never delete an existing file.
 });
 await assert.rejects(api.uploadVat(service,'SOURCE',new File([new Uint8Array(10*1024*1024+1)],'large.bin')));
});
test('malformed and non-JSON responses never look like successful writes',async()=>{
 for(const response of ['<html>Bad gateway</html>',{}, {data:null}, {data:{service:null}}]) await stub('post',response,async()=>assert.rejects(api.commandVat(sid,'request-review',{expectedVersion:0})));
 await stub('post',{data:{service}},async()=>assert.rejects(api.commandVat(sid,'create-next-period',{expectedVersion:0})));
});
test('transport does not replay VAT writes on unauthorized responses',async()=>{
 const original=client.defaults.adapter;let requests=0;
 client.defaults.adapter=async(config)=>{requests++;throw Object.assign(new Error('Unauthorized'),{config,response:{status:401,data:{error:{code:'AUTHENTICATION_REQUIRED'}}}});};
 try{await assert.rejects(api.commandVat(sid,'request-review',{expectedVersion:0}));assert.equal(requests,1);}finally{client.defaults.adapter=original;}
});
test('errors propagate without POST retries or substitute data',async()=>{
 const original=client.post;
 try{for(const status of [401,403,404,409,422,500,undefined]){let count=0;const expected=Object.assign(new Error('failure'),status?{response:{status,data:{error:{code:'TEST'}}}}:{});client.post=async()=>{count++;throw expected;};await assert.rejects(api.commandVat(sid,'prepare',{expectedVersion:0}),(error)=>error===expected);assert.equal(count,1);}}finally{client.post=original;}
});
test('obsolete list reads can be cancelled and cannot overwrite a newer filter cache',async()=>{
 const cache=new QueryClient({defaultOptions:{queries:{retry:false}}});
 const original=client.get;const releases=new Map();const signals=new Map();
 client.get=(_url,{params,signal})=>new Promise((resolve)=>{signals.set(params.stage,signal);releases.set(params.stage,()=>resolve({data:{data:[service],page:{number:1,limit:25,hasMore:false}}}));});
 try{
  const old=cache.fetchQuery({queryKey:['vat-filings','list',{stage:'PREPARING'}],queryFn:({signal})=>api.listVat({stage:'PREPARING'},signal)}).catch(()=>null);
  const recent=cache.fetchQuery({queryKey:['vat-filings','list',{stage:'FILED'}],queryFn:({signal})=>api.listVat({stage:'FILED'},signal)});
  await cache.cancelQueries({queryKey:['vat-filings','list',{stage:'PREPARING'}]});assert.equal(signals.get('PREPARING').aborted,true);
  releases.get('FILED')();await recent;releases.get('PREPARING')();await old;
  assert.equal(cache.getQueryData(['vat-filings','list',{stage:'PREPARING'}]),undefined);
  assert.equal(cache.getQueryData(['vat-filings','list',{stage:'FILED'}]).data[0].id,sid);
 }finally{client.get=original;cache.clear();}
});
