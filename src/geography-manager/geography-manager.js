const THREE = require('three');
const _ = require('lodash');
const NOISEJS = require('noisejs');
const CHROMA = require('chroma-js');

export default class GeographyManager {
  constructor(map) {
    this.map = map;
  }

  generateElevationMap() {
    var cells = this.map.graphManager.cells;
    var noise = new NOISEJS.Noise(Math.random());

    _.forEach(cells, function(cell) {
      var center = cell.center;
      var elevation = noise.simplex2(center.x / 100, center.y / 100);

      var f = CHROMA.scale(['yellow', '008ae5']).domain([-1, 1]);

      cell.color = f(elevation);
      cell.elevation = elevation;
    });
  }
}