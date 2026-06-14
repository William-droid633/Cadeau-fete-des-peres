// --- 1. INITIALISATION DE LA SCÈNE THREE.JS ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.08);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 7);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- 2. CRÉATION DES ÉLÉMENTS GRAPHIQUES (KRAFTWERK STYLE) ---

// A. La grille au sol infinie (Computer World Grid)
const gridX = 40;
const gridZ = 40;
const gridGeometry = new THREE.PlaneGeometry(60, 60, gridX, gridZ);
const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aa00,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
gridMesh.rotation.x = -Math.PI / 2; // Met la grille à plat
scene.add(gridMesh);

// B. L'objet central mathématique vert néon
const coreGeometry = new THREE.IcosahedronGeometry(1.5, 2); // Forme géométrique pure
const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.7
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
coreMesh.position.set(0, 1.5, 0);
scene.add(coreMesh);

// --- 3. LOGIQUE D'ANIMATION EN TEMPS RÉEL ---
const clock = new THREE.Clock();

// Déformation dynamique de la grille pour simuler des ondes sonores/synthétiseur
const positionAttribute = gridGeometry.attributes.position;
const vertexCount = positionAttribute.count;

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. Animation de l'objet central
    coreMesh.rotation.y = time * 0.3;
    coreMesh.rotation.x = time * 0.1;
    // Pulsation mathématique régulière (effet rythme cardiaque de synthétiseur)
    const scaleFactor = 1 + Math.sin(time * 2.5) * 0.08;
    coreMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 2. Animation des vagues sur la grille
    for (let i = 0; i < vertexCount; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Formule mathématique pour générer des vagues de données rétro
        const zValue = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 0.5;
        positionAttribute.setZ(i, zValue);
    }
    positionAttribute.needsUpdate = true;

    // 3. Rendu
    renderer.render(scene, camera);
}
animate();

// Réactivité aux changements de taille d'écran
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. GESTION DES INTERACTIONS (GSAP) ---
const actionBtn = document.getElementById('action-btn');
const typewriter = document.getElementById('typewriter');

actionBtn.addEventListener('click', () => {
    // Séquence d'animation cybernétique au clic
    gsap.to(actionBtn, { opacity: 0, scale: 0.8, duration: 0.4, pointerEvents: 'none' });
    
    // Changement de texte dynamique
    gsap.to(typewriter, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            typewriter.innerHTML = "MESSAGE REÇU // TRANSMISSION :<br><span style='color:#ff0000; font-size: 1.5rem;'>BONNE FÊTE DES PÈRES !</span><br>MERCI D'ÊTRE LE MEILLEUR DES PILOTES.";
            gsap.to(typewriter, { opacity: 1, duration: 1 });
            document.querySelector('.glitch-title').innerHTML = "SYSTEM.PAPA.OK";
            document.querySelector('.glitch-title').style.color = "#ff0000";
        }
    });

    // Modification spectaculaire de la 3D (accélération et changement de couleur)
    gsap.to(camera.position, { z: 4, y: 1, duration: 2, ease: 'expo.inOut' });
    gsap.to(coreMesh.rotation, { x: 5, y: 5, duration: 2 });
    coreMaterial.color.setHex(0xff0000); // Devient rouge électrique
    gridMaterial.color.setHex(0x00ff00);
    gridMaterial.opacity = 0.8;
});
