import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('assets-manifest.json','utf8'));
let total=0;for(const asset of manifest.resources){const bytes=await readFile(asset.path);if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error(`Integrity mismatch: ${asset.path}`);if(!asset.author||!asset.license||!asset.source)throw new Error(`Missing provenance: ${asset.path}`);total+=bytes.length}
const audio=await stat('public/assets/audio/garganta.opus');if(audio.size>250000)throw new Error('Audio transfer exceeds budget');
console.log(JSON.stringify({resources:manifest.resources.length,totalAssetBytes:total,opusBytes:audio.size,allHashesMatch:true},null,2));
