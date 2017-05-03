export default class Tile {
  constructor(spriteID, t, offx, offy) {
  	this.spriteID = spriteID;
  	this.pokemon = undefined;
  	this.traversable = t;
    this.offx = offx || 0;
    this.offy = offy || 0;
  }

  offset(x, y) {
    this.offx = x;
    this.offy = y;
  }
}
