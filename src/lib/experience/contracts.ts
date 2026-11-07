export type Vec3 = readonly [number, number, number];
export type QualityTier = 'high' | 'balanced' | 'low';
export type Phase = 'reveal' | 'approach' | 'contemplate';
export type SceneStatus = 'loading' | 'ready' | 'fallback' | 'error' | 'context-lost';
export interface CameraFrame { position: Vec3; target: Vec3; fov: number }
export interface SceneDefinition {
  id: string; title: string; poster: string;
  camera: readonly {at:number; position:Vec3; target:Vec3; fov:number}[];
  hotspot: {id:string; position:Vec3; title:string};
  audio: {id:string; src:string; fallbackSrc:string; license:string; creator:string; source:string};
}
export interface RuntimeSnapshot {
  progress: number; displayedProgress: number; time: number; frames: number;
  camera: [number,number,number]; target: [number,number,number];
  fps: number; frameP95: number; calls: number; triangles: number;
  textures: number; geometries:number; estimatedGpuMB:number; dpr:number;
  tier:QualityTier; status:SceneStatus; contextLosses:number;
  readyMs:number; width:number; height:number; renderer:string;
}
export interface ExperienceRuntime {
  rawProgress: number; displayedProgress: number; time: number;
  paused: boolean; hidden:boolean; inspect:boolean; reducedMotion:boolean;
  inspectYaw:number; inspectPitch:number;
  snapshot: RuntimeSnapshot;
  capture?:()=>string;
  canvas?:HTMLCanvasElement;
  loseContext?:()=>void;
  restoreContext?:()=>void;
  changeQuality?: (tier:QualityTier)=>void;
  onFrame?: (progress:number,position:Vec3,target:Vec3)=>void;
}
