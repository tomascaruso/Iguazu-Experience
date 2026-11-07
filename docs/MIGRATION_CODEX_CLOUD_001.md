> Informe histórico de la recuperación inicial. La exportación pública posterior usa un historial raíz nuevo con identidad técnica, conserva el JPEG original de Mariordo fuera del repositorio y distribuye su WebP intacto. Los SHA y los inventarios originales citados abajo describen aquella etapa, no el historial público actual. Ver PUBLICATION_WORK_H2.md.

# Iguazú Experience — migración Work → Codex Cloud · tarea 001

Fecha: 7 de noviembre de 2026 (America/Buenos_Aires).

**MIGRATION_PARTIAL**

**WEBGL_AVAILABLE = YES** — Chromium, WebGL2 y SwiftShader por software.

**H2_VISUAL_APPROVAL = PENDING**

El proyecto original se recuperó íntegramente, se instaló desde el lockfile y compiló. Los controles fundamentales y el primer render real están verificados, pero el recorrido automatizado falla en dos casos. GitHub sigue sin commits remotos: todavía no constituye una copia del código recuperado. No se modificó el diseño ni se inició una nueva fase visual.

## 1. Repositorio e identidad

- Remoto existente: `https://github.com/tomascaruso/Iguazu-Experience.git`.
- Checkout: `/workspace/Iguazu-Experience`; único proyecto Git encontrado en una inspección completa de `/workspace`. El `.git` vacío y de solo lectura en `/workspace` es un marcador de plataforma, no otro checkout.
- Se reutilizó el repositorio conectado; no se creó otro repositorio ni un worktree.
- `git ls-remote --symref origin HEAD 'refs/heads/*'` terminó con código 0 y sin referencias, tanto antes como después de la importación.
- Visibilidad GitHub: **no verificada**. La consulta de metadatos a `api.github.com` fue rechazada por la política de red (CONNECT 403). `private: true` en package.json no demuestra que el repositorio GitHub sea privado. No se cambiaron permisos ni se añadieron credenciales.

## 2. Rama y HEAD

- Estado inicial: rama local `work`, sin commits, sin archivos ni cambios del usuario; no existía `main` local o remota.
- Se creó la rama local nueva `migration/work-h2`, sin crear ni modificar `main`.
- Commit local de importación: `da572c2ade448938f915cfb21cd2ab27168b1299`.
- Mensaje: `chore: import Iguazu Experience H2 from Work`.
- Este informe se añade en un commit local posterior. Su SHA final se consulta con `git rev-parse HEAD`; el SHA anterior identifica exactamente el código sometido a las pruebas.
- No hubo push, merge, despliegue ni modificación remota. El historial local aún no tiene un ancestro `main` contra el que abrir una comparación normal.

## 3. Recuperación e inventario

Origen: ZIP adjunto `Iguazu_Experience_H2_Para_GitHub.zip`, 23.366.483 bytes.

SHA-256 del ZIP: `32f9e2a58dfe858db2c7dd82aed75766ff7bfd098cb0d9b080970e30ac31c4dc`.

Se comprobaron la integridad CRC del ZIP, rutas seguras y ausencia de enlaces simbólicos. Se extrajeron **68 archivos**, 24.286.275 bytes descomprimidos, directamente en la raíz. Se compararon todos los archivos byte a byte antes del commit y después de instalar, compilar y ejecutar: **68/68 idénticos al ZIP**.

Inventario recuperado:

- README, AGENTS, H2_VALIDACION, LICENSES, assets-manifest y research/H2_SCOPE, leídos antes de instalar.
- package.json, package-lock.json y configuraciones originales de Next, TypeScript, Tailwind y Playwright.
- `src/app/`, incluidas `/`, `/creditos`, `/revision` y `/api/evidence`.
- `Experience.tsx`, `SceneCanvas.tsx`, `GargantaScene.tsx`, geometría y materiales/shaders originales.
- `src/lib/audio/` y `src/lib/experience/`, sin sustituciones.
- `public/assets/`: fotografías, referencias, ruido, microtextura, audio Opus/AAC y fuentes con sus licencias.
- `research/`: medios originales y fuentes documentales; `tests/`, `qa/`, scripts y PDF original en docs.

No se importó el ZIP como un blob en Git ni se incorporaron evidencias históricas ausentes del paquete. No se reconstruyó nada desde descripciones.

## 4. Plataforma y versiones

