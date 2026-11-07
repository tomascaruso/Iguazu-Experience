import type { ExperienceRuntime } from './contracts';
export function createRuntime():ExperienceRuntime{return {
 rawProgress:0,displayedProgress:0,time:0,paused:false,hidden:false,inspect:false,reducedMotion:false,inspectYaw:0,inspectPitch:0,
 snapshot:{progress:0,displayedProgress:0,time:0,frames:0,camera:[79,46,129],target:[-5,-24,-52],fps:0,frameP95:0,calls:0,triangles:0,textures:0,geometries:0,estimatedGpuMB:0,dpr:1,tier:'balanced',status:'loading',contextLosses:0,readyMs:0,width:0,height:0,renderer:''}
}}
