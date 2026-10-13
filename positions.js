import {number,geometry,rad} from './engine.js';
import {solveAutomatic} from './planning.js';
const minimumAngle=(cfg,r)=>Math.max(cfg.minAngle||0,...r.usedBooms.map(L=>cfg.minAngles?.[cfg.booms.indexOf(L)]||0));
const has=v=>v!==''&&v!==null&&v!==undefined;

// Geometría rígida aproximada. θ se mide desde la horizontal; no es β del lingado.
export function resolvePosition(known,p){
 const R=has(known.radius)?number(known.radius,'radio de grúa',.01):null;
 const L=has(known.boom)?number(known.boom,'longitud de pluma',.1):null;
 const A=has(known.angle)?number(known.angle,'ángulo de pluma desde horizontal',0,90):null;
 const offset=number(p.pivotOffset,'offset del pivote',-20,20);
 let radius=R,boom=L;
 if(A!==null&&R!==null&&L!==null){
  const g=geometry(R,L,{...p,landingHeight:0,loadHeight:0,rigHeight:0});
  if(Math.abs(g.angle-A)>.5+1e-9){const e=Error(`Radio, pluma y ángulo no son coherentes: la geometría aproximada da ${g.angle.toFixed(2)}°, pero ingresaste ${A}°. Revisá los datos o dejá el ángulo vacío.`);e.code='ANGLE_CONFLICT';throw e;}
 }else if(A!==null&&L!==null){radius=number(offset+L*Math.cos(rad(A)),'radio obtenido desde pluma y ángulo',.01);}
 else if(A!==null&&R!==null){
  if(Math.cos(rad(A))<1e-8){const e=Error('Con pluma a 90° no se puede obtener su longitud desde un radio horizontal. Ingresá la pluma.');e.code='ANGLE_CONFLICT';throw e;}
  boom=number((R-offset)/Math.cos(rad(A)),'pluma obtenida desde radio y ángulo',.1);
 }
 return {radius:radius??'',boom:boom??'',angle:A,auto:{radius:R===null,boom:L===null,angle:A===null}};
}

export function solvePosition(cfg,p,known){
 if(!['radius','boom','angle'].some(key=>has(known[key]))){const e=Error((has(known.hookHeight)?'La altura sola no define esta posición. ':'')+'Falta completar: ingresá radio R, pluma L o ángulo θ (al menos uno).');e.code='MISSING_POSITION_DATA';throw e;}
 const resolved=resolvePosition(known,p);let solved;
 if(resolved.angle!==null&&resolved.radius===''&&resolved.boom===''){
  const options=[];let reason;
  for(const boom of cfg.booms){try{
   const radius=number(Number(p.pivotOffset)+boom*Math.cos(rad(resolved.angle)),'radio obtenido desde ángulo',.01);
   if(has(p.minRadius)&&radius<number(p.minRadius,'radio mínimo',.01))continue;
   const trial=solveAutomatic(cfg,p,{radius,boom,hookHeight:known.hookHeight});
   options.push(...trial.options.filter(r=>r.pass&&r.geometry&&r.geometry.angle<=cfg.maxAngle+1e-8&&r.geometry.angle>=minimumAngle(cfg,r)-1e-8));
  }catch(e){reason??=e;}}
  if(!options.length)throw Error(`No hay combinación verificable con ese ángulo de pluma.${reason?' '+reason.message:''}`);
  options.sort((a,b)=>b.radius-a.radius||a.boom-b.boom);
  solved={chosen:options[0],options,auto:{radius:true,boom:true,hookHeight:!has(known.hookHeight)}};
 }else solved=solveAutomatic(cfg,p,{radius:resolved.radius,boom:resolved.boom,hookHeight:known.hookHeight});
 const fixed=resolved.radius!==''&&resolved.boom!=='';
 const updated=solved.options.map(r=>{
  const geometryPass=!!r.geometry&&r.geometry.angle<=cfg.maxAngle+1e-8&&r.geometry.angle>=minimumAngle(cfg,r)-1e-8&&(!r.hasRequiredHeight||r.geometry.reach);
  return {...r,geometryPass,angle:resolved.angle??r.geometry?.angle??null,angleApproximate:resolved.angle===null,pass:r.pass&&geometryPass};
 });
 const options=fixed?updated:updated.filter(r=>r.pass);
 if(!options.length)throw Error('No hay combinación que cumpla la geometría y el ángulo máximo de esta configuración.');
 return {...solved,chosen:options[0],options,auto:{...solved.auto,...resolved.auto},resolved};
}

export function assessLift(positions,slingResult){
 const slingPass=!!slingResult?.pass;
 const verified=positions.length===2&&positions.every(p=>!!p.result&&!p.estimate&&!p.error);
 const cranePass=verified&&positions.every(p=>p.result.pass&&p.result.percent<=75+1e-9);
 const failedSling=!!slingResult&&!slingPass;
 const failedCrane=positions.some(p=>p.result&&!p.result.pass);
 const status=failedSling||failedCrane?'NO APTO':cranePass&&slingPass?'APTO':positions.some(p=>p.error||p.estimate)?'SIN VERIFICAR':'PENDIENTE';
 const numeric=positions.filter(p=>p.result);
 const limiting=numeric.length?numeric.reduce((a,b)=>b.result.percent>a.result.percent?b:a):null;
 return {status,pass:cranePass&&slingPass,cranePass,slingPass,verified,limitingPosition:limiting?.index??null};
}
