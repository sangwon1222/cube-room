import * as THREE from "three"

export class Camera extends THREE.Object3D{
  private mCamera:THREE.Camera = new THREE.PerspectiveCamera( 75, 800 / 600, 0.1, 1000 );
  
  yaw=180;
  pitch=20;
  
  getCamera(){ return this.mCamera }

  constructor( w:number,h:number){
    super()
    this.mCamera = new THREE.PerspectiveCamera( 45, w / h, 0.1, 10000 );
    this.add( this.mCamera )
    this.mCamera.position.z = -800;
    this.mCamera.lookAt( this.position )

    this.setRotationFromEuler( new THREE.Euler( 
      THREE.MathUtils.degToRad(this.pitch), 
      THREE.MathUtils.degToRad(this.yaw), 
      0,
      'ZYX'
    ))
    
    this.position.set( 48*7.5, 0, 48*5 )
  }

  setYawPitchDelta( yaw:number, pitch:number){
    this.yaw += yaw;
    this.pitch += pitch;
    
    if( this.pitch < 0) this.pitch = 0;
    if( this.pitch > 90) this.pitch = 90;
    
    this.setRotationFromEuler( new THREE.Euler( 
      THREE.MathUtils.degToRad(this.pitch), 
      THREE.MathUtils.degToRad(this.yaw), 
      0,
      'ZYX'
    ))
    
  }



}