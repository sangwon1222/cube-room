
import * as THREE from "three"

const geometry = new THREE.BoxGeometry( 48, 48, 48 );
const material = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = 24;
cube.castShadow = true;

const materialSet = {
  "normal": new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ),
  "blocked": new THREE.MeshPhongMaterial( { color: 0xAAAAAA } ),
}
export class MapTile extends THREE.Mesh {
  private mMap:TileMap|null = null;
  private mTilePos = [0,0];
  get tilePos(){ return [...this.mTilePos] }

  constructor( map:TileMap, tilex:number, tiley:number ) {
    super()
    
    this.mTilePos = [ tilex, tiley ];

    this.mMap = map;
    const geometry = new THREE.BoxGeometry( 48, 48, 48 );
    this.geometry=geometry;
    this.material=material;
    this.castShadow = true;
    this.receiveShadow = true;

    this.position.set( ((tilex) * 48), 0, (tiley + 1) * 48 );
    this.setTileIDX( map.mapData[tiley][tilex]);
  }

  get w() { return 48 }
  get h() { return 48 }

  setTileIDX( idx:number ){
    switch(idx){
      case 0:{
        this.material = materialSet[ "normal" ];
      }break;
      case 1:{
        const geometry = new THREE.BoxGeometry( 48, 100, 48 );
        this.geometry=geometry;
        this.material = materialSet[ "blocked" ];
      }break;
    }
  }
}


export class TileMap extends THREE.Object3D {
  private mTiles: Array<TileMap> = [];
  private mTileWidth = 16;
  private mTileHeight = 10;
  
  private mMapData: Array<Array<number>> = [];
  get mapData(){ return this.mMapData }

  constructor() {
    super();
  }

  clearMap(){
    this.clear();
    // for (let i = this.children.length - 1; i >= 0; i--) {
    //   this.remove(this.children[i]);
    // }
    this.mTiles = [];
  }

  loadMap( mapData:Array<Array<number>> ){
    console.log("loadMap", mapData )
    this.mMapData = mapData;
  
    for (let x = 0; x < this.mMapData[0].length; x++) {
      for (let y = 0; y < this.mMapData.length; y++) {
        const tile = new MapTile( this, x,y );
        this.add( tile );
      }
    }
    
    // this.eventMode = 'static';
    // this.onpointerup=(evt:PIXI.FederatedPointerEvent)=>{
    //   const tilex = Math.floor( evt.x/48 );
    //   const tiley = Math.floor( evt.y/48 );
    //   // console.log( tilex,tiley );
    //   this.emit( 'click-tile' as any , [tilex,tiley]);
    // }
  }

}