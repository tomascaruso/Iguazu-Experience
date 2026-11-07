'use client';
import {useEffect,useRef,useState} from 'react';
import type {ExperienceRuntime} from '@/lib/experience/contracts';
import type {AmbientAudio} from '@/lib/audio/AmbientAudio';

async function saveEvidence(name:string,blob:Blob){const response=await fetch('/api/evidence?name='+encodeURIComponent(name),{method:'POST',body:blob,headers:{'Content-Type':blob.type}});if(!response.ok)throw new Error('No se pudo guardar la evidencia');return response.json()}
export default function ReviewTools({runtime,audio,range}:{runtime:ExperienceRuntime;audio:React.RefObject<AmbientAudio|null>;range:()=>number}){
 const [metrics,setMetrics]=useState(''),[message,setMessage]=useState(''),[recording,setRecording]=useState(false);
 const history=useRef<object[]>([]),activeRecorder=useRef<MediaRecorder|null>(null);
 useEffect(()=>{const id=setInterval(()=>{const s={...runtime.snapshot,audio:audio.current?.stats,visibility:document.visibilityState,heapMB:(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize?((performance as Performance&{memory:{usedJSHeapSize:number}}).memory.usedJSHeapSize/1048576):null};setMetrics(JSON.stringify(s,null,2));history.current.push({at:performance.now(),...s});if(history.current.length>240)history.current.shift()},1000);return()=>{clearInterval(id);if(activeRecorder.current?.state==='recording')activeRecorder.current.stop()}},[runtime,audio]);
 async function capture(){try{if(!runtime.capture)throw new Error('La escena todavía no está lista');const blob=await (await fetch(runtime.capture())).blob();await saveEvidence(innerWidth<760?'mobile-scene.png':'desktop-scene.png',blob);setMessage('Captura WebGL auténtica guardada')}catch(e){setMessage(String(e))}}
 async function recordAudio(){
  if(!audio.current?.stream||audio.current.stats.status!=='playing'){setMessage('Activá el sonido para grabar la salida real de Web Audio.');return}
  const stream=new MediaStream(audio.current.stream.getAudioTracks().map(t=>t.clone()));const recorder=new MediaRecorder(stream,{mimeType:'audio/webm;codecs=opus'});activeRecorder.current=recorder;const chunks:BlobPart[]=[];
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=async()=>{try{await saveEvidence('browser-audio.webm',new Blob(chunks,{type:'audio/webm'}));setMessage('Salida real de Web Audio guardada: 30 segundos, incluye cruces de bucle.')}catch(e){setMessage(String(e))}stream.getTracks().forEach(t=>t.stop());setRecording(false)};
  recorder.start(1000);setRecording(true);setMessage('Grabando 30 segundos de audio real del navegador.');setTimeout(()=>{if(recorder.state==='recording')recorder.stop()},30000);
 }
 async function record(){
  if(!runtime.canvas||recording)return;
  if(!audio.current?.stream||audio.current.stats.status!=='playing'){setMessage('Activá el sonido antes de grabar la evidencia audiovisual.');return}
  const stream=runtime.canvas.captureStream(30);for(const track of audio.current.stream.getAudioTracks())stream.addTrack(track.clone());
  const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000});activeRecorder.current=recorder;
  const chunks:BlobPart[]=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onstop=async()=>{try{await saveEvidence('scroll-audiovisual.webm',new Blob(chunks,{type:'video/webm'}));await saveMetrics();setMessage('Video y métricas reales guardados. La grabación contiene el canvas y el audio; el HTML se documenta por capturas.')}catch(e){setMessage(String(e))}finally{stream.getTracks().forEach(t=>t.stop());setRecording(false)}};
  window.scrollTo({top:0,behavior:'instant'});setRecording(true);setMessage('Grabando el render y audio del navegador; recorrido de ida y vuelta.');recorder.start(1000);
  const started=performance.now(),duration=18000;
  function frame(now:number){const t=(now-started)/duration;const p=t<.12?0:t<.68?(t-.12)/.56:t<.81?1:Math.max(0,1-(t-.81)/.19);window.scrollTo({top:range()*p,behavior:'instant'});if(t<1&&recorder.state==='recording')requestAnimationFrame(frame);else if(recorder.state==='recording')recorder.stop()}
  requestAnimationFrame(frame);
 }
 async function saveMetrics(){const nav=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;const data={capturedAt:new Date().toISOString(),userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},navigation:nav?.toJSON(),resources:performance.getEntriesByType('resource').map(e=>(e as PerformanceResourceTiming).toJSON()),history:history.current};await saveEvidence(innerWidth<760?'mobile-metrics.json':'desktop-metrics.json',new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));setMessage('Métricas reales guardadas')}
 return <details className="review-tools"><summary>Revisión técnica H2</summary><div className="review-buttons"><button onClick={capture}>Capturar escena</button><button onClick={record} disabled={recording}>Grabar recorrido audiovisual</button><button onClick={recordAudio} disabled={recording}>Grabar prueba de audio</button><button onClick={()=>void saveMetrics()}>Guardar métricas</button><button onClick={()=>runtime.loseContext?.()}>Simular pérdida de WebGL</button><button onClick={()=>runtime.restoreContext?.()}>Restaurar WebGL</button></div><p role="status">{message}</p><pre aria-label="Métricas del render en tiempo real">{metrics}</pre></details>;
}
