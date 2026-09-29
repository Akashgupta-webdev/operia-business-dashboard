import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedActions, isAdmin, isVat, normalizeDto, minor, decimal, money, apiDate, inputDate, today, overdue, errorInfo, evidenceFor } from '../src/features/vat/utils/vat.js';
import { actionPayload, createPayload } from '../src/features/vat/schemas/vat.js';
const sid = '68ad00000000000000000010', cid = '68ad00000000000000000011', coid = '68ad00000000000000000001';
const doc = (suffix, purpose, service = sid) => ({ id: `68ad000000000000000000${suffix}`, service, client: cid, purpose });
const documents = [doc('02','SOURCE'), doc('03','WORKING_PAPER'), doc('04','APPROVAL'), doc('05','ACKNOWLEDGMENT'), doc('06','TAX_PAYMENT')];
const service = (stage = 'AWAITING_DOCUMENTS', extra = {}) => ({ id: sid, client: cid, company: coid, serviceCode: 'VAT_RETURN_FILING', version: 0, status: 'Pending', details: { vat: { stage, periodStart: '2020-01-01T00:00:00.000Z', periodEnd: '2020-03-31T00:00:00.000Z', revision: 0, history: [], ...extra } } });
const dates = { periodStart: '2020-01-01', periodEnd: '2020-03-31', dueDate: '2020-04-28' };
const company = { id: coid, client: cid, vatTaxRegistrationNumber: '100000000000001' };
test('only active Admin can access; package-only VAT is legacy', () => {
 assert.equal(isAdmin({role:'ADMIN',status:'ACTIVE'}), true);
 for (const user of [null, {}, {role:'AGENT',status:'ACTIVE'}, {role:'ADMIN',status:'INACTIVE'}]) assert.equal(isAdmin(user), false);
 assert.equal(isVat({package:'Quarterly VAT Return Filing Package'}), false);
 assert.equal(isVat(service()), true);
});
test('DTO normalization preserves precision, null, missing and unknown fields', () => {
 const normalized = normalizeDto({ packagePrice: { $numberDecimal:'9999999999999999.99' }, nullable: null, extra: { amount: { $numberDecimal:'-0.20' } } });
 assert.deepEqual(normalized, {packagePrice:'9999999999999999.99',nullable:null,extra:{amount:'-0.20'}});
 assert.equal(normalized.paymentStatus, undefined);
 assert.equal(money(null), 'Not recorded'); assert.equal(money(undefined),'Not recorded');
 assert.equal(money('9999999999999999.99'),'AED 9,999,999,999,999,999.99');
 assert.equal(decimal(minor('0.30') - minor('0.20')),'0.10');
 assert.equal(decimal(minor('-999999999999999.99') - minor('999999999999999.99')),'-1999999999999999.98');
});
test('date-only display is timezone-independent and today uses Dubai', () => {
 for (const tz of ['America/Los_Angeles', 'Pacific/Auckland']) { const previous=process.env.TZ; process.env.TZ=tz; assert.equal(apiDate('2026-06-30T00:00:00.000Z'),'30-06-2026'); assert.equal(inputDate('30-06-2026'),'2026-06-30'); process.env.TZ=previous; }
 assert.equal(today(new Date('2026-06-30T21:00:00Z')),'2026-07-01');
 assert.equal(overdue({...service(),dueDate:today()}),false);
 assert.equal(overdue({...service(),dueDate:'2000-01-01'}),true);
 assert.equal(overdue({...service(),dueDate:'2000-01-01',status:'Completed'}),false);
});
test('creation uses company ID and explicit period without TRN/stage injection', () => {
 const result=createPayload({...dates, packagePrice:'500.05', paymentStatus:'Unpaid', stage:'FILED', company:'wrong'}, company);
 assert.deepEqual(result,{serviceCode:'VAT_RETURN_FILING',category:'Tax & Accounting',package:'Quarterly VAT Return Filing Package',company:coid,status:'Pending',dueDate:'28-04-2020',details:{vat:{periodStart:'01-01-2020',periodEnd:'31-03-2020'}},packagePrice:'500.05',paymentStatus:'Unpaid'});
 for(const trn of ['', '123', '10000000000000x']) assert.throws(()=>createPayload(dates,{...company,vatTaxRegistrationNumber:trn}));
 assert.throws(()=>createPayload({...dates,periodEnd:'2020-02-30'},company));
 assert.throws(()=>createPayload({...dates,dueDate:dates.periodEnd},company));
 assert.throws(()=>createPayload({...dates,packagePrice:'1e3'},company));
 assert.throws(()=>createPayload(dates,{...company,client:'Company name'}));
});
test('guards enforce review order, cancelled precedence, filed lock and reminder state', () => {
 assert(!allowedActions(service()).includes('record-submission'));
 assert(!allowedActions(service('PREPARING')).includes('request-review'));
 assert(allowedActions(service('PREPARING',{calculation:{netVat:'10'}})).includes('request-review'));
 assert(allowedActions(service('INTERNAL_REVIEW')).includes('approve-review'));
 assert(allowedActions(service('AWAITING_CLIENT_APPROVAL')).includes('record-approval'));
 assert(allowedActions(service('READY_TO_FILE')).includes('record-submission'));
 assert.deepEqual(allowedActions({...service('READY_TO_FILE'),status:'Cancelled'}),['reopen','fee']);
 assert.deepEqual(allowedActions(service('FILED',{calculation:{netVat:'0.00'}})),['create-next-period','assign','fee']);
 assert(!allowedActions(service('FILED',{calculation:{netVat:'-1.00'}})).includes('record-tax-payment'));
 assert(allowedActions(service('FILED',{calculation:{netVat:'0.01'}})).includes('record-tax-payment'));
 assert(allowedActions(service(),{state:'PENDING'}).includes('complete-reminder'));
 assert(!allowedActions(service(),{state:'COMPLETED'}).includes('complete-reminder'));
 assert.deepEqual(allowedActions({...service(),version:undefined}),[]);
});
test('preparation requires distinct evidence of the right purpose and filing', () => {
 const values={outputVat:'0.30',recoverableInputVat:'0.20',workingPaper:documents[1].id,sourceDocuments:[documents[0].id]};
 assert.equal(actionPayload('prepare',values,service(),documents).expectedVersion,0);
 for (const outputVat of ['+1','1e5','1,000','1.001','1000000000000000']) assert.throws(()=>actionPayload('prepare',{...values,outputVat},service(),documents));
 assert.throws(()=>actionPayload('prepare',{...values,sourceDocuments:[documents[0].id,documents[0].id]},service(),documents));
 assert.throws(()=>actionPayload('prepare',{...values,workingPaper:documents[0].id},service(),documents));
 assert.throws(()=>actionPayload('prepare',values,service(),documents.map(d=>({...d,service:coid}))));
 assert.equal(evidenceFor([...documents,doc('07','SOURCE',coid)],sid,'SOURCE').length,1);
});
test('cumulative payment permits zero, prevents overpayment and requires replacement reason', () => {
 const filed=service('FILED',{calculation:{netVat:'500.05'},settlement:{document:documents[4].id,amountPaid:'100.00'}});
 const values={amountPaid:'500.05',paidOn:'2020-04-01',document:documents[4].id,reason:' Updated total '};
 assert.equal(actionPayload('record-tax-payment',values,filed,documents).reason,'Updated total');
 for(const amountPaid of ['500.06','-1','1.001']) assert.throws(()=>actionPayload('record-tax-payment',{...values,amountPaid},filed,documents));
 assert.equal(actionPayload('record-tax-payment',{...values,amountPaid:'0'},filed,documents).amountPaid,'0');
 assert.throws(()=>actionPayload('record-tax-payment',{...values,reason:''},filed,documents));
 assert.throws(()=>actionPayload('record-tax-payment',{...values,paidOn:'2020-03-30'},filed,documents));
 assert.throws(()=>actionPayload('record-tax-payment',{...values,paidOn:'9999-12-31'},filed,documents));
});
test('next period, submission, approval, reminders, fee clear and version snapshot', () => {
 const s={...service('FILED'),version:8};
 assert.throws(()=>actionPayload('create-next-period',dates,s));
 assert.deepEqual(actionPayload('create-next-period',{periodStart:'2020-04-01',periodEnd:'2020-06-30',dueDate:'2020-07-28'},s),{expectedVersion:8,periodStart:'01-04-2020',periodEnd:'30-06-2020',dueDate:'28-07-2020'});
 assert.deepEqual(actionPayload('record-approval',{approverName:' Customer ',document:documents[2].id},s,documents),{expectedVersion:8,approverName:'Customer',document:documents[2].id});
 assert.throws(()=>actionPayload('record-submission',{reference:'x',submittedOn:'2020-03-30',document:documents[3].id},s,documents));
 assert.deepEqual(actionPayload('schedule-reminder',{followupDate:'2020-04-01',notes:' first\nsecond '},s),{expectedVersion:8,followupDate:'01-04-2020',notes:['first','second']});
 assert.deepEqual(actionPayload('fee',{}, {...s,packagePrice:'10'}),{expectedVersion:8,packagePrice:null,paymentStatus:null,targetCompletionDate:null,notes:null});
 assert.throws(()=>actionPayload('fee',{},s));
 assert.deepEqual(actionPayload('request-review',{expectedVersion:999,status:'Completed'},s),{expectedVersion:8});
});
test('errors distinguish conflicts, authorization, validation and uncertain writes', () => {
 for(const status of [401,403,404,409,422,429,500]) { const info=errorInfo({response:{status,data:{error:{code:status===409?'VERSION_CONFLICT':'TEST',message:'Failure',details:[{field:'reason',issue:'Required'}]},meta:{correlationId:'support-1'}}}}); assert.equal(info.status,status);assert.equal(info.correlationId,'support-1');assert.equal(info.uncertain,status>=500); }
 assert.match(errorInfo({response:{status:409,data:{error:{code:'VAT_PERIOD_EXISTS'}}}}).message,/cancelled/);
 assert.equal(errorInfo(new Error('Network error')).uncertain,true);
});
