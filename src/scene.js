import * as THREE from 'three';

let scene, camera, renderer, kettlebell;
let mouseX = 0;
let mouseY = 0;
let isMobile = false;

const GROUP_RADIUS = 1.2;

export function initScene(container) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;

  // Determine if mobile for sizing
  isMobile = window.innerWidth < 768;

  scene = new THREE.Scene();
  scene.background = null;

  const fov = isMobile ? 50 : 45;
  const zPos = isMobile ? 6.5 : 5;
  camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100);
  camera.position.set(0, 0, zPos);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);
  const fillLight = new THREE.DirectionalLight(0x00d1c1, 0.6);
  fillLight.position.set(-3, 2, 4);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(-2, -1, -5);
  scene.add(rimLight);
  const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
  topLight.position.set(0, 10, 0);
  scene.add(topLight);

  // Shadow plane
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.ShadowMaterial({ opacity: 0.15, color: 0x000000 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -GROUP_RADIUS - 0.1;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  kettlebell = createKettlebell();
  scene.add(kettlebell);

  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
  animate();
}

function createKettlebell() {
  const group = new THREE.Group();

  // Handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.65, 1.9, 0),
    new THREE.Vector3(-0.9, 2.6, 0),
    new THREE.Vector3(-0.7, 3.2, 0.15),
    new THREE.Vector3(0, 3.4, 0),
    new THREE.Vector3(0.7, 3.2, -0.15),
    new THREE.Vector3(0.9, 2.6, 0),
    new THREE.Vector3(0.65, 1.9, 0),
  ]);
  const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.12, 8, true);
  const handleMat = new THREE.MeshPhysicalMaterial({
    color: 0x909090,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 0.1,
    envMapIntensity: 0.8,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.castShadow = true;
  handle.receiveShadow = true;
  group.add(handle);

  // Body
  const bodyGeo = new THREE.SphereGeometry(GROUP_RADIUS, 48, 48);
  const positions = bodyGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    if (y > 0.5) {
      positions.setY(i, y * (1 - (y - 0.5) * 0.35));
    } else if (y < -0.5) {
      positions.setY(i, y * (1 - (Math.abs(y) - 0.5) * 0.3));
    }
  }
  positions.needsUpdate = true;
  bodyGeo.computeVertexNormals();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f5f5,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.3,
    sheen: 0.05,
    sheenColor: new THREE.Color(0xffffff),
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.1;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Base ring
  const ringGeo = new THREE.TorusGeometry(GROUP_RADIUS * 0.85, 0.05, 16, 48);
  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0xb0b0b0,
    metalness: 0.7,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = -GROUP_RADIUS * 0.85;
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  group.add(ring);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.2, 0.5, 0.5, 16);
  const neckMat = new THREE.MeshPhysicalMaterial({
    color: 0xe8e8e8,
    roughness: 0.3,
    metalness: 0.1,
  });
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.position.y = 1.4;
  neck.castShadow = true;
  neck.receiveShadow = true;
  group.add(neck);

  // Accent ring
  const accentGeo = new THREE.TorusGeometry(0.4, 0.04, 8, 32);
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0x00d1c1,
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0x00d1c1,
    emissiveIntensity: 0.05,
  });
  const accent = new THREE.Mesh(accentGeo, accentMat);
  accent.position.y = 1.15;
  accent.rotation.x = Math.PI / 2;
  group.add(accent);

  return group;
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onResize() {
  if (!renderer || !camera) return;
  const container = renderer.domElement.parentElement;
  if (!container) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function animate() {
  requestAnimationFrame(animate);
  if (!kettlebell) return;

  const time = Date.now() * 0.001;
  kettlebell.position.y = Math.sin(time * 0.5) * 0.08;
  kettlebell.rotation.y += 0.003;
  kettlebell.rotation.x += (mouseY * 0.1 - kettlebell.rotation.x) * 0.02;
  kettlebell.rotation.z += (-mouseX * 0.15 - kettlebell.rotation.z) * 0.02;

  renderer.render(scene, camera);
}

export function updateSceneProgress(progress) {
  if (!kettlebell) return;
  const targetX = -3.5 * progress;
  const targetY = 0.5 * (1 - progress);
  const targetRotY = progress * 0.5;
  const scale = 1 - progress * 0.2;

  kettlebell.position.x += (targetX - kettlebell.position.x) * 0.05;
  kettlebell.position.y += (targetY - kettlebell.position.y) * 0.05;
  kettlebell.rotation.y += (targetRotY - kettlebell.rotation.y) * 0.05;
  kettlebell.scale.setScalar(scale);
}

export function disposeScene() {
  if (renderer) {
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  }
  document.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', onResize);
}