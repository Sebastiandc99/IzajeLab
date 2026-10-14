# Lecturas elegidas y transcritas de las imágenes PDF por el revisor.
# No importa ni lee data.js, engine.js ni sus resultados.
from decimal import Decimal as D
from pathlib import Path
import json,math
rows=[
# modelo,config,PDF,p.impresa,R,L,Ct,carga,gancho,aparejos,bajo,otros,deduccion,WLL,beta,nota
('900','outrigger-6-t1-0',6,10,3,12.2,80,40,.795,.1,.2,0,0,40,30,'Pluma básica, apoyos 100%'),
('900','outrigger-6-t1-0',6,10,4,16.55,28,19,.795,.1,0,0,0,20,30,'T1 0%; longitud repetida'),
('900','outrigger-6-t1-50',6,10,4,16.55,51,30,.795,.2,0,0,.5,30,30,'T1 50%; no usar la columna de T1 0%'),
('900','outrigger-6-t1-0',6,10,10,20.9,15.5,10,.795,.1,.5,.2,.3,10,45,'Sumar todos los suspendidos y separar deducción'),
('900','outrigger-6-t1-100',6,10,16,25.25,8,5,.795,.1,0,0,0,5,50,'Banda de eslingas 45–60°: factor 1'),
('900','outrigger-6-t1-100',6,11,22,47,5.3,3.08,.795,.1,0,0,0,4,30,'Límite exacto 75%'),
('900','outrigger-6-t1-100',6,11,30,47,2.65,1.5,.795,.1,0,0,0,2,30,'Supera 75% aun con eslingas suficientes'),
('900','outrigger-6-t1-100',6,11,20,38.3,6.1,3,.795,.1,.4,0,.2,3,30,'Deducción de 0,2 tn sin volver a descontar el gancho'),
('900','outrigger-7-t1-0',7,12,4,12.2,61,40,.795,.2,0,0,0,40,30,'Apoyos al 50%'),
('900','outrigger-7-t1-50',7,12,8,16.55,19.6,13,.795,.1,0,0,0,13,30,'Apoyos 50%, T1 50%'),
('900','outrigger-7-t1-100',7,13,22,47,2.9,1.28,.795,.1,0,0,0,2,30,'Otro límite exacto 75%, apoyos 50%'),
('900','outrigger-8-t1-0',8,14,6,12.2,12.8,8,.795,.1,0,0,0,8,30,'Vigas retraídas; no usar capacidad de apoyos extendidos'),
('900','outrigger-8-t1-50',8,14,10,16.55,3.9,2,.795,.1,0,0,0,1,30,'Grúa cumple; eslingas no cumplen'),
('900','outrigger-8-t1-100',8,15,16,47,1.2,.5,.16,.03,.1,0,.02,1,30,'Gancho de bola de 8 tn supuesto: 0,16 tn'),
('900','outrigger-8-t1-100',8,15,22,47,None,1,.795,.1,0,0,0,2,30,'Celda vacía: sin capacidad'),
('900','outrigger-6-t1-100',6,11,22.5,47,4.2,1,.795,.1,0,0,0,2,30,'Criterio del proyecto: radio 24, capacidad 4,2 tn'),
('900','outrigger-6-t1-100',6,11,40,47,None,1,.795,.1,0,0,0,2,30,'Fuera del rango tabulado'),
('1300','full-0-0-0',25,25,4,13,87,55,1.13,.2,0,0,0,55,30,'Pluma básica'),
('1300','full-0-0-0',25,25,8,17.3,33.3,20,1.13,.2,0,0,0,20,30,'17,3 m: T2/T3/T4 0/0/0'),
('1300','full-0-0-46',25,25,8,17.3,44.8,30,1.13,.2,0,0,0,30,30,'17,3 m: T2/T3/T4 0/0/46'),
('1300','full-0-46-0',25,25,8,17.3,45,30,1.13,.2,0,0,0,30,30,'17,3 m: T2/T3/T4 0/46/0'),
('1300','full-0-0-0',26,26,14,30.2,11.4,7,1.13,.1,.3,0,0,7,30,'30,2 m, columna 1 p.26'),
('1300','full-92-46-46',26,26,14,30.4,18.7,12,1.13,.2,0,0,.4,12,30,'30,4 m, columna 3 p.26'),
('1300','full-100-100-100',27,27,20,60,9,5,1.13,.1,.5,0,0,5,30,'Pluma completamente extendida'),
('1300','full-100-100-100',27,27,22,60,7.7,5,1.13,.1,.5,0,0,5,30,'Posición más exigente: mismo peso que el ejemplo anterior'),
('1300','full-100-100-100',27,27,10.5,60,10.5,2,1.13,.1,0,0,0,3,30,'Nota 4 p.29: fila 11; fila 10 vacía'),
('1300','full-100-100-100',27,27,21,60,7.7,4,1.13,.1,0,0,0,4,30,'Nota 4 p.29: fila 22'),
('1300','full-0-0-0',26,26,10.2,29,13.6,8,1.13,.1,.2,0,.5,8,30,'Nota 4: radio 11 y pluma 30,2'),
('1300','full-0-0-0',25,25,12.7,25.5,13.8,8,1.13,.1,0,.2,.3,8,30,'Nota 4: radio 14 y pluma 25,9'),
('1300','outrigger-28',28,28,8,39,24.3,16,1.13,.1,0,0,0,16,30,'Estabilizadores 50%'),
('1300','outrigger-28',28,28,22,60,6.1,3.4,1.13,.1,.2,0,.1,4,30,'Estabilizadores 50%, deducción separada'),
('1300','outrigger-29',29,29,8,21.6,17.3,10,1.13,.1,0,0,0,10,30,'Estabilizadores retraídos'),
('1300','outrigger-29',29,29,24,60,2.6,.5,.18,.02,0,0,0,1,30,'Gancho de bola de 8 tn supuesto: 0,18 tn'),
('1300','full-100-100-100',27,27,10,60,None,1,1.13,.1,0,0,0,2,30,'Fila 10 exacta vacía: no saltar a fila 11'),
('4500','H',37,37,6,24,450,250,10.9,1,0,0,0,250,30,'Más de 225 tn requiere doble cabrestante; chequeo numérico condicionado'),
('4500','H',37,37,10,48,259,160,10.9,1,2,0,1,160,30,'H con contrapeso trasero 180 + bastidor 50'),
('4500','H',37,37,20,36,113,70,10.9,.5,1,0,0,70,30,'H R20/L36'),
('4500','H',37,37,30,36,64.5,40,10.9,.5,1,0,0,40,30,'H R30/L36: segunda posición puede no cumplir'),
('4500','H',37,37,40,48,41.9,20,10.9,.5,0,0,1,20,30,'Pluma más larga'),
('4500','H',37,37,48,60,30.1,10,10.9,.5,0,0,0,10,30,'Alcance largo'),
('4500','H',37,37,72,84,10,1,10.9,.1,0,0,0,2,30,'El gancho pesado hace superar el 75%; suspensión intermedia requerida'),
('4500','H',37,37,12,24,236,150,10.9,.5,0,1,2,150,30,'Otros suspendidos y deducción'),
('4500','HJ',46,46,8,48,226,140,10.9,.5,0,0,0,140,30,'HJ no es H para la misma longitud'),
('4500','HJ',46,46,20,72,108,60,10.9,.5,.5,0,0,60,30,'HJ: suspensión intermedia requerida desde 72 m'),
('4500','HJ',46,46,30,96,60.5,30,10.9,.5,0,0,.5,30,30,'HJ pluma 96 m'),
('4500','HJ',46,46,60,96,19.4,4,10.9,.1,0,0,0,4,30,'HJ R60/L96'),
('4500','HJ',46,46,80,96,4.1,1.5,.9,.1,0,0,.1,2,30,'Gancho de bola de 16 tn supuesto: 0,9 tn'),
('4500','H',37,37,8,24,369,100,10.9,1,0,0,0,50,30,'Grúa cumple; eslingas insuficientes'),
('4500','H',37,37,8,84,None,1,10.9,.1,0,0,0,2,30,'Celda vacía para pluma larga y radio corto'),
('4500','HJ',46,46,31,96,55.7,1,10.9,.1,0,0,0,2,30,'Criterio del proyecto: radio 32, capacidad 55,7 tn')]
assert len(rows)==50
out=[]
for i,(m,cfg,p,pr,R,L,C,W,H,A,B,O,Ded,S,beta,note) in enumerate(rows,1):
 d=lambda x:D(str(x))
 gross=d(W)+d(H)+d(A)+d(B)+d(O)
 factor=d(1.4 if beta<=45 else 1)
 slingload=d(W)+d(B);slingcap=d(S)*factor;slingpass=slingload<=slingcap
 expected={'grossT':str(gross),'slingLoadT':str(slingload),'slingCapacityT':str(slingcap),'slingPercent':str(slingload/slingcap*100),'slingPass':slingpass,'factor':str(factor),'tensionKn':float(slingload)*9.80665/(2*math.cos(math.radians(beta)))}
 if C is not None:
  cap=d(C);net=cap-d(Ded);allowed=net*d('.75');percent=gross/net*100
  expected.update({'capacityT':str(cap),'netT':str(net),'allowedT':str(allowed),'percent':str(percent),'cranePass':gross<=allowed,'status':'APTO' if gross<=allowed and slingpass else 'NO APTO'})
 else:expected.update({'capacityT':None,'status':'SIN VERIFICAR'})
 usedR={16:24,50:32,26:11,27:22,28:11,29:14}.get(i,R);usedL={28:30.2,29:25.9}.get(i,L)
 out.append({'id':i,'model':{'900':'sany-src900c','1300':'sany-src1300t','4500':'sany-scc4500a'}[m],'config':cfg,'pdfPage':p,'printedPage':pr,'radius':R,'boom':L,'usedRadius':usedR,'usedBoom':usedL,'loadT':W,'hookT':H,'rigT':A,'belowT':B,'otherT':O,'deductionT':Ded,'wllT':S,'beta':beta,'note':note,'expected':expected})
(Path(__file__).resolve().parents[1]/'tests/fixtures/manual-50.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
