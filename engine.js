// Motor sin UI. Unidades internas: kg, m y grados; fuerzas reales: kN.
export const G=9.80665, rad=x=>x*Math.PI/180, deg=x=>x*180/Math.PI;
export function number(value,name,min=0,max=Infinity){
 if(value===null||value===undefined||value===''||typeof value==='boolean')throw Error(`Falta ${name}.`);
 const n=Number(value); if(!Number.isFinite(n)||n<min||n>max)throw Error(`${name}: valor fuera de rango (${min} a ${max}).`);return n;
}
export function validateCrane(c){
 if(!c||typeof c!=='object'||!c.id||!c.brand||!c.model||!c.source?.title||!c.source?.page||!Array.isArray(c.configs)||!c.configs.length)throw Error('Faltan identificación, fuente/página o configuraciones de la grúa.');
 number(c.massKg,'masa de grúa',0); number(c.nominalKg,'capacidad nominal',1);
 if(!String(c.source.url||'').match(/^https?:\/\//)&&!c.source.document)throw Error('Indicar URL del manual o nombre/revisión del documento de la unidad.');
 const ids=new Set();
 for(const cfg of c.configs){
 if(ids.has(cfg.id)||!cfg.id||!cfg.name)throw Error('Configuraciones sin identificar o repetidas.');ids.add(cfg.id);
 if(cfg.basis!=='gross')throw Error('Solo se admiten tablas de capacidad bruta; convertir/cotejar antes de importar.');
 if(!['exact','bracket-min','next-larger'].includes(cfg.radiusPolicy))throw Error('Política de radio no válida.');
 if(!['exact','bracket-min','next-larger'].includes(cfg.boomPolicy||'exact'))throw Error('Política de pluma no válida.');
 if((cfg.radiusPolicy==='next-larger'||(cfg.boomPolicy&&cfg.boomPolicy!=='exact'))&&!cfg.intermediateSource)throw Error('Indicá la nota/página del manual que habilita los valores intermedios.');
 if(!cfg.outriggers||!cfg.sector||!cfg.extension)throw Error('Indicar estabilizadores, sector y patrón de extensión.');
 number(cfg.counterweightKg,'contrapeso');number(cfg.maxAngle,'ángulo máximo',1,90);
 if(!Array.isArray(cfg.booms)||!cfg.booms.length||!Array.isArray(cfg.rows)||!cfg.rows.length)throw Error('Tabla vacía.');
 let b=-1;for(const L of cfg.booms){number(L,'pluma',0.1);if(L<=b)throw Error('Plumas deben ser únicas y crecientes.');b=L;}
 if(cfg.reeving&&(!Array.isArray(cfg.reeving)||cfg.reeving.length!==cfg.booms.length||cfg.reeving.some(x=>!Number.isInteger(x)||x<1)))throw Error('Enhebrado inválido.');
 let r=-1;for(const row of cfg.rows){if(!Array.isArray(row)||row.length!==cfg.booms.length+1)throw Error('Cada fila debe tener radio y una celda por pluma.');number(row[0],'radio',0.01);if(row[0]<=r)throw Error('Radios deben ser únicos y crecientes.');r=row[0];for(const v of row.slice(1)){if(v!==null)number(v,'capacidad',0.001,c.nominalKg);}}
 }return c;
}
export function tableAxis(values,value,name,policy='exact'){
 const v=number(value,name,.01),exact=values.findIndex(x=>Math.abs(x-v)<1e-8);
 if(exact>=0)return {bounds:[exact],used:[exact],derived:false};
 const hi=values.findIndex(x=>x>v);
 if(hi<=0)throw Error(`${name}: fuera del rango tabulado (${values[0]} a ${values.at(-1)} m). No hay capacidad verificable fuera de tabla.`);
 if(policy==='exact')throw Error(`${name}: el manual cargado no habilita medidas intermedias. Elegí un valor exacto de la tabla o cargá el criterio del manual de la unidad.`);
 if(!['next-larger','bracket-min'].includes(policy))throw Error('Criterio de tabla no reconocido.');
 return {bounds:[hi-1,hi],used:policy==='next-larger'?[hi]:[hi-1,hi],derived:true};
}
export function lookup(cfg,radius,boom){
 const r=number(radius,'radio',.01),L=number(boom,'pluma',.1);
 const ra=tableAxis(cfg.rows.map(row=>row[0]),r,'radio',cfg.radiusPolicy),ba=tableAxis(cfg.booms,L,'pluma',cfg.boomPolicy||'exact');
 if((ra.derived&&cfg.radiusPolicy==='next-larger'||ba.derived&&(cfg.boomPolicy||'exact')!=='exact')&&!cfg.intermediateSource)throw Error('Falta la nota del manual para resolver estas medidas intermedias.');
 // Ambos límites deben ser válidos: una celda vacía no define un dominio de capacidad.
 const bounds=ra.bounds.flatMap(i=>ba.bounds.map(j=>({radius:cfg.rows[i][0],boom:cfg.booms[j],capacity:cfg.rows[i][j+1]})));
 if(bounds.some(c=>c.capacity===null))throw Error('Celda vacía: no se puede resolver entre celdas no válidas ni extender el alcance de esta configuración.');
 const cells=ra.used.flatMap(i=>ba.used.map(j=>({radius:cfg.rows[i][0],boom:cfg.booms[j],capacity:cfg.rows[i][j+1]})));
 const derived=ra.derived||ba.derived,hasMin=(ra.derived&&cfg.radiusPolicy==='bracket-min')||(ba.derived&&cfg.boomPolicy==='bracket-min');
 return {capacity:Math.min(...cells.map(c=>c.capacity)),usedRadii:ra.used.map(i=>cfg.rows[i][0]),usedBooms:ba.used.map(j=>cfg.booms[j]),boom:L,derived,cells,bounds,
  policySource:derived?cfg.intermediateSource||'Criterio conservador de radios ingresado con la tabla.':'',
  method:!derived?'Celda exacta':hasMin?'Mínimo de celdas contiguas válidas (criterio conservador del manual)':'Siguiente radio/pluma mayor según manual (sin interpolación lineal)'};
}
export function grossMass(p){return number(p.loadKg,'peso de carga',0.001)+number(p.hookKg,'gancho')+number(p.rigKg,'aparejos')+number(p.otherKg,'otros suspendidos');}
export function craneCheck(cfg,p){
 const chart=lookup(cfg,p.radius,p.boom),gross=grossMass(p),limit=number(p.limit,'límite de utilización',1,75)/100,deduction=number(p.deductionKg,'deducciones');
 const netCapacity=chart.capacity-deduction;if(netCapacity<=0)throw Error('Las deducciones anulan la capacidad tabulada.');
 const percent=gross/netCapacity*100,allowed=netCapacity*limit;
 return {...chart,gross,netCapacity,percent,allowed,headroom:allowed-gross,minimumChart:gross/limit+deduction,pass:percent<=limit*100+1e-9,maxPayload:Math.max(0,allowed-gross+Number(p.loadKg))};
}
// Offset positivo: pivote hacia la carga respecto del eje de giro. Altura punta aproximada; no modela flexión/cabezal.
export function geometry(radius,boom,p){
 const x=number(radius,'radio',0.01)-number(p.pivotOffset,'desplazamiento de pivote',-20,20),L=number(boom,'pluma',0.1);
 if(x<0||x>L)throw Error('Geometría no alcanzable con esa pluma y desplazamiento.');
 const angle=deg(Math.acos(x/L)),tipHeight=number(p.pivotHeight,'altura de pivote',0)+Math.sqrt(Math.max(0,L*L-x*x));
 const requiredTip=number(p.landingHeight,'cota base de carga')+number(p.loadHeight,'altura de carga')+number(p.rigHeight,'altura de eslingado')+number(p.headroom,'reserva gancho/cabezal',0.01);
 return {angle,tipHeight,requiredTip,clearance:tipHeight-requiredTip,reach:tipHeight>=requiredTip};
}
export function radiusFromAngle(boom,angle,offset){return number(offset,'desplazamiento de pivote',-20,20)+number(boom,'pluma',0.1)*Math.cos(rad(number(angle,'ángulo pluma',0,90)));}
export function candidates(cfg,p){
 const out=[];
 for(const row of cfg.rows){if(row[0]<number(p.minRadius,'radio mínimo',0.01))continue;for(const L of cfg.booms){if(p.fixedBoom&&Math.abs(L-p.fixedBoom)>1e-8)continue;try{
 const result=craneCheck(cfg,{...p,radius:row[0],boom:L});if(!result.pass)continue;
 let geom=null;if(p.useGeometry){geom=geometry(row[0],L,p);if(!geom.reach||geom.angle>cfg.maxAngle+1e-8)continue;}
 out.push({...result,radius:row[0],boom:L,geometry:geom});
 }catch{ /* Las celdas no alcanzables quedan fuera. Validaciones globales se hacen antes en UI. */ }}}
 return out.sort((a,b)=>b.radius-a.radius||a.boom-b.boom);
}
export function betaFromInput(p){
 let beta;
 if(p.angleMode==='geometry'){
 const reach=number(p.span,'separación',0.001)/2,h=number(p.slingRise,'altura gancho sobre anclajes',0.001);beta=deg(Math.atan2(reach,h));
 }else if(p.angleMode==='length'){
 const half=number(p.span,'separación',0.001)/2,L=number(p.slingLength,'longitud ramal',0.001);if(L<=half)throw Error('La longitud del ramal debe ser mayor que la mitad de la separación.');beta=deg(Math.asin(half/L));
 }else{
 const angle=number(p.angle,'ángulo',0,180);
 if(p.angleMode==='vertical')beta=angle;else if(p.angleMode==='horizontal')beta=90-angle;else if(p.angleMode==='included')beta=angle/2;else throw Error('Tipo de ángulo no válido.');
 }return number(beta,'β respecto de vertical',0,60);
}
export function slingCheck(p){
 const load=number(p.loadKg,'carga sobre eslingas',0.001)+number(p.belowKg,'peso bajo eslingas'),wll=number(p.wllKg,'WLL vertical por eslinga/ramal',0.001);
 const type=p.type,mode=p.hitch;
 if(!['flat','round','chain','wire'].includes(type))throw Error('Tipo de eslinga no válido.');
 if(!['straight','choke','basket','legs2','legs2choke','legs3','legs4','asym2'].includes(mode))throw Error('Configuración no válida.');
 if(type==='wire'){
 const assembly=number(p.assemblyWll,'WLL certificado para configuración y ángulo',0.001);
 return {load,assemblyCapacity:assembly,percent:load/assembly*100,pass:load<=assembly,certifiedOnly:true,notes:['Cable de acero: se usa el WLL del conjunto certificado para este ángulo/amarre; no se aplican factores textiles.']};
 }
 if(type==='chain'&&mode==='basket')throw Error('Cesta de cadena: requiere la tabla del conjunto específico; no se usa factor de cesta textil.');
 let beta=['straight','choke'].includes(mode)?0:betaFromInput(p),n=mode==='legs3'?3:mode==='legs4'?(p.equalized?3:2):mode==='straight'||mode==='choke'?1:2;
 const choke=['choke','legs2choke'].includes(mode)?0.8:1;let bandFactor=n===1?1:n===3?(beta<=45?2.1:1.5):(mode==='basket'&&beta<=7?2:beta<=45?1.4:1);
 let factor=Math.min(bandFactor*choke,n*Math.cos(rad(beta))*choke),tension=load/(n*Math.cos(rad(beta))),details=null;
 if(mode==='asym2'){
 const span=number(p.span,'separación de puntos',0.001),cog=number(p.cog,'CG desde punto izquierdo',0.001,span-0.001),h=number(p.slingRise,'altura gancho',0.001);
 const b1=deg(Math.atan2(cog,h)),b2=deg(Math.atan2(span-cog,h));if(Math.max(b1,b2)>60)throw Error('Algún ramal supera β=60°.');
 const v1=load*(span-cog)/span,v2=load*cog/span,t1=v1/Math.cos(rad(b1)),t2=v2/Math.cos(rad(b2));
 beta=Math.max(b1,b2);tension=Math.max(t1,t2);
 // Asimetría: chequeo independiente de cada ramal; sin habilitar factores de conjunto por reparto uniforme.
 factor=Math.min(load/tension,Math.cos(rad(beta)));n=1;details={b1,b2,v1,v2,t1,t2,L1:Math.hypot(cog,h),L2:Math.hypot(span-cog,h)};
 }
 const capacity=wll*factor,requiredWll=load/factor;
 const reach=Number(p.span)>0?Number(p.span)/2:null;
 const rise=beta===0?null:reach/Math.tan(rad(beta)),length=reach===null?null:(beta===0?null:reach/Math.sin(rad(beta)));
 return {load,beta,horizontal:90-beta,included:2*beta,effectiveLegs:n,factor,assemblyCapacity:capacity,requiredWll,tensionKg:tension,tensionKn:tension*G/1000,percent:load/capacity*100,pass:load<=capacity+1e-8,rise,length,details,notes:[mode==='legs4'&&!p.equalized?'4 ramales: se considera que solo 2 comparten la carga.':mode==='asym2'?'CG desplazado: tensiones por equilibrio; WLL preliminar conservador como 1 ramal a β máximo. Confirmar criterio del fabricante.':'Reparto estático uniforme supuesto.',['choke','legs2choke'].includes(mode)?'Factor 0,8: confirmar geometría del estrangulado en las instrucciones del producto.':'Factores por bandas SpanSet: el certificado del conjunto y sus componentes prevalece.']};
}
