import type { QualityTier } from './contracts';
export const qualityProfiles={
  high:{dpr:1.5,arcSegments:240,flowSegments:108,trees:600,mist:32,particles:2100},
  balanced:{dpr:1.15,arcSegments:144,flowSegments:62,trees:220,mist:22,particles:1200},
  low:{dpr:.85,arcSegments:128,flowSegments:64,trees:180,mist:14,particles:550},
} as const;
export function startingQuality(width:number):QualityTier {return width<760?'balanced':'high'}
