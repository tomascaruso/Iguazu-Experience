# Iguazú Experience - H2
## Implementación local y validación parcial

**Fecha de entrega: 7 de noviembre de 2026. H2 NO aprobado ni cerrado.**

Se construyeron el código de la escena S03, la coreografía, los materiales, la interfaz HTML y el módulo de sonido. El navegador compartido no permite crear un contexto WebGL. Por ese motivo no se obtuvo un render verificable de la escena ni un video audiovisual del scrollytelling. Las capturas son auténticas del navegador, pero muestran la alternativa fotográfica, claramente identificada. No se usaron imágenes generadas para simular funcionamiento.

## 1. Qué está implementado

- Next.js 16.4.5, React 19.3.1, TypeScript 7.0.2, Tailwind 4.3.5, Three.js 0.187.0, React Three Fiber 9.8.2, Drei 10.7.9, GSAP 3.15.1. Versiones fijadas en package-lock.
- Un solo registro de escena: Garganta del Diablo. No se desarrollaron los otros siete escenarios.
- Cabecera curva asimétrica, caídas y río inferior mediante geometría propia. Roca procedural, vegetación instanciada, bruma en capas y spray.
- Microdetalle fotográfico del agua con licencia CC BY 4.0 sobre geometría animada; no un paisaje fotográfico a pantalla completa dentro del render.
- Scroll nativo con ScrollTrigger. El progreso visible controla cámara, agua y mezcla sonora. Secuencia Revelar - Acercarse - Contemplar, reversible y con pausa.
- Hotspot proyectado en HTML, panel modal nativo, alternativa informativa independiente del canvas.
- Tres perfiles gráficos; límites de DPR; reducción de calidad por tiempo de frame; manejo previsto de fallos y pérdida/restauración de contexto.
- Audio apagado al entrar; carga por gesto; volumen y silencio permanentes; solo el volumen se conserva. Controles también dentro del panel.
- Un audio documental del lugar; reproducción continua con cruces de 0,8 s. Capa ambiental estéreo y capa de detalle con PannerNode HRTF; Web Audio API sin servicios externos.
- Captura local de canvas y mezcla mediante MediaRecorder, preparada para producir evidencia real cuando WebGL esté disponible. Este mecanismo audiovisual todavía no se verificó.

## 2. Evidencias obtenidas

| Archivo | Qué prueba | Qué no prueba |
| --- | --- | --- |
| H2_Escritorio_Fallback.jpg | Interfaz real de escritorio y fallback rotulado | Render 3D o realismo del agua |
| H2_Movil_Completo.jpg | Responsive en marco de 390 x 844 CSS px; contenido 388 x 842 | Teléfono físico, rendimiento móvil o Safari |
| H2_Panel_HTML.jpg / H2_Panel_Movil_Completo.jpg | Panel real, contenido y controles | Posicionamiento espacial del hotspot |
| H2_Movimiento_Reducido_Forzado.jpg | Estado alternativo activado mediante parámetro QA | Preferencia real del sistema operativo |
| H2_Audio_Real_Navegador.wav | 30 s capturados de la salida real de Web Audio | Video, sincronización con cámara o aprobación auditiva |
| desktop-metrics.json / mobile-metrics.json | Navegación local, recursos, estado y audio del navegador | FPS, p95 o VRAM reales de la escena |
| validation.json | Resultados y pendientes explícitos | Una certificación de accesibilidad o calidad artística |

No se entrega un video del recorrido porque no existe una ejecución WebGL validada que grabar. No se montó la fotografía con sonido para presentarla como esa evidencia.

## 3. Pruebas ejecutadas

