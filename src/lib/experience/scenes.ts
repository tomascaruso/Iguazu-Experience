import type { SceneDefinition } from './contracts';
import { cameraKeys } from './timeline';
export const garganta:SceneDefinition={
  id:'S03',title:'Garganta del Diablo',poster:'/assets/garganta-poster.webp',camera:cameraKeys,
  hotspot:{id:'borde',position:[-39,-9,-98],title:'El borde del asombro'},
  audio:{id:'garganta-water',src:'/assets/audio/garganta.opus',fallbackSrc:'/assets/audio/garganta.m4a',license:'CC BY-SA 4.0',creator:'Josep M. Gracia',source:"https://commons.wikimedia.org/wiki/File:GD_-_Devil%27s_Throat_from_the_Argentine_viewpoint_at_Iguazu_Falls,_2023.webm"},
};
// Only the authorized module is registered. Further modules use the same contract.
export const sceneRegistry:Readonly<Record<string,SceneDefinition>>={S03:garganta};
