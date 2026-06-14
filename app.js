/* =====================================================================
   DIE MENSCH-MASCHINE · SPACELAB
   Une sphère de Dyson autour de la Terre — hommage à KRAFTWERK,
   pour la fête des pères.  Three.js r128 + GSAP, sans dépendance ajoutée.
   ===================================================================== */

/* ---------------------------------------------------------------------
   ✏️  PERSONNALISE ICI
   --------------------------------------------------------------------- */
const CONFIG = {
    mission:       "KLING KLANG · SPACELAB",
    eyebrowStart:  "★ FÊTE DES PÈRES · DIMANCHE 14 JUIN 2026 ★",
    titreStart:    "SPACELAB",
    eyebrowReveal: "DIE MENSCH-MASCHINE · FÜR PAPA",
    titreReveal:   "BONNE FÊTE PAPA",
    messageReveal: "Mensch &amp; Maschine — et surtout un super papa.<br> Wir sind die Roboter…",
    dateReveal:    "FÊTE DES PÈRES · DIMANCHE 14 JUIN 2026",
    audio:         "kraftwerk.mp3",
    ticker: [
        "WIR FAHREN FAHREN FAHREN AUF DER AUTOBAHN",
        "SHE'S A MODEL AND SHE'S LOOKING GOOD",
        "WIR SIND DIE ROBOTER",
        "RADIO-AKTIVITÄT",
        "TRANS-EUROPA EXPRESS",
        "EINS · ZWEI · DREI · VIER",
        "COMPUTERWELT · COMPUTERLIEBE",
        "BOING BOOM TSCHAK · MUSIK NON STOP",
        "DIE MENSCH-MASCHINE",
        "NEON LIGHTS · SPACELAB · METROPOLIS",
        "★ BONNE FÊTE PAPA ★",
        "KLING KLANG STUDIO · DÜSSELDORF"
    ]
};

const DEG = Math.PI / 180;

/* ---------------------------------------------------------------------
   RENDU
   --------------------------------------------------------------------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.getElementById("canvas-container").appendChild(renderer.domElement);
const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 4000);
const SUN_DIR = new THREE.Vector3(0.65, 0.32, 0.62).normalize();

/* ---------------------------------------------------------------------
   COMMANDES ORBITALES (souris + tactile)
   --------------------------------------------------------------------- */
function createControls(cam, dom) {
    const target = new THREE.Vector3(0, 0, 0);
    const minR = 5.6, maxR = 30, minPhi = 0.35, maxPhi = Math.PI - 0.35, damp = 0.085;
    let theta = 0.55, phi = Math.PI / 2 + 0.06, thetaT = theta, phiT = phi;
    let radius = 18, radiusT = 18;
    const pointers = new Map();
    let dragging = false, px = 0, py = 0, pinch = 0, pinchR = 0, idle = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function down(e) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 1) { dragging = true; px = e.clientX; py = e.clientY; }
        else if (pointers.size === 2) {
            dragging = false; const p = [...pointers.values()];
            pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); pinchR = radiusT;
        }
        idle = 0;
        if (dom.setPointerCapture) try { dom.setPointerCapture(e.pointerId); } catch (_) {}
    }
    function move(e) {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2 && pinch > 0) {
            const p = [...pointers.values()];
            radiusT = clamp(pinchR * (pinch / Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)), minR, maxR);
            return;
        }
        if (!dragging) return;
        thetaT -= (e.clientX - px) * 0.005;
        phiT = clamp(phiT - (e.clientY - py) * 0.005, minPhi, maxPhi);
        px = e.clientX; py = e.clientY; idle = 0;
    }
    function up(e) {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinch = 0;
        if (pointers.size === 0) dragging = false;
    }
    function wheel(e) {
        e.preventDefault();
        radiusT = clamp(radiusT * (1 + Math.sign(e.deltaY) * 0.08), minR, maxR);
        idle = 0;
    }
    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    dom.addEventListener("wheel", wheel, { passive: false });

    return {
        get radiusTarget() { return radiusT; },
        set radiusTarget(v) { radiusT = v; },
        update(dt) {
            idle += dt;
            if (pointers.size === 0 && idle > 1.2) thetaT += 0.04 * dt;
            theta += (thetaT - theta) * damp; phi += (phiT - phi) * damp; radius += (radiusT - radius) * damp;
            const s = Math.sin(phi);
            cam.position.set(radius * s * Math.sin(theta), radius * Math.cos(phi), radius * s * Math.cos(theta));
            cam.lookAt(target);
        }
    };
}
const controls = createControls(camera, renderer.domElement);

