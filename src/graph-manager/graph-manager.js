const _ = require('lodash');

import Cell from './cell'
import Edge from './edge'
import Node from './node'
import HalfEdge from './halfedge'

export default class GraphManager {
  constructor(options, map) {
    this.numCells = options.numCells;
    this.cellType = options.cellType;
    this.map = map;
    this.nodes = [];
    this.edges = [];
    this.cells = [];
  }

  generateGrid() {
    if (this.cellType === 'square') {
      this._generateFromSquareGrid();
    } else if (this.cellType === 'hex') {
      this._generateFromHexGrid();
    } else {
      // Unrecognized cell type
    }
  }

  _generateFromSquareGrid() {
    var nodesMap = {};
    var edgesMap = {};

    for (var x = 0; x <= this.numCells; x++) {
      for (var y = 0; y <= this.numCells; y++) {
        var node = new Node(x, y);
        var nodesMapIndex = x + ' ' + y;

        nodesMap[nodesMapIndex] = node;
      }
    }

    for (var x = 0; x <= this.numCells; x++) {
      for (var y = 0; y <= this.numCells; y++) {
        var nodesMapIndex = x + ' ' + y;
        var node = nodesMap[nodesMapIndex];
        var adjCoors = [ [ x-1, y ], [ x+1, y ], [ x, y-1 ], [ x, y+1 ] ];

        adjCoors.forEach(function(coors) {
          var xAdj = coors[0];
          var yAdj = coors[1];

          if (xAdj >= 0 && xAdj <= this.numCells &&
              yAdj >= 0 && yAdj <= this.numCells) {
            var adjNodeMapIndex = xAdj + ' ' + yAdj;
            var adjNode = nodesMap[adjNodeMapIndex];
            var edgesMapIndex = nodesMapIndex + ' ' + adjNodeMapIndex;
            var edgesMapOppositeIndex = adjNodeMapIndex + ' ' + nodesMapIndex;
            var edgeInMap = edgesMap[edgesMapIndex] || edgesMap[edgesMapOppositeIndex];

            if (!edgeInMap) {
              var edge = new Edge(node, adjNode);

              edgesMap[edgesMapIndex] = edge;
              node.neighbors.push(adjNode);
              adjNode.neighbors.push(node);
            }
          }
        }, this);
      }
    }

    for (var x = 0; x < this.numCells; x++) {
      for (var y = 0; y < this.numCells; y++) {
        var cell = new Cell();

        var edgesMapIndexA = (x+1) + ' ' + y + ' ' + x + ' ' + y;
        var edgesMapIndexB = x + ' ' + y + ' ' + x + ' ' + (y+1);
        var edgesMapIndexC = x + ' ' + (y+1) + ' ' + (x+1) + ' ' + (y+1);
        var edgesMapIndexD = (x+1) + ' ' + (y+1) + ' ' + (x+1) + ' ' + y;
        var edgesMapIndices = [ edgesMapIndexA, edgesMapIndexB, edgesMapIndexC, edgesMapIndexD ];
        var nodesMapIndices = [ (x+1) + ' ' + y, x + ' ' + y, x + ' ' + (y+1), (x+1) + ' ' + (y+1) ];

        for (var i = 0; i < 4; i++) {
          var edgesMapIndex = edgesMapIndices[i];
          var nodesMapIndexA = nodesMapIndices[i];
          var nodesMapIndexB = nodesMapIndices[(i+1) % 4];

          var edge = edgesMap[edgesMapIndex];
          var nodeA = nodesMap[nodesMapIndexA];
          var nodeB = nodesMap[nodesMapIndexB];
          var halfedge = new HalfEdge();

          halfedge.cell = cell;
          halfedge.edge = edge;
          halfedge.nodeA = nodeA;
          halfedge.nodeB = nodeB;
          cell.halfedges.push(halfedge);
          cell.corners.push(nodeA);
        }

        var numHalfEdges = cell.halfedges.length;

        for (var i = 1; i <= numHalfEdges; i++) {
          var halfedgeA = cell.halfedges[i-1];
          var halfedgeB = cell.halfedges[i % numHalfEdges];

          halfedgeA.next = halfedgeB;
        }

        cell.center.x = x+0.5;
        cell.center.y = y+0.5;

        this.cells.push(cell);
      }
    }

    this.nodes = _.values(nodesMap);
    this.edges = _.values(edgesMap);
  }

