const THREE = require('three');
const _ = require('lodash');
const CHROMA = require('chroma-js');
const SEEDRANDOM = require('seedrandom');

export default class ViewManager {
  constructor(options, map, scene) {
    this.renderGraph = options.renderGraph;
    this.renderColors = options.renderColors;
    this.render3D = options.render3D;
    this.renderCoastline = options.renderCoastline;
    this.renderPolygonVariation = options.renderPolygonVariation;
    this.renderDepth = options.renderDepth;
    this.renderOceanDepth = options.renderOceanDepth;
    this.seedPolygonVariation = options.seedPolygonVariation;
    this.debugOcean = options.debugOcean;
    this.debugShowNodes = options.debugShowNodes;
    this.debugShowCoastalNodes = options.debugShowCoastalNodes;
    this.map = map;
    this.scene = scene;

    // Determines if the shader will use elevation, moisture, or biomes
    var uColor = (this.renderColors === 'elevation') ? 0 :
                 (this.renderColors === 'moisture')  ? 1 :
                 (this.renderColors === 'biomes')    ? 2 :
                                                       3;

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_color: { value: uColor }
      },
      vertexShader: require('../shaders/map-vert.glsl'),
      fragmentShader: require('../shaders/map-frag.glsl'),
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    });
  }

  renderMap() {
    if (this.render3D === 'polygon') {
      this._render3DPolygon();
      return;
    }

    if (this.render3D === 'shader') {
      this._render3DShader();
      return;
    }

    if (this.renderGraph) {
      this._renderGraph();
    }

    this._renderCells();

    if (this.renderCoastline) {
      this._renderCoastline();
    }

    if (this.debugShowNodes) {
      this._renderNodes();
    }

    if (this.debugShowCoastalNodes) {
      this._renderCoastalNodes();
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

  _renderCells() {
    var cells = this.map.graphManager.cells;

    cells.forEach(function(cell) {
      var color = (this.renderColors === 'elevation') ? cell.elevationColor :
                  (this.renderColors === 'moisture')  ? cell.moistureColor :
                  (this.renderColors === 'biomes')    ? cell.biomeColor :
                                                        CHROMA('black');

      this._renderCell(cell, color);
    }, this);
  }

  _render3DPolygon() {
    var geometry = new THREE.Geometry();
    var cells = this.map.graphManager.cells;
    var positionsVisited = {};

    var rng1 = SEEDRANDOM(this.seedPolygonVariation);
    var rng2 = SEEDRANDOM(this.seedPolygonVariation + 1.0);

    cells.forEach(function(cell) {
      var corners = cell.corners;
      var faceIndices = [];

      corners.forEach(function(node, i) {
        var pos = node.pos.clone().setComponent(2, node.elevation * 5);

        if (!this.renderOceanDepth && node.elevation <= 0) {
          pos.setComponent(2, 0);
        }

        if (!this.renderDepth) {
          pos.setComponent(2, 0);
        }

        var posMapIndex = pos.x + ' ' + pos.y;
        var id = positionsVisited[posMapIndex];

        if (_.isUndefined(id)) {
          id = geometry.vertices.length;
          positionsVisited[posMapIndex] = id;
          geometry.vertices.push(pos);
        }

        faceIndices.push(id);
      }, this);

      var color = (this.renderColors === 'elevation') ? cell.elevationColor :
                  (this.renderColors === 'moisture')  ? cell.moistureColor :
                  (this.renderColors === 'biomes')    ? cell.biomeColor :
                                                        CHROMA('black');
      var normal = new THREE.Vector3(1, 1, 1);
      var materialIndex = 0;

      for (var i = 2; i < faceIndices.length; i++) {
        var ia = faceIndices[0];
        var ib = faceIndices[i - 1];
        var ic = faceIndices[i];

        var tempColor = (rng1() > 0.5) ? color.darken(rng2() / 10) : color.brighten(rng2() / 10);
        var finalColor = this.renderPolygonVariation ? tempColor : color;

        var face = new THREE.Face3(ia, ib, ic, normal, new THREE.Color(finalColor.hex()), materialIndex);

        geometry.faces.push(face);

        rng1 = SEEDRANDOM(rng1());
        rng2 = SEEDRANDOM(rng2());
      }
    }, this);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    });
    var mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

  _render3DShader() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;
    var numNodes = nodes.length;

    var geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array((numNodes - 2) * 3 * 3);
    var positions = new Float32Array(numNodes * 3 * 3);
    var elevations = new Float32Array(numNodes * 3);
    var moistures = new Float32Array(numNodes * 3);

    var indicesOfPositions = {};
    var i = 0;
    var j = 0;

    cells.forEach(function(cell) {
      var corners = cell.corners;

      corners.forEach(function(node) {
        var elevation = node.elevation;
        var moisture = node.moisture;
        var pos = node.pos.clone();
        var posMapIndex = pos.x + ' ' + pos.y;
        var positionNotSeen = _.isUndefined(indicesOfPositions[posMapIndex]);

        if (positionNotSeen) {
          indicesOfPositions[posMapIndex] = i;

          positions[(i * 3)    ] = pos.x;
          positions[(i * 3) + 1] = pos.y;
          positions[(i * 3) + 2] = pos.z + (elevation * 5.0);

          if (!this.renderOceanDepth && elevation <= 0) {
            positions[(i * 3) + 2] = 0;
          }

          if (!this.renderDepth) {
            positions[(i * 3) + 2] = 0;
          }

          elevations[i] = elevation;
          moistures[i] = moisture;

          i++;
        }
      }, this);
    }, this);


    cells.forEach(function(cell) {
      var corners = cell.corners;

      for (var k = 1; k < corners.length - 1; k++) {
        var nA = corners[0];
        var nB = corners[k];
        var nC = corners[k + 1];

        var posA = nA.pos.clone();
        var posB = nB.pos.clone();
        var posC = nC.pos.clone();

        var posMapIndexA = posA.x + ' ' + posA.y;
        var posMapIndexB = posB.x + ' ' + posB.y;
        var posMapIndexC = posC.x + ' ' + posC.y;

        var iA = indicesOfPositions[posMapIndexA];
        var iB = indicesOfPositions[posMapIndexB];
        var iC = indicesOfPositions[posMapIndexC];

        indices[j    ] = iA;
        indices[j + 1] = iB;
        indices[j + 2] = iC;

        j += 3;
      }
    }, this);

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('elevation', new THREE.BufferAttribute(elevations, 1));
    geometry.addAttribute('moisture', new THREE.BufferAttribute(moistures, 1));
    geometry.computeVertexNormals();

    var material = this.shaderMaterial;
    var mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
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

  _renderCoastalNodes() {
    var nodes = this.map.graphManager.nodes;
    var coastalNodes = [];

    nodes.forEach(function(node) {
      if (node.isCoastal) coastalNodes.push(node);
    });

    this._renderPoints(coastalNodes, CHROMA('black').hex());
  }

  _renderNodes() {
    var nodes = this.map.graphManager.nodes;

    this._renderNodes(nodes, CHROMA('black').hex());
  }

}