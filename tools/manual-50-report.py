from pathlib import Path
import json,sys,html
from decimal import Decimal
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph,Table,TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
root=Path(__file__).resolve().parents[1]
cases=json.loads((root/'docs/manual-50-results.json').read_text())
assert len(cases)==50 and not any(c['differences'] for c in cases)
output=Path(sys.argv[1] if len(sys.argv)>1 else '/workspace/scratch/23c1586d1529/output/pdf/IzajeLab_50_ejemplos_verificados.pdf')
output.parent.mkdir(parents=True,exist_ok=True)
fonts=Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('DejaVu',str(fonts/'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('DejaVuBold',str(fonts/'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('DejaVu',normal='DejaVu',bold='DejaVuBold')
W,H=A4;blue=HexColor('#292247');purple=HexColor('#6d55a3');muted=HexColor('#566078');green=HexColor('#1c7959');red=HexColor('#a92f3d');amber=HexColor('#a97112');line=HexColor('#dfe3ec')
styles={'normal':ParagraphStyle('normal',fontName='DejaVu',fontSize=9,leading=13,textColor=blue),'small':ParagraphStyle('small',fontName='DejaVu',fontSize=8,leading=11,textColor=blue),'tiny':ParagraphStyle('tiny',fontName='DejaVu',fontSize=7,leading=9.4,textColor=blue)}
cv=canvas.Canvas(str(output),pagesize=A4);cv.setTitle('IzajeLab - 50 ejemplos independientes y comparación');cv.setAuthor('IzajeLab')
page=0
f=lambda v,d=3:format(float(v),f'.{d}f').rstrip('0').rstrip('.').replace('.',',')
pct=lambda v:f(v,6)
models={'sany-src900c':'SRC900C','sany-src1300t':'SRC1300T','sany-scc4500a':'SCC4500A'}
sourcefiles={'sany-src900c':'SRC 900C.pdf','sany-src1300t':'SRC1300T.pdf','sany-scc4500a':'SCC 4500A (1).pdf'}
def para(text,y,x=40,width=W-80,style='normal'):
 p=Paragraph(text,styles[style]);_,height=p.wrap(width,H);p.drawOn(cv,x,y-height);return y-height-7

def header(title,subtitle=''):
 global page
 page+=1;cv.setFillColor(blue);cv.rect(0,H-95,W,95,fill=1,stroke=0);cv.setFillColor(HexColor('#c3b1ee'));cv.setFont('DejaVuBold',9);cv.drawString(40,H-30,'IZAJELAB  /  AUDITORÍA DE CÁLCULOS')
 cv.setFillColor(white);cv.setFont('DejaVuBold',19);cv.drawString(40,H-58,title);cv.setFont('DejaVu',8.5);cv.drawString(40,H-79,subtitle)
 cv.setStrokeColor(line);cv.line(40,37,W-40,37);cv.setFillColor(muted);cv.setFont('DejaVu',7);cv.drawString(40,24,'13/10/2026  |  v4.3.0  |  Masas y capacidades en toneladas (tn)');cv.drawRightString(W-40,24,str(page))
 return H-116

def table(rows,y,widths):
 formatted=[[Paragraph(html.escape(str(cell)),styles['tiny']) for cell in row] for row in rows]
 t=Table(formatted,colWidths=widths,repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#ede8f6')),('ROWBACKGROUNDS',(0,1),(-1,-1),[white,HexColor('#f7f8fc')]),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.7,line),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));_,th=t.wrap(W-80,H);t.drawOn(cv,40,y-th);return y-th-10

y=header('50 ejemplos independientes','Tres PDF del proyecto, cuentas manuales y resultados del programa')
for x,n,label in [(40,'50','casos cotejados'),(215,'44','resultados numéricos'),(390,'6','rechazos correctos')]:
 cv.setFillColor(HexColor('#ede8f6'));cv.roundRect(x,y-90,165,90,10,fill=1,stroke=0);cv.setFillColor(purple);cv.setFont('DejaVuBold',31);cv.drawString(x+16,y-45,n);cv.setFillColor(blue);cv.setFont('DejaVu',10);cv.drawString(x+16,y-68,label)
y-=112
y=para('<b>Resultado: 50/50 coincidencias.</b> Las 44 lecturas habilitadas coinciden en capacidad, peso suspendido, utilización, admisible al 75% y estado de las eslingas. Los otros 6 casos se rechazan como capacidad no verificable.',y)
y=para('Distribución: 17 ejemplos SRC900C, 17 SRC1300T y 16 SCC4500A. Se incluyen apoyos al 100%, 50% y 0%, patrones distintos para una misma longitud, montajes H/HJ, deducciones y medidas intermedias autorizadas.',y)
y=para('<b>Cómo se hizo:</b> se eligieron filas y columnas leyendo las páginas de los PDF. Las capacidades esperadas quedaron transcritas en un archivo independiente. Las sumas y divisiones se resolvieron en toneladas con aritmética decimal, sin consultar el motor ni el catálogo del programa. Después se contrastaron los resultados y se cargaron esos mismos datos en el formulario automatizado.',y)
y=para('La auditoría agregó 50 pruebas del motor y 50 recorridos de formulario. La batería completa aprobó 273 pruebas. Las 2.267 capacidades y 141 columnas de los documentos no se modificaron.',y)
y=para('<b>Cambio de lógica:</b> para cable de acero, el cálculo utiliza la capacidad certificada del conjunto; se eliminó la exigencia de una capacidad individual oculta que no intervenía en la fórmula. Se mantienen la validación del ángulo y el bloqueo si falta la capacidad certificada.',y)
y=para('<b>Cambio de interfaz:</b> toneladas seleccionadas inicialmente en todos los pesos y capacidades; kg disponibles con conversión. La pantalla de eslingas empieza por su peso propio. Peso propio vacío equivale a cero. La carga y ambas capacidades de etiqueta/certificado arrancan vacías. Los análisis anteriores conservan su interpretación en kg.',y)
y=para('La documentación recibida contiene fichas técnicas y tablas de carga. Este trabajo comprueba cálculos de la app; APTO sigue siendo el resultado numérico preliminar para los datos ingresados.',y,style='small')
cv.showPage()
y=header('Criterios de lectura','Reglas aplicadas antes de hacer las cuentas')
criteria=[
('SRC900C','Elegir apertura de estabilizadores, contrapeso y porcentajes de secciones de la columna. PDF 6-8 contienen las páginas impresas 10-15. No hay una regla de intermedios cotejada en estos PDF: para verificar se usan celdas exactas. Ángulo máximo 78°; mínimos específicos por columna cuando figuran.'),
('SRC1300T','Tablas PDF 25-29. La nota 4 de p.29 indica usar el radio y la pluma mayores entre dos valores. Se conserva el patrón de extensión: no se toma el máximo entre columnas de igual longitud. Nota 1: capacidad bruta incluyendo el bloque de gancho. Ángulo máximo 80°.'),
('SCC4500A','Tabla H en p.37 y HJ en p.46. Contrapeso trasero 180 tn y bastidor 50 tn; no mezclar ambos montajes. Misma longitud de celosía en posición inicial y final. Rango de pluma 30°-85°. Las combinaciones largas requieren suspensión intermedia según pp.35/44; cargas mayores a 225 tn requieren doble cabrestante según p.5.'),
('Celdas vacías','Una celda vacía no vale cero ni se sustituye por la vecina arbitrariamente. Si el radio es exacto, se conserva esa fila aunque esté vacía. Si es intermedio en SRC1300T, se lee la fila mayor que prescribe la nota 4.'),
('Estimaciones','En SRC900C/SCC, un radio no habilitado puede mostrar una referencia matemática. Esa referencia no es capacidad publicada y no permite APTO ni validar el límite del 75%.'),
('Eslingas','Para estos 50 ejemplos se supone un lingado simétrico de 2 ramales textiles directos. Capacidad = etiqueta individual × factor de banda: 1,4 hasta 45° y 1,0 por encima de 45° hasta 60°, desde la vertical. La tensión se coteja por equilibrio. Las capacidades de etiqueta de los ejemplos son supuestos de ensayo; no vienen de las tablas de grúa.')]
for title,body in criteria:y=para('<b>'+title+'</b><br/>'+body,y)
y=para('Referencia de factores: SpanSet, Tabla de izaje seguro 87034, sección de eslingas textiles. https://www.spanset.com/uploads/uk/Safe%20Lifting%20Chart%2087034.pdf',y,style='tiny')
cv.showPage()
y=header('Las cuentas y su alcance','Masa suspendida, capacidad y aprobación conjunta')
for t in [
'<b>1. Masa suspendida:</b> M = carga + gancho + peso propio de eslingas/aparejos + accesorios debajo de eslingas + otros suspendidos. El contrapeso de la máquina define la tabla; no se suma como carga suspendida.',
'<b>2. Capacidad disponible:</b> C disponible = C tabulada - deducciones indicadas. No volver a descontar un gancho que ya se sumó a M. Una deducción de prueba representa un ajuste adicional específico, no un porcentaje general de seguridad.',
'<b>3. Grúa:</b> utilización = M / C disponible × 100. Admisible = 0,75 × C disponible. Cumple si M es menor o igual al admisible. El redondeo mostrado no cambia el veredicto.',
'<b>4. Eslingas:</b> carga sobre ramales = carga + accesorios debajo de eslingas. Capacidad conjunta = etiqueta × factor de banda. El gancho de la grúa y el peso propio del aparejo se incluyen en M, pero no se vuelven a sumar a esta carga útil sobre ramales.',
'<b>5. Tensión por ramal:</b> T = (carga sobre eslingas × 9,80665) / (2 × cos β), en kN cuando la masa se expresa en tn. El factor de banda puede ser más conservador que el factor geométrico 2 cos β.',
'<b>6. APTO:</b> requiere ambas posiciones de grúa al 75% o menos y lingado suficiente. Si el lingado falla, el formulario detiene el chequeo de grúa. En la comparación matemática independiente se calcula igualmente la grúa para localizar cuál verificación falla.',
'Los 50 recorridos replican el mismo caso en posición 1 y 2 para aislar cada lectura de tabla. La batería de regresión comprueba adicionalmente posiciones diferentes, la posición gobernante y la longitud común de la SCC.',
'<b>Precisión:</b> cuentas independientes con Decimal; comparación con números de coma flotante del motor y tolerancia 0,0000001 para porcentaje y capacidad en tn. Los resúmenes muestran hasta 6 decimales.',
'<b>Lecturas revisadas:</b> en SRC1300T p.25, R8/L17,3 corresponde a 45 tn con T2/T3/T4 0/46/0 y a 44,8 tn con 0/0/46. En SCC H p.37, R48/L60 son 30,1 tn; 29,4 tn pertenece a L66. Se cotejaron de nuevo los encabezados y pies de columna antes de cerrar el oráculo; el catálogo original era correcto.',
'<b>Límites de la revisión:</b> pruebas automáticas del motor y formularios; no se ensayó el sensor de un teléfono físico ni la operación de las grúas. La geometría de pluma es aproximada, y verificar extremos no verifica todo el recorrido. Montaje, gancho real, enhebrado, suelo, viento, puntos de izaje y certificados se cotejan en obra.'
]:y=para(t,y,style='small')
cv.showPage()
# Resumen completo, dividido en 2 páginas.
for group in [cases[:25],cases[25:]]:
 y=header('Comparación completa',f"Ejemplos {group[0]['id']:02d}-{group[-1]['id']:02d}; utilización en porcentaje")
 rows=[['N° / grúa','R / L (m)','C tabla (tn)','Manual %','App %','Eslingas %','Estado']]
 for c in group:
  e=c['expected'];a=c['actual'];rows.append([str(c['id'])+' '+models[c['model']],f(c['radius'])+' / '+f(c['boom']),f(e['capacityT']) if e['capacityT'] is not None else 'sin verificar',pct(e.get('percent')) if e.get('percent') else '-',pct(a['percent']) if a.get('percent') is not None else '-',pct(e['slingPercent']),e['status']])
 y=table(rows,y,[86,66,64,67,67,67,98]);para('Los valores de grúa con lingado insuficiente pertenecen al cotejo independiente; el formulario los bloquea. Los casos sin capacidad verificable no reciben utilización ni admisible de grúa.',y,style='tiny');cv.showPage()
# Cuatro ejemplos detallados por página.
md=['# IzajeLab - 50 ejemplos independientes - 13/10/2026 - v4.3.0','', '50/50 coincidencias: 44 cálculos numéricos y 6 rechazos correctos. Capacidades transcritas visualmente de los PDF, cuentas independientes en toneladas usando Decimal. Los datos esperados no se extraen del catálogo ni del motor de la app. 273 pruebas automáticas aprobadas.','', 'M = carga + gancho + aparejos + accesorios debajo + otros. C disponible = C tabla - deducciones. Utilización = M/C disponible ×100. Admisible = C disponible ×0,75. Eslingas de ensayo: 2 ramales textiles directos; capacidad = etiqueta × factor de banda (1,4 hasta45°, 1 por encima45° hasta60°). APTO numérico requiere grúa y lingado.','']
for start in range(0,len(cases),4):
 group=cases[start:start+4];y=header('Ejemplos y cuentas',f"Casos {group[0]['id']:02d}-{group[-1]['id']:02d} / referencias de columna separadas")
 for c in group:
  e=c['expected'];a=c['actual'];cardtop=y;cv.setFillColor(HexColor('#f7f8fc'));cv.roundRect(35,y-153,W-70,153,7,fill=1,stroke=0)
  status=e['status'];color=green if status=='APTO' else red if status=='NO APTO' else amber
  cv.setFillColor(color);cv.setFont('DejaVuBold',8.5);cv.drawRightString(W-47,y-17,status)
  title=f"{c['id']:02d}. {models[c['model']]} - R {f(c['radius'])} m / L {f(c['boom'])} m"
  yy=para('<b>'+title+'</b>',y-8,x=47,width=W-94,style='small')
  yy=para(f"Fuente: {sourcefiles[c['model']]}, PDF {c['pdfPage']} / impresa {c['printedPage']}.<br/>{html.escape(a['configuration'])}. {html.escape(c['note'])}",yy,x=47,width=W-94,style='tiny')
  mass=' + '.join(f(c[k]) for k in ['loadT','hookT','rigT','belowT','otherT'])
  line1=f"<b>M:</b> {mass} = {f(e['grossT'])} tn. Orden: carga / gancho / aparejos / debajo / otros."
  yy=para(line1,yy,x=47,width=W-94,style='tiny')
  if e['capacityT'] is not None:
   mathline=f"<b>Tabla:</b> R {f(c['usedRadius'])}, L {f(c['usedBoom'])}: {f(e['capacityT'])} tn. Disponible = {f(e['capacityT'])} - {f(c['deductionT'])} = {f(e['netT'])} tn.<br/><b>Manual:</b> {f(e['grossT'])} / {f(e['netT'])} ×100 = {pct(e['percent'])}%. Admisible = {f(e['allowedT'])} tn. <b>App:</b> {pct(a['percent'])}% (coincide)."
  else:mathline='<b>Grúa:</b> sin capacidad verificable. Manual: rechazar esa lectura. App: SIN VERIFICAR; no asigna utilización ni admisible.'
  yy=para(mathline,yy,x=47,width=W-94,style='tiny')
  slingline=f"<b>Eslingas:</b> {f(e['slingLoadT'])} / ({f(c['wllT'])} × {f(e['factor'])}) ×100 = {pct(e['slingPercent'])}%; app {pct(a['slingPercent'])}%. β {c['beta']}°; tensión {f(e['tensionKn'])} kN/ramal. {'Cumple' if e['slingPass'] else 'No cumple; bloquea chequeo de grúa'}; coincidencia completa."
  yy=para(slingline,yy,x=47,width=W-94,style='tiny')
  assert yy>=cardtop-150,(c['id'],yy,cardtop)
  y-=165
  md += [f"## {title}",f"Fuente: {sourcefiles[c['model']]}, PDF {c['pdfPage']}, impresa {c['printedPage']}. Configuración: {a['configuration']}. {c['note']}",f"M = {mass} = {f(e['grossT'])} tn."]
  if e['capacityT'] is not None:md += [f"Celda: R{f(c['usedRadius'])}/L{f(c['usedBoom'])}; C={f(e['capacityT'])} tn. Disponible: {f(e['capacityT'])} - {f(c['deductionT'])} = {f(e['netT'])} tn. Utilización manual: {f(e['grossT'])}/{f(e['netT'])}×100 = {pct(e['percent'])}%. Admisible al75%: {f(e['allowedT'])} tn. Motor: {pct(a['percent'])}%."]
  else:md += ['Manual y motor: sin capacidad verificable; sin utilización ni admisible.']
  md += [f"Eslingas: {f(e['slingLoadT'])}/({f(c['wllT'])}×{f(e['factor'])})×100 = {pct(e['slingPercent'])}%; motor {pct(a['slingPercent'])}%. β={c['beta']}°; tensión por ramal {f(e['tensionKn'])} kN. Estado conjunto: **{e['status']}**. Sin diferencias.",'']
 cv.showPage()
md+=['## Cambios y alcance','Cable certificado ya no exige WLL individual que no usa. Unidades independientes tn/kg con conversión, capacidad de etiqueta y peso propio vacíos, kg en archivos anteriores. Español en selectores e informe. No se modificaron las capacidades del catálogo.','La SRC1300T aplica la nota4 de p29: siguiente radio y pluma mayores del mismo patrón. SRC900C/SCC verifican celdas exactas; referencias estimadas no aprueban.','Cotejos repetidos de columna: SRC1300T R8/L17,3 =45tn con T2/T3/T4 0/46/0; =44,8tn con0/0/46. SCC H R48/L60 =30,1tn;29,4tn esL66. El catálogo original era correcto.','Pruebas del motor y formulario automatizado. No se ensayó físicamente el sensor ni las grúas; geometría aproximada y chequeo de dos extremos. Ganchos, etiqueta y montaje supuesto del ejemplo se cotejan con la unidad real.','Factores de eslingas: https://www.spanset.com/uploads/uk/Safe%20Lifting%20Chart%2087034.pdf','']
(root/'docs/manual-50-audit.md').write_text('\n\n'.join(md))
cv.save();print(json.dumps({'pdf':str(output),'pages':page,'cases':len(cases)}))
