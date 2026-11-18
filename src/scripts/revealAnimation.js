import * as THREE from 'three';
import dotsUrl from '../assets/reveal/dots.bin?url';
import photoUrl from '../assets/reveal/photo_cutout.webp?url';
import fontUrl from '../assets/reveal/anton.woff2?url';

export function createRevealAnimation(root, onEnter, onError = (error) => console.error('Reveal animation failed:', error)) {
    let disposed = false;
    let progressInterval = 0;
    let embFrameId = 0;
    let frameId = 0;
    let imageUrl = null;
    let image = null;
    let renderer = null;
    let scene = null;
    let loadedFont = null;

    const controller = new AbortController();
    const timeoutIds = new Set();

    const schedule = (callback, delay) => {
        const id = window.setTimeout(() => {
            timeoutIds.delete(id);
            if (!disposed) callback();
        }, delay);
        timeoutIds.add(id);
        return id;
    };

    const cleanup = () => {
        if (disposed) return;
        disposed = true;
        controller.abort();
        window.clearInterval(progressInterval);
        window.cancelAnimationFrame(embFrameId);
        window.cancelAnimationFrame(frameId);
        timeoutIds.forEach((id) => window.clearTimeout(id));
        timeoutIds.clear();

        if (imageUrl) URL.revokeObjectURL(imageUrl);
        if (image) image.src = '';
        if (loadedFont) document.fonts.delete(loadedFont);

        if (scene) {
            const textures = new Set();
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
                materials.forEach((material) => {
                    if (material.uniforms) {
                        Object.values(material.uniforms).forEach((uniform) => {
                            const value = uniform.value;
                            if (value && value.isTexture && !textures.has(value)) {
                                textures.add(value);
                                value.dispose();
                            }
                        });
                    }
                    material.dispose();
                });
            });
        }

        if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
        }
    };

    const initialize = async () => {
        const META = { W: 1672, H: 941, pivotX: 860.5, chinY: 574.6211758152024, N: 77988, zmin: -268.0396423339844, zmax: 281.701904296875 };
        const ASSET = { sizes: { dots: 787996, photo: 96322, font: 18612 } };
        const assetUrls = { 'dots.bin': dotsUrl, 'photo_cutout.webp': photoUrl, 'anton.woff2': fontUrl };

        const PW = META.W;
        const PH = META.H;
        const PCX = PW / 2;
        const PCY = PH / 2;
        const CAMY = PCY;
        const CRIM = [0.64, 0.035, 0.055];

        const $ = (id) => root.querySelector('#' + id);
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const ease = (value) => (value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2);

        const ring = $('ring');
        const pct = $('pct');
        const btn = $('btn');

        if (!ring || !pct || !btn || !$('gl') || !$('pre') || !$('emb')) {
            throw new Error('Reveal loader markup is missing required elements.');
        }

        const CAMW = { v: 0 };
        let curP = 0;
        let tgt = 0;
        let shown = 1;
        let lastC = performance.now();

        function show(value) {
            curP = value;
            pct.textContent = Math.round(value);
            ring.style.strokeDashoffset = 389.6 * (1 - value / 100);
        }

        function setPct(value) {
            tgt = clamp(value, 0, 100);
        }

        show(1);
        progressInterval = window.setInterval(() => {
            const now = performance.now();
            const dt = (now - lastC) / 1000;
            lastC = now;
            if (shown < tgt) {
                shown = Math.min(tgt, shown + 68 * dt);
                show(shown);
            }
        }, 16);

        const ec = $('emb');
        const ex = ec.getContext('2d');
        const edpr = Math.min(devicePixelRatio || 1, 2);
        ec.width = 280 * edpr;
        ec.height = 280 * edpr;
        ex.scale(edpr, edpr);

        const em = [];
        let embOn = true;
        let lastA = null;
        let lastT = performance.now();

        function embFrame(now) {
            const dt = Math.min((now - lastT) / 1000, 0.05);
            lastT = now;
            ex.clearRect(0, 0, 280, 280);
            ex.globalCompositeOperation = 'lighter';

            if (embOn && curP > 0) {
                const a = (curP / 100) * Math.PI * 2 - Math.PI / 2;
                const a0 = lastA === null ? a : lastA;
                const span = a - a0;
                const n = Math.max(2, Math.round(dt * 100)) + Math.ceil(Math.abs(span) * 8);
                for (let index = 0; index < n; index += 1) {
                    const aa = a0 + span * Math.random();
                    const sp = 14 + Math.random() * 46;
                    const j = (Math.random() - 0.5) * 0.9;
                    em.push({
                        x: 140 + Math.cos(aa) * 30,
                        y: 140 + Math.sin(aa) * 30,
                        vx: Math.cos(aa + j) * sp,
                        vy: Math.sin(aa + j) * sp - 9,
                        l: 0,
                        L: 0.7 + Math.random() * 0.8,
                        r: 0.5 + Math.random() * 1.2,
                    });
                }
                lastA = a;
            }

            for (let index = em.length - 1; index >= 0; index -= 1) {
                const particle = em[index];
                particle.l += dt;
                if (particle.l >= particle.L) {
                    em.splice(index, 1);
                    continue;
                }

                particle.x += particle.vx * dt;
                particle.y += particle.vy * dt;
                particle.vx *= 0.985;
                particle.vy *= 0.985;
                const f = 1 - particle.l / particle.L;
                ex.fillStyle = 'rgba(205,32,42,' + (f * f * 0.85).toFixed(3) + ')';
                ex.beginPath();
                ex.arc(particle.x, particle.y, particle.r * (0.6 + 0.6 * f), 0, 6.2832);
                ex.fill();
            }

            if (embOn || em.length) embFrameId = window.requestAnimationFrame(embFrame);
        }

        embFrameId = window.requestAnimationFrame(embFrame);

        const sizes = ASSET.sizes;
        const total = sizes.dots + sizes.photo + sizes.font;
        const got = [0, 0, 0];

        const upd = () => setPct((got[0] + got[1] + got[2]) / total * 100 * 0.985);

        async function getBuf(url, index, expected) {
            const response = await fetch(assetUrls[url], { signal: controller.signal });
            if (!response.ok) throw new Error('Failed to load ' + url + ': ' + response.status);

            const reader = response.body.getReader();
            const parts = [];
            let readLength = 0;

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                parts.push(value);
                readLength += value.length;
                got[index] = Math.min(readLength, expected);
                upd();
            }

            const out = new Uint8Array(readLength);
            let offset = 0;
            for (const part of parts) {
                out.set(part, offset);
                offset += part.length;
            }
            return out.buffer;
        }

        const [dotBuf, photoBuf, fontBuf] = await Promise.all([
            getBuf('dots.bin', 0, sizes.dots),
            getBuf('photo_cutout.webp', 1, sizes.photo),
            getBuf('anton.woff2', 2, sizes.font),
        ]);

        loadedFont = new FontFace('Anton', fontBuf);
        await loadedFont.load();
        document.fonts.add(loadedFont);

        image = new Image();
        imageUrl = URL.createObjectURL(new Blob([photoBuf], { type: 'image/webp' }));
        image.src = imageUrl;
        await image.decode();
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            imageUrl = null;
        }

        const dv = new DataView(dotBuf);
        const N = dv.getUint32(4, true);
        const minValue = [0, 1, 2].map((index) => dv.getFloat32(8 + index * 4, true));
        const rangeValue = [0, 1, 2].map((index) => dv.getFloat32(20 + index * 4, true));

        const raw = await new Response(new Blob([dotBuf.slice(32)]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
        const q = new Uint16Array(raw, 0, N * 3);
        let off = N * 6;

        const pos = new Float32Array(N * 3);
        for (let index = 0; index < N; index += 1) {
            pos[index * 3] = minValue[0] + q[index] / 65535 * rangeValue[0];
            pos[index * 3 + 1] = minValue[1] + q[N + index] / 65535 * rangeValue[1];
            pos[index * 3 + 2] = minValue[2] + q[2 * N + index] / 65535 * rangeValue[2];
        }

        const nrm = new Float32Array(N * 3);
        {
            const n8 = new Int8Array(raw, off, N * 3);
            off += N * 3;
            for (let index = 0; index < N; index += 1) {
                nrm[index * 3] = n8[index] / 127;
                nrm[index * 3 + 1] = n8[N + index] / 127;
                nrm[index * 3 + 2] = n8[2 * N + index] / 127;
            }
        }

        const rnd = new Float32Array(N);
        const bri = new Float32Array(N);
        {
            const u = new Uint8Array(raw, off, N * 2);
            for (let index = 0; index < N; index += 1) {
                rnd[index] = u[index] / 255;
                bri[index] = u[N + index] / 255;
            }
        }

        const canvas = $('gl');
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
        renderer.setClearColor(0x060507, 1);
        scene = new THREE.Scene();

        const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
        cam.position.set(0, PCY - CAMY, 100);

        const U = {
            uTime: { value: 0 },
            uIntro: { value: -1 },
            uSweep: { value: -1 },
            uYawH: { value: 0 },
            uYawS: { value: 0 },
            uPivot: { value: META.pivotX },
            uChin: { value: META.chinY },
            uCur: { value: new THREE.Vector3(0, 0, 240) },
            uCurOn: { value: 0 },
            uReveal: { value: 0 },
            uSize: { value: 1 },
            uPS: { value: 1 },
            uPhoto: { value: null },
            uCenter: { value: new THREE.Vector2(0, PCY - CAMY) },
            uRingR: { value: 60 },
            uCamPy: { value: PCY },
            uHH: { value: PH / 2 },
        };

        const tex = new THREE.Texture(image);
        tex.needsUpdate = true;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        U.uPhoto.value = tex;

        const bgMat = new THREE.ShaderMaterial({
            depthTest: false,
            depthWrite: false,
            uniforms: { uAsp: { value: 1 }, uReveal: U.uReveal, uSweep: U.uSweep, uCamPy: U.uCamPy, uHH: U.uHH },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2., 0., 1.); }`,
            fragmentShader: `varying vec2 vUv; uniform float uAsp, uReveal, uSweep, uCamPy, uHH; float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
                void main(){ vec2 d = (vUv - vec2(.5, .48)) * vec2(uAsp, 1.); float g = exp(-dot(d, d) * 5.2); float g2 = exp(-dot(d - vec2(0., -.28), d - vec2(0., -.28)) * 9.);
                vec3 c = vec3(.022, .016, .022) + vec3(.20, .018, .032) * g * .62 + vec3(.13, .012, .02) * g2 * .5; c *= 1. - .55 * smoothstep(.45, 1.15, length((vUv - .5) * vec2(uAsp * .8, 1.2)));
                float ypn = (uCamPy - (vUv.y - .5) * 2. * uHH) / ${PH.toFixed(1)};
                float vr = step(.002, uReveal) * step(uReveal, .998); float d2 = ypn - uReveal * 1.25;
                c += vr * (exp(-d2 * d2 / (2. * .003 * .003)) * .55 + exp(d2 / .09) * step(d2, 0.) * .14) * vec3(.82, .09, .11);
                float ds = ypn - (uSweep * 1.35 - .15); c += step(0., uSweep) * step(uSweep, 1.2) * exp(-ds * ds / (2. * .0035 * .0035)) * .38 * vec3(.82, .1, .12);
                c += (h(vUv * 913.) - .5) * .012; gl_FragColor = vec4(c, 1.); }`,
        });

        const bg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bgMat);
        bg.renderOrder = -1;
        bg.frustumCulled = false;
        scene.add(bg);

        const bc = document.createElement('canvas');
        bc.width = 2400;
        {
            const g = bc.getContext('2d');
            let fs = 400;
            g.font = fs + 'px Anton';
            const w = g.measureText('DEVELOPER').width;
            fs = fs * bc.width / w;
            g.font = fs + 'px Anton';
            const th = Math.ceil(fs * 1.02);
            bc.height = th;
            g.font = fs + 'px Anton';
            g.textBaseline = 'alphabetic';
            g.fillStyle = '#fff';
            g.fillText('DEVELOPER', 0, fs * 0.93);
        }

        const btex = new THREE.CanvasTexture(bc);
        btex.minFilter = THREE.LinearFilter;

        const bannerMat = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: { ...U, uBanner: { value: btex } },
            vertexShader: `varying vec2 vUv; varying vec2 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xy; gl_Position = projectionMatrix * viewMatrix * w; }`,
            fragmentShader: `varying vec2 vUv; varying vec2 vW; uniform sampler2D uBanner, uPhoto; uniform float uReveal;
                float pa(vec2 w){ vec2 p = vec2(w.x + ${PCX.toFixed(1)}, ${PCY.toFixed(1)} - w.y); return texture2D(uPhoto, vec2(p.x / ${PW.toFixed(1)}, 1. - p.y / ${PH.toFixed(1)})).a * step(0., p.x) * step(p.x, ${PW.toFixed(1)}) * step(0., p.y) * step(p.y, ${PH.toFixed(1)}); }
                void main(){ float a = texture2D(uBanner, vUv).a; float m = 0.; for(int i = -2; i <= 2; i++) for(int j = -2; j <= 2; j++) m += pa(vW + vec2(float(i), float(j)) * 5.); m /= 25.; float v = 1. - vUv.y; vec3 grey = vec3(.56, .55, .58); vec3 cr = vec3(.78, .055, .075); float fg = 1. - pow(v, 1.1) * .97, fc = 1. - pow(v, .85) * .94; float ypn = (${PCY.toFixed(1)} - vW.y) / ${PH.toFixed(1)}; float s = clamp((uReveal * 1.25 - ypn) / .25, 0., 1.); vec3 c = mix(grey, cr, s) * (1. - .7 * m); gl_FragColor = vec4(c, a * mix(fg, fc, s) * (1. - .55 * m)); }`,
        });

        const banner = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bannerMat);
        banner.renderOrder = 0;
        scene.add(banner);

        const photoMat = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: U,
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
            fragmentShader: `varying vec2 vUv; uniform sampler2D uPhoto; uniform float uReveal; void main(){ vec4 t = texture2D(uPhoto, vUv); float ypn = 1. - vUv.y; float s = clamp((uReveal * 1.25 - ypn - .07) / .25, 0., 1.); vec2 p = vec2(vUv.x * ${PW.toFixed(1)}, ypn * ${PH.toFixed(1)}) / 7.; float d = length(fract(p) - .5); float R = s * .76; float m = 1. - smoothstep(R - .05, R + .02, d); if(s <= 0.) m = 0.; gl_FragColor = vec4(t.rgb, t.a * m); }`,
        });

        const photo = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), photoMat);
        photo.position.set(0, 0, 0);
        photo.renderOrder = 1;
        scene.add(photo);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('aN', new THREE.BufferAttribute(nrm, 3));
        geo.setAttribute('aR', new THREE.BufferAttribute(rnd, 1));
        geo.setAttribute('aB', new THREE.BufferAttribute(bri, 1));

        const dotMat = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: U,
            vertexShader: `attribute vec3 aN; attribute float aR, aB; uniform float uTime, uIntro, uSweep, uYawH, uYawS, uPivot, uChin, uCurOn, uReveal, uSize, uPS, uRingR; uniform vec3 uCur; uniform vec2 uCenter; uniform sampler2D uPhoto; varying vec3 vC; varying float vA; float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
                void main(){ vec3 p = position; float ypn = p.y / ${PH.toFixed(1)}; float w = smoothstep(uChin - 20., uChin + 170., p.y); float th = mix(uYawH, uYawS, w); float c = cos(th), s = sin(th); vec3 q = vec3(uPivot + (p.x - uPivot) * c + p.z * s, p.y, -(p.x - uPivot) * s + p.z * c); vec3 n = vec3(aN.x * c + aN.z * s, aN.y, -aN.x * s + aN.z * c); float rs = clamp((uReveal * 1.25 - ypn) / .25, 0., 1.); float rse = rs * rs * (3. - 2. * rs); q.z = mix(q.z, 0., rse); q.x = mix(q.x, p.x, rse); vec3 wp = vec3(q.x - ${PCX.toFixed(1)}, ${PCY.toFixed(1)} - q.y, q.z); float ang = h(p.xy * .013) * 6.28318; vec3 rp = vec3(uCenter.x + cos(ang) * uRingR, uCenter.y + sin(ang) * uRingR, 0.); float tt = clamp((uIntro - aR * .20 - h(p.yx) * .06) / .64, 0., 1.); float e = 1. - pow(1. - tt, 2.6); float a2 = ang + (h(p.xy + 3.7) - .5) * 1.5; float dist = 260. + 1100. * pow(h(p.yx + 9.1), 1.6); vec3 cp = rp + vec3(cos(a2), sin(a2), (h(p.xy + 1.3) - .5) * 300.) * dist; vec3 fp = (1. - e) * (1. - e) * rp + 2. * (1. - e) * e * cp + e * e * wp; if(uIntro < 0.) fp = rp; gl_Position = projectionMatrix * viewMatrix * vec4(fp, 1.); float key = max(dot(n, normalize(vec3(-.45, .55, .7))), 0.); float rim = pow(1. - clamp(n.z, 0., 1.), 2.2); float fill = max(dot(n, normalize(vec3(.7, -.2, .5))), 0.); float shade = .58 + .78 * key + .30 * fill + .70 * rim; vec3 L = uCur - vec3(wp.x, wp.y, wp.z); float dd = length(L.xy); float fall = exp(-dd * dd / (2. * 120. * 120.)); float lam = max(dot(vec3(n.x, -n.y, n.z), normalize(L)), 0.); float cur = uCurOn * fall * (.25 + 1.7 * lam); float sw = 0.; if(uSweep >= 0.) { float by = uSweep * 1.35 - .15; float d = ypn - by; sw = exp(-d * d / (2. * .045 * .045)) * 1.6 * step(uSweep, 1.2); } float lead = smoothstep(0., .25, rs) * (1. - smoothstep(.25, .7, rs)) * 1.2; float f = smoothstep(-.35, .15, n.z); float B = .40 + .95 * aB; float I = B * (shade + cur) + sw * (.35 + aB) + lead * .6; vec3 col = vec3(${CRIM[0]}, ${CRIM[1]}, ${CRIM[2]}) * I * 2.9; vec3 pc = texture2D(uPhoto, vec2(p.x / ${PW.toFixed(1)}, 1. - p.y / ${PH.toFixed(1)})).rgb * 1.4 + .06; col = mix(col, pc, smoothstep(.1, .8, rs)); float intro = clamp(tt * 3., 0., 1.); vC = col; vA = f * (1. - smoothstep(.55, 1., rs)) * (uIntro < 0. ? 0. : 1.) * mix(.16, 1., intro); float sz = (2.3 + 2.4 * aR * aR) * (.8 + .6 * aB); sz *= (1. + .35 * (1. - tt)); gl_PointSize = max(2.2, sz * uSize); }`,
            fragmentShader: `varying vec3 vC; varying float vA; void main(){ float r = length(gl_PointCoord - .5) * 2.; float a = exp(-r * r * 3.4) * (1. - smoothstep(.8, 1., r)); gl_FragColor = vec4(vC * a, a * vA); }`,
        });

        const dots = new THREE.Points(geo, dotMat);
        dots.frustumCulled = false;
        dots.renderOrder = 2;
        scene.add(dots);

        const DN = 240;
        const dp = new Float32Array(DN * 3);
        const dr = new Float32Array(DN);
        for (let index = 0; index < DN; index += 1) {
            dp[index * 3] = (Math.random() - 0.5) * 2200;
            dp[index * 3 + 1] = (Math.random() - 0.5) * 1100 + PCY - CAMY;
            dp[index * 3 + 2] = Math.random() * 200;
            dr[index] = Math.random();
        }

        const dg = new THREE.BufferGeometry();
        dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
        dg.setAttribute('aR', new THREE.BufferAttribute(dr, 1));

        const dust = new THREE.Points(
            dg,
            new THREE.ShaderMaterial({
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: U,
                vertexShader: `attribute float aR; uniform float uTime, uSize; varying float vA; void main(){ vec3 p = position; p.x += sin(uTime * .07 * (.5 + aR) + aR * 40.) * 60.; p.y += mod(uTime * (4. + aR * 9.) + aR * 900., 1400.) - 700.; p.y = mod(p.y + 700., 1400.) - 700.; vA = .10 + .22 * aR; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); gl_PointSize = (1.2 + 2.2 * aR) * uSize; }`,
                fragmentShader: `varying float vA; void main(){ float r = length(gl_PointCoord - .5) * 2.; float a = exp(-r * r * 3.) * (1. - smoothstep(.8, 1., r)); gl_FragColor = vec4(vec3(.8, .18, .2) * a, a * vA); }`,
            }),
        );
        dust.frustumCulled = false;
        dust.renderOrder = 3;
        scene.add(dust);

        function resize() {
            const w = innerWidth;
            const h = innerHeight;
            const dpr = Math.min(devicePixelRatio || 1, 2);
            renderer.setPixelRatio(dpr);
            renderer.setSize(w, h, false);

            const ps = Math.min(h / PH * 1.12, Math.max(w / (w < h ? 760 : 1180), 0.2));
            const hw = w / ps / 2;
            const hh = h / ps / 2;
            cam.left = -hw;
            cam.right = hw;
            cam.top = hh;
            cam.bottom = -hh;
            cam.updateProjectionMatrix();

            const camPy = hh * 2 > PH ? PH - hh : Math.min(PH - hh, Math.max(hh + 4, 430));
            U.uCamPy.value = camPy;
            U.uHH.value = hh;
            cam.position.y = PCY - camPy;
            U.uCenter.value.set(0, PCY - camPy);
            CAMW.v = PCY - camPy;

            bgMat.uniforms.uAsp.value = w / h;
            U.uPS.value = ps;
            U.uSize.value = ps * dpr * (w < 700 ? 0.9 : 1);
            U.uRingR.value = 34 / ps;

            const bw = hw * 2;
            const bh = bw * bc.height / bc.width;
            banner.scale.set(bw, bh, 1);
            banner.position.set(0, PCY - 330, -5);
            bg.scale.set(1, 1, 1);
        }

        window.addEventListener('resize', resize, { signal: controller.signal });
        resize();

        let mx = innerWidth / 2;
        let my = innerHeight / 2;
        let moved = false;
        let state = 'loading';
        let curOn = 0;
        let yaw = 0;
        let yawT = 0;
        let t0 = performance.now();

        window.addEventListener('pointermove', (event) => {
            mx = event.clientX;
            my = event.clientY;
            moved = true;
        }, { signal: controller.signal });

        let rv = { from: 0, to: 0, t: 0, dur: 3.6, run: false, done: null };

        function tween(to, dur, done) {
            rv = { from: U.uReveal.value, to, t: 0, dur, run: true, done };
        }

        btn.addEventListener('click', () => {
            if (state === 'revealed') {
                onEnter();
            }
        }, { signal: controller.signal });

        setPct(100);
        while (shown < 100) {
            await new Promise((resolve) => window.setTimeout(resolve, 16));
        }
        show(100);
        await new Promise((resolve) => window.setTimeout(resolve, 140));

        const pre = $('pre');
        pre.classList.add('go');
        embOn = false;
        state = 'intro';

        let last = performance.now();
        let introT = 0;
        let sweepT = -1;

        function frame(now) {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const t = (now - t0) / 1000;
            U.uTime.value = t;

            if (state === 'intro') {
                introT += dt;
                U.uIntro.value = introT / 1.8;
                if (introT > 1.9) {
                    state = 'turning';
                    btn.disabled = true;
                    tween(1, 3.6, () => {
                        state = 'revealed';
                        btn.textContent = 'Enter Portfolio';
                        btn.classList.add('on');
                        btn.disabled = false;
                    });
                }
            }

            if (sweepT >= 0 && sweepT < 1.4) {
                sweepT += dt / 2.4;
                U.uSweep.value = sweepT;
            } else if (sweepT >= 1.4) {
                U.uSweep.value = -1;
                sweepT = 2;
            }

            if (state === 'intro' || state === 'live') {
                const nx = clamp((mx - innerWidth / 2) / (innerWidth / 2), -1, 1);
                const idle = Math.sin(t * 0.55) * 0.22 + Math.sin(t * 0.23 + 1.3) * 0.1;
                yawT = moved ? nx * (30 * Math.PI / 180) : idle * (30 * Math.PI / 180) * 0.32;
                curOn += ((moved && state === 'live' ? 1 : 0) - curOn) * (1 - Math.exp(-dt * 5));
            } else if (state === 'turning' || state === 'revealing' || state === 'revealed' || state === 'reversing') {
                yawT = 0;
                curOn += (0 - curOn) * (1 - Math.exp(-dt * 9));
            }

            const k = 1 - Math.exp(-dt * (state === 'turning' ? 6.5 : 3.4));
            yaw += (yawT - yaw) * k;
            if (Math.abs(yaw) < 1e-4 && yawT === 0) yaw = 0;

            U.uYawH.value = yaw;
            U.uYawS.value = yaw * 0.32;
            U.uCurOn.value = curOn;

            const ps = U.uPS.value;
            U.uCur.value.set((mx - innerWidth / 2) / ps, -(my - innerHeight / 2) / ps + CAMW.v, 240);

            if (rv.run) {
                rv.t += dt / rv.dur;
                const u = clamp(rv.t, 0, 1);
                U.uReveal.value = rv.from + (rv.to - rv.from) * (0.15 * u + 0.85 * ease(u));
                if (u >= 1) {
                    U.uReveal.value = rv.to;
                    rv.run = false;
                    if (rv.done) rv.done();
                }
            }

            renderer.render(scene, cam);
            frameId = window.requestAnimationFrame(frame);
        }

        frameId = window.requestAnimationFrame(frame);
    };

    void initialize().catch((error) => {
        if (!disposed) {
            cleanup();
            onError(error);
        }
    });

    return cleanup;
}

