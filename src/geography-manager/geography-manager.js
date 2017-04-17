const THREE = require('three');
const _ = require('lodash');
const NOISEJS = require('noisejs');
const CHROMA = require('chroma-js');

export default class GeographyManager {
  constructor(options, map) {
    this.map = map;
  }

  generateElevationMap() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;
    var seed = Math.random();
    var noise = new NOISEJS.Noise(seed);

    nodes.forEach(function(node) {
      var elevation = noise.simplex2(node.pos.x / 100, node.pos.y / 100);

      var f = CHROMA.scale(['008ae5', 'yellow']).domain([-1, 1]);

      node.color = f(elevation);
      node.elevation = elevation;
    });

    cells.forEach(function(cell) {
      var colors = [];

      cell.corners.forEach(function(corner) {
        colors.push(corner.color);
      });

      cell.color = CHROMA.average(colors);
    });
  }
}