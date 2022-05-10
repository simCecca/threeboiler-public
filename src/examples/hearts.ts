import * as THREE from "three";

class Hearts {
  private hearts: Array<any>;
  private pongMaterial: THREE.MeshPhongMaterial;
  private basicMaterial: THREE.MeshBasicMaterial;
  private heartGeometry: THREE.ExtrudeGeometry;
  private scene: THREE.Scene;

  constructor(scene, nHearts: number) {
    this.hearts = [];
    this.pongMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(60, 138, 204)",
    });
    this.basicMaterial = new THREE.MeshBasicMaterial({
      color: 0x44aa88,
    });
    this.heartGeometry = this.createGeometry();
    this.scene = scene;
    this.fill(nHearts);
  }

  private fill = (n: number) => {
    for (let i = 0; i < n; i++) {
      const h1 = new THREE.Mesh(this.heartGeometry, this.pongMaterial);
      h1.scale.x = 0.5;
      h1.scale.y = 0.5;
      h1.scale.z = 0.5;
      this.hearts.push(h1);
      this.scene.add(h1);
    }
  };

  private createGeometry = () => {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 0, // ui: steps
      depth: 1, // ui: depth
      bevelEnabled: true, // ui: bevelEnabled
      bevelThickness: 1, // ui: bevelThickness
      bevelSize: 1, // ui: bevelSize
      bevelSegments: 2, // ui: bevelSegments
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  updatePositions = () => {};

  getHearts = () => {
    return this.hearts;
  };
}

export default Hearts;
