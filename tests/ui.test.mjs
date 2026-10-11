// Smoke tests con DOM mínimo: validan inicialización y flujos, no layout ni navegador real.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const fixture=JSON.parse(fs.readFileSync(new URL('dom-fixture.json',import.meta.url)));
class Element{
 constructor(a){Object.assign(this,a);this.value=a.value??'';this.checked=false;this.disabled=false;this.hidden=Object.hasOwn(a,'hidden');this.type=a.type||a.tag;this.events={};this._html='';this.classList={toggle(){}};}
 set innerHTML(s){this._html=s;if(this.tag==='select'){this.opts=[...s.matchAll(/<option value="([^"]*)">([^<]*)<\/option>/g)].map(m=>({value:m[1],textContent:m[2]}));this.value=this.opts[0]?.value||'';}}
 get innerHTML(){return this._html;}
 get selectedOptions(){return this.opts?.filter(o=>o.value===this.value)||[];}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
 querySelectorAll(){return [];}
}
function boot(){const elements=Object.fromEntries(Object.entries(fixture).map(([id,a])=>[id,new Element(a)]));
 for(const [id,value] of Object.entries({solveMode:'check',unit:'kg',slingType:'flat',hitch:'legs2',angleMode:'vertical',customPolicy:'exact'}))elements[id].value=value;
 const document={getElementById:id=>elements[id],querySelectorAll:()=>[],createElement:()=>({click(){}})};
 const storage=new Map(),ctx={document,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},navigator:{},location:{protocol:'file:'},window:{print(){},confirm:()=>true},console,structuredClone,Intl,Date,Number,Math,JSON,URL,Blob,setTimeout:()=>0,clearTimeout(){}};
 const code=['data.js','engine.js','app.js'].map(name=>fs.readFileSync(new URL(name,root),'utf8').replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=const|function)/g,'')).join('\n');
 vm.createContext(ctx);vm.runInContext(code,ctx,{timeout:2000});return {e:elements,ctx};}
test('UI inicializa ambos resultados y tabla sin excepciones',()=>{const {e}=boot();assert.match(e.craneResult.innerHTML,/55,88/);assert.match(e.slingResult.innerHTML,/89,29/);assert.match(e.loadTable.innerHTML,/10,65/);assert.equal(e.craneModel.value,'sany-stc250');});
test('UI cambia kg a t conservando resultado físico',()=>{const {e}=boot();e.unit.value='t';e.unit.onchange();assert.equal(Number(e.load.value),5);e.calculate.onclick();assert.match(e.craneResult.innerHTML,/55,88/);});
test('UI búsqueda de radio con pluma elegida',()=>{const {e}=boot();e.boom.value='14.5';e.solveMode.value='radius';e.solveMode.onchange();e.calculate.onclick();assert.match(e.craneResult.innerHTML,/RADIO MÁXIMO TABULADO/);assert.match(e.craneResult.innerHTML,/>10 <small>m/);assert.match(e.alternatives.innerHTML,/combinaciones/);});
test('UI fallo no conserva un resultado viejo',()=>{const {e}=boot();e.load.value='-5';e.calculate.onclick();assert.match(e.craneResult.innerHTML,/No se puede emitir resultado/);assert.equal(e.craneDiagram.innerHTML,'');});
test('UI marca sin tabla no fabrica capacidad',()=>{const {e}=boot();e.brand.value='Tadano';e.brand.onchange();e.calculate.onclick();assert.match(e.craneResult.innerHTML,/No hay tabla numérica/);assert.equal(e.calculate.disabled,true);});
test('UI eslingas rechaza β fuera de rango y conserva límites',()=>{const {e}=boot();e.slingAngle.value='61';e.calculateSling.onclick();assert.match(e.slingResult.innerHTML,/Sin resultado de eslingado/);assert.equal(e.useSlingHeight.disabled,true);});
