const THREE = require('three');
const _ = require('lodash');
const CHROMA = require('chroma-js');

export default class ViewManager {
  constructor(options, map, scene) {
    this.debugOcean = options.debugOcean;
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

    cells.forEach(function(cell) {
      var colors = [];

      cell.corners.forEach(function(corner) {
        colors.push(corner.color);
      });

      var color = CHROMA.average(colors);

      if (this.debugOcean && cell.getElevation() <= 0) {
        color = CHROMA('red');
      }

      this._renderCell(cell, color);
    }, this);
  }

  renderCoastline() {
    var cells = this.map.graphManager.cells;

    cells.forEach(function(cell) {
      var corners = cell.corners;
      var isCoastal = false;

      corners.forEach(function(node) {
        if (node.elevation <= 0) {
          isCoastal = true;
        }
      });

      if (isCoastal) {
        corners.forEach(function(node) {
          if (node.elevation > 0) {
            node.isCoastal = true;
          }
        })
      }
    });

    this._renderCoastline();
  }

  _renderCoastline() {
    var nodes = this.map.graphManager.nodes;
    var material = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2
    });
    var group = new THREE.Group();

    nodes.forEach(function(node) {
      if (node.isCoastal) {

        var neighbors = node.neighbors;

        neighbors.forEach(function(neighbor) {
          if (neighbor.isCoastal) {
            var geometry = new THREE.Geometry();

            geometry.vertices.push(node.pos);
            geometry.vertices.push(neighbor.pos);

            var line = new THREE.Line(geometry, material);

            group.add(line);
          }
        });
      }
    });

    group.translateZ(0.2);

    this.scene.add(group);
  }

  _renderPoints(nodes) {
    var material = new THREE.PointsMaterial({ color: 0x000000 });
    var geometry = new THREE.Geometry();

    _.forEach(nodes, function(node) {
      geometry.vertices.push(node.pos);
    })

    var points = new THREE.Points(geometry, material);

    points.translateZ(0.2);

    this.scene.add(points);
  }

  _renderLine(nodes) {
    var material = new THREE.LineBasicMaterial({ color: 0x000000 });
    var geometry = new THREE.Geometry();

    _.forEach(nodes, function(node) {
      geometry.vertices.push(node.pos);
    })

    var line = new THREE.Line(geometry, material);

    line.translateZ(0.2);

    this.scene.add(line);
  }

  _renderCell(cell, color) {
    var halfedges = cell.halfedges;
    var positions = [];

    positions.push(halfedges[0].nodeA.pos);

    _.forEach(cell.halfedges, function(halfedge) {
      positions.push(halfedge.nodeB.pos);
    });

    var shape = new THREE.Shape(positions);
    var geometry = new THREE.ShapeGeometry(shape);
    var material = new THREE.MeshBasicMaterial({ color: color.hex() });
    var mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

}