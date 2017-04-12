export default class Cell {
  constructor() {
    this.center = {};
    this.halfedges = [];
    this.corners = [];
  }

  getElevation() {
    var elevation = 0;

    _.forEach(this.corners, function(corner) {
      elevation += corner.elevation;
    });

    return elevation / this.corners.length;
  }
}