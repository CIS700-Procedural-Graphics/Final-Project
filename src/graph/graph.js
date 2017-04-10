const _ = require('lodash');

import Cell from './cell'
import Edge from './edge'
import Node from './node'

export default class Graph {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.cells = [];
  }

  static generateFromSquareGrid(numCells) {
    var graph = new Graph();
    var nodesMap = {};
    var edgesMap = {};

    for (var x = 0; x <= numCells; x++) {
      for (var y = 0; y <= numCells; y++) {
        var node = new Node(x, y);
        var nodesMapIndex = x + ' ' + y;

        nodesMap[nodesMapIndex] = node;
      }
    }

    for (var x = 0; x <= numCells; x++) {
      for (var y = 0; y <= numCells; y++) {
        var nodesMapIndex = x + ' ' + y;
        var node = nodesMap[nodesMapIndex];
        var adjCoors = [ [ x-1, y ], [ x+1, y ], [ x, y-1 ], [ x, y+1 ] ];

        _.forEach(adjCoors, function(coors) {
          var xAdj = coors[0];
          var yAdj = coors[1];

          if (xAdj >= 0 && xAdj <= numCells &&
              yAdj >= 0 && yAdj <= numCells) {
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
        });
      }
    }

    for (var x = 0; x < numCells; x++) {
      for (var y = 0; y < numCells; y++) {
        var cell = new Cell();

        var edgesMapIndexA = x + ' ' + y + ' ' + (x+1) + ' ' + y;
        var edgesMapIndexB = x + ' ' + y + ' ' + x + ' ' + (y+1);
        var edgesMapIndexC = x + ' ' + (y+1) + ' ' + (x+1) + ' ' + (y+1);
        var edgesMapIndexD = (x+1) + ' ' + y + ' ' + (x+1) + ' ' + (y+1);
        var edgesMapIndices = [ edgesMapIndexA, edgesMapIndexB, edgesMapIndexC, edgesMapIndexD ];

        _.forEach(edgesMapIndices, function(edgesMapIndex) {
          var edge = edgesMap[edgesMapIndex];
          var halfedge = new HalfEdge();

          halfedge.cell = cell;
          halfedge.edge = edge;
          cell.halfedges.push(halfedge);
        });

        var numHalfEdges = cell.halfedges.length;

        for (var i = 1; i <= numHalfEdges; i++) {
          var halfedgeA = cell.halfedges[i-1];
          var halfedgeB = cell.halfedges[i % numHalfEdges];

          halfedgeA.next = halfedgeB;
        }

        cell.center.x = x+0.5;
        cell.center.y = y+0.5;
      }
    }

    graph.nodes = _.values(nodesMap);
    graph.edges = _.values(edgesMap);

    console.log(graph.nodes.length, graph.edges.length);

    return graph;
  }

  static generateFromHexGrid(numCells) {

  }
}