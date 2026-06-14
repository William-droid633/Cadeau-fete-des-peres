// ======================
// SCENE
// ======================
const scene = new THREE.Scene();

// CAMERA (cinematic feel)
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,0,12);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// ======================
// LIGHTING (SUN CORE)
// ======================
const sunLight = new THREE.PointLight(0x00ffcc, 2);
sunLight.position.set(0,0,0);
scene.add(sunLight);

scene.add(new THREE.AmbientLight(0x111111));

// ======================
// STARFIELD (MULTI DEPTH)
// ======================
function stars(n,spread,color,opacity){
const geo = new THREE.BufferGeometry();
const pos = [];

for(let i=0;i<n;i++){
pos.push((Math.random()-0.5)*spread);
pos.push((Math.random()-0.5)*spread);
pos.push((Math.random()-0.5)*spread);
}

geo.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));

return new THREE.Points(
geo,
new THREE.PointsMaterial({
color,
size:0.03,
transparent:true,
opacity
})
);
}

scene.add(stars(3000,80,0xffffff,0.8));
scene.add(stars(2000,120,0x88aaff,0.5));
scene.add(stars(1500,160,0x00ffcc,0.3));

// ======================
// EARTH (REALISTIC LAYERED)
// ======================
const loader = new THREE.TextureLoader();

const earth = new THREE.Mesh(
new THREE.SphereGeometry(2,64,64),
new THREE.MeshStandardMaterial({
map: loader.load("earth_color.jpg"),
roughness:0.9,
metalness:0.1
})
);

scene.add(earth);

// clouds
const clouds = new THREE.Mesh(
new THREE.SphereGeometry(2.02,64,64),
new THREE.MeshStandardMaterial({
map: loader.load("earth_cloud.jpg"),
transparent:true,
opacity:0.35
})
);

scene.add(clouds);

// ======================
// DYSON SPHERE (ENERGY SHELL)
// ======================
const dyson = new THREE.Group();
scene.add(dyson);

// glowing shell
const shell = new THREE.Mesh(
new THREE.SphereGeometry(5,64,64),
new THREE.MeshBasicMaterial({
color:0x00ffcc,
wireframe:true,
transparent:true,
opacity:0.07
})
);

dyson.add(shell);

// rings
const rings=[];

function ring(r,x,y,s){
const m = new THREE.Mesh(
new THREE.TorusGeometry(r,0.02,16,200),
new THREE.MeshBasicMaterial({
color:0x00ffcc,
transparent:true,
opacity:0.25
})
);

m.rotation.x=x;
m.rotation.y=y;
m.userData.speed=s;

dyson.add(m);
rings.push(m);
}

ring(3,0.5,0.2,0.2);
ring(4,-0.4,1.2,-0.1);

// ======================
// ENERGY FIELD (REALISM BOOST)
// ======================
const geo = new THREE.BufferGeometry();
const pos = [];

for(let i=0;i<4000;i++){
pos.push((Math.random()-0.5)*14);
pos.push((Math.random()-0.5)*14);
pos.push((Math.random()-0.5)*14);
}

geo.setAttribute("position", new THREE.Float32BufferAttribute(pos,3));

const energy = new THREE.Points(
geo,
new THREE.PointsMaterial({
color:0x00ffcc,
size:0.03,
transparent:true,
opacity:0.5
})
);

scene.add(energy);

// ======================
// AUDIO (SAFE)
// ======================
let audio;

function initAudio(){
audio = new Audio("kraftwerk.mp3");
audio.loop=true;
audio.volume=0.5;
}

// ======================
// ANIMATION (CINEMA MOVEMENT)
// ======================
const clock = new THREE.Clock();

function animate(){
requestAnimationFrame(animate);

const t = clock.getElapsedTime();

// cinematic slow drift camera
camera.position.x = Math.sin(t*0.1)*0.5;
camera.position.y = Math.cos(t*0.1)*0.3;

earth.rotation.y += 0.001;
clouds.rotation.y += 0.0015;

dyson.rotation.y = t*0.03;

rings.forEach(r=>{
r.rotation.z += r.userData.speed*0.01;
});

energy.rotation.y = t*0.02;

renderer.render(scene,camera);
}

animate();

// ======================
// INTERACTION
// ======================
const btn = document.getElementById("btn");

btn.addEventListener("click", async()=>{

if(!audio) initAudio();

try{ await audio.play(); }catch(e){}

gsap.to(camera.position,{z:6,duration:3});

let data={temp:273,energy:0,progress:0};

gsap.to(data,{
temp:20000,
energy:999,
progress:100,
duration:4,
onUpdate:()=>{
document.getElementById("temp-val").textContent=Math.floor(data.temp)+"K";
document.getElementById("energy-val").textContent=data.energy.toFixed(0)+"YW";
document.getElementById("progress-percent").textContent=Math.floor(data.progress)+"%";
}
});

document.getElementById("title").innerText="DYSON ACTIVE";
document.getElementById("status").innerText="ONLINE";
});

// resize
window.addEventListener("resize",()=>{
camera.aspect=innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);
});