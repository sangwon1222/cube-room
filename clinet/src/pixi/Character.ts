import * as PIXI from "pixi.js"
import gsap from "gsap"

export class Character extends PIXI.Sprite{
  private mTilePos = [0,0];
  get tilex(){ return this.mTilePos[0]}
  get tiley(){ return this.mTilePos[1]}

  private mMoveProc:gsap.core.Timeline|null = null;
  constructor( imgpath:string ){
    super()
    this.setTilePos( 0,0 );
    this.anchor.set( 0.5,0.6 )
    this.setImage( imgpath );
  }

  setTilePos( tilex:number, tiley:number){
    this.mTilePos[0]=tilex;
    this.mTilePos[1]=tiley;
    this.position.set( (tilex*48)+24, (tiley*48)+24 );
  }

  setImage( key:string){
    console.log("character set image ")
    console.log( (PIXI.Assets as any).cache.get(key))
    this.texture = (PIXI.Assets as any).cache.get(key) 
  }

  async moveToTile( tilex:number, tiley:number ){
    await gsap.to( this.position, {x:(tilex*48)+24,y:(tiley*48)+24,duration:0.5})
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
        x:(p[0]*48)+24,
        y:(p[1]*48)+24,
        duration:0.1,
        onStart:()=>{
          this.mTilePos[0]=p[0];
          this.mTilePos[1]=p[1];
          this.zIndex = this.mTilePos[1];
          this.parent.sortChildren();
          console.log("moved:", this.mTilePos[0],this.mTilePos[1] );    
        }
      })
    }
    //this.mMoveProc.play(); 
  }

}