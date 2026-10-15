// Helpers de geometría y sensor: unidades m, kg, grados. No crean datos de sensor.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function phoneInclinationFromGravity(g){
 if(!g||![g.x,g.y,g.z].every(v=>typeof v==='number'&&Number.isFinite(v)))return null;
 const norm=Math.hypot(g.x,g.y,g.z);if(norm<7.5||norm>12)return null;
 // Eje Y físico del teléfono: borde largo. Independiente de la rotación de pantalla.
 return Math.asin(clamp(Math.abs(g.y)/norm,0,1))*180/Math.PI;
}
export function phoneInclinationFromOrientation(beta){
 if(typeof beta!=='number'||!Number.isFinite(beta))return null;
 return Math.asin(Math.abs(Math.sin(beta*Math.PI/180)))*180/Math.PI;
}
export function sensorReading(samples,now,zero=0){
 const s=samples.filter(v=>now-v.time<=1200&&now>=v.time);
 if(!s.length||now-s.at(-1).time>600)return null;
 const values=s.map(v=>v.angle),theta=clamp(values.reduce((a,b)=>a+b,0)/values.length-zero,0,90);
 const stable=s.length>=8&&s.at(-1).time-s[0].time>=750&&Math.max(...values)-Math.min(...values)<=1.5;
 return {theta,beta:90-theta,stable,fresh:true,count:s.length};
}
export function craneDrawing({radius,boom,pivotHeight=2.5,pivotOffset=0,maxBoom=34,maxRadius=28,hookHeight=0,unknownRadius=false,unknownBoom=false,angleOverride=null}){
 if(!Number.isFinite(radius)||radius<=0||!Number.isFinite(boom)||boom<=0)return null;
 const x=radius-pivotOffset,reachable=x>=0&&x<=boom;
 const tipHeight=reachable?pivotHeight+(Number.isFinite(angleOverride)?x*Math.tan(angleOverride*Math.PI/180):Math.sqrt(Math.max(0,boom*boom-x*x))):pivotHeight;
 const scale=Math.min(640/(Math.max(maxRadius,radius)+5),480/(Math.max(maxBoom+pivotHeight,tipHeight,hookHeight)+1.5));
 const originX=145,groundY=490,pivotX=originX+pivotOffset*scale,pivotY=groundY-pivotHeight*scale;
 const loadX=originX+radius*scale,tipX=reachable?loadX:pivotX+boom*scale,tipY=groundY-tipHeight*scale;
 let hookY=groundY-Math.max(hookHeight,Math.min(tipHeight-2,2))*scale;
 if(hookHeight<=0)hookY=Math.min(groundY-2*scale,tipY+2.5*scale);
 const angle=reachable?(Number.isFinite(angleOverride)?angleOverride:Math.acos(x/boom)*180/Math.PI):null;
 return {scale,originX,groundY,pivotX,pivotY,loadX,tipX,tipY,hookY,angle,reachable,tipHeight,radius,boom,unknownRadius,unknownBoom};
}
