class FloorItem extends THREE.Object3D {
  private mItem: THREE.Mesh;
  get item() {
    return this.mItem;
  }
  constructor() {
    super();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.mItem = cube;
  }
}
