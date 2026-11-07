'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense,Component,useEffect,type ReactNode } from 'react';
import * as THREE from 'three';
import GargantaScene from './GargantaScene';
import type { ExperienceRuntime,QualityTier,SceneStatus } from '@/lib/experience/contracts';
import { qualityProfiles } from '@/lib/experience/quality';

class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(error:Error){console.error('Scene failed:',error.message);this.props.onError()}
 render(){return this.state.failed?null:this.props.children}
}
export default function SceneCanvas({runtime,quality,hotspot,onStatus,onQuality,paused,hidden}:{runtime:ExperienceRuntime;quality:QualityTier;hotspot:React.RefObject<HTMLButtonElement|null>;onStatus:(s:SceneStatus)=>void;onQuality:(q:QualityTier)=>void;paused:boolean;hidden:boolean}){
 useEffect(()=>{runtime.paused=paused;runtime.hidden=hidden},[runtime,paused,hidden]);
 return <SceneBoundary onError={()=>onStatus('error')}>
  <Canvas className="landscape-canvas" aria-label="Recreación tridimensional de Garganta del Diablo" dpr={qualityProfiles[quality].dpr} frameloop={paused||hidden?'demand':'always'} camera={{position:[79,46,129],near:.4,far:2200,fov:49}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false}} onCreated={({gl})=>{gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12;gl.setClearColor('#b4c1b8');gl.debug.onShaderError=()=>{runtime.snapshot.status='error';onStatus('error')}}}>
   <Suspense fallback={null}><GargantaScene runtime={runtime} quality={quality} hotspot={hotspot} onStatus={onStatus} onQuality={onQuality}/></Suspense>
  </Canvas>
 </SceneBoundary>;
}
