# Iguazú Experience · H2 / Garganta del Diablo

**Estado: implementación local, aceptación H2 pendiente.** El build y las pruebas de lógica pasan. El navegador compartido del entorno bloquea WebGL (`GL_RENDERER = Disabled`); por eso no hay evidencia visual del render 3D, video del scrollytelling ni aprobación artística. Las capturas disponibles muestran la alternativa fotográfica y HTML, rotulada como tal. No es un sitio publicado.

## Ejecutar en Windows, macOS o Linux

Requisitos: Node.js 24 o superior, npm, un navegador con WebGL2. No requiere Ubuntu/WSL, Docker, cuentas, claves ni servicios de pago.

```sh
npm ci
npm run build
npm start
```

Abrir `http://localhost:3000`. `npm start` no habilita la escritura local de evidencias. Para desarrollo, usar `npm run develop`.

Para una revisión local con capturas, audio y video:

```sh
npm run dev
```

Abrir `http://localhost:3000/?qa=1`. El script usa el build si existe; de lo contrario usa Next dev. Los botones de revisión escriben únicamente nombres predefinidos en `evidence/`, con límite de 32 MiB y verificación de origen. Esta ruta es una herramienta local; no habilitarla en un despliegue.

- `/?qa=1`: métricas y controles de captura.
- `/?qa=1&webgl=off`: alternativa sin WebGL.
- `/?qa=1&motion=reduce`: inyección del estado de movimiento reducido para revisión manual; no sustituye probar la preferencia real del sistema.
- `/revision`: iframe de 390 × 844 CSS px para revisar responsive. No representa hardware móvil.
- `/creditos`: procedencia y licencias.

El audio empieza apagado en cada carga. Solo se conserva el volumen. El botón de audio permanece visible fuera del escenario y también está disponible en el panel modal.

## Verificar

```sh
npm run typecheck
npm test
npm run audit:assets
npm audit
```

Siete pruebas de lógica y geometría fueron ejecutadas. No equivalen a pruebas WebGL.

Las seis pruebas de navegador (tres casos × dos proyectos) están preparadas en `qa/h2.spec.ts`, **sin ejecución completa en este entorno**. Fallan explícitamente si se intenta aprobar la escena 3D mostrando un fallback.

Con la app ejecutándose localmente:

```sh
npm run qa:install
npm run qa:browser
```

No activar flags experimentales para usar la web. Registrar navegador, GPU y dispositivo de las pruebas. La emulación móvil de Playwright no reemplaza revisar Android e iOS físicos.

## Arquitectura

| Área | Archivos | Responsabilidad |
| --- | --- | --- |
| Página y contenido | `src/app`, `src/components/Experience.tsx` | HTML prerenderizado, navegación, panel, orquestación |
| Contrato de escena | `src/lib/experience/contracts.ts`, `scenes.ts` | Solo S03 registrado; preparado para futuros módulos |
| Coreografía | `timeline.ts`, `runtime.ts` | Curvas deterministas; scroll nativo; pausa y reversa |
| Render | `src/components/scene/SceneCanvas.tsx`, `GargantaScene.tsx` | R3F, ciclo de vida, métricas, pérdida de contexto |
| Recursos 3D | `geometry.ts`, `materials.ts` | Superficies propias; agua, roca, selva, bruma y spray |
| Calidad | `quality.ts` | Tres perfiles, DPR limitado, reducción por tiempos de frame |
| Ambiente | `src/lib/audio/AmbientAudio.ts` | Carga voluntaria, mezcla, volumen, suspensión |
| Transporte sonoro | `LoopTransport.ts` | Solapamiento de 0,8 s, curva de potencia igual |
| Audio espacial | `SpatialEmitter.ts` | HRTF en capa de detalle; ambiente amplio estéreo |
| Controles y revisión | `AudioControls.tsx`, `ReviewTools.tsx` | HTML accesible; captura real del canvas y salida de audio |

El scroll alimenta `rawProgress`; la cámara usa `displayedProgress`, suavizado de manera reversible. El audio sigue ese mismo progreso visible y la posición de cámara. React no se actualiza en cada frame. La pausa congela la escena; el scroll nativo permanece disponible. El transporte de audio conserva su reloj al suspender AudioContext.

Canvas UI queda sin activar: no aporta un segundo contexto GPU a H2. La interfaz prevé ampliación, pero no se implementaron los otros siete escenarios. H2 está en español; la internacionalización global queda para un hito posterior.

## Recursos y licencias

Consultar `assets-manifest.json` y `LICENSES.md`. Los archivos ya optimizados están incluidos y permiten construir sin descargar medios externos. No se usa concept art generado dentro del render ni en las evidencias.

La regeneración opcional usa `scripts/prepare-assets.py`, con Pillow, NumPy y fontTools y las fuentes documentales incluidas en `research/source-inputs`, salvo el JPEG original de Mariordo, conservado en respaldo privado fuera del historial público. Para regenerar recursos hay que proporcionar su ruta local mediante `IGUAZU_MARIORDO_ORIGINAL`; no es necesario para instalar, construir ni ejecutar la aplicación. El audio original acreditado está en `research/garganta-gracia-source.webm`; la cadena de conversión se documenta en `LICENSES.md`. Los hashes permiten comprobar la integridad de los archivos distribuidos; regenerar recursos requiere actualizar el manifiesto de forma deliberada.

## Límites de producción

- Geometría interpretativa, sin fotogrametría ni relevamiento topográfico.
- Agua mediante geometría desplazada y shaders; no simulación física de fluidos.
- Bruma de planos instanciados y partículas; no volumen físico completo.
- Vegetación procedural genérica; no identificación de especies.
- El realismo, las oclusiones, la posición del hotspot y las transiciones requieren revisión sobre un render real.
- FPS, p95 de frame, consumo GPU real, recuperación WebGL, sincronización audiovisual y Safari/iOS siguen pendientes.
- Los mecanismos de captura audiovisual y recuperación existen, pero no se presentan como verificados.

No hubo commits, pushes, merges, despliegues ni creación de repositorios remotos. No se modificaron SIS ni DocFlow. No avanzar a otro escenario sin autorización expresa posterior.