Debian GNU/Linux 13.6, x86_64; Node **24.22.1**, npm **11.9.0**, Git **2.52.0**. Chromium del sistema **156.0.8078.79**, en `/usr/bin/chromium`; Playwright del proyecto **1.62.1**. La herramienta Python preinstalada usa Playwright 1.62.0 y solo se utilizó para diagnósticos complementarios.

Dependencias fijadas e instaladas: Next **16.4.5**, React/React DOM **19.3.1**, Three.js **0.187.0**, R3F **9.8.2**, Drei **10.7.9**, GSAP **3.15.1**, TypeScript **7.0.2**, Tailwind/PostCSS **4.3.5**. No se actualizó ninguna versión ni se modificó el lockfile.

Recursos disponibles: cinco CPU lógicas, aproximadamente 33 GiB de RAM y 60 GiB de disco libre al inicio. Next compiló con cuatro workers. No se instalaron paquetes globales, servicios de pago ni dependencias opcionales para regenerar los recursos.

## 5. Instalación reproducible

El primer `npm ci` falló con `ENOENT` al intentar crear `/home/agent/.npm/_cacache`; las advertencias de tarball de ese intento no se aceptaron como una instalación válida. Se corrigió únicamente la ubicación de caché:

```bash
cd /workspace/Iguazu-Experience
export npm_config_cache=/workspace/.cache/npm
export NEXT_TELEMETRY_DISABLED=1
mkdir -p "$npm_config_cache"
npm ci
```

Resultado: **PASS**, 122 paquetes instalados. Se ejecutó de nuevo el script completo guardado y también pasó, con 122 paquetes en 16 s. No se deshabilitaron TLS, comprobaciones de integridad, firmas ni resolución de peers; no se usaron `--force`, `--legacy-peer-deps` o `npm install`.

GitHub y registry.npmjs.org funcionan con el acceso existente. El flujo normal no necesita claves, bases de datos, descargas de medios ni cuentas externas.

## 6. Typecheck y pruebas unitarias

Ejecutadas en el orden solicitado:

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` | PASS, salida 0 |
| `npm test` | PASS, 7 ejecutados, 7 aprobados, 0 fallidos, omitidos o cancelados |
| `npm run audit:assets` | PASS, salida 0 |
| `npm run build` | PASS, salida 0 |
| `npm audit --json` | PASS, salida 0; misma auditoría solicitada con salida estructurada |

Los unitarios ejercitan geometría finita e índices, presupuestos, densidad de bruma, cámara reversible, pausa/convergencia, mezcla de audio y umbrales de fase. No equivalen a pruebas del navegador o de realismo.

## 7. Build y servidores

Build de producción aprobado en aproximadamente 7,9 s: compilación Turbopack, TypeScript y prerenderizado. Rutas generadas: `/`, `/_not-found`, `/creditos`, `/revision` y `/api/evidence` dinámica.

Se ejecutó `npm run develop -- --port 3000`, se validó por HTTP y se utilizó para los seis tests de navegador. Después se detuvo ese servidor y se ejecutó `npm start -- --port 3000` para el diagnóstico de producción. Un primer arranque de producción encontró el puerto aún ocupado por el proceso de desarrollo; se identificó y terminó exclusivamente ese proceso antes de repetir con éxito.

Tras repetir la instalación, también se reinició producción con éxito y se comprobaron otra vez las tres páginas y el hash del audio servido. Los procesos vivos no se consideran parte del entorno reutilizable.

## 8. Integridad y auditorías

- **11 recursos**, **2.006.998 bytes**, todos los SHA-256 del manifiesto correctos y con autor, procedencia y licencia declarados.
- Opus: 120.118 bytes; el recurso servido por HTTP coincide con el original.
- Las 11 URLs de recursos respondieron 200 y conservaron los hashes, incluidas las dos fuentes y los dos formatos de audio.
- Auditoría npm actual: **0 vulnerabilidades reportadas**. Se conserva aparte el resultado histórico de Work; no se reemplazó `research/npm-audit.json`.
- Licencias y originales conservados. No se regeneraron imágenes, audio, geometría o shaders.

## 9. Diagnóstico WebGL

El primer Chromium dentro del sandbox de comandos abortó porque el helper SUID aparecía con propietario incorrecto. La ejecución oficial escalada, aprobada por la plataforma, funcionó con **`chromiumSandbox: true`**. No se cambiaron propietarios, permisos o políticas; no se utilizó `--no-sandbox`. También se retiró el flag predeterminado de Playwright `--enable-unsafe-swiftshader` de las ejecuciones válidas, sin forzar una excepción de seguridad.

Resultados de la ejecución válida:

- Contexto **WebGL2** creado.
- Renderer: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`.
- Clear/readPixels: `[51, 102, 153, 255]`, error GL 0.
- Escena mínima con Three.js original, un cubo: un draw call, 12 triángulos, píxel central `[199,87,224,255]`, error GL 0 y 0 excepciones de página.
- Captura auténtica: `evidence/three-minimal.png`, inspeccionada.
- Escena H2 original visible en `evidence/mobile-chromium-revelar.png` y `evidence/h2-production-low.png`, también inspeccionadas. Son renders reales, no fotografías usadas como sustituto ni imágenes generadas.

