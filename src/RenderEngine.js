import Tile from './Tile.js'
import Sprite, { TERRAIN_TILEMAP, POKE_TILEMAP, CHARACTER_TILEMAP } from './Sprite.js'

export default class RenderEngine {
  constructor(canvas, ts, pls, pks, world) {
    // canvas is 960 x 640
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.terrainSprite = ts;
    this.playerSprite = pls;
    this.pokemonSprite = pks;
    // Viewport
    this.vpWidth = 15;
    this.vpHeight = 11;
    this.halfWidth = Math.floor(this.vpWidth / 2);
    this.halfHeight = Math.floor(this.vpHeight / 2);
  }

  render() {
    this._renderTerrain();
    this._renderAgents();
    if (window.DEBUG_MODE === 1 && !this.debugRendered) {
      this._renderWorld();
    }
  }

  _renderTerrain() {
    let { pos } = this.world.getMe();
    for (let i = 0; i < this.vpWidth; i++) {
      for (let j = 0; j < this.vpHeight; j++) {
        let x = i + pos.x - this.halfWidth;
        let y = j + pos.y - this.halfHeight;
        let tile = this.world.getTile(x, y);
        this.drawTile(tile, 'terrain', i, j);
        if (tile.pokemon !== undefined) {
          this.drawTile(tile, 'pokemon', i, j);
        }
      }
    }
  }

  _renderAgents() {
    let { agents } = this.world;
    let me = this.world.getMe();
    for (let a in agents) {
      let agent = agents[a];
      let tile = new Tile(agent.spriteID, true);
      tile.spriteID = agent.spriteID;
      switch (agent.dir) {
        case 'right':
          tile.offx = 1;
          break;
        case 'up':
          tile.offx = 2;
          break;
        case 'left':
          tile.offx = 3;
          break;
        default:
          tile.offx = 0;
      }
      this.drawTile(tile, 'agent', agent.pos.x - me.pos.x + this.halfWidth, agent.pos.y - me.pos.y + this.halfHeight);
    }
  }

  drawTile(tile, type, x, y) {
    let spritePos, spriteSheet;
    switch (type) {
      case 'agent':
        spritePos = CHARACTER_TILEMAP[tile.spriteID];
        spriteSheet = this.playerSprite;
        break;
      case 'terrain':
        spritePos = TERRAIN_TILEMAP[tile.spriteID];
        spriteSheet = this.terrainSprite;
        break;
      case 'pokemon':
        spritePos = POKE_TILEMAP[tile.pokemon];
        spriteSheet = this.pokemonSprite;
        break;
    }
    let { tileHeight, tileWidth } = spriteSheet;
    let canvasTileWidth = this.canvas.width / this.vpWidth;
    let canvasTileHeight = this.canvas.height / this.vpHeight;
    let canvasPosx = x * canvasTileWidth;
    let canvasPosy = y * canvasTileHeight;
    let sx = spritePos.x + tile.offx * tileWidth;
    let sy = spritePos.y + tile.offy * tileHeight;
    this.ctx.drawImage(
      spriteSheet.image,
      sx, sy,
      tileWidth, tileHeight,
      canvasPosx, canvasPosy,
      canvasTileWidth, canvasTileHeight
    );
  }

  _renderWorld() {
    // TODO: this needs to get refactored or i will cry
    let { pos } = this.world.getMe();
    let { grid } = this.world.grid;
    let tmpCanvas = this.canvas;
    let tmpCtx = this.ctx;
    this.canvas = window.debugCanvas;
    this.ctx = window.debugCanvas.getContext('2d');
    this.vpWidth = window.debugCanvas.width * 2;
    this.vpHeight = window.debugCanvas.height * 2;
    this.halfWidth = Math.floor(this.vpWidth / 2);
    this.halfHeight = Math.floor(this.vpHeight / 2);
    for (let i = 0; i < this.world.size; i++) {
      for (let j = 0; j < this.world.size; j++) {
        let tile = this.world.getTile(i, j);
        this.drawTile(tile, 'terrain', i, j);
      }
    }
    this.debugRendered = true;
    // reset values
    this.vpWidth = 15;
    this.vpHeight = 11;
    this.halfWidth = Math.floor(this.vpWidth / 2);
    this.halfHeight = Math.floor(this.vpHeight / 2);
    this.canvas = tmpCanvas;
    this.ctx = tmpCtx;
  }
}
