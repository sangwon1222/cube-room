import * as THREE from "three"
import gsap from "gsap"

export class Character extends THREE.Mesh{
  private mTilePos = [0,0];
  get tilex(){ return this.mTilePos[0]}
  get tiley(){ return this.mTilePos[1]}

  private mMoveProc:gsap.core.Timeline|null = null;
  constructor( ){
    super()
    
    this.geometry = new THREE.SphereGeometry( 24, 16, 16 );
    this.material = new THREE.MeshPhongMaterial( { color: 0xFFCC00 } );
    this.castShadow = true;
    this.setTilePos( 0,0 );
    
  }

  setTilePos( tilex:number, tiley:number){
    this.mTilePos[0]=tilex;
    this.mTilePos[1]=tiley;
    this.position.set( (tilex*48), 48, (tiley*48)+48 );
  }

  async moveToTile( tilex:number, tiley:number ){
    await gsap.to( this.position, {x:(tilex*48), z:(tiley*48)+48,duration:0.5})
    this.mTilePos[0]=tilex;
    this.mTilePos[1]=tiley;
     
  }

  async movePath( path:any){
    // if exist pre movement. stop movement
    if( this.mMoveProc ){
      this.mMoveProc.kill();
    }

    // assign movement by path list
    this.mMoveProc = gsap.timeline({onComplete:()=>{
      this.mMoveProc = null;
    }});

    for( const p of path){
      this.mMoveProc.to( this.position, { 
        x:(p[0]*48),
        z:(p[1]*48)+48,
        duration:0.1,
        onStart:()=>{
          this.mTilePos[0]=p[0];
          this.mTilePos[1]=p[1];
          console.log("moved:", this.mTilePos[0],this.mTilePos[1] );    
        }
      })
    }
    //this.mMoveProc.play(); 
  }

}