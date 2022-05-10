import * as THREE from "three";
import { TextGeometry } from "../TextGeometry";
import { FontLoader } from "../FontLoader";

const createMaterial = () => {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  material.color.setHSL(0.6, 1, 0.5);

  return material;
};

const loadFont = () => {
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      "../helvetiker_regular.typeface.json",
      resolve,
      undefined,
      reject
    );
  });
};

export const getText = async (): Promise<THREE.Object3D> => {
  const font = await loadFont();
  const text = "Three.JS \n       Boilerplate"; // ui: text
  const geometry = new TextGeometry(text, {
    font: font,
    size: 3, // ui: size
    height: 0.2, // ui: height
    curveSegments: 12, // ui: curveSegments
    bevelEnabled: true, // ui: bevelEnabled
    bevelThickness: 0.15, // ui: bevelThickness
    bevelSize: 0.3, // ui: bevelSize
    bevelSegments: 5, // ui: bevelSegments
  });
  const mesh = new THREE.Mesh(geometry, createMaterial());
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

  const parent = new THREE.Object3D();
  parent.add(mesh);

  parent.position.y = -15;
  parent.scale.x = 5.5;
  parent.scale.y = 5.5;
  parent.scale.z = 5.5;
  return parent;
};
