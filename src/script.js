import * as THREE from "three";
// import * as TWEEN from "@tweenjs/tween.js";
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
const venusTexture = textureLoader.load("/textures/2k_venus_atmosphere.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const jupiterTexture = textureLoader.load("/textures/2k_jupiter.jpg");
const saturnTexture = textureLoader.load("/textures/2k_saturn.jpg");
const uranusTexture = textureLoader.load("/textures/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("/textures/2k_neptune.jpg");
const IoTexture = textureLoader.load("/textures/2k_io.webp");
const EuropaTexture = textureLoader.load("/textures/europa_flat.png");
const CallistoTexture = textureLoader.load("/textures/callisto_flat.png");

const backgroundCubeMap = cubeTextureLoader.load([
  "nx.png",
  "px.png",
  "ny.png",
  "py.png",
  "nz.png",
  "pz.png",
]);

scene.background = backgroundCubeMap;

//initialize the sun mesh & texture
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// sunMaterial.side = THREE.DoubleSide;
const sunScale = 8;

// init other materials
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const IoMaterial = new THREE.MeshStandardMaterial({ map: IoTexture });
const EuropaMaterial = new THREE.MeshStandardMaterial({ map: EuropaTexture });
const CallistoMaterial = new THREE.MeshStandardMaterial({
  map: CallistoTexture,
});

const astra = [
  {
    name: "Sun",
    radius: 8,
    distance: -8, //10
    speed: 0.0007,
    material: sunMaterial,
    cameraAngle: new THREE.Vector3(-86, 25, 25),
  },
  {
    name: "Mercury",
    radius: 0.4,
    distance: 5.7, //10
    speed: 0.008,
    material: mercuryMaterial,
    cameraAngle: new THREE.Vector3(30, 4, 0),
  },
  {
    name: "Venus",
    radius: 0.9,
    distance: 16.2, //15
    speed: 0.006,
    material: venusMaterial,
    cameraAngle: new THREE.Vector3(-14, 5, 12),
  },
  {
    name: "Earth",
    radius: 1,
    distance: 30, //20
    speed: 0.005,
    material: earthMaterial,
    cameraAngle: new THREE.Vector3(-20, 5, 12),
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
    radius: 0.55,
    distance: 45,
    speed: 0.004,
    material: marsMaterial,
    cameraAngle: new THREE.Vector3(-20, 4, 6),
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
  {
    name: "Jupiter",
    radius: 8,
    distance: 156, //20
    speed: 0.0019,
    material: jupiterMaterial,
    cameraAngle: new THREE.Vector3(-60, 16, 46),
    moons: [
      {
        name: "Io",
        radius: 0.04,
        distance: 1.5,
        speed: 0.04,
        material: IoMaterial,
      },
      {
        name: "Europa",
        radius: 0.035,
        distance: 2.75,
        speed: 0.02,
        material: EuropaMaterial,
      },
      {
        name: "Callisto",
        radius: 0.06,
        distance: 3.5,
        speed: 0.01,
        material: CallistoMaterial,
      },
    ],
  },
  {
    name: "Saturn",
    radius: 6.5,
    distance: 285, //20
    speed: 0.0016,
    material: saturnMaterial,
    cameraAngle: new THREE.Vector3(-30, 35, 50),
    moons: [
      {
        name: "Titan",
        radius: 0.09,
        distance: 3,
        speed: 0.01,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Uranus",
    radius: 4,
    distance: 585, //20
    speed: -0.0011,
    material: uranusMaterial,
    cameraAngle: new THREE.Vector3(-30, 6, -42),
  },
  {
    name: "Neptune",
    radius: 4,
    distance: 900, //20
    speed: -0.0009,
    material: neptuneMaterial,
    cameraAngle: new THREE.Vector3(40, 2, -7),
  },
];

astra.forEach((planet) => {
  planet.distance += sunScale;
});

// Define helper functions
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

// Create the planet + moon meshes with the helpers
const planetMeshes = astra.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  planet.moons &&
    planet.moons.forEach((moon) => {
      const moonMesh = createMoon(moon);
      planetMesh.add(moonMesh);
    });
  return planetMesh;
});

// Change the camera to the planet's position
let followOrbit = { astra: undefined, cameraOffset: undefined };
const changeCameraToAstra = (value) => {
  scene.children.map((planet) => {
    if (planet.name === value) {
      const cameraAngleArray = astra
        .filter((planetArray) => planetArray.name === value)
        .map((planetArray) => planetArray.cameraAngle);
      const [cameraAngle] = cameraAngleArray;

      const planetPosition = new THREE.Vector3();
      planet.getWorldPosition(planetPosition);

      // const cameraOffset = new THREE.Vector3().add(cameraAngle);
      // let newPosition = planetPosition.clone().add(cameraOffset);
      followOrbit.astra = planet;
      followOrbit.cameraOffset = cameraAngle;
      controls.object.position.copy(followOrbit.cameraOffset);
      cameraFolder.refresh();
      return followOrbit;
    }
    return;
  });
};

let orbitSpeed = { multiplier: 1 };
const orbitPane = pane.addFolder({ title: "Orbit", expanded: true });
orbitPane.addBinding(orbitSpeed, "multiplier", {
  min: 0,
  max: 10,
  step: 0.2,
  label: "Change Speed",
});
orbitPane.addButton({ title: "Reset Orbit Speed" }).on("click", () => {
  orbitSpeed.multiplier = 1;
  orbitPane.refresh();
});

// initialize the light
const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(pointLight, ambientLight);

// initialize the camera

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(-70, 20, 20);

const cameraFolder = pane.addFolder({ title: "Camera", expanded: true });
cameraFolder.addBinding(camera, "position", {
  label: "Camera Position",
  x: { min: -100, max: 1000 },
  y: { min: -100, max: 100 },
  z: { min: -100, max: 100 },
});
cameraFolder
  .addButton({ title: "refresh", label: "Camera Position" })
  .on("click", () => {
    cameraFolder.refresh();
  });

const planetFolder = pane.addFolder({ title: "astra", expanded: true });
planetFolder
  .addBlade({
    view: "list",
    label: "Orbit",
    options: [
      { text: "Sun", value: "Sun" },
      { text: "Mercury", value: "Mercury" },
      { text: "Venus", value: "Venus" },
      { text: "Earth", value: "Earth" },
      { text: "Mars", value: "Mars" },
      { text: "Jupiter", value: "Jupiter" },
      { text: "Saturn", value: "Saturn" },
      { text: "Uranus", value: "Uranus" },
      { text: "Neptune", value: "Neptune" },
    ],
    value: "Sun",
  })
  .on("change", (ev) => {
    changeCameraToAstra(ev.value);
  });

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000);
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

// render loop
const renderloop = () => {
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += astra[index].speed * 1.2 * orbitSpeed.multiplier;
    planet.position.x =
      Math.sin(Math.abs(planet.rotation.y * 0.6)) * astra[index].distance;
    planet.position.z =
      Math.cos(Math.abs(planet.rotation.y * 0.6)) * astra[index].distance;
    planet.children &&
      planet.children.forEach((moon, moonIndex) => {
        moon.rotation.y += astra[index].moons[moonIndex].speed;
        moon.position.x =
          Math.sin(moon.rotation.y * 0.6) *
          astra[index].moons[moonIndex].distance;
        moon.position.z =
          Math.cos(moon.rotation.y * 0.6) *
          astra[index].moons[moonIndex].distance;
      });
    if (followOrbit.astra !== undefined) {
      console.log(followOrbit);
      const planetPosition = new THREE.Vector3();
      followOrbit.astra.getWorldPosition(planetPosition);
      controls.target = new THREE.Vector3().add(planetPosition);
    }
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
