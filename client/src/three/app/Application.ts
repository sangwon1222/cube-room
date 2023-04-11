import * as THREE from "three";
import { Stage } from "@three/app/Stage";

export class Application {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: Stage;

  constructor({ view }: { view: HTMLCanvasElement }) {
    this.canvas = view;
    this.canvas.width = 1280;
    this.canvas.height = 800;
    this.canvas.style.backgroundColor = "#CCC";

    this.scene = new Stage();
    this.scene.init();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    this.canvas.addEventListener("pointerup", (evt) => {
      this.scene.onPointerUp(evt);
    });
    this.canvas.addEventListener("pointermove", (evt) => {
      if (evt.shiftKey) {
        this.scene.camera.setYawPitchDelta(
          evt.movementX * 0.5,
          evt.movementY * 0.5
        );
      }
    });

    this.loop();
  }

  private loop = () => {
    requestAnimationFrame(this.loop);
    this.renderer.render(this.scene, this.scene.camera.getCamera());
  };
}
