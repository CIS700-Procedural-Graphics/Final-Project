const THREE = require('three');
const _ = require('lodash');

export default class ViewManager {
  constructor(map, scene) {
    this.map = map;
    this.scene = scene;
  }

  renderGraph() {
    var edges = this.map.graphManager.edges;
    var material = new THREE.LineBasicMaterial({ color: 0xffffff });
    var geometry = new THREE.Geometry();

    _.forEach(edges, function(edge) {
      geometry.vertices.push(edge.nodeA.pos);
      geometry.vertices.push(edge.nodeB.pos);
    });

    var line = new THREE.Line(geometry, material);

    line.translateZ(0.1);

    this.scene.add(line);
  }

  renderElevation() {
    var cells = this.map.graphManager.cells;
    var self = this;

    _.forEach(cells, function(cell) {
      var halfedges = cell.halfedges;
      var positions = [];

      positions.push(halfedges[0].nodeA.pos);

      _.forEach(cell.halfedges, function(halfedge) {
        positions.push(halfedge.nodeB.pos);
      });

      var shape = new THREE.Shape(positions);
      var geometry = new THREE.ShapeGeometry(shape);
      var material = new THREE.MeshBasicMaterial({ color: cell.color.hex() });
      var mesh = new THREE.Mesh(geometry, material);

      self.scene.add(mesh);
    });
  }

}