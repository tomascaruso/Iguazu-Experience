import type { CameraFrame, Phase, Vec3 } from './contracts';
export const clamp=(x:number,min=0,max=1)=>Math.max(min,Math.min(max,x));
export const smooth=(x:number)=>{const t=clamp(x);return t*t*(3-2*t)};
export function phaseAt(p:number):Phase{return p<.23?'reveal':p<.76?'approach':'contemplate'}
export const phaseNames={reveal:'Revelar',approach:'Acercarse',contemplate:'Contemplar'};
export const cameraKeys=[
  {at:0,position:[79,46,129] as Vec3,target:[-5,-24,-52] as Vec3,fov:49},
  {at:.23,position:[61,32,107] as Vec3,target:[-8,-26,-64] as Vec3,fov:48},
  {at:.76,position:[33,17,64] as Vec3,target:[-9,-30,-87] as Vec3,fov:46},
  {at:1,position:[28,15,60] as Vec3,target:[-9,-30,-88] as Vec3,fov:46},
] as const;
export function cameraAt(progress:number,mobile=false):CameraFrame {
  const p=clamp(progress);let i=0;while(i<cameraKeys.length-2&&p>cameraKeys[i+1].at)i++;
  const a=cameraKeys[i],b=cameraKeys[i+1],t=smooth((p-a.at)/(b.at-a.at));
  const mix=(u:Vec3,v:Vec3):Vec3=>[u[0]+(v[0]-u[0])*t,u[1]+(v[1]-u[1])*t,u[2]+(v[2]-u[2])*t];
  const position=mix(a.position,b.position),target=mix(a.target,b.target);
  return {position:mobile?[position[0]*.62,position[1]+15,position[2]+44]:position,target,fov:mobile?57:a.fov+(b.fov-a.fov)*t};
}
export function advanceProgress(current:number,target:number,dt:number,paused:boolean){
  if(paused)return current;
  return Math.abs(target-current)<.00005?target:current+(clamp(target)-current)*(1-Math.exp(-Math.min(dt,.1)*6));
}
export function audioMixAt(progress:number){
  const p=smooth(clamp(progress)/.85);
  return {ambient:.28+.21*p,detail:.07+.29*p,cutoff:1100+6200*p,pan:.18*(1-p)};
}
