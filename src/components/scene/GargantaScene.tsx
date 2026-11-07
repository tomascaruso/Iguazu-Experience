'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import type { ExperienceRuntime, QualityTier, SceneStatus } from '@/lib/experience/contracts';
import { qualityProfiles } from '@/lib/experience/quality';
import { cameraAt, advanceProgress } from '@/lib/experience/timeline';
import { garganta } from '@/lib/experience/scenes';
import { createFlowGeometry,createMistGeometry,createSprayGeometry,createRiverGeometry,rockGeometry,canopyGeometry,createFernGeometry,seeded,START,END,rimAt } from './geometry';
import { waterMaterial,rockMaterial,mistMaterial,sprayMaterial,skyMaterial,riverMaterial } from './materials';

interface Props { runtime:ExperienceRuntime; quality:QualityTier; hotspot:React.RefObject<HTMLButtonElement|null>; onStatus:(s:SceneStatus)=>void; onQuality:(q:QualityTier)=>void }

function Landscape({count,rock}:{count:number;rock:THREE.ShaderMaterial}){
 const trees=useRef<THREE.InstancedMesh>(null),rocks=useRef<THREE.InstancedMesh>(null),ferns=useRef<THREE.InstancedMesh>(null);
 const canopy=useMemo(canopyGeometry,[]),stone=useMemo(rockGeometry,[]),fern=useMemo(createFernGeometry,[]);
 const leaf=useMemo(()=>new THREE.MeshStandardMaterial({color:'#42623b',roughness:.96,vertexColors:false,flatShading:false}),[]);
 const fernMat=useMemo(()=>new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.83}),[]);
 useEffect(()=>{
  const rng=seeded(369),obj=new THREE.Object3D(),color=new THREE.Color();
  if(trees.current)for(let i=0;i<count;i++){
    let x:number,z:number,base:number;
    if(i<count*.6){x=(rng()-.5)*1000;z=-340-rng()*310;base=7}
    else if(i<count*.83){x=-140-rng()*95;z=45-rng()*190;base=7}
    else{x=158+rng()*130;z=60-rng()*140;base=5}
    const s=4+rng()*11;obj.position.set(x,base+s*.7,z);obj.scale.set(s*(.85+rng()*.5),s*(.9+rng()*.6),s);obj.rotation.set(rng()*.2,rng()*6.28,rng()*.13);obj.updateMatrix();trees.current.setMatrixAt(i,obj.matrix);
    color.setHSL(.23+rng()*.075,.26+rng()*.16,.12+rng()*.13);trees.current.setColorAt(i,color);
  }
  if(trees.current){trees.current.instanceMatrix.needsUpdate=true;if(trees.current.instanceColor)trees.current.instanceColor.needsUpdate=true;trees.current.computeBoundingSphere()}
  if(rocks.current)for(let i=0;i<110;i++){
    const theta=START+rng()*(END-START),p=rimAt(theta);let s=2+rng()*4;
    if(i<65){p.add(new THREE.Vector3(Math.cos(theta)*3,-rng()*67,-Math.sin(theta)*3));obj.scale.set(s*1.2,s*2,s)}
    else{p.add(new THREE.Vector3(Math.cos(theta)*(12+rng()*15),1,-Math.sin(theta)*(12+rng()*15)));s*=.8;obj.scale.set(s*1.6,s*.4,s)}
    obj.position.copy(p);obj.rotation.set(rng()*.2,theta,rng()*.2);obj.updateMatrix();rocks.current.setMatrixAt(i,obj.matrix);
  }
  if(rocks.current){rocks.current.instanceMatrix.needsUpdate=true;rocks.current.computeBoundingSphere()}
  if(ferns.current)for(let i=0;i<24;i++){
    obj.position.set(-115-rng()*35,6+rng()*3,30-rng()*100);obj.scale.setScalar(1.3+rng()*1.3);obj.rotation.set(0,rng()*6.28,0);obj.updateMatrix();ferns.current.setMatrixAt(i,obj.matrix);
  }
  if(ferns.current){ferns.current.instanceMatrix.needsUpdate=true;ferns.current.computeBoundingSphere()}
  return()=>{};
 },[count]);
 useEffect(()=>()=>{canopy.dispose();stone.dispose();fern.dispose();leaf.dispose();fernMat.dispose()},[canopy,stone,fern,leaf,fernMat]);
 return <group>
  <instancedMesh ref={trees} args={[canopy,leaf,count]} />
  <instancedMesh ref={rocks} args={[stone,rock,110]} />
  <instancedMesh ref={ferns} args={[fern,fernMat,24]} />
  <mesh position={[-159,-2,-12]} scale={[70,15,145]} geometry={stone} material={rock}/>
  <mesh position={[191,-4,31]} scale={[90,16,122]} geometry={stone} material={rock}/>
  <mesh position={[0,-7,-470]} scale={[580,22,200]} geometry={stone} material={rock}/>
 </group>;
}

