import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
// Local review only. Never registers a site or writes to a remote repository.
const built=existsSync('.next/BUILD_ID');
const args=process.argv.slice(2);const value=(flag,fallback)=>args.includes(flag)?args[args.indexOf(flag)+1]:fallback;
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',built?'start':'dev','--hostname',value('--host','0.0.0.0'),'--port',value('--port',process.env.PORT??'3000')],{
  stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',H2_LOCAL_EVIDENCE:'1'}
});
process.on('SIGTERM',()=>child.kill('SIGTERM'));process.on('SIGINT',()=>child.kill('SIGINT'));
child.on('exit',code=>process.exit(code??0));