/* ---------------------------------------------------------------------
   TEXTURES + chargement
   --------------------------------------------------------------------- */
const manager = new THREE.LoadingManager();
const loaderTex = new THREE.TextureLoader(manager);
const pctEl = document.getElementById("loader-pct");
const loaderEl = document.getElementById("loader");
manager.onProgress = (u, l, t) => { if (pctEl && t) pctEl.textContent = Math.round((l / t) * 100) + "%"; };
manager.onLoad = revealScene;
manager.onError = () => {};
setTimeout(revealScene, 9000);

let started = false;
function revealScene() {
    if (started) return; started = true;
    if (loaderEl) loaderEl.classList.add("hidden");
    gsap.fromTo(renderer.domElement, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" });
    gsap.to(controls, { radiusTarget: 13, duration: 4.4, ease: "power2.out" });
}

const colorMap = loaderTex.load("earth_color.jpg");
colorMap.encoding = THREE.sRGBEncoding; colorMap.anisotropy = MAX_ANISO;
const specMap = loaderTex.load("earth_specular.jpg", undefined, undefined,
    () => { if (earth) { earth.material.specularMap = null; earth.material.needsUpdate = true; } });
specMap.anisotropy = MAX_ANISO;
const cloudMap = loaderTex.load("earth_cloud.jpg");
cloudMap.anisotropy = MAX_ANISO;

/* ---------------------------------------------------------------------
   LUMIÈRES
   --------------------------------------------------------------------- */
const sun = new THREE.DirectionalLight(0xfff3e2, 1.45);
sun.position.copy(SUN_DIR).multiplyScalar(12);
scene.add(sun);
scene.add(new THREE.AmbientLight(0x1a2740, 0.55));

/* ---------------------------------------------------------------------
   Texture de lueur radiale
   --------------------------------------------------------------------- */
function glowTexture(stops) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}
const starTex = glowTexture([[0, "rgba(255,255,255,1)"], [0.35, "rgba(255,255,255,0.7)"], [1, "rgba(255,255,255,0)"]]);

/* ---------------------------------------------------------------------
   ÉTOILES
   --------------------------------------------------------------------- */
function starLayer(count, size, color, opacity) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        if (v.lengthSq() < 1e-4) v.set(1, 0, 0);
        v.normalize().multiplyScalar(320 + Math.random() * 220);
        pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
        map: starTex, color, size, sizeAttenuation: false,
        transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending
    }));
}
const stars = new THREE.Group();
stars.add(starLayer(2600, 2.0, 0xffffff, 0.95));
stars.add(starLayer(1300, 3.0, 0xffd0d0, 0.65));
stars.add(starLayer(600, 4.0, 0xffe2bd, 0.6));
scene.add(stars);

/* Soleil visible */
const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture([[0, "rgba(255,255,255,1)"], [0.2, "rgba(255,246,224,0.95)"], [0.5, "rgba(255,200,150,0.35)"], [1, "rgba(255,170,120,0)"]]),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
}));
sunSprite.position.copy(SUN_DIR).multiplyScalar(160); sunSprite.scale.setScalar(70); scene.add(sunSprite);

/* ---------------------------------------------------------------------
   TERRE (réaliste)
   --------------------------------------------------------------------- */
const R = 2;
const earthGroup = new THREE.Group(); earthGroup.rotation.z = 23.4 * DEG; scene.add(earthGroup);
const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), new THREE.MeshPhongMaterial({
    map: colorMap, specularMap: specMap, specular: new THREE.Color(0x2a3a55), shininess: 16
}));
earthGroup.add(earth);
const clouds = new THREE.Mesh(new THREE.SphereGeometry(R * 1.012, 96, 96), new THREE.MeshLambertMaterial({
    color: 0xffffff, alphaMap: cloudMap, transparent: true, opacity: 0.92, depthWrite: false
}));
earthGroup.add(clouds);

