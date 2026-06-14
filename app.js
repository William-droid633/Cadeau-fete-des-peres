// --- 1. MOTEUR 3D : LA SPHÈRE DE DYSON ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020202, 0.1);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Groupe contenant toute la structure pour la rotation globale
const dysonSystem = new THREE.Group();
scene.add(dysonSystem);

// A. L'ÉTOILE CENTRALE (Le Cœur Nucléaire)
const starGeo = new THREE.SphereGeometry(0.8, 32, 32);
const starMat = new THREE.MeshBasicMaterial({ color: 0x00ff66, wireframe: true, transparent: true, opacity: 0.2 });
const star = new THREE.Mesh(starGeo, starMat);
dysonSystem.add(star);

// B. ANNEAUX DE DYSON (Mégastructure filaire)
const rings = [];
const ringMaterials = [];

const createDysonRing = (radius, tube, rotX, rotY) => {
    const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff66, wireframe: true, transparent: true, opacity: 0.4 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = rotX;
    ringMesh.rotation.y = rotY;
    dysonSystem.add(ringMesh);
    rings.push(ringMesh);
    ringMaterials.push(ringMat);
};

// Génération de 3 anneaux géants sur des axes différents
createDysonRing(1.8, 0.04, Math.PI / 4, 0);
createDysonRing(2.2, 0.03, -Math.PI / 4, Math.PI / 4);
createDysonRing(2.6, 0.02, 0, Math.PI / 2);

// C. CHAMP DE PARTICULES DE DONNÉES
const partGeo = new THREE.BufferGeometry();
const partCount = 1000;
const posArray = new Float32Array(partCount * 3);
for(let i=0; i<partCount*3; i++) { posArray[i] = (Math.random() - 0.5) * 15; }
partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const partMat = new THREE.PointsMaterial({ size: 0.02, color: 0x00ff66, transparent: true, opacity: 0.3 });
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// Animation de base
const clock = new THREE.Clock();
let activeMode = false;

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Rotations mécaniques asynchrones (Style mécanique orbitale)
    star.rotation.y = time * 0.2;
    rings[0].rotation.z = time * 0.1;
    rings[1].rotation.x = time * -0.15;
    rings[2].rotation.y = time * 0.08;
    particles.rotation.y = time * 0.01;

    if (activeMode) {
        // Pulsation hyper-rapide en mode actif
        const pulse = 1 + Math.sin(time * 15) * 0.1;
        star.scale.set(pulse, pulse, pulse);
    }

    renderer.render(scene, camera);
}
animate();

// --- 2. SYNTHÉTISEUR AUDIO (HOMMAGE KRAFTWERK VIA WEB AUDIO API) ---
let audioCtx = null;

const playKraftwerkSynth = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let step = 0;
    
    // Notes de la séquence (Basse minimaliste style "Radioactivity")
    const sequence = [110, 110, 130, 146, 110, 110, 165, 146]; 

    setInterval(() => {
        if (!activeMode) return;

        // 1. Générateur d'onde (Synthétiseur)
        let osc = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        
        // Type d'onde rétro : "sawtooth" (dent de scie) ou "square" (carrée) pour le côté robotique
        osc.type = 'square';
        osc.frequency.setValueAtTime(sequence[step % sequence.length], audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);

        step++;
    }, 250); // Tempo rigide (120 BPM)
};

// --- 3. SÉQUENCE D'INITIALISATION MAJESTUEUSE ---
const trigger = document.getElementById('launch-trigger');

trigger.addEventListener('click', () => {
    activeMode = true;
    playKraftwerkSynth(); // Démarre le synthétiseur de code

    // Effacement de l'interface de contrôle
    gsap.to(trigger, { opacity: 0, y: 20, duration: 0.5, pointerEvents: 'none' });
    document.getElementById('status-desc').style.display = 'none';

    // Mutation visuelle immédiate de la 3D (Énergie pure)
    starMat.color.setHex(0xff0055);
    ringMaterials.forEach(m => {
        m.color.setHex(0xff0055);
        m.opacity = 0.8;
    });
    partMat.color.setHex(0xffffff);

    // Zoom cinématique au cœur du réacteur
    gsap.to(camera.position, { z: 2.8, duration: 4, ease: 'power4.inOut' });

    // Simulation de la montée en puissance de la centrale (Télémétrie)
    let telemetryData = { temp: 273, energy: 0, progress: 0 };
    
    gsap.to(telemetryData, {
        temp: 15000000, // 15 Millions de Kelvins (Température cœur du soleil)
        energy: 384.6,  // Puissance totale d'une Sphère de Dyson en Yottawatts
        progress: 100,
        duration: 4,
        ease: 'power2.in',
        onUpdate: () => {
            document.getElementById('temp-val').innerText = Math.floor(telemetryData.temp).toLocaleString() + " K";
            document.getElementById('energy-val').innerText = telemetryData.energy.toFixed(2) + " YW";
            document.getElementById('progress-percent').innerText = Math.floor(telemetryData.progress) + "%";
        },
        onComplete: () => {
            // Affichage du message final grandiose
            const title = document.getElementById('main-title');
            title.innerHTML = "SYSTEM.PAPA.MAX_POWER";
            title.style.color = "#ffffff";
            title.style.textShadow = "0 0 30px #ff0055";

            // Injection du texte de remerciement à la place des sous-titres
            const infoBlock = document.createElement('div');
            infoBlock.innerHTML = "<br><br>SÉQUENCE COMPLÈTE.<br>BONNE FÊTE AU MEILLEUR DES PÈRES.<br>TRANSMISSION TERMINÉE.";
            infoBlock.style.color = "#ffffff";
            infoBlock.style.fontSize = "1.2rem";
            infoBlock.style.letterSpacing = "2px";
            document.querySelector('.core-control').appendChild(infoBlock);
        }
    });
});

// Redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
