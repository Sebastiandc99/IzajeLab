import {number,grossMass,craneCheck,geometry,tableAxis} from './engine.js';
const present=v=>v!==''&&v!==null&&v!==undefined;
export function solveAutomatic(cfg,p,known){
 grossMass(p);number(p.limit,'límite',1,75);number(p.deductionKg,'deducciones');number(p.headroom,'reserva de gancho',.01);
 const hasR=present(known.radius),hasL=present(known.boom),hasH=present(known.hookHeight);
 const R=hasR?number(known.radius,'radio',.01):null,L=hasL?number(known.boom,'pluma',.1):null,H=hasH?number(known.hookHeight,'altura del gancho',.01):null;
 if(hasL)tableAxis(cfg.booms,L,'pluma',cfg.boomPolicy||'exact');
 if(hasR)tableAxis(cfg.rows.map(row=>row[0]),R,'radio',cfg.radiusPolicy);
 const minR=present(p.minRadius)?number(p.minRadius,'radio mínimo',.01):cfg.rows[0][0];
 const radii=hasR?[R]:cfg.rows.map(row=>row[0]).filter(r=>r>=minR),booms=hasL?[L]:cfg.booms;
 const options=[];let firstError;
 for(const radius of radii)for(const boom of booms){try{
 const a=craneCheck(cfg,{...p,radius,boom});let g=null;try{g=geometry(radius,boom,{...p,landingHeight:H??0,loadHeight:0,rigHeight:0});}catch{}
 const geometryPass=!hasH||!!g&&g.reach&&g.angle<=cfg.maxAngle;
 if(!(hasR&&hasL)&&(!a.pass||!geometryPass))continue;
 const availableH=g?g.tipHeight-p.headroom:null;
 if(!hasH&&(!Number.isFinite(availableH)||availableH<=0)){if(hasR&&hasL)throw Error('No se puede estimar altura con el pivote ingresado. Revisá los ajustes.');continue;}
 options.push({...a,radius,boom,geometry:g,geometryPass,hookHeight:H??availableH,hasRequiredHeight:hasH,pass:a.pass&&geometryPass});
 }catch(e){firstError??=e;}}
 if(!options.length){if(hasR&&hasL&&firstError)throw firstError;throw Error('No hay una combinación de esta tabla que cumpla los datos cargados y el límite de utilización.');}
 // Con radio conocido: menor pluma. Sin radio: mayor radio tabulado y después menor pluma.
 options.sort((a,b)=>hasR?a.boom-b.boom:b.radius-a.radius||a.boom-b.boom);
 return {chosen:options[0],options,auto:{radius:!hasR,boom:!hasL,hookHeight:!hasH},known:{radius:R,boom:L,hookHeight:H}};
}
