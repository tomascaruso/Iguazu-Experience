import {NextRequest,NextResponse} from 'next/server';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
const names=new Set(['desktop-scene.png','mobile-scene.png','scroll-audiovisual.webm','browser-audio.webm','desktop-metrics.json','mobile-metrics.json']);
/** Local review only. Disabled unless explicitly started through the local preview script. */
export async function POST(request:NextRequest){
 if(process.env.H2_LOCAL_EVIDENCE!=='1')return new NextResponse(null,{status:404});
 const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host')??request.headers.get('host');
 if(!origin||new URL(origin).host!==host)return new NextResponse(null,{status:403});
 const name=request.nextUrl.searchParams.get('name');if(!name||!names.has(name))return new NextResponse(null,{status:400});
 const declared=Number(request.headers.get('content-length')??0);if(declared>32*1024*1024)return new NextResponse(null,{status:413});
 const chunks:Uint8Array[]=[];let size=0;const reader=request.body?.getReader();if(!reader)return new NextResponse(null,{status:400});
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>32*1024*1024){await reader.cancel();return new NextResponse(null,{status:413})}chunks.push(value)}
 const buffer=Buffer.concat(chunks);const dir=path.join(process.cwd(),'evidence');await mkdir(dir,{recursive:true});await writeFile(path.join(dir,name),buffer);return NextResponse.json({saved:name,bytes:size});
}
