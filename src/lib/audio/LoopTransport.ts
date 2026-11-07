/** Equal-power overlapped loops. One decoded documentary recording, no network on transitions. */
export class LoopTransport {
 private timer:ReturnType<typeof setInterval>|undefined;
 private next=0; private active=new Set<AudioBufferSourceNode>(); private started=false;
 constructor(private context:AudioContext,private buffer:AudioBuffer,private output:AudioNode,private overlap=.8){}
 private schedule=()=>{
  while(this.next<this.context.currentTime+2){
   const source=this.context.createBufferSource(),gain=this.context.createGain();
   source.buffer=this.buffer;source.connect(gain);gain.connect(this.output);
   const start=Math.max(this.next,this.context.currentTime),end=start+this.buffer.duration;
   const fadeIn=new Float32Array(48),fadeOut=new Float32Array(48);
   for(let i=0;i<48;i++){fadeIn[i]=Math.sin(i/47*Math.PI/2);fadeOut[i]=Math.cos(i/47*Math.PI/2)}
   gain.gain.setValueAtTime(0,start);gain.gain.setValueCurveAtTime(fadeIn,start,this.overlap);
   gain.gain.setValueAtTime(1,end-this.overlap);gain.gain.setValueCurveAtTime(fadeOut,end-this.overlap,this.overlap);
   source.start(start);source.stop(end);this.active.add(source);
   source.onended=()=>{source.disconnect();gain.disconnect();this.active.delete(source)};
   this.next=start+this.buffer.duration-this.overlap;
  }
 };
 start(){if(!this.started){this.next=this.context.currentTime+.04;this.started=true}this.schedule();this.timer??=setInterval(this.schedule,250)}
 pauseScheduler(){if(this.timer)clearInterval(this.timer);this.timer=undefined}
 dispose(){this.pauseScheduler();for(const source of this.active){try{source.stop()}catch{}source.disconnect()}this.active.clear()}
 get sourceCount(){return this.active.size}
}
