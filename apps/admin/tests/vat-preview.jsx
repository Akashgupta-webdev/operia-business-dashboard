// Development-only, synthetic UI fixture. Never imported by the production entry point.
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom';
import '@operio/ui/globals.css';
import client from '../src/app/apiClient';
import VatListPage from '../src/features/vat/pages/VatListPage';
import VatCreatePage from '../src/features/vat/pages/VatCreatePage';
import VatDetailPage from '../src/features/vat/pages/VatDetailPage';
if (!import.meta.env.DEV) throw new Error('Development fixture only');
const sid='68ad00000000000000000010', cid='68ad00000000000000000011', coid='68ad00000000000000000001';
const company={id:coid,client:cid,companyName:'Preview Trading LLC',clientName:'Preview Client',vatTaxRegistrationNumber:'100000000000001'};
let service={id:sid,client:cid,company:coid,serviceCode:'VAT_RETURN_FILING',version:0,status:'Pending',dueDate:'2026-07-28T00:00:00.000Z',details:{vat:{trn:company.vatTaxRegistrationNumber,stage:'AWAITING_DOCUMENTS',revision:0,periodStart:'2026-04-01T00:00:00.000Z',periodEnd:'2026-06-30T00:00:00.000Z',history:[]}}};
const docs=['SOURCE','WORKING_PAPER','APPROVAL','ACKNOWLEDGMENT','TAX_PAYMENT'].map((purpose,i)=>({id:`68ad0000000000000000000${i+2}`,client:cid,service:sid,purpose,documentTitle:`Preview ${purpose.toLowerCase()} evidence.pdf`}));
const query=new URLSearchParams(location.search);
let failOnce=query.get('error');
client.defaults.adapter=async(config)=>{
 let data;const path=config.url;const body=typeof config.data==='string'?JSON.parse(config.data):config.data;
 if(path==='/api/v1/me') data={id:'68ad00000000000000000020',role:query.get('role')||'ADMIN',status:query.get('inactive')?'INACTIVE':'ACTIVE'};
 else if(path==='/api/v1/client/companies') return {data:{data:[company],page:{page:1,limit:20,total:1,totalPages:1}},status:200,config,headers:{}};
 else if(path==='/api/v1/client/services') return {data:{data:[service],page:{number:1,limit:25,hasMore:false}},status:200,config,headers:{}};
 else if(path===`/api/v1/client/${cid}`) data={client:{id:cid,name:'Preview Client'},companies:[company]};
 else if(path===`/api/v1/client/${cid}/service`) {service={...service,...body};data=service;}
 else if(path===`/api/v1/client/service/${sid}` && config.method==='get') data={service,documents:docs,reminder:null};
 else if(config.method==='post' && path.includes('/vat/')) {
  if(failOnce){const code=failOnce;failOnce=null;service={...service,version:service.version+1};throw Object.assign(new Error('Preview conflict'),{config,response:{status:409,data:{error:{code,message:'Preview conflict'}}}});}
  const action=path.split('/').at(-1);let vat={...service.details.vat};
  const stages={prepare:'PREPARING','request-review':'INTERNAL_REVIEW','approve-review':'AWAITING_CLIENT_APPROVAL','record-approval':'READY_TO_FILE','record-submission':'FILED',reopen:'PREPARING'};
  if(action==='prepare') {vat.calculation={outputVat:body.outputVat,recoverableInputVat:body.recoverableInputVat,netVat:'500.05',workingPaper:body.workingPaper,sourceDocuments:body.sourceDocuments};vat.revision++;vat.settlement={status:'UNPAID',amountPaid:'0.00'};}
  if(action==='record-approval') vat.approval={name:body.approverName,document:body.document,revision:vat.revision};
  if(action==='record-submission') vat.submission={reference:body.reference,submittedOn:body.submittedOn,acknowledgment:body.document};
  if(action==='record-tax-payment') vat.settlement={amountPaid:body.amountPaid,status:'PAID',paidOn:body.paidOn,document:body.document};
  vat.stage=stages[action]||vat.stage;vat.history=[...vat.history,{action,actor:'Preview Admin',at:new Date().toISOString(),revision:vat.revision}];
  service={...service,version:service.version+1,status:action==='cancel'?'Cancelled':vat.stage==='FILED'?'Completed':'In Progress',details:{vat}};data={service};
 } else throw Error(`Unmocked fixture request: ${config.method} ${path}`);
 return {data:{data:structuredClone(data)},status:200,config,headers:{}};
};
createRoot(document.getElementById('root')).render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={[query.get('view')==='list'?'/vat-filings':query.get('view')==='create'?'/vat-filings/new':`/vat-filings/${sid}`]}><div className="bg-primary/10 p-3 text-center text-sm">Development fixture — synthetic records only · <Link to="/vat-filings">Queue</Link> · <Link to="/vat-filings/new">Create</Link></div><Routes><Route path="/vat-filings" element={<VatListPage/>}/><Route path="/vat-filings/new" element={<VatCreatePage/>}/><Route path="/vat-filings/:serviceId" element={<VatDetailPage/>}/></Routes></MemoryRouter></QueryClientProvider>);
