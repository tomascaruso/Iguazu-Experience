import {test,expect} from '@playwright/test';
type Snapshot={status:string;displayedProgress:number;time:number;camera:number[];frames:number;contextLosses:number;audio?:{status:string;context:string;volume:number;muted:boolean;decodedMB:number}};
test('authentic WebGL: native scroll, reverse, pause, hotspot, recovery',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?qa=1');await page.getByText('Revisión técnica H2',{exact:true}).click();
 const metrics=page.getByLabel('Métricas del render en tiempo real');const snapshot=async()=>JSON.parse(await metrics.textContent()||'{}') as Snapshot;
 // Fallback deliberately FAILS this test. It is not a successful WebGL render.
 await expect.poll(async()=>(await snapshot()).status,{timeout:20000}).toBe('ready');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await expect.poll(async()=>(await snapshot()).displayedProgress).toBe(0);
 const first=await snapshot();await page.screenshot({path:`evidence/${info.project.name}-revelar.png`});
 await page.getByRole('button',{name:'02 Acercarse',exact:true}).click();await expect.poll(async()=>(await snapshot()).displayedProgress).toBeGreaterThan(.4);
 expect((await snapshot()).camera).not.toEqual(first.camera);
 await page.getByRole('button',{name:'Pausar',exact:true}).click();await page.waitForTimeout(1300);const stopped=await snapshot();await page.mouse.wheel(0,200);await page.waitForTimeout(1300);const later=await snapshot();expect(later.time).toBeCloseTo(stopped.time,1);
 await page.getByRole('button',{name:'Reanudar',exact:true}).click();await page.getByRole('button',{name:'03 Contemplar',exact:true}).click();await expect.poll(async()=>(await snapshot()).displayedProgress).toBeGreaterThan(.97);
 await page.screenshot({path:`evidence/${info.project.name}-contemplar.png`});
 const hotspot=page.getByRole('button',{name:'Explorar el borde de Garganta del Diablo',exact:true});await expect(hotspot).toBeVisible();await hotspot.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cerrar información'}).press('Escape');await expect(hotspot).toBeFocused();
 await page.getByRole('button',{name:'01 Revelar',exact:true}).click();await expect.poll(async()=>(await snapshot()).displayedProgress).toBe(0);expect((await snapshot()).camera).toEqual(first.camera);
 await page.getByRole('button',{name:'Simular pérdida de WebGL'}).click();await expect(page.getByText('El paisaje 3D se interrumpió.')).toBeVisible();await page.getByRole('button',{name:'Recuperar experiencia'}).click();await expect.poll(async()=>(await snapshot()).status).toBe('ready');
 expect(errors).toEqual([]);
});
test('fallback remains keyboard accessible and sound starts off',async({page})=>{
 await page.goto('/?qa=1&webgl=off');await expect(page.locator('canvas')).toHaveCount(0);const sound=page.getByRole('button',{name:'Activar sonido',exact:true});await expect(sound).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Descubrí este lugar'}).press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cerrar información'}).press('Escape');await expect(page.getByRole('button',{name:'Descubrí este lugar'})).toBeFocused();
 await sound.click();await expect(page.getByRole('button',{name:'Silenciar sonido',exact:true})).toBeVisible();await page.getByRole('slider',{name:'Volumen ambiental',exact:true}).press('ArrowLeft');await page.getByRole('button',{name:'Silenciar sonido',exact:true}).click();await expect(sound).toHaveAttribute('aria-pressed','false');
});
test('actual reduced-motion preference avoids animation and canvas',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByText(/Se respetó tu preferencia de movimiento reducido/)).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);
});