function estimateGpu(scene:THREE.Scene){
 const geos=new Set<THREE.BufferGeometry>(),textures=new Set<THREE.Texture>();let bytes=0;
 scene.traverse(obj=>{
  const mesh=obj as THREE.Mesh;if(mesh.geometry&&!geos.has(mesh.geometry)){geos.add(mesh.geometry);for(const a of Object.values(mesh.geometry.attributes))bytes+=a.array.byteLength;if(mesh.geometry.index)bytes+=mesh.geometry.index.array.byteLength}
  const mats=mesh.material?(Array.isArray(mesh.material)?mesh.material:[mesh.material]):[];
  for(const mat of mats){const shader=mat as THREE.ShaderMaterial;if(shader.uniforms)for(const u of Object.values(shader.uniforms)){if(u.value instanceof THREE.Texture)textures.add(u.value)}}
 });
 for(const t of textures){const img=t.image as {width?:number;height?:number};bytes+=(img?.width??0)*(img?.height??0)*4*1.333}
 return bytes/1048576;
}

export default function GargantaScene({runtime,quality,hotspot,onStatus,onQuality}:Props){
 const {gl,scene,camera,size,invalidate}=useThree();const profile=qualityProfiles[quality];
 const [noise,detail]=useLoader(THREE.TextureLoader,['/assets/noise.webp','/assets/water-detail.webp']);
 useEffect(()=>{for(const t of [noise,detail]){t.wrapS=t.wrapT=THREE.MirroredRepeatWrapping;t.colorSpace=THREE.NoColorSpace;t.anisotropy=Math.min(gl.capabilities.getMaxAnisotropy(),4);t.needsUpdate=true}},[noise,detail,gl]);
 const water=useMemo(()=>waterMaterial(noise,detail),[noise,detail]);const rock=useMemo(()=>rockMaterial(noise),[noise]);
 const mist=useMemo(()=>mistMaterial(noise),[noise]);const spray=useMemo(sprayMaterial,[]);const sky=useMemo(()=>skyMaterial(noise),[noise]);const river=useMemo(()=>riverMaterial(noise),[noise]);
 const waterGeo=useMemo(()=>createFlowGeometry(profile.arcSegments,profile.flowSegments),[profile]);
 const rockGeo=useMemo(()=>createFlowGeometry(Math.floor(profile.arcSegments*.7),28,true),[profile]);
 const mistGeo=useMemo(()=>createMistGeometry(profile.mist),[profile]);const sprayGeo=useMemo(()=>createSprayGeometry(profile.particles),[profile]);const riverGeo=useMemo(createRiverGeometry,[]);
 const samples=useRef<number[]>([]),lastReport=useRef(0),lastQuality=useRef(0),ready=useRef(false),lost=useRef(false),point=useMemo(()=>new THREE.Vector3(...garganta.hotspot.position),[]),look=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>()=>{waterGeo.dispose();rockGeo.dispose();mistGeo.dispose();sprayGeo.dispose()},[waterGeo,rockGeo,mistGeo,sprayGeo]);
 useEffect(()=>()=>{water.dispose();rock.dispose();mist.dispose();spray.dispose();sky.dispose();river.dispose();riverGeo.dispose()},[water,rock,mist,spray,sky,river,riverGeo]);
 useEffect(()=>{
  runtime.canvas=gl.domElement;
  runtime.capture=()=>{gl.render(scene,camera);return gl.domElement.toDataURL('image/png')};
  runtime.loseContext=()=>gl.forceContextLoss();runtime.restoreContext=()=>gl.forceContextRestore();
  const context=gl.getContext();const ext=context.getExtension('WEBGL_debug_renderer_info');
  runtime.snapshot.renderer=ext?context.getParameter(ext.UNMASKED_RENDERER_WEBGL):'WebGL2';
  const loss=(e:Event)=>{e.preventDefault();lost.current=true;runtime.snapshot.contextLosses++;runtime.snapshot.status='context-lost';onStatus('context-lost')};
  const restore=()=>{lost.current=false;ready.current=false;invalidate()};
  gl.domElement.addEventListener('webglcontextlost',loss);gl.domElement.addEventListener('webglcontextrestored',restore);
  return()=>{gl.domElement.removeEventListener('webglcontextlost',loss);gl.domElement.removeEventListener('webglcontextrestored',restore);runtime.canvas=undefined;runtime.capture=undefined};
 },[gl,scene,camera,runtime,onStatus,invalidate]);
 useFrame((_,dt)=>{
  if(lost.current)return;
  const frozen=runtime.paused||runtime.hidden||runtime.reducedMotion;
  if(!frozen)runtime.time+=Math.min(dt,.06);
  runtime.displayedProgress=advanceProgress(runtime.displayedProgress,runtime.rawProgress,dt,frozen||runtime.inspect);
  const frame=cameraAt(runtime.displayedProgress,size.width<760);
  camera.position.set(...frame.position);look.set(...frame.target);
  if(runtime.inspect){look.x+=Math.sin(runtime.inspectYaw)*115;look.y+=Math.sin(runtime.inspectPitch)*100}
  camera.lookAt(look);const cam=camera as THREE.PerspectiveCamera;if(cam.fov!==frame.fov){cam.fov=frame.fov;cam.updateProjectionMatrix()}
  for(const m of [water,mist,spray,river]){m.uniforms.uTime.value=runtime.time;m.uniforms.uProgress.value=runtime.displayedProgress}
  spray.uniforms.uDpr.value=gl.getPixelRatio();
  if(hotspot.current){const p=point.clone().project(camera);const x=(p.x*.5+.5)*size.width,y=(-p.y*.5+.5)*size.height;hotspot.current.style.transform=`translate3d(${x}px,${y}px,0)`;hotspot.current.style.visibility=p.z>1||x<24||x>size.width-24||y<94||y>size.height-120?'hidden':'visible'}
  runtime.snapshot.frames++;runtime.snapshot.time=runtime.time;runtime.snapshot.camera=[camera.position.x,camera.position.y,camera.position.z];runtime.snapshot.target=[look.x,look.y,look.z];runtime.snapshot.progress=runtime.rawProgress;runtime.snapshot.displayedProgress=runtime.displayedProgress;
  runtime.onFrame?.(runtime.displayedProgress,runtime.snapshot.camera,runtime.snapshot.target);
  const now=performance.now();if(!frozen&&dt<1)samples.current.push(dt*1000);
  if(!ready.current){ready.current=true;runtime.snapshot.readyMs=now;runtime.snapshot.status='ready';onStatus('ready')}
  if(now-lastReport.current>1000){
    const sorted=samples.current.sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)]||0;
    Object.assign(runtime.snapshot,{fps:median?1000/median:0,frameP95:sorted[Math.floor(sorted.length*.95)]||0,calls:gl.info.render.calls,triangles:gl.info.render.triangles,textures:gl.info.memory.textures,geometries:gl.info.memory.geometries,estimatedGpuMB:estimateGpu(scene)+size.width*size.height*gl.getPixelRatio()**2*12/1048576,dpr:gl.getPixelRatio(),tier:quality,width:size.width,height:size.height});
    if(now>8000&&now-lastQuality.current>12000&&median>38&&quality!=='low'&&!frozen){lastQuality.current=now;onQuality(quality==='high'?'balanced':'low')}
    samples.current=[];lastReport.current=now;
  }
 });
 return <>
  <fogExp2 attach="fog" args={['#a7b5ac',.0019]} />
  <ambientLight intensity={.7} color="#c7d9cc"/>
  <hemisphereLight args={['#cad7dc','#26362b',1.8]}/>
  <directionalLight position={[130,180,90]} intensity={2.2} color="#fff3d0"/>
  <mesh material={sky} renderOrder={-20}><sphereGeometry args={[1800,36,20]}/></mesh>
  <mesh geometry={rockGeo} material={rock}/>
  <mesh geometry={waterGeo} material={water}/>
  <mesh geometry={riverGeo} material={river}/>
  <Landscape count={profile.trees} rock={rock}/>
  <mesh geometry={mistGeo} material={mist} frustumCulled={false} renderOrder={3}/>
  <points geometry={sprayGeo} material={spray} frustumCulled={false} renderOrder={2}/>
  <AdaptiveDpr pixelated={false}/>
 </>;
}
