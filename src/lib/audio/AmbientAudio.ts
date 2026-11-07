import { audioMixAt } from '../experience/timeline';
import type { SceneDefinition,Vec3 } from '../experience/contracts';
import { LoopTransport } from './LoopTransport';
import { SpatialEmitter } from './SpatialEmitter';
export type AudioStatus='off'|'loading'|'playing'|'muted'|'suspended'|'error';
export class AmbientAudio {
 private context:AudioContext|undefined;private loop:LoopTransport|undefined;
 private ambient:GainNode|undefined;private detail:GainNode|undefined;private filter:BiquadFilterNode|undefined;
 private master:GainNode|undefined;private spatial:SpatialEmitter|undefined;private destination:MediaStreamAudioDestinationNode|undefined;
 private volume=.45;private muted=true;private blocked=false;private disposed=false;private loading=false;
 private lastUpdate=0; private decodedBytes=0;private progress=0;private url='';private suspensionCount=0;
 status:AudioStatus='off';
 constructor(private asset:SceneDefinition['audio'],private onChange:(status:AudioStatus)=>void){}
 private setStatus(s:AudioStatus){this.status=s;this.onChange(s)}
 async activate(){
  if(this.loading)return;
  try{
   if(!this.context){
    this.context=new AudioContext({latencyHint:'playback'});
    // resume stays in the user-gesture call stack, before fetching the recording.
    await this.context.resume();this.loading=true;this.setStatus('loading');
    this.master=this.context.createGain();this.master.gain.value=0;
    const limiter=this.context.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=6;limiter.ratio.value=4;
    this.master.connect(limiter);limiter.connect(this.context.destination);
    this.destination=this.context.createMediaStreamDestination();limiter.connect(this.destination);
    this.ambient=this.context.createGain();this.detail=this.context.createGain();this.filter=this.context.createBiquadFilter();this.filter.type='lowpass';
    const initial=audioMixAt(this.progress);this.ambient.gain.value=initial.ambient;this.detail.gain.value=initial.detail;this.filter.frequency.value=initial.cutoff;
    this.spatial=new SpatialEmitter(this.context);const bus=this.context.createGain();
    bus.connect(this.ambient);this.ambient.connect(this.master);
    bus.connect(this.filter);this.filter.connect(this.detail);this.detail.connect(this.spatial.node);this.spatial.node.connect(this.master);
    let buffer:AudioBuffer|undefined;
    for(const src of [this.asset.src,this.asset.fallbackSrc]){
     try{const response=await fetch(src);if(!response.ok)throw new Error('Audio unavailable');buffer=await this.context.decodeAudioData(await response.arrayBuffer());this.url=src;break}catch{}
    }
    if(!buffer)throw new Error('No supported recording');
    if(this.disposed)return;
    this.decodedBytes=buffer.length*buffer.numberOfChannels*4;
    this.loop=new LoopTransport(this.context,buffer,bus);this.loop.start();this.loading=false;
   }
   this.muted=false;await this.context.resume();this.applyVolume();this.setStatus(this.blocked?'suspended':'playing');
   if(this.blocked){this.loop?.pauseScheduler();await this.context.suspend()}else this.loop?.start();
  }catch{this.loading=false;this.setStatus('error');await this.disposeContext()}
 }
 toggle(){if(!this.context||this.status==='off'||this.status==='error')return this.activate();this.muted=!this.muted;this.applyVolume();this.setStatus(this.blocked?'suspended':this.muted?'muted':'playing')}
 setVolume(value:number){this.volume=Math.max(0,Math.min(1,value));this.applyVolume()}
 private applyVolume(){if(this.context&&this.master){const t=this.context.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setTargetAtTime(this.muted?0:this.volume,t,.07)}}
 async suspend(blocked:boolean){
  if(blocked&&!this.blocked&&this.context)this.suspensionCount++;this.blocked=blocked;if(!this.context||this.loading)return;
  if(blocked){this.loop?.pauseScheduler();await this.context.suspend();this.setStatus('suspended')}
  else{try{await this.context.resume();this.loop?.start();this.setStatus(this.muted?'muted':'playing')}catch{this.setStatus('muted')}}
 }
 update(progress:number,position:Vec3,target:Vec3){
  this.progress=progress;if(!this.context||this.context.state!=='running'||performance.now()-this.lastUpdate<60)return;
  this.lastUpdate=performance.now();const mix=audioMixAt(progress),t=this.context.currentTime;
  this.ambient?.gain.setTargetAtTime(mix.ambient,t,.18);this.detail?.gain.setTargetAtTime(mix.detail,t,.18);this.filter?.frequency.setTargetAtTime(mix.cutoff,t,.18);this.spatial?.update(position,target);
 }
 get stream(){return this.destination?.stream}
 get stats(){return {status:this.status,context:this.context?.state??'not-created',decodedMB:this.decodedBytes/1048576,sources:this.loop?.sourceCount??0,volume:this.volume,muted:this.muted,progress:this.progress,mix:audioMixAt(this.progress),source:this.url,suspensionCount:this.suspensionCount}}
 private async disposeContext(){this.loop?.dispose();this.spatial?.dispose();if(this.context&&this.context.state!=='closed')await this.context.close();this.context=undefined;this.loop=undefined}
 dispose(){this.disposed=true;void this.disposeContext()}
}
