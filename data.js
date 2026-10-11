// Datos numéricos transcritos de publicaciones del fabricante; NO son tablas operativas de una unidad individual.
const sanyBooms=[10.65,14.5,18.3,22.1,25.9,29.7,33.5];
const sanyRows=[
[3,25000,18000,null,null,null,null,null],
[3.5,25000,18000,15000,null,null,null,null],
[4,24300,18000,14900,11000,9200,null,null],
[4.5,21820,17000,14900,11000,9200,null,null],
[5,18900,16500,14500,11000,9150,7500,null],
[5.5,17350,16000,13800,11000,9150,7500,null],
[6,15800,14500,13300,11000,8900,7500,null],
[7,12200,12200,11300,9500,8300,7400,null],
[8,9700,10000,9800,8500,7600,6500,6150],
[9,null,8500,8250,7550,7200,6200,5600],
[10,null,7500,6900,6700,6500,5700,5100],
[11,null,6250,5850,5800,5700,5200,4800],
[12,null,5500,5160,5100,5100,4800,4380],
[13,null,null,4600,4550,4510,4400,4200],
[14,null,null,4000,4000,3950,3900,3850],
[15,null,null,3500,3500,3550,3550,3700],
[16,null,null,null,3200,3150,3150,3150],
[17,null,null,null,2800,2800,2850,2900],
[18,null,null,null,2600,2580,2580,2550],
[19,null,null,null,null,2210,2200,2200],
[20,null,null,null,null,2050,2000,1970],
[21,null,null,null,null,1800,1800,1800],
[22,null,null,null,null,1650,1600,1600],
[23,null,null,null,null,null,1400,1400],
[24,null,null,null,null,null,null,1300],
[25,null,null,null,null,null,null,1100]];
const groveBooms=[9.8,12.2,15.2,18.3,21.3,24.4,27.4,31];
// Se elige tabla 85% SAE, NO DIN/ISO. El 85% es criterio de estabilidad del fabricante, no utilización del proyecto.
const groveRows=[
[2.5,35000,null,null,null,null,null,null,null],
[3,32725,22975,21975,null,null,null,null,null],
[3.5,29000,22975,21975,null,null,null,null,null],
[4,25150,22975,21975,21025,null,null,null,null],
[4.5,22125,22350,21975,20150,null,null,null,null],
[5,19675,19900,20075,18925,17550,null,null,null],
[6,15950,16175,16350,16250,14275,13450,null,null],
[7,13250,13475,13675,13775,12650,12075,9975,null],
[8,null,11450,11625,11725,11250,10725,9530,8375],
[9,null,9835,9900,9885,9780,9405,8470,7980],
[10,null,8420,8545,8545,8360,8060,7625,7350],
[12,null,null,6070,6130,6200,6110,5930,5720],
[14,null,null,null,4525,4620,4670,4635,4475],
[16,null,null,null,3415,3500,3560,3570,3560],
[18,null,null,null,null,2675,2730,2760,2775],
[20,null,null,null,null,null,2090,2130,2160],
[22,null,null,null,null,null,1585,1630,1670],
[24,null,null,null,null,null,null,1220,1265],
[26,null,null,null,null,null,null,null,935],
[28,null,null,null,null,null,null,null,650]];
function config(id,name,booms,rows,extra){return {id,name,booms,rows,basis:'gross',radiusPolicy:'exact',...extra};}
export const CRANES=[{
 id:'sany-stc250',brand:'SANY',model:'STC250 (folleto 2017)',massKg:30000,nominalKg:25000,referenceOnly:true,
 source:{title:'SANY STC250 Truck Crane',url:'https://www.sanyglobal.com/all/d/file/p/2017-01-20/9ab5b183f46b230d01d74ab3a77eda58.pdf',page:'12 (página PDF 7)',revision:'Ruta publicación 2017-01-20',checked:'2026-10-11'},
 notes:'No intercambiable con STC250-IR2, STC250T4 ni otras variantes. Pluma principal, sin plumín. Capacidad bruta asumida para planificación: cotejar deducciones y enhebrado con la tabla operativa de la unidad.',
 configs:[config('main-full','Principal · estabilizadores 100% · giro 360° · contrapeso 3,8 t',sanyBooms,sanyRows,{counterweightKg:3800,outriggers:'100% / transversal 6,2 m',sector:'360°',reeving:[8,8,6,4,4,4,3],extension:'Sección I 100%; II/III/IV: 0,17,34,50,67,84,100% según columna.',maxAngle:80})]
},{
 id:'grove-rt540e',brand:'Grove',model:'RT540E · Latinoamérica · 85% SAE',massKg:27300,nominalKg:35000,referenceOnly:true,
 source:{title:'Grove RT540E Product Guide Metric Latin America',url:'https://www.manitowoc.com/sites/default/files/media/divers/file/2020-01/RT540E-Product-Guide-Metric-Latin-America.pdf',page:'15, tabla inferior 85% (página PDF 15); notas p.14',revision:'Tabla A6-829-104283',checked:'2026-10-11'},
 notes:'Se usa exclusivamente la tabla inferior 85% SAE. No se mezcla con DIN/ISO. La guía advierte que la tabla operativa individual prevalece. Agregar pesos suspendidos y deducciones por accesorios.',
 configs:[config('main-full-sae','Principal · estabilizadores 100% · giro 360° · contrapeso 4,3 t · SAE',groveBooms,groveRows,{counterweightKg:4300,outriggers:'100%',sector:'360°',extension:'Pluma principal telescópica según tabla; sin plumín. Ver patrón de extensión de la unidad.',maxAngle:76,radiusPolicy:'bracket-min'})]
}];
export const BRANDS=['SANY','XCMG','Tadano','Grove','Liebherr','Demag','Fuwa','HIAB','Otra'];
export const REFERENCES=[
...CRANES.map(c=>({title:c.source.title,url:c.source.url,detail:c.source.page})),
{title:'SpanSet · Safe Lifting Chart · 87034',url:'https://www.spanset.com/uploads/uk/Safe%20Lifting%20Chart%2087034.pdf',detail:'Factores de modo para eslingas textiles y cadenas; edición 07/2015.'},
{title:'SpanSet · Instrucciones de uso',url:'https://www.spanset.com/es-es/section/descargas/instrucciones-de-uso',detail:'Consultar instrucciones y etiqueta del producto utilizado.'},
{title:'Tadano GR-300EX-3 · página de fabricante',url:'https://www.tadano.com/latam/es/lifting-equipment/rough-terrain-cranes/gr-300ex-3/',detail:'Referencia de modelo. Sin capacidades precargadas: importar tabla de la unidad.'},
{title:'Tecmaco · proveedor argentino',url:'https://ventas.tecmaco.com.ar/sobre-tecmaco',detail:'Proveedor de varias marcas. Elegir fabricante/modelo real, no Tecmaco como tabla de carga.'}
];
