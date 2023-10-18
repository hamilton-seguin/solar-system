import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

//initialize the textureloader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("/textures/cubeMap/");

//add textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");

// const backgroundCubeMap = cubeTextureLoader.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
const backgroundCubeMap = cubeTextureLoader.load(["nx.png", "px.png", "ny.png", "py.png", "nz.png", "pz.png"]);

scene.background = backgroundCubeMap

//initialize the sun mesh & texture
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMaterial.side = THREE.DoubleSide;
sun.scale.setScalar(4);
scene.add(sun);

// init other materials
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 5.7, //10
    speed: 0.01,
    material: mercuryMaterial,
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 16.2, //15
    speed: 0.008,
    material: venusMaterial,
  },
  {
    name: "Earth",
    radius: 1,
    distance: 30, //20
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.01,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.006,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        material: moonMaterial,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
];

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.name = planet.name;
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moon.material);
  moonMesh.name = moon.name;
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons &&
    planet.moons.forEach((moon) => {
      const moonMesh = createMoon(moon);
      planetMesh.add(moonMesh);
    });
  return planetMesh;
});

// initialize the light
const pointLight = new THREE.PointLight(0xffffff, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(pointLight, ambientLight);

// initialize the camera

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.set(0, 55, 75);

const paneCamera = pane.addFolder({ title: "Camera" });
paneCamera.addBinding(camera, "position", {
  x: { min: -200, max: 200, step: 1 },
  y: { min: -200, max: 200, step: 1 },
  z: { min: -200, max: 200, step: 1 },
  label: "Camera Position",
});

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

// // Add event listeners to each planet object
// planetMeshes.forEach(planet => {
//   planet.addEventListener('click', () => {
//     // Smoothly transition the camera to the planet's position
//     const tween = new TWEEN.Tween(camera.position)
//       .to(planet.position, 1000)
//       .easing(TWEEN.Easing.Quadratic.InOut)
//       .start();

//     // Zoom in on the planet
//     const zoomTween = new TWEEN.Tween(camera)
//       .to({
//         fov: 30,
//         position: planet.position.clone().add(new THREE.Vector3(0, 0, 100))
//       }, 1000)
//       .easing(TWEEN.Easing.Quadratic.InOut)
//       .start();
//   });
// });

// // Add a button to reset the camera
// const resetButton = document.createElement('resetButton');

// resetButton.textContent = 'Reset Camera';
// resetButton.addEventListener('click', () => {
//   const tween = new TWEEN.Tween(camera.position)
//     .to({ x: 0, y: 0, z: 500 }, 1000)
//     .easing(TWEEN.Easing.Quadratic.InOut)
//     .start();

//   const zoomTween = new TWEEN.Tween(camera)
//     .to({
//       fov: 75,
//       position: new THREE.Vector3(0, 0, 500)
//     }, 1000)
//     .easing(TWEEN.Easing.Quadratic.InOut)
//     .start();
// });
// document.body.appendChild(resetButton);

// initialize a clock
const clock = new THREE.Clock();

// render loop
const renderloop = () => {
  sun.rotation.y += 0.0015;
  const elapsedTime = clock.getElapsedTime();
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed * 1.2;
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance;
    planet.children &&
      planet.children.forEach((moon, moonIndex) => {
        moon.rotation.y += planets[index].moons[moonIndex].speed;
        moon.position.x =
          Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance;
        moon.position.z =
          Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance;
      });
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
