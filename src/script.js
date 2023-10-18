import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

//initialize the texture loader
const textureLoader = new THREE.TextureLoader();

//initialize the sun mesh & texture
const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial();
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sunMaterial.side = THREE.DoubleSide;

const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
sunMaterial.map = sunTexture;

// initialize the mercury mesh & texture
const mercuryGeometry = new THREE.SphereGeometry(5 / 3, 32, 32);
const mercuryMaterial = new THREE.MeshBasicMaterial();
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
scene.add(mercury);
mercury.position.x = 38;
mercury.position.z = -5;

const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
mercuryMaterial.map = mercuryTexture;

// initialize the venus mesh & texture
const venusGeometry = new THREE.SphereGeometry(4.5, 32, 32);
const venusMaterial = new THREE.MeshBasicMaterial();
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
scene.add(venus);
venus.position.x = 72;
venus.position.z = -5 * 1.3;

const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
venusMaterial.map = venusTexture;

// initialize the earth mesh & texture
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial();
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
earth.position.x = 100;
earth.position.z = -5 * 1.5;

const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
earthMaterial.map = earthTexture;

// initialize the moon mesh & texture
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial();
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
earth.add(moon); // moon is a child of earth
moon.position.x = 2;
moon.position.z = 9;
moon.rotation.y = -5;
moon.rotation.x = 0.05;

const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
moonMaterial.map = moonTexture;

// initialize the mars mesh & texture
const marsGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const marsMaterial = new THREE.MeshBasicMaterial();
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);
mars.position.x = 152;
mars.position.z = -5 * 1.7;

const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
marsMaterial.map = marsTexture;

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.z = 300;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 2000;
controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// initialize a clock
const clock = new THREE.Clock();

// render loop
const renderloop = () => {
  const elapsedTime = clock.getElapsedTime();
  earth.rotation.y += 0.04;
  earth.position.x = Math.sin(elapsedTime * 0.2) * 110;
  earth.position.z = Math.cos(elapsedTime * 0.2) * 110;

  moon.position.x = Math.sin(elapsedTime * 0.1) * 10;
  moon.position.z = Math.cos(elapsedTime * 0.1) * 10;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
