import * as THREE from "three"
import { Camera } from "./Camera";
import { Stage } from "./Stage";

export class Application{
  private mScreenSize=[800,600]
  private mCanvas:HTMLCanvasElement = document.createElement('canvas')
  private mScene: Stage = new Stage();
  
  private mRenderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  constructor(option:{view:HTMLCanvasElement}){
    this.mCanvas = option.view;

    this.mCanvas.width = this.mScreenSize[0];
    this.mCanvas.height = this.mScreenSize[1];
    this.mCanvas.style.backgroundColor = "#CCC";
    //this.mCanvas.addEventListener("pointerup",( evt )=>{
    this.mCanvas.addEventListener("pointerup",( evt )=>{
      this.mScene.onPointerUp( evt )
    })
    this.mCanvas.addEventListener("pointermove",( evt )=>{
      if(evt.shiftKey == true){
        console.log( evt.movementX, evt.movementY );
        this.mScene.camera.setYawPitchDelta( evt.movementX*0.5, evt.movementY*0.5 )
      }
      //this.mScene.onPointerUp( evt )
    })
    this.mRenderer = new THREE.WebGLRenderer({
      canvas: this.mCanvas
    });

    this.mScene = new Stage()
    this.mRenderer.setSize( this.mScreenSize[0],this.mScreenSize[1] );
    this.mRenderer.setClearColor( 0x000000,1)
    this.mRenderer.shadowMap.enabled = true;
    this.mRenderer.setPixelRatio( window.devicePixelRatio );
		
    this.mScene.init();
    this._loop();
  }

  private async _loop(){
    requestAnimationFrame( ()=>this._loop() )
    
    this.mRenderer.render( this.mScene, this.mScene.camera.getCamera() );
  }


}