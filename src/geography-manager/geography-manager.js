const THREE = require('three');
const _ = require('lodash');
const NOISEJS = require('noisejs');
const CHROMA = require('chroma-js');

export default class GeographyManager {
  constructor(map) {
    this.map = map;
  }

  generateElevationMap() {
    var nodes = this.map.graphManager.nodes;
    var seed = Math.random();
    var noise = new NOISEJS.Noise(seed);

    _.forEach(nodes, function(node) {
      var elevation = noise.simplex2(node.pos.x / 100, node.pos.y / 100);

      var f = CHROMA.scale(['yellow', '008ae5']).domain([-1, 1]);

      node.color = f(elevation);
      node.elevation = elevation;
    });
  }
}