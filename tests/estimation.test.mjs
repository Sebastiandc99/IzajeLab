import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateCapacity} from '../estimation.js';
import {lookup,craneCheck} from '../engine.js';
import {solveAutomatic} from '../planning.js';
import {CRANES} from './fixtures/mathematical-charts.js';
const sany=CRANES[0].configs[0];
const p={loadKg:100,hookKg:320,rigKg:100,otherKg:0,deductionKg:0,limit:75,minRadius:'',pivotHeight:2.5,pivotOffset:0,headroom:1.5};
test('radio fuera de tabla: proyección 900 kg desde 1300/1100, referencia más cercana 1100',()=>{
 const r=estimateCapacity(sany,26,33.5);assert.equal(r.kind,'extrapolated');assert.equal(r.capacity,900);assert.equal(r.verificationEligible,false);
 assert.equal(r.reference.radius,25);assert.equal(r.reference.boom,33.5);assert.equal(r.reference.capacity,1100);
 assert.deepEqual(r.cells.map(c=>c.capacity),[1300,1100]);assert.equal(r.radius,26);
 // Una carga pequeña tampoco convierte la estimación en capacidad verificable.
 assert.throws(()=>lookup(sany,26,33.5),/fuera del rango/);
 assert.throws(()=>craneCheck(sany,{...p,radius:26,boom:33.5}),/fuera del rango/);
 assert.throws(()=>solveAutomatic(sany,p,{radius:26,boom:33.5,hookHeight:''}),/fuera del rango/);
});
test('pluma fuera de tabla usa pendiente de dos columnas contiguas',()=>{
 const r=estimateCapacity(sany,10,34);assert.equal(r.kind,'extrapolated');assert.ok(Math.abs(r.capacity-5021.052631578947)<1e-8);
 assert.equal(r.reference.capacity,5100);assert.equal(r.reference.boom,33.5);assert.equal(r.cells.length,2);
});
test('ambos ejes fuera: extrapolación bilineal con cuatro celdas de la misma configuración',()=>{
 const f={booms:[10,20],rows:[[3,1000,800],[5,600,400]]},r=estimateCapacity(f,6,22);
 assert.ok(Math.abs(r.capacity-160)<1e-8);assert.equal(r.cells.length,4);assert.equal(r.kind,'extrapolated');assert.equal(r.reference.capacity,400);
 assert.equal(r.verificationEligible,false);assert.equal(r.pass,undefined);assert.equal(r.percent,undefined);
});
test('intermedios son interpolación, celda exacta no inventa una estimación',()=>{
 const r=estimateCapacity(sany,9.5,16);assert.equal(r.kind,'interpolated');assert.equal(r.cells.length,4);
 assert.equal(estimateCapacity(sany,10,18.3),null);
 assert.equal(lookup(sany,9.5,16).capacity,6900); // El cálculo operativo conserva su criterio.
});
test('tramo publicado de una columna exacta permite referencia fuera de su borde sin saltar huecos',()=>{
 const r=estimateCapacity(sany,16,18.3);assert.equal(r.kind,'extrapolated');assert.equal(r.capacity,3000);assert.equal(r.reference.radius,15);
 const f={booms:[10],rows:[[1,1000],[2,null],[3,500]]};assert.throws(()=>estimateCapacity(f,2.5,10),/huecos/);
});
test('faltantes, huecos del rectángulo, pendiente ausente y proyección no positiva no dan número',()=>{
 assert.throws(()=>estimateCapacity(sany,26,34),/huecos/);
 assert.throws(()=>estimateCapacity({booms:[10],rows:[[3,1000]]},4,10),/dos valores/);
 assert.throws(()=>estimateCapacity(sany,40,33.5),/positiva/);
 for(const v of ['',null,NaN,Infinity,-1])assert.throws(()=>estimateCapacity(sany,v,33.5));
});
