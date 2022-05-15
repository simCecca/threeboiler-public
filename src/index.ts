import * as THREE from "three";
import Compass from "./Compass";
import { draw2dRandomly } from "./examples/drawingAlgos";
import Hearts from "./examples/hearts";
import { getText } from "./examples/primitives";

const main = async () => {
  const canvas = document.querySelector("#c");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10500);
  camera.position.set(0, 0, 284);

  // our simple Compass
  const compass = new Compass(camera, renderer);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 250, 1400);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.225);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  const hearts = new Hearts(scene, 7300);
  const heartObj: Array<THREE.Mesh | THREE.Object3D> = hearts.getHearts();

  draw2dRandomly(heartObj, 1000);

  const text = await getText();
  scene.add(text);

  const render = (time) => {
    time *= 0.001;

    heartObj.forEach((prim) => {
      prim.rotation.x = time;
      prim.rotation.z = time;
    });
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

main();
