import * as THREE from 'three';

export const START=-.34, END=Math.PI+.37;
export function seeded(seed:number){let v=seed>>>0;return()=>{v=(v*1664525+1013904223)>>>0;return v/4294967296}}
/** Interpretive, asymmetric U-shaped head. Units approximate metres, not a survey. */
export function rimAt(theta:number):THREE.Vector3{
  const scallop=4.0*Math.sin(theta*7.2)+2.8*Math.sin(theta*15.5)+1.2*Math.sin(theta*41);
  const rx=72+scallop+8*Math.sin(theta*2+.4);
  const rz=128+scallop*.7;
  return new THREE.Vector3(rx*Math.cos(theta),3+.9*Math.sin(theta*5)+.4*Math.sin(theta*21),-rz*Math.sin(theta));
}
export function flowPoint(theta:number,v:number,rock=false):THREE.Vector3{
  const rim=rimAt(theta);const dx=Math.cos(theta),dz=-Math.sin(theta);
  if(v<.32){
    const upstream=(.32-v)/.32;
    return rim.add(new THREE.Vector3(dx*(upstream*155+(rock?3:0)),rock?-1.6:upstream*.45,dz*(upstream*155+(rock?3:0))));
  }
  const fall=(v-.32)/.68;
  const spill=-(4.5*Math.sin(Math.min(1,fall*3)*Math.PI*.5)+10*fall)+(rock?4:0);
  rim.x+=dx*spill;rim.z+=dz*spill;
  rim.y-=82*Math.pow(fall,1.25)+(rock?1:0);
  if(rock){rim.x+=Math.sin(theta*50+fall*20)*1.6;rim.z+=Math.cos(theta*40+fall*35)*1.4}
  return rim;
}
export function createFlowGeometry(segments:number,depth:number,rock=false){
  const positions:number[]=[],uvs:number[]=[],index:number[]=[];
  for(let y=0;y<=depth;y++)for(let x=0;x<=segments;x++){
    const u=x/segments,v=y/depth,theta=START+u*(END-START),p=flowPoint(theta,v,rock);
    positions.push(p.x,p.y,p.z);uvs.push(u,v);
  }
  for(let y=0;y<depth;y++)for(let x=0;x<segments;x++){
    const a=y*(segments+1)+x,b=a+1,c=a+segments+1,d=c+1;index.push(a,c,b,b,c,d);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(index);geo.computeVertexNormals();geo.computeBoundingSphere();return geo;
}
export function createRiverGeometry(){
  const g=new THREE.PlaneGeometry(650,600,60,60);g.rotateX(-Math.PI/2);g.translate(0,-80,40);return g;
}
export function rockGeometry(){
  const g=new THREE.IcosahedronGeometry(1,2);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const s=1+.14*Math.sin(x*16+z*9)+.08*Math.cos(y*27-z*13);
    p.setXYZ(i,x*s,y*s*.72+.045*Math.sin(x*34),z*s);
  }g.computeVertexNormals();return g;
}
export function canopyGeometry(){
  const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const s=1+.16*Math.sin(x*22+z*17)*Math.cos(y*20);
    p.setXYZ(i,x*s,y*s*.72,z*s);
  }g.computeVertexNormals();return g;
}
export function createMistGeometry(count:number){
  const rng=seeded(320),base=new THREE.PlaneGeometry(1,1);const g=new THREE.InstancedBufferGeometry();
  g.index=base.index;g.attributes.position=base.attributes.position;g.attributes.uv=base.attributes.uv;
  const offsets=[],sizes=[],phases=[];
  for(let i=0;i<count;i++){
    const t=(i+.5)/count;offsets.push((rng()-.5)*106,-70+rng()*46,20-t*165);sizes.push(32+rng()*41);phases.push(rng()*20);
  }
  g.setAttribute('aOffset',new THREE.InstancedBufferAttribute(new Float32Array(offsets),3));
  g.setAttribute('aSize',new THREE.InstancedBufferAttribute(new Float32Array(sizes),1));
  g.setAttribute('aPhase',new THREE.InstancedBufferAttribute(new Float32Array(phases),1));g.instanceCount=count;return g;
}
export function createSprayGeometry(count:number){
  const rng=seeded(822);const positions=[],seeds=[];
  for(let i=0;i<count;i++){
    const theta=START+rng()*(END-START),p=rimAt(theta);positions.push(p.x,p.y,p.z);seeds.push(rng(),rng(),rng());
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,3));return g;
}
export function createFernGeometry(){
  const p:number[]=[],colors:number[]=[];const rng=seeded(678);
  const add=(a:THREE.Vector3,b:THREE.Vector3,c:THREE.Vector3,color:THREE.Color)=>{for(const q of [a,b,c]){p.push(q.x,q.y,q.z);colors.push(color.r,color.g,color.b)}};
  for(let f=0;f<11;f++){
    const angle=f/11*Math.PI*2,len=2.6+rng()*1.3;
    for(let j=2;j<17;j++){
      const t=j/18,center=new THREE.Vector3(Math.cos(angle)*len*t,Math.sin(t*Math.PI*.8)*1.7,Math.sin(angle)*len*t);
      const forward=new THREE.Vector3(Math.cos(angle)*.35,.08,Math.sin(angle)*.35);
      const side=new THREE.Vector3(-Math.sin(angle),.11,Math.cos(angle));
      const w=.55*Math.sin(t*Math.PI)*(1-t*.4);const color=new THREE.Color().setHSL(.25+rng()*.04,.36,.11+rng()*.09);
      for(const sign of [-1,1]){
        const tip=center.clone().addScaledVector(side,w*sign).addScaledVector(forward,-.5);
        add(center.clone().addScaledVector(forward,-.23),tip,center.clone().addScaledVector(forward,.4),color);
      }
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
}
