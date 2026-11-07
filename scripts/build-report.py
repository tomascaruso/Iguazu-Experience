from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from PIL import Image
root=Path(__file__).resolve().parents[1]; out=root/'deliverables';out.mkdir(exist_ok=True)
for name,file in [('M','manrope-static.ttf'),('F','fraunces-static.ttf')]:pdfmetrics.registerFont(TTFont(name,str(root/'research/source-inputs/fonts'/file)))
ink=HexColor('#112A22');paper=HexColor('#F3F1E8');muted=HexColor('#526747');earth=HexColor('#955039');line=HexColor('#CAD0C1')
W,H=595.2756,841.8898; margin=42;cw=W-84
styles={name:ParagraphStyle(name,fontName='M',fontSize=size,leading=lead,textColor=ink,spaceAfter=0) for name,size,lead in [('body',10,15),('small',8,12),('tiny',7,10),('table',8.4,12)]}
c=canvas.Canvas(str(out/'Iguazu_H2_Informe_Visual.pdf'),pagesize=(W,H));c.setTitle('Iguazú Experience H2 - Implementación y validación parcial');c.setAuthor('Iguazú Experience')
def p(text,y,x=42,width=cw,style='body'):
 q=Paragraph(text,styles[style]);a,h=q.wrap(width,800);q.drawOn(c,x,y-h);return y-h-10
def base(n,title,kicker='H2 / GARGANTA DEL DIABLO'):
 c.setFillColor(paper);c.rect(0,0,W,H,fill=1,stroke=0);c.setFillColor(muted);c.setFont('M',8);c.drawString(42,H-39,kicker);c.drawRightString(W-42,H-39,'07 NOV 2026')
 c.setStrokeColor(line);c.line(42,H-52,W-42,H-52);c.setFillColor(ink);c.setFont('F',29);c.drawString(42,H-95,title)
 c.setFont('M',7);c.setFillColor(muted);c.drawString(42,28,'PROYECTO INDEPENDIENTE Y NO OFICIAL · VALIDACIÓN PARCIAL');c.drawRightString(W-42,28,f'{n:02d} / 06')
 return H-122
def photo(path,x,y,w,maxh=None):
 im=Image.open(path);h=w*im.height/im.width
 if maxh and h>maxh:w*=maxh/h;h=maxh
 c.drawImage(str(path),x,y-h,width=w,height=h,mask='auto');return y-h
