const THREE = require('three');
const _ = require('lodash');
const CHROMA = require('chroma-js');

export default class ViewManager {
  constructor(options, map, scene) {
    this.renderGraph = options.renderGraph;
    this.renderElevation = options.renderElevation;
    this.renderCoastline = options.renderCoastline;
    this.debugOcean = options.debugOcean;
    this.debugShowNodes = options.debugShowNodes;
    this.map = map;
    this.scene = scene;
  }

  renderMap() {
    if (this.renderGraph) {
      this._renderGraph();
    }

    if (this.renderElevation) {
      this._renderElevation();
    }

    if (this.renderCoastline) {
      this._renderCoastline();
    }
  }

  _renderGraph() {
    var edges = this.map.graphManager.edges;
    var nodePairs = [];
    var nodePairsColor = CHROMA('white');

    edges.forEach(function(edge) {
      nodePairs.push(edge.nodeA);
      nodePairs.push(edge.nodeB);
    }, this);

    this._renderLineSegments(nodePairs, nodePairsColor);

    if (this.debugShowNodes) {
      var nodes = this.map.graphManager.nodes;
      var nodesColor = CHROMA('white');

      this._renderPoints(nodes, nodesColor);
    }
  }

  _renderElevation() {
    var cells = this.map.graphManager.cells;

    cells.forEach(function(cell) {
      var color = (this.debugOcean && cell.getElevation() <= 0) ? CHROMA('red') : cell.color;

      this._renderCell(cell, color);
    }, this);
  }

  _renderCoastline() {
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

    this._renderCoastlineHelper();
  }

  _render3D() {
    var geometry = new THREE.Geometry();
    var cells = this.map.graphManager.cells;
    var positionsVisited = {};

    cells.forEach(function(cell) {
      var corners = cell.corners;
      var faceIndices = [];

      corners.forEach(function(node, i) {
        var pos = node.pos.clone().setComponent(2, node.elevation * 10);
        var posMapIndex = pos.x + ' ' + pos.y;
        var id = positionsVisited[posMapIndex];

        if (_.isUndefined(id)) {
          id = geometry.vertices.length;
          positionsVisited[posMapIndex] = id;
          geometry.vertices.push(pos);
        }

        faceIndices.push(id);
      });

      var color = cell.color;
      var normal = new THREE.Vector3(1, 1, 1);
      var materialIndex = 0;

      for (var i = 2; i < faceIndices.length; i++) {
        var ia = faceIndices[0];
        var ib = faceIndices[i - 1];
        var ic = faceIndices[i];

        var face = new THREE.Face3(ia, ib, ic, normal, color, materialIndex);

        geometry.faces.push(face);
      }
    });



    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

  }

  _renderCoastlineHelper() {
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

  _renderPoints(nodes, color) {
    var material = new THREE.PointsMaterial({ color: color });
    var geometry = new THREE.Geometry();

    _.forEach(nodes, function(node) {
      geometry.vertices.push(node.pos);
    })

    var points = new THREE.Points(geometry, material);

    points.translateZ(0.2);

    this.scene.add(points);
  }

  _renderLine(nodes, color) {
    var material = new THREE.LineBasicMaterial({ color: color });
    var geometry = new THREE.Geometry();

    nodes.forEach(function(node) {
      geometry.vertices.push(node.pos);
    });

    var line = new THREE.Line(geometry, material);

    line.translateZ(0.1);

    this.scene.add(line);
  }

  _renderLineSegments(nodes, color) {
    var material = new THREE.LineBasicMaterial({ color: color });
    var geometry = new THREE.Geometry();

    nodes.forEach(function(node) {
      geometry.vertices.push(node.pos);
    });

    var line = new THREE.LineSegments(geometry, material);

    line.translateZ(0.1);

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