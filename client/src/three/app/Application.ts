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
    this.canvas.style.backgroundColor = "#263326";

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

    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    let isActivCameraMove = false;
    this.canvas.addEventListener("mousedown", (evt) => {
      console.log(evt.button);
      if (evt.button) {
        //## 좌클릭
        isActivCameraMove = false;
      } else {
        //## 우클릭
        this.scene.onPointerUp(evt);
      }
    });
    // this.canvas.addEventListener("pointerup", (evt) => {
    //   this.scene.onPointerUp(evt);
    // });
    this.canvas.addEventListener("pointermove", (evt) => {
      if (evt.shiftKey) {
        const { camera } = this.scene;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        // 카메라가 바라보는 곳의 좌표 구하기
        const target = new THREE.Vector3();
        target.copy(camera.position).add(direction.multiplyScalar(900)); // 100은 거리입니다.
        console.log(target);

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
    if (this.scene.character) {
      // const { position } = this.scene.character;
      // this.scene.camera.lookAt(position.x, position.y, position.z);
    }

    this.renderer.render(this.scene, this.scene.camera.getCamera());
  };
}
