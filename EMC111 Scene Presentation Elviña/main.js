const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1220);
scene.fog = new THREE.FogExp2(0x0f1220, 0.06);

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.8, 400);

const orbitRadius = 18;
const tilt = THREE.MathUtils.degToRad(30);
let angle = 0;

function updateCameraPos() {
  camera.position.set(
    Math.sin(angle) * orbitRadius,
    Math.sin(tilt) * orbitRadius * 0.55,
    Math.cos(angle) * orbitRadius
  );
  camera.lookAt(0, 0.2, -0);
}



scene.add(new THREE.AmbientLight(0x808080, 0.4));

const moon = new THREE.DirectionalLight(0xc8dff6, 0.7);
moon.position.set(-6, 12, 6);
moon.castShadow = false;
scene.add(moon);

const spot1 = new THREE.SpotLight(0xfff7d6, 1.1, 40, Math.PI / 8, 0.5, 1);
spot1.position.set(3.2, 6.2, 1.2);
spot1.target.position.set(1.7, 2.3, 1.2);
scene.add(spot1, spot1.target);

const spot2 = new THREE.SpotLight(0xfff7d6, 0.9, 40, Math.PI / 8, 0.5, 1);
spot2.position.set(6.2, 6.2, 1.2);
spot2.target.position.set(4.7, 2.3, 1.2);
scene.add(spot2, spot2.target);

const groundMat = new THREE.MeshStandardMaterial({ color: 0x1b1b22, roughness: 1.0, metalness: 0.0 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

const roadMat = new THREE.MeshStandardMaterial({ color: 0x0f0f12, roughness: 0.9 });
const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 60), roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.001, -6);
scene.add(road);

const crackCanvas = document.createElement('canvas');
crackCanvas.width = 512;
crackCanvas.height = 512;
const cctx = crackCanvas.getContext('2d');
cctx.fillStyle = '#1b1b22';
cctx.fillRect(0, 0, 512, 512);
for (let i = 0; i < 180; i++) {
  cctx.strokeStyle = 'rgba(60,60,60,' + (Math.random() * 0.12 + 0.02) + ')';
  cctx.beginPath();
  cctx.moveTo(Math.random() * 512, Math.random() * 512);
  cctx.lineTo(Math.random() * 512, Math.random() * 512);
  cctx.stroke();
}
const crackTex = new THREE.CanvasTexture(crackCanvas);
crackTex.wrapS = crackTex.wrapT = THREE.RepeatWrapping;
crackTex.repeat.set(6, 2);
road.material.map = crackTex;
road.material.needsUpdate = true;

function addSilhouette(x, z, h, w) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 1 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 2), mat);
  b.position.set(x, h / 2 - 0.2, z);
  b.rotation.y = (Math.random() - 0.5) * 0.2;
  scene.add(b);
}
addSilhouette(-10, -30, 9, 18);
addSilhouette(12, -32, 10, 20);
addSilhouette(-2, -40, 6, 10);

const boardGeo = new THREE.BoxGeometry(5.2, 3.2, 0.25);
const boardMat = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.9, metalness: 0.03 });
const board = new THREE.Mesh(boardGeo, boardMat);
board.position.set(3, 2.2, 1.2);
board.castShadow = true;
board.receiveShadow = true;
scene.add(board);

const postMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 1 });
const postL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 0.3), postMat);
postL.position.set(1.2, 0.9, 1.2);
const postR = postL.clone();
postR.position.set(5.2, 0.9, 1.2);
scene.add(postL, postR);

const txt = document.createElement('canvas');
txt.width = 1024;
txt.height = 512;
const ctx = txt.getContext('2d');
ctx.fillStyle = '#1f2326';
ctx.fillRect(0, 0, 1024, 512);
for (let i = 0; i < 200; i++) {
  ctx.fillStyle = 'rgba(40,40,40,' + (Math.random() * 0.05 + 0.01) + ')';
  ctx.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 30 + 2, 1);
}
ctx.font = 'bold 82px serif';
ctx.fillStyle = 'rgba(196,176,150,0.95)';
ctx.textAlign = 'center';
ctx.fillText('Welcome To', 1024 / 2, 512 / 2 - 20);
ctx.fillText('Silent Hill', 1024 / 2, 512 / 2 + 70);
ctx.fillStyle = 'rgba(0,0,0,0.18)';
ctx.fillText('Welcome To', 1024 / 2 + 3, 512 / 2 - 17);
ctx.fillText('Silent Hill', 1024 / 2 + 3, 512 / 2 + 73);
const boardTex = new THREE.CanvasTexture(txt);
board.material.map = boardTex;
board.material.needsUpdate = true;

