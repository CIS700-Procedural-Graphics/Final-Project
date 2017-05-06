import Tile from './Tile.js'
import Agent from './Agent.js'
import Area from './Area.js'
import { util } from './Util.js'
import Route from './Route.js'

export default class World {
  constructor(num_areas) {
    this.agents = {};
    this.areas = [];
    this.routes = [];
    this.num_areas = num_areas;
  }

  getTile(x, y) {
    if (0 <= x && x < this.size && 0 <= y && y < this.size) {
      return this.grid[x][y];
    } else {
      return null;
    }
  }

  initWorld(world, myID) {
    let { agents, size, seed } = world;
    this.me = myID;
    for (let id in agents) {
      let agentID = parseInt(id);
      this.agents[agentID] = new Agent(agents[id]);
    }

    util.seed(seed);
    this.size = size;

    // creating grid[]
    this.grid = new Array(size);
    for (let i = 0; i < size; i++) {
      this.grid[i] = new Array(size);
    }

    // creating areas
    this.defineNPAreas();
    this.defineAreas();
    this.defineAreaContent();
    this.defineNPContent();
    this.fillAreas();
    this.fillRoutes();
    this.repairWorld();
}

  defineNPAreas() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = new Tile('0', false);
      }
    }
  }

  generateArea(x, y) {
    let padding = 30;
    let sx = Math.floor(util.random() * this.size / 16 + this.size / 16);
    let sy = Math.floor(util.random() * this.size / 16 + this.size / 16);
    while (x + sx/2 > this.size - padding || x - sx/2 < padding) {
      sx = Math.floor(util.random() * this.size);
    }
    while (y + sy/2 > this.size - padding || y - sy/2 < padding) {
      sy = Math.floor(util.random() * this.size);
    }
    sx += (sx % 2 === 0) ? 0 : 2 - (sx % 2);
    sy += (sy % 3 === 0) ? 0 : 3 - (sy % 3);
    let area = new Area(x, y, sx, sy, 3, true, true);
    this.areas.push(area);
    return area;
  }

  defineAreas() {
    // init area
    let numAreas = this.num_areas;
    let areaCnt = 1;
    let stack = [];
    let area = this.generateArea(256, 256);

    let route;
    let prev;
    stack.push(area);
    while (stack.length !== 0) {
      area = stack.shift();
      let num = util.random();
      // let num = 0;
      if (num < 0.5) {
        // one path
        let len = Math.floor(util.random() * 64 + 32);
        let dir = Math.floor(util.random() * 4);
        while (area.prev === dir) {
          dir = Math.floor(util.random() * 4);
        }
        switch(dir) {
          case 0:
            route = this.generateRoute(area, len, 'north');
            route.a2.prev = 0;
            break;
          case 1:
            route = this.generateRoute(area, len, 'south');
            route.a2.prev = 1;
            break;
          case 2:
            route = this.generateRoute(area, len, 'east');
            route.a2.prev = 2;
            break;
          case 3:
            route = this.generateRoute(area, len, 'west');
            route.a2.prev = 3;
            break;
        }
        this.routes.push(route);
        areaCnt += 1;
        if (areaCnt < numAreas) {
          stack.push(route.a2);
        }
        else {
          break;
        }
      }
      else {
        // two paths
        // one path
        let route1, route2;
        let len = Math.floor(util.random() * 64 + 32);
        if (area.prev === 2 || area.prev === 3) {
          route1 = this.generateRoute(area, len, 'north');
          route2 = this.generateRoute(area, len, 'south');
          route1.a2.prev = 0;
          route2.a2.prev = 1;
        }
        else {
          route1 = this.generateRoute(area, len, 'east');
          route2 = this.generateRoute(area, len, 'west');
          route1.a2.prev = 2;
          route2.a2.prev = 3;
        }
        this.routes.push(route1, route2);
        areaCnt += 2;
        if (areaCnt < numAreas) {
          stack.push(route1.a2);
          stack.push(route2.a2);
        }
        else {
          break;
        }
      }
    }
  }

  generateRoute(area, len, dir) {
    let {x, y} = area;
    let newX, newY, newArea, route;
    switch(dir) {
      case 'north':
        while (area.y - len < 0) {
          len = Math.floor(util.random() * len);
        }
        newX = x;
        newY = y - len;
        area.outlets.push({x: x, y: y - area.sy});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX, y: newY + newArea.ry});
        route = new Route(area, newArea, newArea.biome, 'v');
        this.drawRoute(route, 'y');
        break;
      case 'south':
        while (area.y + len > this.size) {
          len = Math.floor(util.random() * len);
        }
        newX = x;
        newY = y + len;
        area.outlets.push({x: x, y: y + area.sy});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX, y: newY - newArea.ry});
        route = new Route(area, newArea, newArea.biome, 'v');
        this.drawRoute(route, 'y');
        break;
      case 'east':
        while (area.x + len > this.size) {
          len = Math.floor(util.random() * len);
        }
        newX = x + len;
        newY = y;
        area.outlets.push({x: x + area.rx, y: y});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX - newArea.rx, y: newY});
        route = new Route(area, newArea, newArea.biome, 'h');
        this.drawRoute(route, 'x');
        break;
      case 'west':
        while (area.y - len < 0) {
          len = Math.floor(util.random() * len);
        }
        newX = x - len;
        newY = y;
        area.outlets.push({x: x - area.rx, y: y});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX + newArea.rx, y: newY});
        route = new Route(area, newArea, newArea.biome, 'h');
        this.drawRoute(route, 'x');
        break;
    }
    return route;
  }

  // connect a1 to a2
  drawRoute(route, dir) {
    let {a1, a2} = route;
    let pathRadius = 8;
    let del;
    let a1x = a1.x;
    let a1y = a1.y;
    if (dir === 'x') {
      del = a2.x - a1.x;
      for (let i = 0; i < Math.abs(del); i++) {
        a1x += Math.sign(del);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1y + j && a1y + j < this.size) {
            this.grid[a1x][a1y + j] = new Tile(route.biome, true);
          }
        }
      }
    }
    else {
      del = a2.y - a1.y;
      for (let i = 0; i < Math.abs(del); i++) {
        a1y += Math.sign(del);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1x + j && a1x + j < this.size) {
            this.grid[a1x + j][a1y] = new Tile(route.biome, true);
          }
        }
      }
    }
  }

  defineAreaContent() {
    // draw cities
    for (let c = 0; c < this.areas.length; c++) {
      let area = this.areas[c];
      for (let i = Math.floor(area.x - area.rx); i < area.x + area.rx; i++) {
        for (let j = Math.floor(area.y - area.ry); j < area.y + area.ry; j++) {
          if (0 <= i  && i < this.size && 0 <= j && j < this.size) {
            this.grid[i][j] = new Tile(area.biome, true);
          }
        }
      }
    }
  }

  defineNPContent() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        // check if this is NP tile
        let npTile = this.grid[i][j];
        if (npTile.traversable === false && i + 1 < this.size && i - 1 >= 0) {
          // check if this is a up, down, left, right
          let uTile = this.grid[i][j-1];
          if (uTile !== undefined && (uTile.spriteID === 'grass' || uTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 0, -1);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j+k] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          else if (uTile !== undefined && (uTile.spriteID === 'water')) {
            // let rand = util.random();
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j+k] = new Tile('dwater', false);
            }
            continue;
          }
          let dTile = this.grid[i][j+1];
          if (dTile !== undefined && (dTile.spriteID === 'grass' || dTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 0, 1);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j-k] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          else if (dTile !== undefined && (dTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j-k] = new Tile('dwater', false);
            }
            continue;
          }
          let lTile = this.grid[i-1][j];
          if (lTile !== undefined && (lTile.spriteID === 'grass' || lTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, -1, 0);
            for (let k = 1; k < 7; k++) {
              this.grid[i+k][j] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          else if (lTile !== undefined && (lTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 7; k++) {
              this.grid[i+k][j] = new Tile('dwater', false);
            }
            continue;
          }

          let rTile = this.grid[i+1][j];
          if (rTile !== undefined && (rTile.spriteID === 'grass' || rTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 1, 0);
            for (let k = 1; k < 7; k++) {
              this.grid[i-k][j] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          else if (rTile !== undefined && (rTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 7; k++) {
              this.grid[i-k][j] = new Tile('dwater', false);
            }
            continue;
          }

          // check for corners
          let urTile = this.grid[i+1][j+1];
          if (urTile !== undefined && (urTile.spriteID === 'grass' || urTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 2, -1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (i - k >= 0 && j - l >= 0 && this.grid[i-k][j-l].spriteID === '0') {
                  this.grid[i-k][j-l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let ulTile = this.grid[i-1][j+1];
          if (ulTile !== undefined && (ulTile.spriteID === 'grass' || ulTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 4, -1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (k === 0 && l === 0) {
                  continue;
                }
                if (i + k < this.size && j - l >= 0 && this.grid[i+k][j-l].spriteID === '0') {
                  this.grid[i+k][j-l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let brTile = this.grid[i+1][j-1];
          if (brTile !== undefined && (brTile.spriteID === 'grass' || brTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 2, 1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (i - k >= 0 && j + l < this.size && this.grid[i-k][j+l].spriteID === '0') {
                  this.grid[i-k][j+l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let blTile = this.grid[i-1][j-1];
          if (blTile !== undefined && (blTile.spriteID === 'grass' || blTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 4, 1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (k === 0 && l === 0) {
                  continue;
                }
                if (i + k < this.size && j + l < this.size && this.grid[i+k][j+l].spriteID === '0') {
                  this.grid[i+k][j+l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }
        }
      }
    }
  }

  fillNPContent(tile, i, j) {

  }

  fillAreas() {
    this.areas.forEach(area => {
      area.init(this.grid);
    });
  }

  fillRoutes() {
    this.routes.forEach(route => {
      route.init(this.grid);
    });
  }


  findNearestArea(area, exclude) {
    let {x, y, rx, ry} = area;
    let min_dist = undefined;
    let closest = undefined;
    for (let i = 0; i < this.areas.length; i++) {
      let a = this.areas[i];
      if (a == area || exclude.indexOf(a) !== -1) {
        continue;
      }
      let dist = Math.sqrt(Math.pow((a.x - x), 2) + Math.pow((a.y - y), 2));
      if (dist < min_dist || min_dist === undefined) {
        min_dist = dist;
        closest = a;
      }
    }
    return closest;
  }

  // avgDist defined by user
  goodAvgDist(x, y) {
    if (this.areas.length === 0) {
      return true;
    }
    let a, min_dist, closest;
    for (let i = 0; i < this.areas.length; i++) {
      a = this.areas[i];
      let dist = Math.sqrt(Math.pow((a.x - x), 2) + Math.pow((a.y - y), 2));
      if (dist < min_dist || min_dist === undefined) {
        min_dist = dist;
        closest = a;
      }
    }
    // calculate distance to closest area
    let dist = Math.sqrt(Math.pow((closest.x - x), 2) + Math.pow((closest.y - y), 2));
    if (dist >= 30) {
      return true;
    }
    return false;
  }

  repairWorld() {
    let { grid } = this;
    for (let i = 1; i < this.size - 1; i++) {
      for (let j = 1; j < this.size - 1; j++) {
        let tile = grid[i][j];
        let ntile = grid[i][j - 1];
        let stile = grid[i][j + 1];
        let wtile = grid[i - 1][j];
        let etile = grid[i + 1][j];
        if (tile.spriteID === 'sand') {
          if (etile.spriteID === 'water' || etile.spriteID === 'R1') {
            tile.spriteID = 'R1';
          } else if (wtile.spriteID === 'water' || wtile.spriteID === 'R1') {
            tile.spriteID = 'R1';
          }
          if (stile.spriteID === 'water' || stile.spriteID === 'R1') {
            tile.spriteID = 'R1';
          } else if (ntile.spriteID === 'water' || ntile.spriteID === 'R1') {
            tile.spriteID = 'R1';
          }
        }

        if (tile.spriteID === 'R1') {
          tile.offset(1, 1);
          if (grid[i + 1][j].spriteID === 'water') {
            tile.offx += 1;
          } else if (grid[i - 1][j].spriteID === 'water') {
            tile.offx -= 1;
          }
          if (grid[i][j - 1].spriteID === 'water') {
            tile.offy -= 1;
          } else if (grid[i][j + 1].spriteID === 'water') {
            tile.offy += 1;
          }
          if (grid[i + 1][j + 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
            tile.offset(2, -1);
          } else if (grid[i + 1][j - 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
            tile.offset(2, -2);
          } else if (grid[i - 1][j + 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
            tile.offset(1, -1);
          } else if (grid[i - 1][j - 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
            tile.offset(1, -2);
          }
        }
      }
    }
  }

  // TODO: should we differentiate between agent types? :thinking:
  addAgents(agents) {
    agents.forEach(a => {
      this.agents[a.id] = new Agent(a);
    });
  }

  updateAgents(agents) {
    agents.forEach(a => {
      this.agents[a.id].update(a);
    });
  }

  deleteAgents(agents) {
    agents.forEach(a => {
      delete this.agents[a.id];
    });
  }

  getMe() {
    return this.agents[this.me];
  }

  morph() {
    let needsRerender = false;
    this.routes.forEach(route => {
      let valid = true;
      Object.keys(this.agents).forEach(agent => {
        let a = this.agents[agent];
        valid &= !util.inBound(route.x - route.rx, a.pos.x, route.x + route.rx);
        valid &= !util.inBound(route.y - route.ry, a.pos.y, route.y + route.ry);
      });
      if (valid && util.random() < route.waitThatWasntThereBeforeWTF) {
        route.init(this.grid);
        needsRerender = true;
      }
    });
    this.areas.forEach(area => {
      let valid = true;
      Object.keys(this.agents).forEach(agent => {
        let a = this.agents[agent];
        valid &= !util.inBound(area.x - area.rx, a.pos.x, area.x + area.rx);
        valid &= !util.inBound(area.y - area.ry, a.pos.y, area.y + area.ry);
      });
      if (valid && util.random() < area.waitThatWasntThereBeforeWTF) {
        area.init(this.grid);
        needsRerender = true;
      }
    });
    return needsRerender;
  }

  serialize() {
    let agents = [];
    for (let p in this.agents) {
      agents.push(this.agents[p]);
    }
    return {
      agents: agents,
      size: this.size,
      seed: this.seed
    };
  }
}
