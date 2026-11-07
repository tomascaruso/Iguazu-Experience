"""Reproducible texture/encoding preparation from attributed documentary sources.
No generated concept art is used in the WebGL scene or functional evidence.
"""
from pathlib import Path
import json, hashlib, shutil, os
import numpy as np
from PIL import Image, ImageOps
from fontTools import subset

root=Path(__file__).resolve().parents[1]; prior=root/'research/source-inputs'
# The archival JPEG stays outside public Git. Explicit local access is required.
mariordo_path=os.environ.get('IGUAZU_MARIORDO_ORIGINAL')
if not mariordo_path or not Path(mariordo_path).is_file():
 raise SystemExit('Set IGUAZU_MARIORDO_ORIGINAL to the privately backed-up JPEG before regenerating assets.')
out=root/'public/assets';out.mkdir(parents=True,exist_ok=True)
(out/'fonts').mkdir(exist_ok=True);(out/'audio').mkdir(exist_ok=True)
(out/'references').mkdir(exist_ok=True)
source=Image.open(prior/'hughes.jpg').convert('RGB')
# Water only, no sky/forest, grayscale detail used within independently modeled moving surfaces.
foam=ImageOps.grayscale(source.crop((3650,1400,5550,3400))).resize((1024,1024))
foam.save(out/'water-detail.webp',quality=88)
poster=Image.open(prior/'gracia.jpg').convert('RGB');poster.thumbnail((1800,1200));poster.save(out/'garganta-poster.webp',quality=82)
for name,p in [('gracia',prior/'gracia.jpg'),('hughes',prior/'hughes.jpg'),('mariordo',Path(mariordo_path)),('leonard',prior/'leonard-aerial.jpg')]:
 im=Image.open(p).convert('RGB');im.thumbnail((1400,1000));im.save(out/'references'/(name+'.webp'),quality=85)

# Authored tileable data texture: packed noise at three scales, stable seed.
rng=np.random.default_rng(214)
channels=[]
for base in [8,20,60]:
 arr=np.zeros((512,512),dtype=float);total=0
 for octv,weight in [(1,1),(2,.5),(4,.25),(8,.125)]:
  size=min(256,base*octv);a=(rng.random((size,size))*255).astype('uint8')
  im=Image.fromarray(a).resize((512,512),Image.Resampling.BICUBIC);arr+=np.array(im)*weight;total+=weight
 channels.append((arr/total).astype('uint8'))
Image.fromarray(np.stack(channels,axis=-1)).save(out/'noise.webp',lossless=True)
chars=''.join(chr(i) for i in range(32,383))+'→←↑↓×−–—·…≠≤≥°'
for name in ['fraunces','manrope']:
 opt=subset.Options();opt.flavor='woff';opt.layout_features=['*']
 font=subset.load_font(str(prior/'fonts'/(name+'-static.ttf')),opt)
 sub=subset.Subsetter(options=opt);sub.populate(text=chars);sub.subset(font)
 subset.save_font(font,str(out/'fonts'/(name+'.woff')),opt)
 shutil.copyfile(prior/'fonts'/(name+'-OFL.txt'),out/'fonts'/(name+'-OFL.txt'))
print('Prepared documentary textures, fallback, reference images, authored noise and OFL fonts.')
