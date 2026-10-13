// Oráculos transcritos visualmente de los PDF del proyecto, independientes de data.js.
import test from 'node:test';import assert from 'node:assert/strict';
import {CRANES} from '../data.js';import {craneCheck,lookup,slingCheck} from '../engine.js';import {solvePosition,assessLift} from '../positions.js';
const base={loadKg:1000,hookKg:795,rigKg:100,belowKg:0,otherKg:0,deductionKg:0,limit:75,minRadius:'',pivotHeight:2.5,pivotOffset:0,headroom:1.5};
const config=(model,id)=>CRANES.find(c=>c.id===model).configs.find(f=>f.id===id);
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
const cells=[
 ['900 PDF6 impresa10','sany-src900c','outrigger-6-t1-0',3,12.2,80],
 ['900 PDF6 impresa10 T1 0%','sany-src900c','outrigger-6-t1-0',3,16.55,28],
 ['900 PDF6 impresa10 T1 50%','sany-src900c','outrigger-6-t1-50',3,16.55,51],
 ['900 PDF6 impresa11','sany-src900c','outrigger-6-t1-100',22,47,5.3],
 ['900 PDF6 impresa11 R30','sany-src900c','outrigger-6-t1-100',30,47,2.65],
 ['900 PDF8 estabilizadores0','sany-src900c','outrigger-8-t1-0',6,12.2,12.8],
 ['1300 PDF25','sany-src1300t','full-0-0-0',2.5,13,130],
 ['1300 PDF27 R20','sany-src1300t','full-100-100-100',20,60,9],
 ['1300 PDF27 R22','sany-src1300t','full-100-100-100',22,60,7.7],
 ['1300 PDF27 R30','sany-src1300t','full-100-100-100',30,60,5.3],
 ['1300 PDF29 apoyos0','sany-src1300t','outrigger-29',6,13,24],
 ['4500 PDF37 H nominal','sany-scc4500a','H',6,24,450],
 ['4500 PDF37 H R20','sany-scc4500a','H',20,36,113],
 ['4500 PDF37 H R30','sany-scc4500a','H',30,36,64.5],
 ['4500 PDF46 HJ','sany-scc4500a','HJ',8,48,226]
];
for(const [label,m,id,R,L,tn] of cells)test('lectura manual: '+label,()=>{const f=config(m,id);assert.equal(lookup(f,R,L).capacity,tn*1000);const p={...base,loadKg:tn*1000*.75,hookKg:0,rigKg:0,radius:R,boom:L};const r=craneCheck(f,p);near(r.percent,75);assert.equal(r.pass,true);assert.equal(craneCheck(f,{...p,loadKg:p.loadKg+1}).pass,false);});
test('manual SRC900C R22/L47: masa 3895 kg, 73,490566%; con accesorios 4895 kg, 92,358491%',()=>{const f=config('sany-src900c','outrigger-6-t1-100'),p={...base,loadKg:3000,radius:22,boom:47};let r=craneCheck(f,p);assert.equal(r.gross,3895);near(r.percent,73.49056603773585);assert.equal(r.allowed,3975);assert.ok(r.pass);r=craneCheck(f,{...p,belowKg:1000});assert.equal(r.gross,4895);near(r.percent,92.35849056603773);assert.equal(r.pass,false);});
test('manual deducción de 300kg: 1895 / (5300 - 300) = 37,9%',()=>{const r=craneCheck(config('sany-src900c','outrigger-6-t1-100'),{...base,radius:22,boom:47,deductionKg:300});assert.equal(r.netCapacity,5000);near(r.percent,37.9);assert.equal(r.allowed,3750);});
test('manual SRC1300T: R21/L60 aplica R22 = 7,7tn; 2230kg = 28,961039%',()=>{const r=craneCheck(config('sany-src1300t','full-100-100-100'),{...base,hookKg:1130,radius:21,boom:60});assert.equal(r.capacity,7700);assert.deepEqual(r.usedRadii,[22]);assert.equal(r.derived,true);near(r.percent,28.96103896103896);});
test('manual SCC4500A H: masa12tn, 10,619469% en R20 y 18,604651% en R30; gobierna P2',()=>{const f=config('sany-scc4500a','H'),p={...base,hookKg:10900},a=solvePosition(f,p,{radius:20,boom:36}).chosen,b=solvePosition(f,p,{radius:30,boom:36}).chosen;assert.equal(a.gross,12000);near(a.percent,10.619469026548673);near(b.percent,18.6046511627907);near(a.angle,56.25101140411141);near(b.angle,33.55730976192071);const verdict=assessLift([{index:1,result:a},{index:2,result:b}],{pass:true});assert.ok(verdict.pass);assert.equal(verdict.limitingPosition,2);});
test('manual lingado 3tn con dos ramales WLL4tn y β30: capacidad5,6tn; tensión17kN/ramal',()=>{const r=slingCheck({loadKg:3000,belowKg:0,wllKg:4000,type:'flat',hitch:'legs2',angleMode:'vertical',angle:30});assert.equal(r.assemblyCapacity,5600);near(r.percent,53.57142857142857);near(r.tensionKg,1732.0508075688772);near(r.tensionKn,16.985616,0.00001);
});
test('manual caso SIN capacidad: 900 apoyos0 R22/L47 no se transforma en APTO',()=>{assert.throws(()=>lookup(config('sany-src900c','outrigger-8-t1-100'),22,47),/vacía|fuera del rango/);});
test('ángulo ingresado sobre máximo no se aprueba por tolerancia de coherencia',()=>{for(const [m,id,R,L,A] of [['sany-src900c','outrigger-6-t1-0',3.5,16.55,78.28],['sany-src1300t','full-0-0-0',4.5,25.9,80.48]]){const r=solvePosition(config(m,id),{...base,hookKg:0,rigKg:0},{radius:R,boom:L,angle:A}).chosen;assert.equal(r.anglePass,false);assert.equal(r.pass,false);}});
test('radio mínimo del sitio: radio22/pluma47 no cumple sitio23, aunque sobra capacidad',()=>{const f=config('sany-src900c','outrigger-6-t1-100'),p={...base,minRadius:23};const r=solvePosition(f,p,{radius:22,boom:47}).chosen;assert.equal(r.capacity,5300);assert.equal(r.sitePass,false);assert.equal(r.pass,false);assert.throws(()=>solvePosition(f,p,{radius:22,boom:''}),/mínimo del sitio/);});
test('cable certificado: valida también β y no permite ángulo61 con WLL suficiente',()=>{const p={loadKg:1000,belowKg:0,wllKg:4000,assemblyWll:5000,type:'wire',hitch:'legs2',angleMode:'vertical',angle:61};assert.throws(()=>slingCheck(p),/fuera de rango/);const r=slingCheck({...p,angle:45});assert.equal(r.beta,45);assert.equal(r.pass,true);});
test('manual SRC1300T R10,5/L60: nota4 permite R11=10,5tn aunque R10 esté vacío; no es interpolación',()=>{const f=config('sany-src1300t','full-100-100-100'),r=solvePosition(f,{...base,hookKg:1130},{radius:10.5,boom:60}).chosen;assert.equal(r.capacity,10500);assert.deepEqual(r.usedRadii,[11]);near(r.percent,21.238095238095237);assert.equal(r.pass,true);assert.throws(()=>lookup(f,10,60),/vacía/);});
