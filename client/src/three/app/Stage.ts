import * as THREE from "three";
import { io, Socket } from "socket.io-client";
import { Camera } from "@atom/Camera";
import { MapTile, TileMap } from "@data/MapTile";
import { Character } from "@atom/Character";

export class Stage extends THREE.Scene {
  private mSocket: Socket | null = null;

  private mCamera: Camera = new Camera(800, 600);
  get camera() {
    return this.mCamera;
  }

  private mMyID = "";
  private mMe: Character | null = null;
  private mTileMap = new TileMap();
  private mCharacters: Record<string, Character> = {};
  private mCharacterPool = new THREE.Object3D();
  get characterLayer() {
    return this.mCharacterPool;
  }

  private mRaycaster = new THREE.Raycaster();

  constructor(w = 800, h = 600) {
    super();

    this.mCamera = new Camera(w, h);
    this.add(this.mCamera);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // soft white light
    this.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(-120, 100, -120);
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 1000;

    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-300, 500, -400);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.add(spotLight);

    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    const ground = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshPhongMaterial({
        color: 0xa0adaf,
        shininess: 10,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.scale.multiplyScalar(3);
    ground.receiveShadow = true;
    this.add(ground);

    this.add(this.mTileMap);
    this.add(this.mCharacterPool);
  }
  async onPointerUp(evt: PointerEvent) {
    this.mCamera.getCamera().updateMatrixWorld();

    const canvas = evt.target as HTMLCanvasElement;
    const pointer = new THREE.Vector2(
      (evt.offsetX - canvas.width * 0.5) / (canvas.width * 0.5),
      -(evt.offsetY - canvas.height * 0.5) / (canvas.height * 0.5)
    );
    this.mRaycaster = new THREE.Raycaster();
    this.mRaycaster.setFromCamera(pointer, this.mCamera.getCamera());
    const intersects = this.mRaycaster.intersectObjects(
      this.mTileMap.children,
      false
    );
    console.log(this.mTileMap.children.length, pointer, intersects);
    if (intersects.length > 0) {
      const tile = intersects[0].object as MapTile;
      // console.log( tile.tilePos[0],tile.tilePos[1] )

      this.mSocket?.emit("moveReq", {
        id: this.mMyID,
        startPos: [this.mMe?.tilex, this.mMe?.tiley],
        endPos: [tile.tilePos[0], tile.tilePos[1]],
      });
    }
  }

  async init() {
    this.mTileMap.clearMap();
    this.mCharacterPool.clear();

    await this.initSocket();
  }

  async initSocket() {
    this.mSocket = io("ws://192.168.0.9:3000", {
      // withCredentials: true,
      // extraHeaders: {
      //   "my-custom-header": "abcd"
      // }
    });

    // my connection maked( enterd )
    this.mSocket.on("welcome", (info: any) => {
      this.mMyID = info.id;

      // make other person's sprite
      for (const userinfo of info.users) {
        const charac = new Character();
        charac.setTilePos(userinfo.pos[0], userinfo.pos[1]);
        if (userinfo.id == this.mMyID) {
          this.mMe = charac;
        }
        this.mCharacters[userinfo.id] = charac;
        this.characterLayer.add(charac);
      }

      // mapData init
      this.mTileMap.loadMap(info.mapData);
    });

    // enter other person
    this.mSocket.on("entertUser", (info: any) => {
      if (info.id != this.mMyID) {
        if (!this.mCharacters[info.id]) {
          const charac = new Character();
          this.mCharacters[info.id] = charac;
          this.characterLayer.add(charac);
        }
      }
    });

    // leave other person
    this.mSocket.on("leaveUser", (info: any) => {
      if (info.id != this.mMyID) {
        if (this.mCharacters[info.id]) {
          this.characterLayer.remove(this.mCharacters[info.id]);
          delete this.mCharacters[info.id];
        }
      }
    });

    // all person's movement signal
    this.mSocket.on("move", (info: any) => {
      if (this.mCharacters[info.id]) {
        this.mCharacters[info.id].movePath(info.paths);
      }
    });
  }
}