Hay WebGL, pero el renderer es **software**. La muestra diagnóstica de calidad baja y viewport 480 × 600 registró aproximadamente 2–3 FPS, 12 draw calls y 72.624 triángulos. No es una medida de GPU física, rendimiento móvil o VRAM real. No acredita fluidez ni aprobación artística.

El escritorio compartido figura habilitado con estado desconocido para el entorno `ccarenv_b64_Y2NhcmVudl83YWY2ZWMyMGFjMzA4MTkxYjVlNzY4MGE5ZDc2Y2M2ZQ`, pero no se ofrecieron herramientas `cua_repl.js`/CDP del escritorio. La validación se hizo con Chromium automatizado, no mediante ese escritorio.

## 10. Aplicación en navegador

La primera invocación del runner no pudo abrir las páginas porque el video opcional requería el FFmpeg propio de Playwright ausente. Esa ejecución es un fallo de inicialización, no seis pruebas de comportamiento válidas. Para la ejecución funcional se creó únicamente una configuración local ignorada, usando Chromium del sistema, sandbox activado, videos del runner desactivados y capturas/trazas conservadas. No se cambiaron tests ni aserciones.

Resultado funcional final: **6 tests ejecutados, 4 PASS, 2 FAIL, 0 omitidos**.

| Caso | Escritorio | Móvil emulado |
| --- | --- | --- |
| Recorrido auténtico WebGL | FAIL: timeout al volver a progreso 0, línea 9 | FAIL: Acercarse no supera 0,4 en el plazo, línea 11 |
| Fallback, teclado, panel y controles de sonido | PASS | PASS |
| Preferencia real `prefers-reduced-motion` | PASS | PASS |

Los casos WebGL alcanzaron `ready`, pero abortaron antes de completar todas sus comprobaciones. **No quedaron aprobadas** la reversa completa, la pausa dentro del test integral ni la recuperación de contexto. No se deshabilitaron esas aserciones ni se reinterpretaron los fallos como éxitos.

Diagnóstico adicional en producción, sin modificar código:

- Hotspot: Enter abre el panel y Escape lo cierra.
- Fuentes Fraunces y Manrope: estado `loaded` en `document.fonts`.
- Audio tras gesto: `playing`, AudioContext `running`, Opus decodificado a 4,75 MiB; al pausar la escena se observó contexto `suspended`. No se evaluó subjetivamente su calidad ni se grabó el recorrido audiovisual.
- A scrollY **605**, viewport alto **600** y story alto **1860**, Acercarse produjo progreso **1** antes de redimensionar. Un resize real de 480 a 481 px conservó scrollY 605 y recalculó el progreso a **0,4801587**; el progreso visible convergió a ese valor.
- Esto reproduce un desajuste de rango independiente de los plazos del runner. El efecto de ScrollTrigger en `Experience.tsx` depende de `runtime` y `staticMode`, pero no de la disponibilidad WebGL que cambia la altura inicial. La corrección mínima propuesta es revisar el refresh al estabilizar el layout 3D; **no se implementó en esta tarea**.
- Excepciones de página en el diagnóstico de producción: **0**. La consola no está totalmente limpia: advertencia de deprecación `THREE.Clock`, avisos del renderer software/ReadPixels y dos mensajes HTTP 404. Se confirmó además que `/favicon.ico` responde 404; no se atribuyen ambos mensajes a esa URL sin una traza específica.
- `/`, `/creditos` y `/revision` responden 200. POST `/api/evidence` responde 404 en el arranque ordinario, como exige su diseño.

Las capturas no implican aprobación visual. Hay pendientes de composición, oclusiones, vegetación, agua, legibilidad y comportamiento responsive que requieren la siguiente revisión de H2.

## 11. Arquitectura y continuidad

