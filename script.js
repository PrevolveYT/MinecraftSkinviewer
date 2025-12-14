// Known users for random
const knownUsers = [
  'Notch','jeb_','Dinnerbone','Herobrine','Dream','Technoblade','Sapnap',
  'GeorgeNotFound','Philza','Tubbo','TommyInnit','WilburSoot','Ranboo','BadBoyHalo',
  'CaptainSparklez','Logdotzip','PrevolveYT','Stampy','DanTDM','SSundee',
  'Esicko8','Deapslate'
];

let scene, camera, renderer, skinMesh, controls;

const viewer = document.getElementById('viewer');

// Three.js setup
scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

camera = new THREE.PerspectiveCamera(45, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (skinMesh) skinMesh.rotation.y += 0.005; // slow rotation
  renderer.render(scene, camera);
}
animate();

// Load skin
function loadSkin(username) {
  const url = `https://mc-heads.net/skin/${username}`;
  
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  loader.load(url, texture => {
    // Remove old skin if exists
    if (skinMesh) {
      scene.remove(skinMesh);
      skinMesh.geometry.dispose();
      skinMesh.material.dispose();
    }

    // Create simple Minecraft figure (head+body+arms+legs)
    const material = new THREE.MeshBasicMaterial({map: texture});

    const group = new THREE.Group();

    const head = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), material);
    head.position.y = 2.75;
    group.add(head);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1,1.5,0.5), material);
    body.position.y = 1.75;
    group.add(body);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.4,1.5,0.4), material);
    leftArm.position.set(-0.7,1.75,0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.4,1.5,0.4), material);
    rightArm.position.set(0.7,1.75,0);
    group.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5,1.5,0.5), material);
    leftLeg.position.set(-0.25,0.75,0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5,1.5,0.5), material);
    rightLeg.position.set(0.25,0.75,0);
    group.add(rightLeg);

    skinMesh = group;
    scene.add(skinMesh);

    // Update download link
    const link = document.getElementById('downloadLink');
    link.href = url;
  });
}

// Button events
document.getElementById('showBtn').addEventListener('click', ()=>{
  const user = document.getElementById('username').value.trim();
  if(!user) return alert('Enter a username');
  loadSkin(user);
});

document.getElementById('randomBtn').addEventListener('click', ()=>{
  const randomUser = knownUsers[Math.floor(Math.random() * knownUsers.length)];
  document.getElementById('username').value = randomUser;
  loadSkin(randomUser);
});

// Moon/sun toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('light');
  if(document.body.classList.contains('light')) themeToggle.textContent = '☀️';
  else themeToggle.textContent = '🌙';
});
