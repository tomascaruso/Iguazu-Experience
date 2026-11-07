'use client';
import type { AudioStatus } from '@/lib/audio/AmbientAudio';
export default function AudioControls({status,volume,onToggle,onVolume}:{status:AudioStatus;volume:number;onToggle:()=>void;onVolume:(v:number)=>void}){
 const playing=status==='playing';
 return <div className="audio-controls">
  <button type="button" className="sound-button" onClick={onToggle} disabled={status==='loading'} aria-pressed={playing} aria-label={playing?'Silenciar sonido':'Activar sonido'}>
   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.5"/>{playing?<><path d="M16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14" stroke="currentColor" strokeWidth="1.5"/></>:<path d="m17 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.5"/>}</svg>
   <span>{playing?'Sonido activo':status==='loading'?'Cargando audio':status==='error'?'Reintentar audio':'Activar sonido'}</span>
  </button>
  <label className="volume-label"><span className="sr-only">Volumen ambiental</span><input aria-label="Volumen ambiental" type="range" min="0" max="100" value={Math.round(volume*100)} onChange={e=>onVolume(Number(e.target.value)/100)}/></label>
 </div>;
}
