import * as THREE from "three";
class Compass {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private zoomOptions: { minZoom: number; maxZoom: number; step: number };
  private draggingObj: {
    isItDragging: boolean;
    positions: { x: number; y: number };
  };

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.zoomOptions = {
      maxZoom: 2,
      minZoom: 10000,
      step: 0.06,
    };
    this.draggingObj = { isItDragging: false, positions: { x: 0, y: 0 } };
    this.setAllEvents();
  }

  setAllEvents = () => {
    this.setZoomHandler();
    this.setDragCanvas();
  };

  setDragCanvas = () => {
    this.renderer.domElement.onmousedown = (event) => {
      const { clientX, clientY } = event;
      this.draggingObj.isItDragging = true;
      const { x, y } = this.getWorldToCanvasABSCoordinates(clientX, clientY);
      this.draggingObj.positions = { x, y };
    };

    window.onmousemove = (event) => {
      if (this.draggingObj.isItDragging) {
        const { clientX, clientY } = event;
        const { x, y } = this.draggingObj.positions;
        const { x: newX, y: newY } = this.getWorldToCanvasABSCoordinates(
          clientX,
          clientY
        );
        this.draggingObj.positions = { x: newX, y: newY };
        this.camera.translateX(x - newX);
        this.camera.translateY(newY - y);
      }
    };

    this.renderer.domElement.onmouseup = (event) => {
      this.draggingObj.isItDragging = false;
    };
  };

  getWorldToCanvasABSCoordinates = (wx: number, wy: number) => {
    const { z } = this.camera.position;
    return this.getWorldToCanvasABSWithCustomZ(wx, wy, z);
  };

  setZoomHandler = () => {
    this.renderer.domElement.onwheel = (event: WheelEvent) => {
      event.preventDefault();
      this.zoom(event);
    };
  };

  getWorldToCanvasPercentCoordinates = (wx: number, wy: number) => {
    const canvas = this.renderer.domElement;
    const percentX = (wx / canvas.clientWidth) * 2 - 1;
    const percentY = -(wy / canvas.clientHeight) * 2 + 1;
    return { percentX, percentY };
  };

  getABSBounds = () => {
    return this.getABSBoundsWithCustomZ(this.camera.position.z);
  };

  getWorldToCanvasCoordinates = (wx: number, wy: number) => {
    const { z } = this.camera.position;
    return this.getWorldToCanvasWithCustomZ(wx, wy, z);
  };

  getWorldToCanvasABSPercentCoordinates = (wx: number, wy: number) => {
    const canvas = this.renderer.domElement;
    const percentX = wx / canvas.clientWidth;
    const percentY = wy / canvas.clientHeight;
    return { percentX, percentY };
  };

  private getWorldToCanvasABSWithCustomZ = (
    wx: number,
    wy: number,
    cz: number
  ) => {
    const { percentX, percentY } = this.getWorldToCanvasABSPercentCoordinates(
      wx,
      wy
    );
    const { width, height } = this.getABSBoundsWithCustomZ(cz);
    const retX = width * percentX;
    const retY = height * percentY;
    return { x: retX, y: retY };
  };

  private getWorldToCanvasWithCustomZ = (
    wx: number,
    wy: number,
    cz: number
  ) => {
    const { percentX, percentY } = this.getWorldToCanvasPercentCoordinates(
      wx,
      wy
    );
    const { x, y } = this.camera.position;
    const { width, height } = this.getABSBoundsWithCustomZ(cz);
    const retX = x + (width / 2) * percentX;
    const retY = y + (height / 2) * percentY;
    return { x: retX, y: retY };
  };

  private getABSBoundsWithCustomZ = (z: number) => {
    const fov = this.camera.fov;
    const aspect = this.camera.aspect;
    const halfHeight = Math.tan((fov * Math.PI) / 180 / 2) * z;
    const halfWidth = halfHeight * aspect;
    return { width: halfWidth * 2, height: halfHeight * 2 };
  };

  private zoom = (event: WheelEvent) => {
    const { clientX, clientY, deltaY } = event;
    const { step, minZoom, maxZoom } = this.zoomOptions;
    const { z: zp } = this.camera.position;
    let nz = zp;
    nz += deltaY * step;
    if (nz < maxZoom) {
      nz = maxZoom;
    } else if (nz > minZoom) {
      nz = minZoom;
    }
    const { x, y } = this.getWorldToCanvasCoordinates(clientX, clientY);
    const { x: futureX, y: futureY } = this.getWorldToCanvasWithCustomZ(
      clientX,
      clientY,
      nz
    );
    const offX = x - futureX;
    const offY = y - futureY;
    this.camera.translateX(offX);
    this.camera.translateY(offY);
    this.camera.position.setZ(nz);
  };
}
export default Compass;