| Prueba | Resultado | Evidencia y alcance |
| --- | --- | --- |
| Build de producción y TypeScript | PASS | Rutas prerenderizadas y componentes compilados. No compila ni valida shaders en una GPU. |
| Lógica de cámara, pausa y reversibilidad | PASS, unitario | Posiciones deterministas; convergencia sin sobrepaso. No ejecutado visualmente en WebGL. |
| Continuidad y límites de mezcla | PASS, unitario | Ganancias acotadas; filtro continuo y creciente. |
| Geometría y presupuestos | PASS, unitario | Coordenadas finitas, índices válidos, caída hacia el fondo y conteo estático. |
| Total unitarios | 7/7 | tests/geometry.test.ts y tests/timeline.test.ts |
| Integridad y procedencia | PASS | 11 recursos; SHA-256 coincide; fuente, autor y licencia presentes. |
| Auditoría npm | 0 vulnerabilidades reportadas | Resultado del registro al consultar; no sustituye una revisión de seguridad completa. |
| Panel por teclado | PASS | Enter abre; Escape cierra; foco regresa al botón, en escritorio e iframe móvil. |
| Audio voluntario | PASS | Empieza apagado; tras clic, AudioContext running y señal capturada. |
| Volumen, silencio y persistencia | PASS | Flecha reduce 45 a 44; silencio cambia estado; nueva navegación conserva 44 y comienza sin audio. |
| Sin WebGL | PASS | Ausencia real de WebGL activa fotografía rotulada, navegación y contenido. |
| Estado de movimiento reducido | PARCIAL | Parámetro QA verificado; falta prueba con preferencia real del sistema. |
| Audio en pestaña oculta | NO VERIFICADO | El entorno mantuvo document.visibilityState en visible durante la prueba; no se observó una suspensión real. |
| Escena, shaders, cámara y hotspot 3D | BLOQUEADO | WebGL deshabilitado en el navegador compartido. |
| Recuperación del contexto y errores de recursos | PENDIENTE | Código preparado; falta provocar y recuperar fallos en una ejecución 3D real. |
| Video audiovisual y sincronización | BLOQUEADO | Sin contexto WebGL no hay recorrido auténtico para grabar. |
| Realismo visual y diseño sonoro | PENDIENTE DE APROBACIÓN | No se deduce aprobación de tests o compilación. |

Se prepararon seis pruebas de navegador reproducibles en Playwright (tres casos por escritorio/móvil). Se verificó que el runner las descubre. **No se ejecutaron hasta el final**. La prueba WebGL falla deliberadamente si recibe un fallback.

## 4. Métricas y límites de interpretación

- Recursos optimizados del manifiesto: **2.006.998 bytes** en total, incluidas referencias documentales que no forman parte del render inicial. No es el tamaño total de la web ni de su JavaScript.
- Audio principal Opus: **120.118 bytes**. Buffer decodificado observado: **4,75 MiB**.
- Grabación de salida: **30,000 s**, 48 kHz, estéreo. WAV derivado del archivo MediaRecorder real, sin añadir música ni sonido externo.
- En esa grabación: pico **-28,10 dBFS**, RMS global **-40,41 dBFS**; medición digital a volumen 45%, mezcla inicial. No es una medición de nivel acústico en auriculares ni aprobación subjetiva de sonoridad.
- Muestra local de navegación, sin throttling y con caché: escritorio DOMContentLoaded **90,6 ms**, load **99,8 ms**; iframe móvil **56,0 ms** y **92,4 ms**. **Solo fallback**; no son Core Web Vitals, resultados Lighthouse ni tiempos de carga de WebGL.
- Los campos FPS/triángulos/GPU del navegador aparecen en cero porque nunca se inició el renderer. No deben interpretarse como consumo nulo de una escena funcionando.

| Perfil | DPR máximo previsto | Triángulos geométricos estimados antes de culling | Instancias de copa | Partículas |
| --- | --- | --- | --- | --- |
| Alta | 1,50 | 146.140 | 600 | 2.100 |
| Equilibrada | 1,15 | 77.928 | 220 | 1.200 |
| Ligera | 0,85 | 72.624 | 180 | 550 |

Estos conteos salen del código, no de una medición GPU. La reducción de detalle no acredita que el resultado visual siga siendo aceptable. La estimación de memoria del componente tampoco representa VRAM real del driver.

## 5. Comparación documental y diferencias de producción

Referencias verificadas: vista aérea de Mariordo, vista aérea de Spouse of Leonard G., fotografías de Josep M. Gracia y P. Hughes. La cabecera irregular en U y el corredor de salida orientan la geometría. No se hizo una reconstrucción topográfica exacta.

