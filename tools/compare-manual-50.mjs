// Oráculo: capacidades transcritas de PDF y cuentas Decimal independientes.
import fs from 'node:fs';
import {CRANES} from '../data.js';
import {craneCheck,slingCheck} from '../engine.js';
import {solvePosition,assessLift} from '../positions.js';
const cases=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/manual-50.json',import.meta.url)));
export function compareManualCases(){return cases.map(c=>{
 const cfg=CRANES.find(x=>x.id===c.model).configs.find(x=>x.id===c.config),p={loadKg:c.loadT*1000,hookKg:c.hookT*1000,rigKg:c.rigT*1000,belowKg:c.belowT*1000,otherKg:c.otherT*1000,deductionKg:c.deductionT*1000,limit:75,minRadius:'',pivotHeight:2.5,pivotOffset:0,headroom:1.5};
 const sling=slingCheck({...p,type:'flat',hitch:'legs2',wllKg:c.wllT*1000,angleMode:'vertical',angle:c.beta,span:3,equalized:false});
 let result=null,error=null,lookupResult=null;
 try{lookupResult=craneCheck(cfg,{...p,radius:c.radius,boom:c.boom});result=solvePosition(cfg,p,{radius:c.radius,boom:c.boom}).chosen;}catch(e){error=e.message;}
 const assessment=assessLift(result?[{index:1,result},{index:2,result}]:[{index:1,error},{index:2,error}],sling);
 const diffs=[];const near=(name,a,b)=>{if(!Number.isFinite(a)||Math.abs(a-Number(b))>1e-7)diffs.push(`${name}: app ${a}, manual ${b}`);};
 near('carga eslingas tn',sling.load/1000,c.expected.slingLoadT);near('capacidad eslingas tn',sling.assemblyCapacity/1000,c.expected.slingCapacityT);near('uso eslingas %',sling.percent,c.expected.slingPercent);near('tensión kN',sling.tensionKn,c.expected.tensionKn);
 if(sling.pass!==c.expected.slingPass)diffs.push('veredicto eslingas');
 if(c.expected.capacityT===null){if(result||lookupResult)diffs.push('se verificó una celda inexistente/no habilitada');}
 else if(!result){diffs.push('sin resultado: '+error);}else{
  for(const [name,a,b] of [['tabla tn',result.capacity/1000,c.expected.capacityT],['masa tn',result.gross/1000,c.expected.grossT],['disponible tn',result.netCapacity/1000,c.expected.netT],['admisible tn',result.allowed/1000,c.expected.allowedT],['uso %',result.percent,c.expected.percent]])near(name,a,b);
  if(result.pass!==c.expected.cranePass)diffs.push('veredicto grúa');
  if(result.usedRadii[0]!==c.usedRadius||result.usedBooms[0]!==c.usedBoom)diffs.push('celda de referencia incorrecta');
 }
 if(assessment.status!==c.expected.status)diffs.push(`estado conjunto: ${assessment.status} / ${c.expected.status}`);
 return {...c,actual:{configuration:cfg.name,extension:cfg.extensionByBoom?.find(p=>p.boom===c.usedBoom)?.pattern||null,capacityT:result?.capacity/1000,percent:result?.percent,cranePass:result?.pass,slingPercent:sling.percent,slingPass:sling.pass,status:assessment.status,error},differences:diffs};
});}
if(process.argv[1]===new URL(import.meta.url).pathname){const results=compareManualCases();console.log(JSON.stringify({total:results.length,numeric:results.filter(c=>c.expected.capacityT!==null).length,matches:results.filter(r=>!r.differences.length).length,differences:results.filter(r=>r.differences.length).map(r=>({id:r.id,differences:r.differences}))},null,2));if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(results,null,2)+'\n');if(results.some(r=>r.differences.length))process.exitCode=1;}
