import type { Vec3 } from '../experience/contracts';
/** Near-water detail has a bounded HRTF direction. The broad ambience stays stereo. */
export class SpatialEmitter {
 readonly node:PannerNode;
 constructor(private context:AudioContext){
  this.node=context.createPanner();this.node.panningModel='HRTF';this.node.distanceModel='inverse';this.node.refDistance=100;this.node.maxDistance=900;this.node.rolloffFactor=.18;
  this.node.positionX.value=-16;this.node.positionY.value=-28;this.node.positionZ.value=-100;
 }
 update(position:Vec3,target:Vec3){
  const t=this.context.currentTime,l=this.context.listener;
  const dx=target[0]-position[0],dy=target[1]-position[1],dz=target[2]-position[2],length=Math.hypot(dx,dy,dz)||1;
  for(const [param,value] of [[l.positionX,position[0]],[l.positionY,position[1]],[l.positionZ,position[2]],[l.forwardX,dx/length],[l.forwardY,dy/length],[l.forwardZ,dz/length],[l.upX,0],[l.upY,1],[l.upZ,0]] as const)param.setTargetAtTime(value,t,.09);
 }
 dispose(){this.node.disconnect()}
}
