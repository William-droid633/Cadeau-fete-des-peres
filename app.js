const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.15);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// A. Nuage de particules (façon data stream)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ 
    size: 0.02, color: 0x00ff00, transparent: true, opacity: 0.4 
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// B. La forme complexe (TorusKnot) en mode Kraftwerk
const shapeGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 32);
const shapeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const mainShape = new THREE.Mesh(shapeGeometry, shapeMaterial);
scene.add(mainShape);

// C. Interaction souris / tactile
let mouseX = 0; let mouseY = 0; let targetX = 0; let targetY = 0;
const windowHalfX = window.innerWidth / 2; const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => { 
    mouseX = (e.clientX - windowHalfX); 
    mouseY = (e.clientY - windowHalfY); 
});
document.addEventListener('touchmove', (e) => { 
    if(e.touches.length > 0) { 
        mouseX = (e.touches[0].clientX - windowHalfX); 
        mouseY = (e.touches[0].clientY - windowHalfY); 
    }
});

// D. Boucle d'animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotation infinie
    mainShape.rotation.y += 0.003;
    mainShape.rotation.x += 0.002;
    particlesMesh.rotation.y = -elapsedTime * 0.05;
    
    // Effet de pulsation (comme un synthétiseur)
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.04;
    mainShape.scale.set(scale, scale, scale);

    // Parallaxe très fluide
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    camera.position.x += 0.05 * (targetX - camera.position.x);
    camera.position.y += 0.05 * (-targetY - camera.position.y);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// E. Séquence d'activation (GSAP)
const actionBtn = document.getElementById('action-btn');
const typewriter = document.getElementById('typewriter');

actionBtn.addEventListener('click', () => {
    gsap.to(actionBtn, { opacity: 0, duration: 0.3, pointerEvents: 'none', display: 'none' });
    
    gsap.to(typewriter, {
        opacity: 0, duration: 0.3,
        onComplete: () => {
            typewriter.innerHTML = "SÉQUENCE VALIDÉE // TRANSMISSION...<br><br><span style='color:#ffffff; font-size: 1.8rem; font-weight: bold;'>BONNE FÊTE PAPA !</span>";
            gsap.to(typewriter, { opacity: 1, duration: 1 });
            
            const title = document.querySelector('.glitch-title');
            title.innerHTML = "MENSCH_MASCHINE";
            title.style.color = "#ffffff";
        }
    });

    // Effet "Hyperespace" vers la forme 3D
    gsap.to(camera.position, { z: 1.8, duration: 2.5, ease: 'power2.inOut' });
    gsap.to(shapeMaterial, { opacity: 0.9, duration: 2 });
    particlesMaterial.color.setHex(0xffffff); // Particules deviennent blanches
});
