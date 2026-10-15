import {number,geometry,rad} from './engine.js';
import {solveAutomatic} from './planning.js';
const minimumAngle=(cfg,r)=>Math.max(cfg.minAngle||0,...(r.geometryReferenceBooms||r.usedBooms).map(L=>cfg.minAngles?.[cfg.booms.indexOf(L)]||0));
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

// La geometría puede resolverse aun cuando no exista una capacidad verificable.
// Esta vista previa no consulta la tabla ni habilita el izaje.
export function previewPositionGeometry(known,p){
 const resolved=resolvePosition(known,p);
 if(resolved.radius===''||resolved.boom==='')return null;
 const H=has(known.hookHeight)?number(known.hookHeight,'altura del gancho',.01):null;
 const g=geometry(resolved.radius,resolved.boom,{...p,landingHeight:H??0,loadHeight:0,rigHeight:0});
 const availableHeight=g.tipHeight-number(p.headroom,'reserva de gancho',.01);
 return {radius:resolved.radius,boom:resolved.boom,angle:resolved.angle??g.angle,angleApproximate:resolved.auto.angle,
  hookHeight:H??(availableHeight>0?availableHeight:null),heightApproximate:H===null,geometry:g,verificationEligible:false};
}

export function solvePosition(cfg,p,known){
 if(!['radius','boom','angle'].some(key=>has(known[key]))){const e=Error((has(known.hookHeight)?'La altura sola no define esta posición. ':'')+'Falta completar: ingresá radio R, pluma L o ángulo θ (al menos uno).');e.code='MISSING_POSITION_DATA';throw e;}
 const sourceAngle=cfg.chartAngles?.[String(known.radius)]?.[String(known.boom)],sourceMatch=has(known.angle)&&Number.isFinite(sourceAngle)&&Math.abs(Number(known.angle)-sourceAngle)<=.5;
 if(cfg.geometryUnsupportedBooms?.includes(Number(known.boom))&&(!has(known.radius)||!has(known.boom)))throw Error('Esta extensión requiere radio y longitud de tabla explícitos; el montaje no está documentado para obtenerlos por geometría.');
 const resolved=resolvePosition(sourceMatch?{...known,angle:''}:known,p);if(sourceMatch){resolved.angle=Number(known.angle);resolved.auto.angle=false;}let solved;
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
  const angle=resolved.angle??r.geometry?.angle??r.chartAngle??null,minAngle=minimumAngle(cfg,r);
  const anglePass=Number.isFinite(angle)&&angle<=cfg.maxAngle+1e-8&&angle>=minAngle-1e-8;
  const geometryPass=anglePass&&!!r.geometry&&r.geometry.angle<=cfg.maxAngle+1e-8&&r.geometry.angle>=minAngle-1e-8&&(!r.hasRequiredHeight||r.geometry.reach);
  return {...r,geometryPass,anglePass,minAngle,maxAngle:cfg.maxAngle,angle,angleApproximate:resolved.angle===null,pass:r.pass&&geometryPass};
 });
 const options=fixed?updated:updated.filter(r=>r.pass);
 if(!options.length)throw Error('No hay combinación que cumpla la geometría y el ángulo máximo de esta configuración.');
 return {...solved,chosen:options[0],options,auto:{...solved.auto,...resolved.auto},resolved};
}

export function assessLift(positions,slingResult){
 const slingPass=!!slingResult?.pass;
 const verified=positions.length===2&&positions.every(p=>!!p.result&&!p.estimate&&!p.error&&p.result.documentVerified!==false&&!p.result.geometryUnavailable);
 const cranePass=verified&&positions.every(p=>p.result.pass&&p.result.percent<=75+1e-9);
 const failedSling=!!slingResult&&!slingPass;
 const failedCrane=positions.some(p=>p.result&&!p.result.pass&&(!p.result.geometryUnavailable||p.result.capacityPass===false));
 const status=failedSling||failedCrane?'NO APTO':cranePass&&slingPass?'APTO':positions.some(p=>p.patternMissing)?'PENDIENTE':positions.some(p=>p.error||p.estimate||p.result?.documentVerified===false||p.result?.geometryUnavailable)?'SIN VERIFICAR':'PENDIENTE';
 const numeric=positions.filter(p=>p.result);
 const limiting=numeric.length?numeric.reduce((a,b)=>b.result.percent>a.result.percent?b:a):null;
 return {status,pass:cranePass&&slingPass,cranePass,slingPass,verified,limitingPosition:limiting?.index??null};
}

// Pluma de celosía: no se cambia el montaje de insertos con carga suspendida.
export function solveFixedBoomPositions(cfg,p,knowns){
 if(knowns.length!==2)throw Error('Se requieren las dos posiciones.');
 for(const boom of cfg.booms){
  if(knowns.some(k=>has(k.boom)&&Math.abs(Number(k.boom)-boom)>1e-8))continue;
  try{const solved=knowns.map(k=>{const r=solvePosition(cfg,p,{...k,boom});return {...r,auto:{...r.auto,boom:!has(k.boom)}};});if(solved.every(s=>s.chosen.pass))return solved;}catch{}
 }
 const e=Error('La pluma de celosía debe tener la misma longitud en ambas posiciones. No hay una longitud común que cumpla estos datos; revisá radio, altura y montaje de pluma.');e.code='FIXED_BOOM_CONFLICT';throw e;
}
