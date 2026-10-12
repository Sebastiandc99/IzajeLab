export const RIGGING_CHOICES=[
 {id:'vertical',hitch:'straight',title:'Vertical',subtitle:'1 eslinga directa',angle:false},
 {id:'choke',hitch:'choke',title:'Estrangulado',subtitle:'1 eslinga abraza la carga',angle:false},
 {id:'basket-parallel',hitch:'basket',title:'Cesta paralela',subtitle:'1 eslinga + balancín',angle:false},
 {id:'basket-angle',hitch:'basket',title:'Cesta con ángulo',subtitle:'1 eslinga, 2 lados',angle:true},
 {id:'two-direct',hitch:'legs2',title:'2 ramales directos',subtitle:'2 puntos de izaje',angle:true},
 {id:'two-choke',hitch:'legs2choke',title:'2 estrangulados',subtitle:'2 eslingas abrazan la carga',angle:true},
 {id:'three-direct',hitch:'legs3',title:'3 ramales',subtitle:'3 puntos de izaje',angle:true},
 {id:'four-direct',hitch:'legs4',title:'4 ramales',subtitle:'4 puntos de izaje',angle:true}
];
export function riggingSVG(id,beta=45,{thumbnail=false,material='flat'}={}){
 const choice=RIGGING_CHOICES.find(c=>c.id===id);if(!choice)return '<text x="350" y="210" text-anchor="middle" font-size="24" fill="#69806a">Elegí un dibujo para ver el lingado.</text>';
 if(choice.angle&&!Number.isFinite(Number(beta)))return '<text x="350" y="220" text-anchor="middle" font-size="25" fill="#a34b36">Revisá el ángulo</text>';
 const parallel=id==='basket-parallel',one=id==='vertical'||id==='choke',b=choice.angle?Math.max(0,Math.min(60,Number(beta)||0)):0;
 const cx=350,hy=65,v=choice.angle?Math.min(205,255/Math.max(Math.tan(b*Math.PI/180),.01)):205;
 const dx=choice.angle?v*Math.tan(b*Math.PI/180):parallel?110:0,ax=cx-dx,bx=cx+dx,y=hy+v;
 const loadW=one?170:parallel?270:Math.max(170,dx*2+65),left=cx-loadW/2,right=cx+loadW/2,bottom=y+65;
 const strap=material==='chain'?'#ad6137':'#e76643',stroke=thumbnail?11:8;
 const line=(x1,y1,x2,y2,leg,dashed=false)=>`<path data-leg="${leg}" d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${strap}" stroke-width="${stroke}" stroke-linecap="round" ${dashed?'stroke-dasharray="11 7"':''}/>`;
 const eye=(x,yy)=>`<circle cx="${x}" cy="${yy}" r="8" fill="#f5f8ef" stroke="${strap}" stroke-width="5"/>`;
 let paths='',eyes='';
 if(id==='vertical'){paths=line(cx,hy,cx,y,'1');eyes=eye(cx,y);}
 if(id==='choke'){paths=line(cx,hy,cx-23,y-4,'1')+`<path d="M${cx-23} ${y-4}Q${left-8} ${y-4} ${left-8} ${y+25}V${bottom+7}H${right+8}V${y+20}Q${right+8} ${y-4} ${cx+23} ${y-4}L${cx-23} ${y+7}" fill="none" stroke="${strap}" stroke-width="${stroke}" stroke-linejoin="round"/>`;eyes=eye(cx-23,y-4);}
 if(id==='basket-parallel'){paths=`<path d="M350 65L240 105M350 65L460 105" fill="none" stroke="#315746" stroke-width="7"/><rect x="225" y="100" width="250" height="16" rx="4" fill="#315746"/>`+line(240,116,240,y,'1')+line(460,116,460,y,'2')+`<path d="M240 ${y}V${bottom+10}H460V${y}" fill="none" stroke="${strap}" stroke-width="${stroke}" stroke-linejoin="round"/>`;eyes=eye(240,116)+eye(460,116);}
 if(id==='basket-angle'){paths=line(cx,hy,ax,y,'1')+line(cx,hy,bx,y,'2')+`<path d="M${ax} ${y}V${bottom+10}H${bx}V${y}" fill="none" stroke="${strap}" stroke-width="${stroke}" stroke-linejoin="round"/>`;}
 if(['two-direct','two-choke','three-direct','four-direct'].includes(id)){paths=line(cx,hy,ax,y,'1')+line(cx,hy,bx,y,'2');eyes=eye(ax,y)+eye(bx,y);}
 if(id==='three-direct'){paths+=line(cx,hy,cx,y-25,'3',true);eyes+=eye(cx,y-25);}
 if(id==='four-direct'){paths+=line(cx,hy,cx-dx*.6,y-25,'3',true)+line(cx,hy,cx+dx*.6,y-25,'4',true);eyes+=eye(cx-dx*.6,y-25)+eye(cx+dx*.6,y-25);}
 if(id==='two-choke'){paths+=`<ellipse cx="${ax}" cy="${y+30}" rx="21" ry="${40}" fill="none" stroke="${strap}" stroke-width="${stroke}"/><ellipse cx="${bx}" cy="${y+30}" rx="21" ry="40" fill="none" stroke="${strap}" stroke-width="${stroke}"/>`;}
 const perspective=['three-direct','four-direct'].includes(id);
 const body=perspective?`<path d="M${left} ${y}L${left+30} ${y-30}H${right+30}L${right} ${y}Z" fill="#bdd19c" stroke="#719252"/><path d="M${right} ${y}L${right+30} ${y-30}V${bottom-30}L${right} ${bottom}Z" fill="#b0c98b" stroke="#719252"/>`:'';
 return `<rect width="700" height="440" rx="15" fill="#f3f7ed"/><path d="M350 12V40q-14 15 0 23q13 0 12-13" fill="none" stroke="#2a513d" stroke-width="8"/>${body}<rect x="${left}" y="${y}" width="${loadW}" height="65" rx="4" fill="#dce8c5" stroke="#779954" stroke-width="2"/>${paths}${eyes}${!thumbnail?`<text x="350" y="${y+41}" text-anchor="middle" font-size="20" fill="#476b3c">Carga</text>`:''}${!thumbnail&&choice.angle?`<line x1="350" y1="75" x2="350" y2="${y-10}" stroke="#97ae82" stroke-dasharray="7 6"/><text x="375" y="122" fill="#738b65" font-size="18">Vertical</text><text x="245" y="160" fill="#a04c33" font-size="26" font-weight="700">β ${b.toFixed(1).replace('.',',')}°</text><text x="350" y="410" text-anchor="middle" font-size="23" fill="#476b3c">${perspective?'β del ramal más abierto':'Entre ramales: α '+(b*2).toFixed(1).replace('.',',')+'°'}</text>`:''}${!thumbnail&&!choice.angle?`<text x="350" y="410" text-anchor="middle" font-size="22" fill="#476b3c">${parallel?'Ramales paralelos · incluir peso del balancín':choice.title}</text>`:''}`;
}
