import {number} from './engine.js';

// Referencia matemática aislada: nunca se usa en lookup, craneCheck ni solveAutomatic.
function estimateAxis(values,value){
 const exact=values.findIndex(x=>Math.abs(x-value)<1e-8);
 if(exact>=0)return {indices:[exact],weights:[1],outside:false};
 if(values.length<2)throw Error('No hay dos valores tabulados contiguos para estimar esta medida.');
 const hi=values.findIndex(x=>x>value),i=hi===0?0:hi<0?values.length-2:hi-1;
 const t=(value-values[i])/(values[i+1]-values[i]);
 return {indices:[i,i+1],weights:[1-t,t],outside:t<0||t>1};
}

export function estimateCapacity(cfg,radius,boom){
 const R=number(radius,'radio para estimación',.01),L=number(boom,'pluma para estimación',.1);
 let radii=cfg.rows.map(row=>row[0]),booms=cfg.booms,rows=cfg.rows;
 const ri=radii.findIndex(x=>Math.abs(x-R)<1e-8),bi=booms.findIndex(x=>Math.abs(x-L)<1e-8);
 // Con un eje exacto, usar solo el tramo publicado de esa fila/columna.
 // Huecos internos se conservan; no se salta una celda vacía para formar la pendiente.
 if(bi>=0){
  const valid=rows.map((row,i)=>row[bi+1]===null?-1:i).filter(i=>i>=0);
  if(!valid.length)throw Error('Esta pluma no tiene capacidades publicadas.');
  rows=rows.slice(valid[0],valid.at(-1)+1);radii=rows.map(row=>row[0]);
 }else if(ri>=0){
  const valid=rows[ri].slice(1).map((v,i)=>v===null?-1:i).filter(i=>i>=0);
  if(!valid.length)throw Error('Este radio no tiene capacidades publicadas.');
  const first=valid[0],last=valid.at(-1);
  booms=booms.slice(first,last+1);rows=rows.map(row=>[row[0],...row.slice(first+1,last+2)]);
 }
 const ra=estimateAxis(radii,R),ba=estimateAxis(booms,L);
 if(ra.indices.length===1&&ba.indices.length===1)return null;
 const cells=ra.indices.flatMap((i,a)=>ba.indices.map((j,b)=>({radius:radii[i],boom:booms[j],capacity:rows[i][j+1],weight:ra.weights[a]*ba.weights[b]})));
 if(cells.some(c=>c.capacity===null||!Number.isFinite(c.capacity)))throw Error('No hay celdas contiguas válidas para estimar; no se atraviesan huecos de tabla.');
 const capacity=cells.reduce((total,c)=>total+c.capacity*c.weight,0);
 if(!Number.isFinite(capacity)||capacity<=0)throw Error('La extrapolación no produce una capacidad matemática positiva.');
 const spanR=radii[ra.indices.at(-1)]-radii[ra.indices[0]]||1,spanL=booms[ba.indices.at(-1)]-booms[ba.indices[0]]||1;
 const distance=c=>Math.hypot((c.radius-R)/spanR,(c.boom-L)/spanL);
 const reference=[...cells].sort((a,b)=>distance(a)-distance(b)||a.capacity-b.capacity)[0];
 return {kind:ra.outside||ba.outside?'extrapolated':'interpolated',method:cells.length===4?'Bilineal sobre cuatro celdas contiguas':'Lineal sobre dos celdas contiguas',radius:R,boom:L,capacity,reference,cells,verificationEligible:false};
}
