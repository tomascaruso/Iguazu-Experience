# H2 — Garganta del Diablo, audiovisual

Authorized: one reusable real WebGL scene, native scroll choreography, accessible HTML hotspot, progressive voluntary sound, browser QA, local evidence. No other scenarios, remote repository, publishing, payments or deployment.

Visual contract: irregular U-shaped head and long open gorge, broad river at the lip, layered turbulent water and spray. Model is interpretive, not a geographic survey. Documentary aerial Mariordo (CC BY-SA4) and spouse of Leonard G. (public domain) supplement the approved Gracia/Hughes references.

Asset plan before scene implementation:

| Resource | Origin / rights | Production / integration | Budget |
|---|---|---|---|
| Gorge and river geometry | Original deterministic parametric modeling informed by documentary references | BufferGeometry; no generator image substituting for terrain | <180k triangles desktop |
| Rock and forest | Original geometry, instanced vegetation and material shaders | Shared, disposed by scene manager | <90 draws total |
| Water microdetail | P. Hughes waterfall photo, CC BY4 | Cropped grayscale texture blended with flowing noise and displaced geometry | 1024 px, <300 KB |
| Mist / foam | Original deterministic noise and shader math | Instanced depth layers and particles | Adaptive density |
| Poster | Documentary Gracia CC BY-SA4 temporarily; replace with authentic renderer capture | HTML fallback, clearly labeled | <250 KB |
| Ambient audio | Josep M. Gracia, actual Garganta video 2023, CC BY-SA4 | Extract, inspect, normalize, loop crossfade; deferred until gesture | AAC + Opus, each <300 KB |
| Fonts | Fraunces + Manrope, SIL OFL1.1 | Local WOFF2 subset, no remote requests | <100 KB combined |

Audio architecture: resource manifest → ambient loop transport → environment lowpass/proximity mix → optional spatial emitter → independent master volume/mute. A shared displayed camera progress drives mix, not raw scroll while the camera is paused. One AudioContext, no fetch before opt-in, no birds/species invented, visibility suspension, memory and lifecycle cleanup. Defaults silent on each document load; retain volume only. All content works without audio.

Canvas UI remains an extension boundary; no experimental HTML-capture requirement in H2. The scene's water and mist are Three.js materials. No heavy second renderer is needed for this milestone.

Stack checked against primary docs and npm metadata on 2026-11-06: Next16.4.5, React19.3.1, R3F9.8.2, Drei10.7.9, Three0.187.0, GSAP3.15.1, TS7.0.2, Tailwind4.3.5. R3F9 accepts React19 (<19.4), Drei10 accepts R3F9. GSAP standard no-charge license. Lockfile and actual installation determine final compatibility.