La comparación final entre render y fotografías **no pudo realizarse**. Debe revisar al menos:

1. Silueta asimétrica reconocible; evitar una pared semicircular uniforme o una cuenca cerrada.
2. Espesor, variación lateral, continuidad y aceleración perceptible de las caídas.
3. Espuma con escalas distintas; ausencia de patrones de textura repetidos o deslizamiento lateral incorrecto.
4. Rocas húmedas con masas creíbles, sin intersecciones visibles con el agua.
5. Vegetación densa y orgánica; evitar copas que parezcan polígonos repetidos.
6. Bruma con capas de profundidad; sin bordes de planos ni lavado gris de toda la escena.
7. Dirección de luz y color estables; lectura del paisaje en escritorio y móvil.
8. Reversa de scroll sin saltos; pausa sin deriva; hotspot alcanzable, bien proyectado y sin tapar información.

Diferencias conocidas del método: geometría interpretativa, agua por shaders en vez de simulación de fluidos, bruma con planos y partículas, vegetación procedural genérica, sin fotogrametría ni materiales escaneados. No se afirma que estas técnicas hayan alcanzado el realismo aprobado en Fase 1. Es probable que requieran ajustes de composición, texturas, densidad y escala tras el primer render visible.

## 6. Bloqueos del entorno

Diagnóstico recibido de creación de contexto: `GL_VENDOR = Disabled; GL_RENDERER = Disabled; BindToCurrentSequence failed`.

La alternativa de prueba automatizada con Chromium falló al crear un socket interno: `socket() failed: Operation not permitted`. La política de aprobación rechazó ejecutar ese proceso fuera del sandbox porque `sandbox_approval` está deshabilitado. No se modificaron permisos ni políticas. Una descarga oficial de Chrome for Testing tampoco produjo un archivo válido; no se la considera instalada.

Estos bloqueos no demuestran que la escena funcione ni que falle visualmente en un navegador compatible. Solo impiden validarla aquí.

## 7. Reproducción y siguiente paso dentro de H2

El ZIP incluye código, lockfile, recursos locales, fuentes documentales acreditadas, README, licencias, pruebas y este informe. No contiene node_modules, claves, repositorios remotos ni los proyectos SIS o DocFlow.

En Windows no hace falta Ubuntu/WSL. Con Node.js 24:

```sh
npm ci
npm run build
npm start
```

Abrir http://localhost:3000. Para herramientas locales de captura: `npm run dev` y `http://localhost:3000/?qa=1`. Activar sonido antes de grabar. `Grabar recorrido audiovisual` captura el canvas real y la salida del AudioContext; el HTML se documenta con capturas aparte. Ver README para pruebas automatizadas.

El siguiente trabajo sigue siendo H2: ejecutar en un navegador que permita WebGL2, revisar el render y corregirlo, registrar el recorrido audiovisual, verificar recuperación y medir rendimiento en dispositivos reales. Luego presentar tres decisiones separadas: aprobación visual, técnica y sonora.

**No avanzar a otro escenario ni publicar sin autorización expresa. H2 continúa pendiente de esos resultados.**

## 8. Fuentes, licencias y alcance

- Fotografías de Gracia y Mariordo, y grabación de Gracia: CC BY-SA 4.0. Derivados y evidencia con esos medios conservan atribución y licencia.
- Fotografía/microtextura de P. Hughes: CC BY 4.0.
- Vista de Spouse of Leonard G.: dominio público declarado por autor.
- Fraunces y Manrope: SIL OFL 1.1, textos íntegros incluidos.
- Fuentes exactas, modificaciones y hashes: assets-manifest.json y LICENSES.md; créditos accesibles en /creditos.
- No se incorporó Canvas UI en H2. No hay otro canvas GPU compitiendo por eventos.
- No se desarrolló la biblioteca sonora completa, otros escenarios, backend turístico, pagos, cuentas o datos operativos actuales.
- No hubo gastos, servicios de pago, commits, pushes, merges, publicación ni modificación de repositorios remotos.
