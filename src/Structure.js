import Tile from './Tile.js'

export default class Structure {
  constructor(spriteID, px, py, sx, sy) {
    this.spriteID = spriteID;
    this.px = px;
    this.py = py;
    this.sx = sx;
    this.sy = sy;
    this.offx = Math.floor(this.sx / 2);
    this.offy = Math.floor(this.sy / 2);
  }

  init(grid) {
    for (let i = 0; i < this.sx; i++) {
      for (let j = 0; j < this.sy; j++) {
        let x = Math.floor(this.px + i - this.offx);
        let y = Math.floor(this.py + j - this.offy);
        grid[x][y] = new Tile(this.spriteID, false, i, j);
      }
    }
  }
}
