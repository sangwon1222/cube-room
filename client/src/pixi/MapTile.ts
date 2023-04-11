
import * as PIXI from "pixi.js"

export class MapTile extends PIXI.Sprite {
  private mMap:TileMap|null = null;
  constructor( map:TileMap, tilex:number, tiley:number ) {
    super()
    
    this.mMap = map;
    this.anchor.set(0, 1);
    this.position.set(((tilex) * 48), (tiley + 1) * 48);
    this.setTileIDX( map.mapData[tiley][tilex]);
  }

  get w() { return 48 }
  get h() { return 48 }

  setTileIDX( idx:number ){
    switch(idx){
      case 0:{
        this.texture = new PIXI.Texture( 
          (PIXI.Assets as any).cache.get('./maptile.png').baseTexture, 
          new PIXI.Rectangle(0,0,48,48) 
        );
      }break;
      case 1:{
        this.texture = new PIXI.Texture( 
          (PIXI.Assets as any).cache.get('./maptile.png').baseTexture, 
          new PIXI.Rectangle(48,0,48,48) 
        );
      }break;
    }
  }
}


export class TileMap extends PIXI.Container {
  private mTiles: Array<TileMap> = [];
  private mTileWidth = 16;
  private mTileHeight = 10;
  
  private mMapData: Array<Array<number>> = [];
  get mapData(){ return this.mMapData }

  constructor() {
    super();
  }

  clear(){
    this.removeChildren();
    this.mTiles = [];
  }

  loadMap( mapData:Array<Array<number>> ){
    console.log("loadMap")
    this.mMapData = mapData;
  
    for (let x = 0; x < this.mMapData[0].length; x++) {
      for (let y = 0; y < this.mMapData.length; y++) {
        const tile = new MapTile( this, x,y );
        this.addChild(tile);
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