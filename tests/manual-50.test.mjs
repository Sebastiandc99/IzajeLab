import test from 'node:test';
import assert from 'node:assert/strict';
import {compareManualCases} from '../tools/compare-manual-50.mjs';
import {slingCheck} from '../engine.js';
const results=compareManualCases();
for(const r of results)test(`manual ${String(r.id).padStart(2,'0')}: ${r.model} / ${r.config} / R${r.radius} L${r.boom}`,()=>{assert.deepEqual(r.differences,[]);});
test('50 casos independientes cubren los tres modelos, apoyos, patrones y celdas no verificables',()=>{assert.equal(results.length,50);assert.equal(results.filter(r=>r.model==='sany-src900c').length,17);assert.equal(results.filter(r=>r.model==='sany-src1300t').length,17);assert.equal(results.filter(r=>r.model==='sany-scc4500a').length,16);assert.equal(results.filter(r=>r.expected.capacityT===null).length,6);});
test('cable certificado no exige una capacidad individual oculta que no usa su fórmula',()=>{const p={type:'wire',hitch:'legs2',loadKg:3000,belowKg:0,wllKg:'',assemblyWll:5000,angleMode:'vertical',angle:30};assert.equal(slingCheck(p).assemblyCapacity,5000);assert.equal(slingCheck(p).pass,true);assert.throws(()=>slingCheck({...p,assemblyWll:''}),/Falta/);assert.throws(()=>slingCheck({...p,angle:61}),/fuera de rango/);});
