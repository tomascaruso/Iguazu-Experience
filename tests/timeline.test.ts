import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt,advanceProgress,audioMixAt,phaseAt} from '../src/lib/experience/timeline.ts';
test('camera follows reversible native progress, with finite mobile framing',()=>{for(const p of [0,.23,.5,.76,1]){const a=cameraAt(p),b=cameraAt(p);assert.deepEqual(a,b);assert.ok(cameraAt(p,true).position.every(Number.isFinite))}assert.notDeepEqual(cameraAt(0).position,cameraAt(1).position);assert.deepEqual(cameraAt(-1),cameraAt(0));assert.deepEqual(cameraAt(2),cameraAt(1))});
test('pause freezes camera, reverse scroll converges without overshoot',()=>{assert.equal(advanceProgress(.4,.9,.1,true),.4);let p=.9;for(let i=0;i<150;i++){const next=advanceProgress(p,.1,1/60,false);assert.ok(next<=p&&next>=.1);p=next}assert.ok(Math.abs(p-.1)<.0001)});
test('audio mix is continuous, bounded and increases proximity',()=>{let old=audioMixAt(0);for(let i=1;i<=1000;i++){const next=audioMixAt(i/1000);assert.ok(next.cutoff>=old.cutoff);assert.ok(next.detail-old.detail<.002);assert.ok(next.ambient+next.detail<1);old=next}assert.equal(audioMixAt(0).cutoff,1100);assert.equal(audioMixAt(1).cutoff,7300)});
test('phase thresholds are deterministic',()=>{assert.equal(phaseAt(0),'reveal');assert.equal(phaseAt(.23),'approach');assert.equal(phaseAt(.76),'contemplate')});