const grassMat = new THREE.MeshStandardMaterial({ color: 0x1e2b24, roughness: 1 });
const g1 = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), grassMat);
g1.rotation.x = -Math.PI / 2;
g1.position.set(1.2, 0.01, 1.6);
const g2 = g1.clone();
g2.position.set(5.2, 0.01, 1.6);
scene.add(g1, g2);

const flickerClock = { t: 0 };
function updateFlicker(dt) {
  flickerClock.t += dt;
  spot1.intensity = 0.9 + Math.sin(flickerClock.t * 8) * 0.12 + Math.random() * 0.04;
  spot2.intensity = 0.7 + Math.cos(flickerClock.t * 7.5) * 0.12 + Math.random() * 0.04;
}

// ----------- PARTICLES ------------
const particleCount = 600;
const partPos = new Float32Array(particleCount * 3);
const partSpeed = new Float32Array(particleCount); // each has unique fall speed
const partSize = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  partPos[i * 3 + 0] = (Math.random() - 0.5) * 40;
  partPos[i * 3 + 1] = Math.random() * 24; // randomized start height
  partPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  partSize[i] = Math.random() * 1.6 + 0.4;
  partSpeed[i] = 0.5 + Math.random() * 0.8; // each falls at its own rate
}

const partGeo = new THREE.BufferGeometry();
partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
partGeo.setAttribute('size', new THREE.BufferAttribute(partSize, 1));

const psCanvas = document.createElement('canvas');
psCanvas.width = 64;
psCanvas.height = 64;
const psCtx = psCanvas.getContext('2d');
const grad = psCtx.createRadialGradient(32, 32, 2, 32, 32, 32);
grad.addColorStop(0, 'rgba(255,200,160,0.85)');
grad.addColorStop(0.2, 'rgba(200,160,120,0.45)');
grad.addColorStop(1, 'rgba(0,0,0,0)');
psCtx.fillStyle = grad;
psCtx.fillRect(0, 0, 64, 64);
const sprite = new THREE.CanvasTexture(psCanvas);

const partMat = new THREE.PointsMaterial({
  map: sprite,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  size: 0.9
});
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// color variation
const emberColors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 0.6 + Math.random() * 0.4;
  const gcol = 0.2 + Math.random() * 0.2;
  const b = 0.05 + Math.random() * 0.05;
  emberColors[i * 3 + 0] = r;
  emberColors[i * 3 + 1] = gcol;
  emberColors[i * 3 + 2] = b;
}
partGeo.setAttribute('color', new THREE.BufferAttribute(emberColors, 3));
partMat.vertexColors = true;

// --- CAMERA MOVEMENT CONTROL ---
const keys = { a: false, d: false };
const rotationSpeed = 1.0;

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'a') keys.a = true;
  if (e.key.toLowerCase() === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'a') keys.a = false;
  if (e.key.toLowerCase() === 'd') keys.d = false;
});

const clock = new THREE.Clock();

function animate() {
  const dt = clock.getDelta();
  const t = clock.elapsedTime;

  const posArr = partGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    let idx = i * 3;
    posArr[idx + 1] -= partSpeed[i] * dt * 2.0; // fall rate varies

    // subtle drift
    posArr[idx + 0] += Math.sin(t * 0.3 + i) * 0.002;
    posArr[idx + 2] += Math.cos(t * 0.25 + i * 0.7) * 0.002;

    // respawn individually
    if (posArr[idx + 1] < -1) {
      posArr[idx + 1] = 20 + Math.random() * 6;
      posArr[idx + 0] = (Math.random() - 0.5) * 40;
      posArr[idx + 2] = (Math.random() - 0.5) * 40;
    }
  }
  partGeo.attributes.position.needsUpdate = true;

  board.material.emissiveIntensity = 0.08 + Math.abs(Math.sin(t * 0.5)) * 0.02;

  updateFlicker(t);

  // --- A and D CAMERA MOVEMENT ---
  if (keys.a) angle += rotationSpeed * dt;
  if (keys.d) angle -= rotationSpeed * dt;
  updateCameraPos();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);


  
});