/* Atmosphère */
function atmosphere(radius, color, power, intensity) {
    const mat = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(color) }, uSunDir: { value: SUN_DIR.clone() }, uPower: { value: power }, uIntensity: { value: intensity } },
        vertexShader: `varying vec3 vN; varying vec3 vWN;
            void main(){ vN=normalize(normalMatrix*normal); vWN=normalize(mat3(modelMatrix)*normal);
            gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 uColor; uniform vec3 uSunDir; uniform float uPower; uniform float uIntensity;
            varying vec3 vN; varying vec3 vWN;
            void main(){ float rim=pow(clamp(0.72-dot(vN,vec3(0.0,0.0,1.0)),0.0,1.0),uPower);
            float day=clamp(dot(vWN,uSunDir)*0.7+0.45,0.0,1.0); float i=rim*day*uIntensity;
            gl_FragColor=vec4(uColor*i,i); }`,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
    });
    return new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), mat);
}
const atmoInner = atmosphere(R * 1.055, 0x5aa0ff, 3.4, 1.05);
const atmoOuter = atmosphere(R * 1.25, 0x3f7be0, 2.0, 0.5);
scene.add(atmoInner, atmoOuter);

/* ---------------------------------------------------------------------
   SPHÈRE DE DYSON — réseau géodésique + essaim de panneaux solaires
   --------------------------------------------------------------------- */
const DYSON_R = 4.7;
const dyson = new THREE.Group();
scene.add(dyson);

/* Structure géodésique (côtes blanches + rouges) */
const latticeWhite = new THREE.Mesh(new THREE.IcosahedronGeometry(DYSON_R, 3),
    new THREE.MeshBasicMaterial({ color: 0xf4f4f4, wireframe: true, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending }));
const latticeRed = new THREE.Mesh(new THREE.IcosahedronGeometry(DYSON_R * 0.985, 1),
    new THREE.MeshBasicMaterial({ color: 0xe10600, wireframe: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
dyson.add(latticeWhite, latticeRed);

/* Panneaux solaires (InstancedMesh) sur une sphère de Fibonacci */
const PANELS = 300;
const panelMat = new THREE.MeshStandardMaterial({
    color: 0x111317, metalness: 0.65, roughness: 0.38,
    emissive: new THREE.Color(0xe10600), emissiveIntensity: 0.22, side: THREE.DoubleSide
});
const panels = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.30, 0.30), panelMat, PANELS);
panels.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
dyson.add(panels);

const panelPos = [], panelOrder = [];
const GA = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < PANELS; i++) {
    const y = 1 - (i / (PANELS - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), phi = i * GA;
    panelPos.push(new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r).multiplyScalar(DYSON_R));
    panelOrder.push((i * 0.61803398875) % 1);   // ordre d'apparition pseudo-aléatoire
}
const _d = new THREE.Object3D();
let buildProgress = 0;
function setDyson(p) {
    buildProgress = p;
    for (let i = 0; i < PANELS; i++) {
        const s = Math.max(0, Math.min(1, (p - panelOrder[i]) / 0.06));
        _d.position.copy(panelPos[i]); _d.lookAt(0, 0, 0); _d.scale.setScalar(s);
        _d.updateMatrix(); panels.setMatrixAt(i, _d.matrix);
    }
    panels.instanceMatrix.needsUpdate = true;
}
setDyson(0.12);

/* ---------------------------------------------------------------------
   AUDIO + ANALYSE (oscilloscope, réactivité)
   --------------------------------------------------------------------- */
let audio = null, audioCtx = null, analyser = null, gainNode = null, freqData = null, timeData = null;
let bass = 0, level = 0;
function ensureAudio() { if (!audio) { audio = new Audio(CONFIG.audio); audio.loop = true; audio.crossOrigin = "anonymous"; } return audio; }
function setupAnalyser() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.8;
        gainNode = audioCtx.createGain(); gainNode.gain.value = 0;
        src.connect(analyser); analyser.connect(gainNode); gainNode.connect(audioCtx.destination);
        freqData = new Uint8Array(analyser.frequencyBinCount);
        timeData = new Uint8Array(analyser.fftSize);
    } catch (e) { analyser = null; }
}
function readAudio() {
    if (!analyser) { bass += (0 - bass) * 0.1; level += (0 - level) * 0.1; return; }
    analyser.getByteFrequencyData(freqData);
    let b = 0, a = 0;
    for (let i = 0; i < 12; i++) b += freqData[i];
    for (let i = 0; i < freqData.length; i++) a += freqData[i];
    bass += (b / 12 / 255 - bass) * 0.25;
    level += (a / freqData.length / 255 - level) * 0.2;
}