def table(rows,widths,y):
 cells=[[Paragraph(str(v),styles['table']) for v in row] for row in rows];t=Table(cells,colWidths=widths,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#DDE2D4')),('LINEBELOW',(0,0),(-1,0),.6,muted),('LINEBELOW',(0,1),(-1,-1),.35,line),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]));tw,th=t.wrap(cw,800);t.drawOn(c,42,y-th);return y-th-18
# Authentic screenshot crops, without retouching; full source images remain in evidence.
for source,name in [('H2_Movil_Completo.jpg','H2_Movil_Recorte.jpg'),('H2_Panel_Movil_Completo.jpg','H2_Panel_Movil_Recorte.jpg')]:
 im=Image.open(root/'evidence'/source);im.crop((22,58,412,902)).save(root/'evidence'/name,quality=96)
y=base(1,'Viví Iguazú antes de llegar.')
y=p('Primera pieza local del sistema: geometría, coreografía, HTML accesible y sonido ambiental. <b>H2 todavía no está aprobado ni cerrado.</b>',y)
c.setFillColor(HexColor('#E7DCCB'));c.rect(42,y-42,cw,42,fill=1,stroke=0);p('<b>VALIDACIÓN 3D BLOQUEADA</b><br/>El navegador no habilita WebGL. Esta entrega no acredita realismo ni rendimiento GPU.',y-8,x=52,width=cw-20,style='small');y-=59
y=photo(root/'evidence/H2_Escritorio_Fallback.jpg',42,y,cw)
y=p('Captura auténtica del navegador. Se muestra la <b>alternativa fotográfica sin WebGL</b>, no una escena 3D. Fotografía: Josep M. Gracia, CC BY-SA 4.0.',y-9,style='small')
y=p('<b>Verificado:</b> build, 7 pruebas unitarias, integridad de recursos, panel por teclado, volumen, silencio y audio real de 30 segundos.',y-4)
p('<b>Pendiente:</b> render y comparación artística, recorrido audiovisual, recuperación de contexto y medición en GPU y móviles reales.',y)
c.showPage()
y=base(2,'La interfaz, en navegador.')
y=p('Responsive y controles reales. Marco móvil de 390 × 844 CSS px; contenido interior de 388 × 842. Motor de escritorio, no un teléfono físico.',y)
photo(root/'evidence/H2_Movil_Recorte.jpg',42,y-9,215);photo(root/'evidence/H2_Panel_Movil_Recorte.jpg',W-42-215,y-9,215)
y-=490
y=p('VISTA SIN WEBGL',y,x=42,width=215,style='small');p('PANEL HTML',y+22,x=W-42-215,width=215,style='small')
y=p('Enter abre el panel; Escape lo cierra y devuelve el foco al botón. Los controles de sonido permanecen disponibles también dentro del panel.',y-8)
p('Estas imágenes son recortes de capturas auténticas, sin retoque de contenido. Los originales completos se incluyen en evidence/. Fotografía de Josep M. Gracia, CC BY-SA 4.0.',y,style='small')
c.showPage()
y=base(3,'Una arquitectura extensible.')
y=p('Un único escenario registrado. El contenido HTML y el audio funcionan aunque el renderer no pueda iniciarse.',y)
y=table([['Módulo','Responsabilidad'],['Escena y recursos','R3F + Three.js. Geometría interpretativa en U, materiales de agua y roca, instancias de vegetación y bruma.'],['Coreografía','Scroll nativo → progreso objetivo → progreso visible suavizado → cámara. Pausa y reversa deterministas.'],['Interacciones y HTML','Hotspot proyectado, diálogo nativo, foco y controles accesibles; contenido disponible fuera del canvas.'],['Calidad y fallos','DPR limitado, tres perfiles, reducción de carga, error boundary y recuperación de contexto preparada.'],['Audio ambiental','Carga voluntaria, buffer único, transporte continuo, mezcla y volumen independiente.'],['Audio espacial','Detalle con PannerNode HRTF; ambiente amplio estéreo. Sigue la cámara visible.']],[135,cw-135],y)
y=p('<b>Progresión sonora definida en código</b>',y)
y=table([['Etapa','Mezcla y percepción previstas'],['Revelar','Ambiente 0,28; detalle 0,07; filtro de detalle 1.100 Hz.'],['Acercarse','Ganancias y filtro cambian de forma gradual con el progreso visible.'],['Contemplar','Ambiente 0,49; detalle 0,36; filtro de detalle 7.300 Hz.']],[135,cw-135],y)
y=p('Uniones de bucle con solapamiento de 0,8 s y curvas de potencia igual. No se reinicia el archivo al cambiar de etapa. La sincronización audiovisual todavía no fue observada.',y,style='small')
p('Grabación: JosepMGracia, Garganta del Diablo desde el mirador argentino (2023), CC BY-SA 4.0. No se agregaron aves ni atribuciones de especies.',y,style='small')
c.showPage()
y=base(4,'Qué pasó y qué falta probar.')
y=table([['Control','Estado','Alcance'],['Build / TypeScript','PASS','No valida shaders en GPU.'],['Lógica y geometría','7 / 7','Pruebas unitarias ejecutadas.'],['Recursos y npm','PASS','11 hashes coinciden; 0 vulnerabilidades reportadas.'],['Panel y teclado','PASS','Escritorio e iframe móvil.'],['Audio, volumen y silencio','PASS','AudioContext running; salida grabada.'],['Sin WebGL','PASS','Fallback real con contenido disponible.'],['Movimiento reducido','PARCIAL','Estado forzado; falta preferencia real del SO.'],['Pestaña oculta','PENDIENTE','No se observó visibilityState hidden en la prueba.'],['WebGL y recuperación','BLOQUEADO','Renderer deshabilitado por el entorno.'],['Video, GPU y realismo','PENDIENTE','No se infieren de la compilación.']],[147,85,cw-232],y)
y=p('<b>Métricas comprobadas</b>',y)
y=p('Opus: 120.118 bytes · Buffer decodificado: 4,75 MiB · Captura de audio: 30 s, 48 kHz, estéreo. Pico -28,10 dBFS y RMS -40,41 dBFS en la mezcla inicial a volumen 45%.',y)
y=p('Conteo geométrico estático: alta 146.140 triángulos; equilibrada 77.928; ligera 72.624. Son estimaciones del código, no mediciones GPU.',y)
p('Los campos de render en cero significan que el renderer no arrancó. No son resultados de FPS o consumo. Las seis pruebas Playwright están preparadas y descubiertas; no ejecutadas completamente.',y,style='small')
c.showPage()
y=base(5,'La fidelidad sigue abierta.')
y=p('Las referencias documentales orientan la escena. No se pudo comparar todavía un render real con ellas ni con el dossier aprobado.',y)
photo(root/'public/assets/references/mariordo.webp',42,y-5,310)
p('<b>REFERENCIA FOTOGRÁFICA</b><br/><br/>Cabecera irregular, caídas laterales y canal profundo de salida.<br/><br/>Mariordo.<br/>CC BY-SA 4.0.<br/><br/>No es concept art ni evidencia WebGL.',y-8,x=372,width=181,style='small')
y-=250
y=p('<b>Criterios de revisión artística para cerrar H2</b>',y)
for s in ['Silueta reconocible y asimétrica; evitar una cuenca circular uniforme.','Agua con variación, volumen, velocidad y espuma sin patrones repetidos.','Rocas húmedas sin intersecciones visibles; selva sin copas repetitivas evidentes.','Bruma en profundidad, sin bordes de planos ni lavado gris global.','Luz y color coherentes; composición legible en escritorio y móvil.','Scroll reversible y pausa estables; hotspot visible y alcanzable.']:
 y=p('• '+s,y,style='body')
p('Límites del método: geometría interpretativa, agua por shaders, bruma con planos/partículas y vegetación procedural. No hay fotogrametría ni simulación física completa. El nivel de realismo alcanzado permanece desconocido.',y-3,style='small')
c.showPage()
y=base(6,'Cómo continuar dentro de H2.')
y=p('El paquete es local y reproducible. En Windows no requiere Ubuntu/WSL. Usar Node.js 24 o superior y un navegador con WebGL2.',y)
c.setFillColor(ink);c.rect(42,y-83,cw,83,fill=1,stroke=0);c.setFillColor(paper);c.setFont('Courier',12)
for i,s in enumerate(['npm ci','npm run build','npm start']):c.drawString(59,y-23-i*21,s)
y-=101
y=p('Abrir http://localhost:3000. Para captura local: <b>npm run dev</b> y /?qa=1. Activar sonido y usar “Grabar recorrido audiovisual” solo cuando haya un render real. El HTML se documenta con capturas separadas.',y)
y=p('<b>El siguiente paso sigue siendo Garganta del Diablo</b>',y-6)
for s in ['Ejecutar WebGL y revisar visualmente el agua, la silueta, materiales y bruma.','Corregir diferencias observadas frente a las fotografías y la dirección aprobada.','Grabar el recorrido real con audio; probar reversa, pausa, hotspot y recuperación.','Medir tiempos de frame y recursos; revisar Android/iOS físicos y movimiento reducido.','Solicitar decisiones separadas sobre calidad visual, técnica y sonora.']:
 y=p('• '+s,y)
y=p('<b>Bloqueo documentado</b><br/>Navegador compartido: GL_RENDERER = Disabled. Chromium automatizado: socket() failed, Operation not permitted. La política rechazó elevar permisos para ejecutar fuera del sandbox; no se alteraron esas restricciones.',y-8)
y=p('<b>Procedencia</b><br/>Fuentes exactas, modificaciones, licencias y SHA-256 en assets-manifest.json y LICENSES.md; créditos HTML en /creditos. Fotografías/audio de Gracia y fotografía de Mariordo: CC BY-SA 4.0. Microtextura de P. Hughes: CC BY 4.0. Fuentes: SIL OFL 1.1.',y,style='small')
p('Sin gastos, servicios de pago, publicación, commits, pushes, merges ni modificaciones de repositorios remotos. SIS y DocFlow no fueron modificados. No se avanza a los otros escenarios. <b>H2 permanece pendiente.</b>',y-5,style='small')
c.save();print(out/'Iguazu_H2_Informe_Visual.pdf')
