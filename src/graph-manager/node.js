const THREE = require('three');

export default class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pos = new THREE.Vector3(x, y, 0);
    this.neighbors = [];
  }
}