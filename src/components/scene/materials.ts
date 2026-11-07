import * as THREE from 'three';

const common=`
uniform sampler2D uNoise;
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vWorld;
varying float vDepth;
float n2(vec2 p){return texture2D(uNoise,p).r;}
float fb(vec2 p){return n2(p)*.58+texture2D(uNoise,p*2.03).g*.28+texture2D(uNoise,p*4.07).b*.14;}
vec3 aerial(vec3 c,float d){return mix(c,vec3(.49,.57,.55),1.-exp(-max(d-80.,0.)*.0015));}
`;
const vertex=`
uniform float uTime;varying vec2 vUv;varying vec3 vWorld;varying float vDepth;
void main(){vUv=uv;vec3 p=position;
 float fall=smoothstep(.30,.47,uv.y);
 float wave=sin(uv.x*241.+uTime*1.8+uv.y*38.)*.38+sin(uv.x*513.-uTime*3.1+uv.y*67.)*.16;
 p+=normal*wave*(.2+fall*1.5);
 p.y+=sin(p.x*.21+uTime*1.9)*.14*(1.-fall);
 vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;vec4 view=modelViewMatrix*vec4(p,1.);vDepth=-view.z;gl_Position=projectionMatrix*view;}
`;
export function waterMaterial(noise:THREE.Texture,detail:THREE.Texture){
 return new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{uNoise:{value:noise},uDetail:{value:detail},uTime:{value:0},uProgress:{value:0}},vertexShader:vertex,fragmentShader:common+`
uniform sampler2D uDetail;
void main(){
 float fall=smoothstep(.30,.42,vUv.y);
 vec2 q=vec2(vUv.x*9.,vUv.y*1.55-uTime*.085);
 float broad=fb(vec2(vUv.x*5.,vUv.y*.63-uTime*.043));
 float flow=fb(q+vec2(broad*.12,0.));
 float micro=texture2D(uDetail,q*vec2(1.35,.86)+vec2(flow*.06,-uTime*.03)).r;
 float ridge=pow(max(0.,sin(vUv.x*430.+broad*16.)),4.);
 float topNoise=fb(vWorld.xz*.012+vec2(uTime*.014,-uTime*.012));
 float foam=smoothstep(.38,.72,flow*.55+micro*.42+ridge*.12);
 float waterChannel=smoothstep(.23,.57,fb(vec2(vUv.x*17.,.3)));
 float white=clamp(foam*.85+fall*(.40+waterChannel*.23)+smoothstep(.25,.33,vUv.y)*(1.-smoothstep(.33,.41,vUv.y))*.3,0.,1.);
 vec3 water=mix(vec3(.115,.139,.103),vec3(.38,.37,.235),topNoise*.8);
 vec3 cream=mix(vec3(.52,.59,.55),vec3(.90,.93,.83),.3+micro*.7);
 vec3 c=mix(water,cream,white);
 float shadow=.73+.27*fb(vec2(vUv.x*36.,vUv.y*1.1-uTime*.06));
 c*=mix(1.,shadow,fall);
 vec3 N=normalize(cross(dFdx(vWorld),dFdy(vWorld)));if(!gl_FrontFacing)N=-N;
 vec3 L=normalize(vec3(.6,1.,.4));vec3 V=normalize(cameraPosition-vWorld);
 float spec=pow(max(dot(reflect(-L,N),V),0.),40.);
 c+=vec3(.26,.24,.17)*spec*(1.-white)*(.3+topNoise);
 c=aerial(c,vDepth);
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`});
}
export function rockMaterial(noise:THREE.Texture){
 return new THREE.ShaderMaterial({uniforms:{uNoise:{value:noise},uTime:{value:0},uProgress:{value:0}},side:THREE.DoubleSide,vertexShader:`varying vec2 vUv;varying vec3 vWorld;varying float vDepth;void main(){vUv=uv;vec4 p=vec4(position,1.);
 #ifdef USE_INSTANCING
 p=instanceMatrix*p;
 #endif
 vec4 w=modelMatrix*p;vWorld=w.xyz;vec4 mv=viewMatrix*w;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,fragmentShader:common+`
void main(){float n=fb(vWorld.xz*.047+vWorld.y*.02);float strata=smoothstep(.15,.6,abs(sin(vWorld.y*.9+n*8.)));
vec3 N=normalize(cross(dFdx(vWorld),dFdy(vWorld)));if(!gl_FrontFacing)N=-N;
float light=.27+.73*max(dot(N,normalize(vec3(.7,1.,.3))),0.);
vec3 c=mix(vec3(.038,.047,.034),vec3(.14,.145,.105),n)*light*(.7+.3*strata);
c+=vec3(.024,.043,.012)*smoothstep(.56,.7,n)*smoothstep(-.2,.7,N.y);
gl_FragColor=vec4(aerial(c,vDepth),1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
}
export function riverMaterial(noise:THREE.Texture){
 return new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{uNoise:{value:noise},uTime:{value:0},uProgress:{value:0}},vertexShader:vertex,fragmentShader:common+`
void main(){vec2 p=vWorld.xz*.008+vec2(uTime*.009,-uTime*.028);float n=fb(p);float f=smoothstep(.58,.7,fb(p*3.+n*.3));vec3 c=mix(vec3(.06,.10,.08),vec3(.27,.32,.25),n);c=mix(c,vec3(.67,.73,.66),f*.8);gl_FragColor=vec4(aerial(c,vDepth),1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
}
export function mistMaterial(noise:THREE.Texture){
 return new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uNoise:{value:noise},uTime:{value:0},uProgress:{value:0}},vertexShader:`
uniform float uTime;attribute vec3 aOffset;attribute float aSize;attribute float aPhase;
varying vec2 vUv;varying float vPhase;varying float vDepth;
void main(){vUv=uv;vPhase=aPhase;vec3 p=aOffset;p.x+=sin(uTime*.075+aPhase)*5.;p.y+=sin(uTime*.13+aPhase)*3.;vec4 mv=modelViewMatrix*vec4(p,1.);mv.xy+=position.xy*aSize;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,fragmentShader:`
uniform sampler2D uNoise;uniform float uTime;uniform float uProgress;varying vec2 vUv;varying float vPhase;varying float vDepth;
void main(){vec2 uv=vUv;float edge=pow(max(0.,1.-length((uv-.5)*2.)),1.6);
float n=texture2D(uNoise,uv*.43+vec2(vPhase*.17+uTime*.009,-uTime*.012)).r;
float fine=texture2D(uNoise,uv*.91+vec2(-uTime*.018,vPhase*.31)).g;
float a=edge*smoothstep(.24,.71,n*.7+fine*.3)*(.40+.13*(1.-uProgress));
vec3 col=mix(vec3(.43,.53,.51),vec3(.86,.91,.84),uv.y*.4+n*.6);
gl_FragColor=vec4(col,a);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
}
export function sprayMaterial(){
 return new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uTime:{value:0},uProgress:{value:0},uDpr:{value:1}},vertexShader:`
uniform float uTime;uniform float uDpr;attribute vec3 aSeed;varying float vAlpha;
void main(){float t=fract(aSeed.x+uTime*(.07+aSeed.y*.035));vec3 p=position;
p.y-=t*t*85.;vec2 inward=normalize(vec2(-p.x,-p.z-45.));p.xz+=inward*t*(5.+aSeed.z*12.);p.x+=sin(t*12.+aSeed.y*52.)*1.5;
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.+aSeed.y*1.6)*uDpr*130./max(10.,-mv.z),.6,6.);vAlpha=sin(t*3.14159)*.5;}`,fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.9,.94,.90,(1.-d*d)*vAlpha);}`});
}
export function skyMaterial(noise:THREE.Texture){
 return new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uNoise:{value:noise}},vertexShader:`varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
uniform sampler2D uNoise;varying vec3 vDir;void main(){vec3 d=normalize(vDir);float t=smoothstep(-.05,.65,d.y);vec3 c=mix(vec3(.60,.68,.65),vec3(.27,.42,.52),t);
vec2 uv=d.xz/(max(d.y,.15)*2.5);float n=texture2D(uNoise,uv*.11).r*.7+texture2D(uNoise,uv*.23).g*.3;float cloud=smoothstep(.43,.67,n)*smoothstep(-.02,.2,d.y);
c=mix(c,vec3(.86,.87,.79),cloud*.65);float sun=pow(max(dot(d,normalize(vec3(.5,.7,.4))),0.),50.);c+=vec3(.27,.22,.12)*sun;gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
}
