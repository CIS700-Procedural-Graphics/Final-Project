export default class Cell {
  constructor() {
    this.center = {};
    this.halfedges = [];
    this.corners = [];
    this.neighbors = [];
  }

  // getElevation() {
  //   var elevation = 0;

  //   _.forEach(this.corners, function(corner) {
  //     elevation += corner.elevation;
  //   });

  //   return elevation / this.corners.length;
  // }

  isCoastal() {
    var adjToOcean = false;

    if (this.elevation <= 0) return false;

    this.neighbors.forEach(function(cell) {
      if (cell.elevation <= 0) adjToOcean = true;
    });

    return adjToOcean;
  }
}