  _generateFromHexGrid() {
    var nodesMap = {};
    var edgesMap = {};

    for (var x = 0; x < this.numCells; x++) {
      for (var y = 0; y < this.numCells; y++) {
        var hexCoors = [ [ 1.5, 0 ], [ 0.5, 0 ], [ 0, 1 ], [ 0.5, 2 ], [ 1.5, 2 ], [ 2, 1 ] ];

        hexCoors.forEach(function(coor) {
          var xCoor = coor[0] + (x * 2);
          var yCoor = coor[1] + (y * 2);

          if (x > 0) {
            xCoor -= (0.5 * x);
          }

          if (x % 2) {
            yCoor -= 1;
          }

          var nodesMapIndex = xCoor + ' ' + yCoor;

          if (!nodesMap[nodesMapIndex]) {
            var node = new Node(xCoor, yCoor);

            nodesMap[nodesMapIndex] = node
          }
        });
      }
    }

    for (var x = 0; x < this.numCells; x++) {
      for (var y = 0; y < this.numCells; y++) {
        var hexCoors = [ [ 1.5, 0 ], [ 0.5, 0 ], [ 0, 1 ], [ 0.5, 2 ], [ 1.5, 2 ], [ 2, 1 ] ];

        hexCoors.forEach(function(coor) {
          var xCoor = coor[0] + (x * 2);
          var yCoor = coor[1] + (y * 2);

          if (x > 0) {
            xCoor -= (0.5 * x);
          }

          if (x % 2) {
            yCoor -= 1;
          }

          var nodesMapIndex = xCoor + ' ' + yCoor;
          var node = nodesMap[nodesMapIndex];
          var adjCoors = [
            [ xCoor-1, yCoor ],
            [ xCoor+1, yCoor ],
            [ xCoor+0.5, yCoor-1 ],
            [ xCoor-0.5, yCoor-1 ],
            [ xCoor+0.5, yCoor+1 ],
            [ xCoor-0.5, yCoor+1 ]
          ];

          adjCoors.forEach(function(adjCoor) {
            var xAdj = adjCoor[0];
            var yAdj = adjCoor[1];

            var adjNodeMapIndex = xAdj + ' ' + yAdj;
            var adjNode = nodesMap[adjNodeMapIndex];

            if (adjNode) {
              var edgesMapIndex = nodesMapIndex + ' ' + adjNodeMapIndex;
              var edgesMapOppositeIndex = adjNodeMapIndex + ' ' + nodesMapIndex;
              var edgeInMap = edgesMap[edgesMapIndex] || edgesMap[edgesMapOppositeIndex];

              if (!edgeInMap) {
                var edge = new Edge(node, adjNode);

                edgesMap[edgesMapIndex] = edge;
                node.neighbors.push(adjNode);
                adjNode.neighbors.push(node);
              }
            }
          }, this);
        });
      }
    }

    for (var x = 0; x < this.numCells; x++) {
      for (var y = 0; y < this.numCells; y++) {
        var cell = new Cell();

        var edgesMapIndexA = (1.5) + ' ' + (0) + ' ' + (0.5) + ' ' + (0);
        var edgesMapIndexB = (0.5) + ' ' + (0) + ' ' + (0) + ' ' + (1);
        var edgesMapIndexC = (0) + ' ' + (1) + ' ' + (0.5) + ' ' + (2);
        var edgesMapIndexD = (0.5) + ' ' + (2) + ' ' + (1.5) + ' ' + (2);
        var edgesMapIndexE = (1.5) + ' ' + (2) + ' ' + (2) + ' ' + (1);
        var edgesMapIndexF = (2) + ' ' + (1) + ' ' + (1.5) + ' ' + (0);
        var edgesMapIndices = [
          edgesMapIndexA, edgesMapIndexB, edgesMapIndexC,
          edgesMapIndexD, edgesMapIndexE, edgesMapIndexF
        ];
        var nodesMapIndices = [
          (1.5) + ' ' + (0),
          (0.5) + ' ' + (0),
          (0) + ' ' + (1),
          (0.5) + ' ' + (2),
          (1.5) + ' ' + (2),
          (2) + ' ' + (1)
        ];

        var xOffset = (x > 0) ? -0.5 * x : 0;
        var yOffset = (x % 2) ? -1 : 0;

        for (var i = 0; i < 6; i++) {
          var edgesMapIndex = edgesMapIndices[i];
          var nodesMapIndexA = nodesMapIndices[i];
          var nodesMapIndexB = nodesMapIndices[(i+1) % 6];

          var edgesMapIndexSplit = edgesMapIndex.split(' ');
          var nodesMapIndexSplitA = nodesMapIndexA.split(' ');
          var nodesMapIndexSplitB = nodesMapIndexB.split(' ');

          edgesMapIndexSplit[0] = (Number(edgesMapIndexSplit[0]) + (x*2)) + xOffset;
          edgesMapIndexSplit[1] = (Number(edgesMapIndexSplit[1]) + (y*2)) + yOffset;
          edgesMapIndexSplit[2] = (Number(edgesMapIndexSplit[2]) + (x*2)) + xOffset;
          edgesMapIndexSplit[3] = (Number(edgesMapIndexSplit[3]) + (y*2)) + yOffset;

          nodesMapIndexSplitA[0] = (Number(nodesMapIndexSplitA[0]) + (x*2)) + xOffset;
          nodesMapIndexSplitA[1] = (Number(nodesMapIndexSplitA[1]) + (y*2)) + yOffset;
          nodesMapIndexSplitB[0] = (Number(nodesMapIndexSplitB[0]) + (x*2)) + xOffset;
          nodesMapIndexSplitB[1] = (Number(nodesMapIndexSplitB[1]) + (y*2)) + yOffset;

          edgesMapIndex = edgesMapIndexSplit.join(' ');
          nodesMapIndexA = nodesMapIndexSplitA.join(' ');
          nodesMapIndexB = nodesMapIndexSplitB.join(' ');

          var edge = edgesMap[edgesMapIndex];
          var nodeA = nodesMap[nodesMapIndexA];
          var nodeB = nodesMap[nodesMapIndexB];
          var halfedge = new HalfEdge();

          halfedge.cell = cell;
          halfedge.edge = edge;
          halfedge.nodeA = nodeA;
          halfedge.nodeB = nodeB;
          cell.halfedges.push(halfedge);
          cell.corners.push(nodeA);
        }

        var numHalfEdges = cell.halfedges.length;

        for (var i = 1; i <= numHalfEdges; i++) {
          var halfedgeA = cell.halfedges[i-1];
          var halfedgeB = cell.halfedges[i % numHalfEdges];

          halfedgeA.next = halfedgeB;
        }

        cell.center.x = (x*2)+1 + xOffset;
        cell.center.y = (y*2)+1 + yOffset;

        this.cells.push(cell);
      }
    }

    this.nodes = _.values(nodesMap);
    this.edges = _.values(edgesMap);
  }
}