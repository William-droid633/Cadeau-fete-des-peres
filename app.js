// --- 1. SÉQUENCE DE DÉMARRAGE (BOOT) ---
const initBootSequence = () => {
    const tl = gsap.timeline();
    tl.to('.progress-fill', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
      .to('.loader-text', { opacity: 0, duration: 0.2 }, "+=0.2")
      .to('#loader', { height: 0, opacity: 0, duration: 0.8, ease: 'expo.inOut' })
      .to('#ui-layer', { opacity: 1, duration: 1 }, "-=0.4")
      .add(() => scrambleText(document.getElementById('main-title')), "-=0.5");
};

// --- 2. EFFET DE BROUILLAGE DE TEXTE (SCRAMBLE) ---
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const scrambleText = (element) => {
    const originalText = element.getAttribute('data-target') || element.innerText;
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = originalText.split('').map((letter, index) => {
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 1 / 3; // Vitesse du décodage
    }, 30);
};

// --- 3. MOTEUR 3D (THREE.JS) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Objet principal : TorusKnot avec AdditiveBlending pour l'effet "Glow"
const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 256, 32);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff41, 
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending // Crucial pour l'effet d'hologramme/néon
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Particules en fond
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({ size: 0.015, color: 0x00ff41, transparent: true, opacity: 0.3 });
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// --- 4. LOGIQUE D'ANIMATION ET PARALLAXE ---
let mouseX = 0; let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    mesh.rotation.x = time * 0.1;
    mesh.rotation.y = time * 0.15;
    particlesMesh.rotation.y = time * 0.02;

    // Déformation mathématique fluide (Pulsation)
    const scale = 1 + Math.sin(time * 2) * 0.05;
    mesh.scale.set(scale, scale, scale);

    // Mouvement caméra basé sur la souris
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Fausse variation des données CPU
    if (Math.random() > 0.95) {
        document.getElementById('cpu-val').innerText = Math.floor(Math.random() * 30 + 10) + '%';
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 5. INTERACTION FINALE ---
const btn = document.getElementById('decrypt-btn');
const title = document.getElementById('main-title');
const subtitle = document.getElementById('subtitle');

// Effet de scramble au survol du bouton
btn.addEventListener('mouseenter', () => scrambleText(btn.querySelector('.btn-text')));

btn.addEventListener('click', () => {
    gsap.to(btn, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
    
    // Décodage du message final
    title.setAttribute('data-target', 'BONNE_FÊTE_PAPA');
    scrambleText(title);
    
    setTimeout(() => {
        subtitle.innerHTML = "Transmission réussie. Merci pour tout ton soutien.<br>Signé : Ton fils.";
        gsap.fromTo(subtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 });
        
        // Accélération de la 3D et changement de couleur pour marquer le succès
        gsap.to(camera.position, { z: 2.5, duration: 2, ease: 'power3.inOut' });
        gsap.to(material, { opacity: 0.6, duration: 1 });
        material.color.setHex(0xff003c); // Passage au rouge
        particlesMat.color.setHex(0xff003c);
        
        // Change la couleur des éléments HUD en rouge via les variables CSS
        document.documentElement.style.setProperty('--color-main', '#ff003c');
        document.documentElement.style.setProperty('--color-main-dim', 'rgba(255, 0, 60, 0.3)');
    }, 1500);
});

// Lancement au chargement de la page
window.onload = () => {
    animate();
    initBootSequence();
};