/* Oscilloscope */
const scope = document.getElementById("scope");
const sctx = scope ? scope.getContext("2d") : null;
function sizeScope() {
    if (!scope) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    scope.width = scope.clientWidth * dpr; scope.height = scope.clientHeight * dpr;
}
sizeScope();
function drawScope(t) {
    if (!sctx) return;
    const w = scope.width, h = scope.height;
    sctx.clearRect(0, 0, w, h);
    sctx.lineWidth = Math.max(1.5, h / 40); sctx.strokeStyle = "#e10600";
    sctx.shadowColor = "#e10600"; sctx.shadowBlur = 8;
    sctx.beginPath();
    if (analyser && timeData) {
        analyser.getByteTimeDomainData(timeData);
        const step = timeData.length / w;
        for (let x = 0; x < w; x++) {
            const v = timeData[Math.floor(x * step)] / 128 - 1;
            const y = h / 2 + v * h * 0.42;
            x === 0 ? sctx.moveTo(0, y) : sctx.lineTo(x, y);
        }
    } else {
        for (let x = 0; x < w; x++) {
            const y = h / 2 + Math.sin(x * 0.05 + t * 3) * h * 0.06;
            x === 0 ? sctx.moveTo(0, y) : sctx.lineTo(x, y);
        }
    }
    sctx.stroke(); sctx.shadowBlur = 0;
}

/* ---------------------------------------------------------------------
   ROBOTS (Die Roboter) + bandeau
   --------------------------------------------------------------------- */
const ROBOT_SVG = `<svg class="robot" viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
<rect x="11" y="2" width="18" height="15" fill="#f4f4f4"/><rect x="14" y="7" width="12" height="3" fill="#050505"/>
<rect x="18" y="17" width="4" height="3" fill="#9c0400"/><rect x="9" y="20" width="22" height="33" fill="#e10600"/>
<polygon points="20,20 16,41 24,41" fill="#050505"/><rect x="3" y="22" width="5" height="27" fill="#f4f4f4"/>
<rect x="32" y="22" width="5" height="27" fill="#f4f4f4"/><rect x="11" y="53" width="7" height="24" fill="#141414"/>
<rect x="22" y="53" width="7" height="24" fill="#141414"/></svg>`;
["loader-robots", "stage-robots"].forEach(id => {
    const el = document.getElementById(id); if (el) el.innerHTML = ROBOT_SVG.repeat(4);
});
const stageRobots = Array.from(document.querySelectorAll("#stage-robots .robot"));

const tickerMove = document.getElementById("ticker-move");
if (tickerMove) {
    const seq = CONFIG.ticker.join(" ◆ ") + " ◆ ";
    tickerMove.textContent = seq + seq;   // doublé pour une boucle continue
}

/* ---------------------------------------------------------------------
   TÉLÉMÉTRIE (saveur Kraftwerk)
   --------------------------------------------------------------------- */
const energyEl = document.getElementById("energy-val");
const radioEl = document.getElementById("radio-val");
const numEl = document.getElementById("num-val");
const speedEl = document.getElementById("speed-val");
const clockEl = document.getElementById("clock");
const dysonPct = document.getElementById("dyson-pct");
const dysonFill = document.getElementById("dyson-fill");
const NUMS = ["EINS", "ZWEI", "DREI", "VIER"];
const space3 = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const pad3 = n => String(Math.round(n)).padStart(3, "0");
let radioTimer = 0, radioVal = 0.41;
function updateHUD(t, dt) {
    if (energyEl) energyEl.textContent = pad3(buildProgress * 999) + " YW";
    radioTimer += dt;
    if (radioTimer > 0.15) { radioTimer = 0; radioVal = 0.35 + Math.random() * 0.18 + (Math.random() < 0.04 ? Math.random() * 1.6 : 0); }
    if (radioEl) radioEl.textContent = radioVal.toFixed(2) + " µSv";
    if (numEl) numEl.textContent = NUMS[Math.floor(t * 2) % 4];
    if (speedEl) speedEl.textContent = space3(27600 + Math.sin(t * 0.4) * 45) + " km/h";
    if (dysonPct) dysonPct.textContent = Math.round(buildProgress * 100) + "%";
    if (dysonFill) dysonFill.style.width = (buildProgress * 100) + "%";
    if (clockEl) {
        const d = new Date(), p = n => String(n).padStart(2, "0");
        clockEl.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
    }
}