Se conservaron geometría procedural, materiales, shaders, SceneCanvas, GargantaScene, cámara, GSAP, audio, accesibilidad y recuperación. `SceneDefinition` y `sceneRegistry` ofrecen una base modular con solo S03 registrado; Experience y GargantaScene todavía dependen directamente de Garganta. Ampliar a ocho escenas requerirá separar esa orquestación y comprobar carga/descarga y presupuestos, en una tarea posterior. No se desarrollaron los otros siete escenarios.

## 12. Riesgos y límites

1. Rango de scroll desactualizado al cambiar el layout inicial; reproducido en producción. Corregir antes de aprobar el recorrido.
2. Dos tests integrales fallidos; recuperación de contexto y secuencia completa aún sin validación.
3. SwiftShader sirve para diagnósticos, no para aceptar rendimiento de dispositivos físicos. Falta Android/iOS/Safari y GPU real.
4. La regla original `evidence/` del `.gitignore` también oculta `src/app/api/evidence/route.ts`. Se detectó antes del commit y ese archivo original se añadió explícitamente con `git add --force`. Proponer `/evidence/` en una tarea de código futura; el `.gitignore` original no fue alterado.
5. No se comprobó la privacidad GitHub; no confundirla con el campo private del paquete npm.
6. El remoto sigue vacío. Los commits locales están respaldados en un bundle, pero su restauración en una tarea Cloud nueva no está garantizada hasta verificarla. No hacer push ni crear main unilateralmente para resolverlo.
7. Faltan una decisión de licencia del código propio y la revisión sonora/artística. Se conservaron todas las licencias de los medios.

## 13. Cambios locales y configuración reutilizable

- Importación exacta de 68 archivos en la rama de migración y un commit local.
- Este informe es el único archivo de proyecto nuevo respecto del ZIP. No se modificaron aplicación, shaders, audio, recursos, tests, manifiestos o lockfile.
- Next dev cambió temporalmente rutas en `next-env.d.ts`; se comprobó que solo era la sustitución generada `.next/types/` → `.next/dev/types/` y se restauraron los bytes originales después de detenerlo.
- Dependencias, build, caché, helpers, logs y capturas permanecen fuera del versionado (`node_modules/`, `.next/`, `evidence/` y `/workspace/.cache/npm`).
- Se guardaron **install_script** y **start_skill** mediante la herramienta de configuración. El script usa Node >=24 y `npm ci` con caché escribible. Las instrucciones incluyen arranque, comprobaciones HTTP, configuración local de Playwright, sandbox, efectos de Next dev y fallos conocidos.
- Guardar el borrador no ejecuta scripts, aplica ajustes ni publica. La instalación y los arranques se ejecutaron por separado en esta instancia. Revisar y guardar en ajustes antes de publicar el entorno cuando corresponda; no se afirma restauración en una tarea nueva.
- No se añadieron secretos, variables obligatorias, dominios de red ni servicios externos.

## 14. Estado Git y evidencias

El commit de importación contiene los 68 originales, incluida la API de evidencias. El commit de documentación añade solo este informe; el árbol queda limpio al terminar. Se conserva la rama `migration/work-h2`; `main` no fue creada ni modificada. No hay referencias remotas nuevas.

El respaldo local `/workspace/scratch/iguazu-experience-migration.bundle` conserva ambos commits. No es una publicación en GitHub ni una prueba de restauración futura de Cloud.

Resultados actuales, todos en `evidence/` e ignorados por Git:

- `npm-ci.log`, `npm-ci-repeat.log`, `checks.json`, logs individuales de los cinco comandos.
- `http-checks.json`, `restart-production.json` y HTML de desarrollo/producción.
- `webgl-probe.json`, `three-minimal.json`, `three-minimal.png` y errores de arranque inicial para trazabilidad.
- `browser-results.json`, `browser-run.log`, `playwright-report/` y trazas en `browser-tests/`.
- `app-diagnostic.json`, `app-diagnostic.log`, `mobile-chromium-revelar.png` y `h2-production-low.png`.
- Configuración local `playwright.cloud.config.ts` y helpers de diagnóstico. No se versionan ni se mezclan con las evidencias históricas de Work.

## 15. Próxima tarea propuesta

Primero autorizar y completar la publicación de la rama de importación en el GitHub existente, verificando su visibilidad y acordando la creación de la base main, sin merge o despliegue automático. Luego, con autorización separada, corregir el refresh de ScrollTrigger y repetir los dos tests fallidos; verificar recuperación del contexto y el recorrido audiovisual antes de iniciar mejoras visuales. Mantener **H2_VISUAL_APPROVAL = PENDING** hasta una revisión real y aprobación expresa.
