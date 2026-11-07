# Procedencia y licencias · H2

No existe asociación ni aval de los autores, Iguazú Argentina S.A., Parques Nacionales o una entidad turística. El proyecto es conceptual e independiente.

## Recursos documentales

| Recurso | Autor | Licencia y fuente |
| --- | --- | --- |
| Fotografía del mirador y fallback | Josep M. Gracia | CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:GD_-_Devil%27s_Throat_seen_from_the_Argentine_viewpoint_at_Iguazu_Falls,_2023.jpg |
| Fotografía y recorte de microdetalle de agua | P. Hughes | CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Iguazu_Falls_-_Devil%27s_Throat.jpg |
| Fotografía aérea principal | Mariordo | CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Aerial_Foz_de_Igua%C3%A7u_29_Nov_2005.jpg |
| Fotografía aérea complementaria | Spouse of Leonard G. | Dominio público según declaración del autor — https://commons.wikimedia.org/wiki/File:ArialViewIquazuFallsDevilsThroat.JPG |
| Grabación ambiental | JosepMGracia | CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:GD_-_Devil%27s_Throat_from_the_Argentine_viewpoint_at_Iguazu_Falls,_2023.webm |

Licencias: https://creativecommons.org/licenses/by/4.0/ y https://creativecommons.org/licenses/by-sa/4.0/ . Verificadas en las páginas de archivo, no deducidas por ser contenido de Wikimedia.

Los originales distribuidos están en `research/source-inputs` y `research/garganta-gracia-source.webm`. Excepción: el JPEG aéreo de Mariordo se conserva íntegro, con metadatos y copyright, en un respaldo privado local fuera del repositorio y del historial público. Se distribuye únicamente su derivado `public/assets/references/mariordo.webp`, con reducción y conversión WebP, bajo CC BY-SA 4.0. El propietario del proyecto confirmó la licencia y la redistribución pública el 7 de noviembre de 2026. Se acredita al autor mediante su seudónimo público Mariordo, se enlaza la fuente y se identifica la adaptación; no se alteró el aviso del original privado. Las versiones reducidas, recortadas, convertidas y el audio derivado conservan las atribuciones; las adaptaciones de obras CC BY-SA 4.0 se distribuyen bajo CC BY-SA 4.0. El manifiesto describe cambios, tamaños y SHA-256.

Las capturas con la fotografía de Gracia y la grabación de salida de Web Audio se acompañan de la misma atribución y se ofrecen bajo CC BY-SA 4.0. Esta licencia de los medios no sustituye la licencia propia de dependencias o código independiente.

## Conversión del audio

```sh
ffmpeg -i research/garganta-gracia-source.webm -vn -af "highpass=f=55,lowpass=f=10500,loudnorm=I=-23:TP=-3:LRA=7" -ar 48000 -c:a libopus -b:a 96k public/assets/audio/garganta.opus
ffmpeg -i public/assets/audio/garganta.opus -c:a aac -b:a 96k public/assets/audio/garganta.m4a
```

El objetivo de normalización del recurso no es el nivel final de mezcla: volumen del usuario, filtros, ganancias y espacialización lo modifican. No se agregaron cantos de especies ni se inventó su correspondencia ecológica.

## Tipografía y software

- Fraunces: Copyright 2018 The Fraunces Project Authors. SIL Open Font License 1.1. Texto íntegro en `public/assets/fonts/fraunces-OFL.txt`.
- Manrope: Copyright 2018 The Manrope Project Authors. SIL Open Font License 1.1. Texto íntegro en `public/assets/fonts/manrope-OFL.txt`.
- Next.js, React, React Three Fiber, Drei, Three.js y Tailwind: MIT; licencias en paquetes instalados.
- TypeScript y Playwright: Apache-2.0; licencias en paquetes instalados.
- GSAP: licencia estándar propia del proveedor; conservar `node_modules/gsap/LICENSE` al redistribuir. https://gsap.com/community/standard-license/ . No se afirma que GSAP sea MIT.
- Canvas UI: no incorporado ni copiado en este hito.
- 3D-Experiences: usado como metodología en la revisión `32b0362f562d82eaddb44e0dd95542421529853b`; no se redistribuyen sus scripts o recursos en el paquete. https://github.com/HardikCoder45/3D-Experiences

La geometría, ruido procedural, shaders, coreografía y componentes fueron escritos para este proyecto. No se incorporaron modelos de procedencia desconocida ni se usaron imágenes generadas como pruebas del render.