/* ---------------------------------------------------------------------
   BOUCLE
   --------------------------------------------------------------------- */
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    readAudio();

    earth.rotation.y += dt * 0.025; clouds.rotation.y += dt * 0.030; stars.rotation.y += dt * 0.004;
    dyson.rotation.y += dt * 0.025; dyson.rotation.x = Math.sin(t * 0.05) * 0.05;

    /* réactivité musicale */
    panelMat.emissiveIntensity = 0.22 + Math.sin(t * 1.5) * 0.05 + bass * 1.4;
    latticeRed.material.opacity = 0.5 + level * 0.4;
    latticeWhite.material.opacity = 0.07 + level * 0.12;
    atmoInner.material.uniforms.uIntensity.value = (launched ? 1.5 : 1.05) + bass * 0.5;
    if (titleEl && launched) titleEl.style.textShadow = `0 2px 26px rgba(0,0,0,.85), 0 0 ${40 + bass * 60}px rgba(225,6,0,${0.5 + bass * 0.4})`;

    stageRobots.forEach((r, i) => {
        const amp = (launched ? 16 : 4), y = -(Math.abs(Math.sin(t * 5 + i * 0.7)) * (bass * amp + 1.5));
        r.style.transform = `translateY(${y}px)`;
    });

    controls.update(dt);
    updateHUD(t, dt);
    drawScope(t);
    renderer.render(scene, camera);
}

/* ---------------------------------------------------------------------
   INTERFACE / RÉVÉLATION
   --------------------------------------------------------------------- */
const btn = document.getElementById("btn");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const eyebrowEl = document.getElementById("eyebrow");
const dateEl = document.getElementById("dateline");
const statusEl = document.getElementById("status");
const statusTextEl = document.getElementById("status-text");
const soundBtn = document.getElementById("sound");
let launched = false;

if (soundBtn) soundBtn.addEventListener("click", () => {
    if (!gainNode) return;
    const muted = !soundBtn.classList.contains("muted");
    soundBtn.classList.toggle("muted", muted);
    gsap.to(gainNode.gain, { value: muted ? 0 : 0.55, duration: 0.4 });
});

btn.addEventListener("click", () => {
    if (launched) return; launched = true;

    ensureAudio(); setupAnalyser();
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    audio.play().then(() => { if (gainNode) gsap.to(gainNode.gain, { value: 0.55, duration: 2.4 }); }).catch(() => {});
    if (soundBtn) soundBtn.classList.add("show");

    btn.classList.add("gone");
    if (statusEl) statusEl.classList.add("online");
    if (statusTextEl) statusTextEl.textContent = "ONLINE";

    const tl = gsap.timeline();
    tl.to(controls, { radiusTarget: 8.2, duration: 3.4, ease: "power2.inOut" }, 0)
      .to(renderer, { toneMappingExposure: 1.16, duration: 3, ease: "power2.out" }, 0)
      .to({ p: buildProgress }, { p: 1, duration: 3.6, ease: "power2.out", onUpdate() { setDyson(this.targets()[0].p); } }, 0)
      .to([titleEl, descEl], { opacity: 0, y: -10, duration: 0.45, ease: "power1.in" }, 0.6)
      .add(() => {
          titleEl.innerHTML = CONFIG.titreReveal; titleEl.classList.add("reveal");
          descEl.innerHTML = CONFIG.messageReveal;
          if (eyebrowEl) eyebrowEl.textContent = CONFIG.eyebrowReveal;
      })
      .to([titleEl, descEl], { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .add(() => { if (dateEl) { dateEl.textContent = CONFIG.dateReveal; dateEl.classList.add("show"); } }, "-=0.4");
});

/* Texte initial depuis la config */
if (eyebrowEl) eyebrowEl.textContent = CONFIG.eyebrowStart;
if (titleEl) titleEl.textContent = CONFIG.titreStart;

/* ---------------------------------------------------------------------
   REDIMENSIONNEMENT
   --------------------------------------------------------------------- */
window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    sizeScope();
});

/* Démarrage de la boucle (après toutes les déclarations) */
animate();
