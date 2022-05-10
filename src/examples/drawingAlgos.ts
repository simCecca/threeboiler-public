import * as THREE from "three";

export const draw2dRandomly = (
  elements: Array<THREE.Mesh | THREE.Object3D>,
  margin: number
) => {
  elements.forEach((element) => {
    element.position.x = Math.random() * margin - margin / 2;
    element.position.y = Math.random() * margin - margin / 2;
    element.position.z = Math.random() * margin - margin / 2;
  });
};

export const draw2dSquare = (elements: Array<THREE.Mesh>) => {
  const rowElements = Math.ceil(Math.sqrt(elements.length));
  const step = 100 / rowElements;
  let currStepX = 0;
  let currStepZ = 0;
  elements.forEach((element, index) => {
    if (index % step == 0 && index > 0) {
      currStepZ += step;
      currStepX = 0;
    }
    element.position.x = currStepX;
    element.position.z = currStepZ;
    element.position.y = -100;
    currStepX += step;
  });
};
