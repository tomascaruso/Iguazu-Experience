# Exportación pública de migration/work-h2

Preparación del 7 de noviembre de 2026. Publicación autorizada por el propietario del proyecto únicamente para esta rama, sin force push, merge a main, despliegue o desarrollo adicional.

## Derechos y privacidad

El propietario confirmó haber verificado en la fuente la licencia CC BY-SA 4.0 de la vista aérea de Mariordo, incluida la redistribución pública con atribución. Fuente: https://commons.wikimedia.org/wiki/File:Aerial_Foz_de_Igua%C3%A7u_29_Nov_2005.jpg . Se conserva la atribución al seudónimo público Mariordo, la fuente, la licencia y la indicación de reducción/conversión WebP. Las demás atribuciones y licencias obligatorias se mantienen.

El JPEG original se conserva con sus metadatos y copyright intactos en un respaldo privado local fuera del repositorio. No se distribuye en el árbol ni en ningún commit alcanzable desde la rama pública. El respaldo del historial previo también es privado y no debe subirse. Su existencia local no implica un respaldo remoto.

El WebP utilizado por la aplicación permanece idéntico, sin EXIF, XMP o comentarios incrustados detectados. Todos los recursos de public/assets, fotografías distribuidas, audio, shaders y geometría conservan sus hashes. No se sustituyeron imágenes, no se regeneraron recursos y no se alteraron sus píxeles o apariencia. El PDF cambió únicamente dos atribuciones textuales a Mariordo; se verificó que las imágenes incrustadas conservan sus hashes.

No hay hashes nuevos para los recursos del manifiesto: los 11 originales distribuidos mantienen sus huellas. El JPEG privado conserva SHA-256 `69cd5bb6c99179ed1c1b36a45e764f776fba09125d90ed0d555b6029d2ce885b`. El PDF documental pasó de `347b3e3d093a7f5fc86b3a82716fabe9018f033cb294383dcdccda0ef21df982` a `9fe3013e7f6c1edf319ee91a8406c577ba18be96e0b54e67d22bd61167a3ef3b` por esas atribuciones, sin editar fotografías.

El manifiesto diferencia el derivado público del original privado. La regeneración opcional requiere IGUAZU_MARIORDO_ORIGINAL apuntando al JPEG privado; instalar, ejecutar y compilar no requieren ese archivo ni variable. La ruta privada nunca se incorpora al build.

## Historial y comprobaciones

La exportación se prepara como un commit raíz nuevo, sin padres: no contiene los commits previos ni el blob del JPEG excluido. Autor y committer usan `Iguazu Experience Bot <migration@iguazu-experience.invalid>`, sin identidad personal de desarrolladores. El informe MIGRATION_CODEX_CLOUD_001.md se conserva como registro histórico, rotulado con el alcance de esta exportación posterior.

Comprobaciones repetidas sobre esta exportación:

- Integridad de recursos: PASS, 11/11 SHA-256, 2.006.998 bytes.
- Typecheck: PASS.
- Tests unitarios: PASS, 7/7, sin omitidos.
- Build de producción: PASS.
- Privacidad: sin correos detectados en textos públicos, texto extraído del PDF o metadatos de imágenes distribuidas; sin patrones de claves/tokens detectados en la revisión. No es una garantía exhaustiva de seguridad.
- node_modules, .env, caches, evidencias generadas y respaldos privados quedan fuera del historial publicado.

Los dos fallos previos del recorrido de navegador no se han corregido ni se declaran aprobados. No se repitió esa suite para convertirlos en éxitos. Esta exportación no introduce mejoras H2: los cambios de aplicación se limitan a atribuciones textuales.

**H2 continúa pendiente de aprobación visual, funcional y de rendimiento.** La publicación del código no es un despliegue de la aplicación. El resultado del push y el SHA remoto se informan después de verificar la rama en GitHub.
