import * as THREE from "three";

const materialSet = {
  normal: new THREE.MeshPhongMaterial({ color: 0xcccccc }),
  blocked: new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),
};

export class MapTile extends THREE.Mesh {
  private mMap: TileMap | null = null;
  private mTilePos = [0, 0];

  constructor(map: TileMap, tilex: number, tiley: number) {
    super(new THREE.BoxGeometry(48, 48, 48), materialSet.normal);
    this.mTilePos = [tilex, tiley];
    this.mMap = map;
    this.castShadow = true;
    this.receiveShadow = true;
    this.position.set(tilex * 48, 0, (tiley + 1) * 48);
    this.setTileIDX(map.mapData[tiley][tilex]);
  }

  get tilePos() {
    return [...this.mTilePos];
  }

  get w() {
    return 48;
  }

  get h() {
    return 48;
  }

  setTileIDX(idx: number) {
    switch (idx) {
      case 0:
        this.material = materialSet.normal;
        break;
      case 1:
        this.geometry = new THREE.BoxGeometry(48, 100, 48);
        this.material = materialSet.blocked;
        break;
    }
  }
}

export class TileMap extends THREE.Object3D {
  private mTiles: Array<MapTile> = [];
  private mTileWidth = 16;
  private mTileHeight = 10;
  private mMapData: Array<Array<number>> = [];

  get mapData() {
    return this.mMapData;
  }

  constructor() {
    super();
  }

  clearMap() {
    this.clear();
    this.mTiles = [];
  }

  loadMap(mapData: Array<Array<number>>) {
    this.mMapData = mapData;
    for (let x = 0; x < this.mMapData[0].length; x++) {
      for (let y = 0; y < this.mMapData.length; y++) {
        const tile = new MapTile(this, x, y);
        this.add(tile);
      }
    }
  }
}
