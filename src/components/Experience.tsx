'use client';
import dynamic from 'next/dynamic';
import {useCallback,useEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {createRuntime} from '@/lib/experience/runtime';
import {garganta} from '@/lib/experience/scenes';
import {phaseAt,phaseNames} from '@/lib/experience/timeline';
import type {Phase,QualityTier,SceneStatus} from '@/lib/experience/contracts';
import type {AmbientAudio,AudioStatus} from '@/lib/audio/AmbientAudio';
import AudioControls from './AudioControls';
import ReviewTools from './ReviewTools';
const SceneCanvas=dynamic(()=>import('./scene/SceneCanvas'),{ssr:false});
const chapterCopy={reveal:['Donde el río','se vuelve inmenso.','Un recorrido por la fuerza del agua. Explorá Garganta del Diablo desde una perspectiva imposible.'],approach:['Acercate','a lo extraordinario.','La corriente se quiebra. La bruma transforma el paisaje. Cada metro revela otra escala.'],contemplate:['Hay lugares','que te dejan sin palabras.','Detenete un momento. Mirá cómo el agua, la roca y la selva comparten un mismo pulso.']} as const;
export default function Experience(){
 const [runtime]=useState(createRuntime),audio=useRef<AmbientAudio|null>(null),hotspot=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDialogElement>(null),story=useRef<HTMLElement>(null),progressbar=useRef<HTMLDivElement>(null),lastFocus=useRef<HTMLElement|null>(null);
 const [status,setStatus]=useState<SceneStatus>('loading'),[quality,setQuality]=useState<QualityTier>('balanced'),[phase,setPhase]=useState<Phase>('reveal'),[paused,setPaused]=useState(false),[hidden,setHidden]=useState(false),[staticMode,setStaticMode]=useState(false),[reduced,setReduced]=useState(false),[canWebgl,setCanWebgl]=useState(false),[retry,setRetry]=useState(0),[inspect,setInspect]=useState(false),[qa,setQa]=useState(false),[audioStatus,setAudioStatus]=useState<AudioStatus>('off'),[volume,setVolume]=useState(.45);
 const audioStatusRef=useRef<AudioStatus>('off');
 const onAudioStatus=useCallback((s:AudioStatus)=>{audioStatusRef.current=s;setAudioStatus(s)},[]);
 const onStatus=useCallback((s:SceneStatus)=>{runtime.snapshot.status=s;setStatus(s)},[runtime]);
 const range=useCallback(()=>Math.max(1,(story.current?.offsetHeight??innerHeight)-innerHeight),[]);
 useEffect(()=>{
  const params=new URLSearchParams(location.search),motion=matchMedia('(prefers-reduced-motion: reduce)');setQa(params.get('qa')==='1');
  const updateMotion=()=>{const value=motion.matches||params.get('motion')==='reduce';setReduced(value);setStaticMode(value);runtime.reducedMotion=value};updateMotion();motion.addEventListener('change',updateMotion);
  let available=false;try{const canvas=document.createElement('canvas');canvas.addEventListener('webglcontextcreationerror',e=>{runtime.snapshot.renderer=(e as WebGLContextEvent).statusMessage});const gl=canvas.getContext('webgl2');available=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch(e){runtime.snapshot.renderer=String(e)}
  available=available&&params.get('webgl')!=='off';setCanWebgl(available);if(!available)onStatus('fallback');setQuality(innerWidth<760?'balanced':'high');
  try{const stored=localStorage.getItem('iguazu:h2:volume:v1');if(stored!==null){const v=Number(stored);if(Number.isFinite(v)&&v>=0&&v<=1)setVolume(v)}}catch{}
  const visibility=()=>{const value=document.hidden;runtime.hidden=value;setHidden(value)};document.addEventListener('visibilitychange',visibility);
  return()=>{motion.removeEventListener('change',updateMotion);document.removeEventListener('visibilitychange',visibility);audio.current?.dispose()};
 },[runtime,onStatus]);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);const trigger=ScrollTrigger.create({trigger:story.current,start:'top top',end:'bottom bottom',onUpdate:self=>{runtime.rawProgress=self.progress},invalidateOnRefresh:true});
  const id=setInterval(()=>{setPhase(phaseAt(runtime.displayedProgress));if(progressbar.current)progressbar.current.style.transform=`scaleX(${runtime.displayedProgress})`},120);
  return()=>{trigger.kill();clearInterval(id)};
 },[runtime,staticMode]);
 useEffect(()=>{runtime.paused=paused;runtime.inspect=inspect;void audio.current?.suspend(paused||hidden);runtime.onFrame=(p,pos,target)=>audio.current?.update(p,pos,target);return()=>{runtime.onFrame=undefined}},[runtime,paused,hidden,inspect]);
 useEffect(()=>{audio.current?.setVolume(volume);try{localStorage.setItem('iguazu:h2:volume:v1',String(volume))}catch{}},[volume]);
 useEffect(()=>{if(staticMode||!canWebgl){runtime.displayedProgress=0;setPhase('reveal')}},[staticMode,canWebgl,runtime]);
 async function toggleSound(){if(!audio.current){const {AmbientAudio}=await import('@/lib/audio/AmbientAudio');audio.current=new AmbientAudio(garganta.audio,onAudioStatus);audio.current.setVolume(volume)}await audio.current.toggle();audio.current.update(runtime.displayedProgress,runtime.snapshot.camera,runtime.snapshot.target);void audio.current.suspend(paused||hidden)}
 function jump(p:number){setInspect(false);window.scrollTo({top:(story.current?.offsetTop??0)+range()*p,behavior:reduced?'instant':'smooth'})}
 function openPanel(){lastFocus.current=document.activeElement as HTMLElement;dialog.current?.showModal()}
 function closePanel(){dialog.current?.close();lastFocus.current?.focus()}
 const is3d=canWebgl&&!staticMode,copy=chapterCopy[phase];
 const drag=useRef<{x:number;y:number}|null>(null);
 return <>
  <a className="skip-link" href="#contenido">Saltar al contenido</a>
  <header className="site-header"><a className="brand" href="#inicio" aria-label="Iguazú Experience, inicio"><span className="brand-mark" aria-hidden="true">≋</span><span>IGUAZÚ <small>EXPERIENCE</small></span></a><span className="header-caption">UN VIAJE HACIA LO EXTRAORDINARIO</span><a className="header-link" href="#contenido">Sobre este lugar <span aria-hidden="true">↗</span></a></header>
  <main>
   <section className={'story '+(!is3d?'static-story':'')} id="inicio" ref={story} aria-label="Experiencia Garganta del Diablo">
    <div className="sticky-stage">
     <div className="scene-viewport" tabIndex={inspect?0:-1} role="region" aria-label="Visor tridimensional. Usá el scroll para recorrer; en explorar, flechas para mirar." onPointerDown={e=>{if(inspect){drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}}} onPointerMove={e=>{if(drag.current&&inspect){runtime.inspectYaw=Math.max(-.2,Math.min(.2,runtime.inspectYaw+(e.clientX-drag.current.x)*.0015));runtime.inspectPitch=Math.max(-.09,Math.min(.09,runtime.inspectPitch+(e.clientY-drag.current.y)*.0015));drag.current={x:e.clientX,y:e.clientY}}}} onPointerUp={()=>{drag.current=null}} onKeyDown={e=>{if(!inspect)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();runtime.inspectYaw=Math.max(-.2,Math.min(.2,runtime.inspectYaw+(e.key==='ArrowLeft'?-.025:e.key==='ArrowRight'?.025:0)));runtime.inspectPitch=Math.max(-.09,Math.min(.09,runtime.inspectPitch+(e.key==='ArrowDown'?-.02:e.key==='ArrowUp'?.02:0)))}if(e.key==='Escape')setInspect(false)}}>
      {/* Documentary poster is explicitly identified in static mode. Never passed off as a live render. */}
      <img className={'poster '+(status==='ready'&&is3d?'poster-hidden':'')} src={garganta.poster} alt="Fotografía documental: caída de agua y bruma en Garganta del Diablo, JosepMGracia." fetchPriority="high"/>
      {is3d?<SceneCanvas key={retry} runtime={runtime} quality={quality} hotspot={hotspot} onStatus={onStatus} onQuality={setQuality} paused={paused} hidden={hidden}/>:null}
     </div>
     <div className="scene-shade" aria-hidden="true"/>
     <div className="location-line"><span className="location-dot"/><span>MISIONES, ARGENTINA</span><span className="location-divider"/><span>25°41′ S · 54°26′ O</span></div>
     <div className="scene-label"><span>03 / GARGANTA DEL DIABLO</span><small>{is3d?'EXPLORACIÓN 3D · H2':'VISTA FOTOGRÁFICA · SIN MOVIMIENTO'}</small></div>
     {is3d&&status==='ready'?<button ref={hotspot} className="hotspot" onClick={openPanel} aria-label="Explorar el borde de Garganta del Diablo"><span>+</span><small>EL BORDE DEL ASOMBRO</small></button>:null}
     <div className="hero-copy"><p className="eyebrow">VIVÍ IGUAZÚ ANTES DE LLEGAR</p><h1>{copy[0]}<br/><em>{copy[1]}</em></h1><p className="hero-description">{copy[2]}</p><button className="text-link" onClick={openPanel}>Descubrí este lugar <span aria-hidden="true">↗</span></button></div>
     <div className="side-note" aria-hidden="true">AGUA · SELVA · ASOMBRO</div>
     <div className="bottom-bar"><nav aria-label="Etapas del recorrido" className="stage-nav">{([['reveal',0],['approach',.48],['contemplate',1]] as const).map(([name,p],i)=><button key={name} onClick={()=>jump(p)} disabled={!is3d} aria-current={phase===name?'step':undefined}><small>0{i+1}</small><span>{phaseNames[name]}</span></button>)}</nav><div className="scroll-hint"><span aria-hidden="true">↓</span> DESLIZÁ PARA EXPLORAR</div><div className="progress-track"><div ref={progressbar}/></div></div>
     <div className="experience-tools"><div className="view-controls"><button onClick={()=>setPaused(v=>!v)} aria-pressed={paused} disabled={!is3d}>{paused?'Reanudar':'Pausar'}</button><button onClick={()=>setInspect(v=>!v)} aria-pressed={inspect} disabled={!is3d||paused}>{inspect?'Volver al recorrido':'Explorar'}</button><button onClick={()=>{setStaticMode(v=>!v);runtime.reducedMotion=false}} disabled={!canWebgl}>{staticMode?'Activar 3D':'Vista sin movimiento'}</button></div></div>
     {status==='loading'&&is3d?<div className="scene-status" role="status">Preparando el paisaje 3D…</div>:null}
     {(status==='error'||status==='context-lost')&&is3d?<div className="scene-status error" role="alert"><strong>El paisaje 3D se interrumpió.</strong><span>El contenido y el sonido siguen disponibles.</span><button onClick={()=>{if(status==='context-lost'){runtime.restoreContext?.()}else{setRetry(v=>v+1);onStatus('loading')}}}>Recuperar experiencia</button><button onClick={()=>setStaticMode(true)}>Continuar sin WebGL</button></div>:null}
     {staticMode||!canWebgl?<p className="fallback-caption">Fotografía: JosepMGracia · CC BY-SA 4.0. {reduced?'Se respetó tu preferencia de movimiento reducido.':'El contenido está disponible sin WebGL.'}</p>:null}
     {inspect?<p className="inspect-hint" role="status">Arrastrá suavemente o enfocá el visor y usá las flechas. Escape para volver.</p>:null}
    </div>
   </section>
   <section id="contenido" className="editorial-section" tabIndex={-1}><div className="section-kicker">UN ENCUENTRO CON LA NATURALEZA <span>01 — 03</span></div><div className="editorial-grid"><h2>El agua encuentra<br/><em>su propia voz.</em></h2><div><p>Garganta del Diablo es un paisaje de agua, roca y bruma. Su cabecera curva concentra la caída y abre un profundo corredor entre las márgenes del río Iguazú.</p><p>Esta recreación propone una mirada digital del lugar. La geometría es interpretativa: no es un relevamiento topográfico ni representa condiciones actuales de visita.</p><button className="dark-link" onClick={openPanel}>Explorar el paisaje <span>↗</span></button></div></div><div className="facts-grid"><article><span>01 / OBSERVAR</span><h3>Una escala que cambia</h3><p>El recorrido se acerca de forma gradual. Podés detenerlo, retroceder o elegir una vista sin movimiento.</p></article><article><span>02 / ESCUCHAR</span><h3>La fuerza del agua</h3><p>Una grabación documental del lugar acompaña la proximidad de la cámara. El sonido siempre empieza apagado.</p></article><article><span>03 / CUIDAR</span><h3>Conocer para conservar</h3><p>La visita digital es independiente de la apertura de los circuitos. Consultá la información vigente antes de viajar.</p><a href="https://iguazuargentina.com/" target="_blank" rel="noopener noreferrer">Información oficial ↗</a></article></div></section>
   <section className="reference-section"><p className="eyebrow">UNA MIRADA DOCUMENTADA</p><h2>El paisaje real, como referencia.</h2><div className="reference-grid"><figure><img src="/assets/references/mariordo.webp" alt="Vista aérea documental: cabecera irregular de Garganta y corredor de salida." loading="lazy"/><figcaption>Referencia fotográfica · Mariordo · CC BY-SA 4.0</figcaption></figure><div><p>La cabecera en U, las caídas laterales y el corredor profundo guían la construcción del escenario. El agua y la bruma de la experiencia son superficies y partículas animadas en WebGL.</p><p>Las fotografías documentan el lugar. No son evidencia de funcionamiento de la escena.</p><a href="/creditos">Ver procedencia y licencias ↗</a></div></div></section>
   <section className="settings-section"><label htmlFor="quality">Calidad del paisaje</label><select id="quality" value={quality} onChange={e=>setQuality(e.target.value as QualityTier)}><option value="high">Alta</option><option value="balanced">Equilibrada</option><option value="low">Ligera</option></select><span>Se adapta si el dispositivo necesita menos carga.</span></section>
   {qa?<ReviewTools runtime={runtime} audio={audio} range={range}/>:null}
  </main>
  <aside className="sound-dock" aria-label="Controles permanentes de sonido"><AudioControls status={audioStatus} volume={volume} onToggle={()=>void toggleSound()} onVolume={setVolume}/></aside>
  <footer><a className="footer-brand" href="#inicio">Iguazú Experience</a><p>Proyecto conceptual independiente y no oficial. H2 · Garganta del Diablo.</p><a href="/creditos">Fuentes y créditos</a></footer>
  <dialog ref={dialog} className="info-dialog" aria-labelledby="panel-title" onCancel={()=>lastFocus.current?.focus()} onClick={e=>{if(e.target===dialog.current)closePanel()}}><button className="dialog-close" aria-label="Cerrar información" onClick={closePanel}>×</button><p className="eyebrow">EXPLORAR / GARGANTA DEL DIABLO</p><h2 id="panel-title">El borde<br/><em>del asombro.</em></h2><img src="/assets/references/gracia.webp" alt="Fotografía de JosepMGracia de la caída y bruma de Garganta del Diablo."/><p>Una cabecera curva, múltiples cortinas de agua y un corredor de roca definen este paisaje. La bruma oculta y revela partes de la caída, cambiando nuestra percepción de profundidad.</p><p className="panel-caption">Imagen documental · JosepMGracia · CC BY-SA 4.0.</p><div className="panel-note">La exploración digital no informa sobre aperturas, horarios ni condiciones de acceso. Verificá esos datos en los canales oficiales.</div><a className="panel-official" href="https://iguazuargentina.com/" target="_blank" rel="noopener noreferrer">Consultar el sitio oficial ↗</a><a className="panel-credits" href="/creditos">Fuentes y licencias</a><AudioControls status={audioStatus} volume={volume} onToggle={()=>void toggleSound()} onVolume={setVolume}/></dialog>
  <div className="sr-only" aria-live="polite">{audioStatus==='error'?'El audio no pudo cargarse. Podés reintentar sin interrumpir la exploración.':audioStatus==='playing'?'Sonido ambiental activado.':audioStatus==='muted'?'Sonido silenciado.':''}</div>
 </>;
}
