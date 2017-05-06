import { util } from './Util.js'
import Tile from './Tile.js'

export default class Route {
    constructor(a1, a2, biome, orientation) {
        this.a1 = a1;
        this.a2 = a2;
        this.a1.height = 3; // TODO: mocked height;
        this.a2.height = 0;
        this.x = Math.floor((a1.x + a2.x) / 2);
        this.y = Math.floor((a1.y + a2.y) / 2);
        this.orientation = orientation;
        if (orientation === 'v') {
            this.sx = 16;
            this.sy = Math.abs(a1.y - a2.y) - (a1.ry + a2.ry);
            this.rx = Math.floor(this.sx / 2);
            this.ry = Math.floor(this.sy / 2);
        }
        else {
            this.sx = Math.abs(a1.x - a2.x) - (a1.rx + a2.rx);
            this.sy = 16;
            this.rx = Math.floor(this.sx / 2);
            this.ry = Math.floor(this.sy / 2);
        }
        this.biome = biome; // TODO: mocked biome
        this.sx += (this.sx % 2 === 0) ? 0 : 2 - (this.sx % 2);
        this.sy += (this.sy % 3 === 0) ? 0 : 3 - (this.sy % 3);

        this.waitThatWasntThereBeforeWTF = 0.1;
    }

    init(grid) {
        this.resolveSprites();
        if (this.orientation === 'v') {
            this.genObstacles(grid);
            this.repairObstacles(grid);
            this.genWalkable(grid);
            this.repairObstacles(grid);
            this.genEncounterables(grid);
        }
        else {
            this.genObstacles(grid);
            this.repairObstacles(grid);
            this.genHorizWalkable(grid);
            this.repairObstacles(grid);
            this.genEncounterables(grid);
            this.genDoodads(grid);
        }
        this.assignHeights(grid);
        this.genLedges(grid);
        this.genPokemon(grid);
    }

    resolveSprites() {
        switch(this.biome) {
            case 'grass':
                this.obstacleFill = 'OB0';
                this.encounterable = 'EC0';
                this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
                this.ledge = 'LG0';
                break;
            case 'snow':
                this.obstacleFill = 'OBS';
                this.encounterable = 'ECS';
                this.doodads = ['DS0', 'DS1', 'DS2', 'DS3'];
                this.ledge = 'LGS';
                break;
            case 'sand':
                this.obstacleFill = 'OBD';
                this.encounterable = 'ECD';
                this.doodads = ['DD0', 'DD1'];
                this.ledge = 'sand';
                break;
            case 'water':
                this.obstacleFill = 'water';
                this.encounterable = 'water';
                this.doodads = ['DW0', 'DW1', 'DW2', 'DW3'];
                this.ledge = 'water';
                break;
            default:
                this.obstacleFill = 'OB0';
                this.encounterable = 'EC0';
                this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
                this.ledge = 'LG0';
                break;
        }
    }

    traverse(f) {
        for (let i = this.x - this.rx + 1; i < this.x + this.rx; i++) {
            for (let j = this.y - this.ry; j < this.y + this.ry; j++) {
                f(i, j);
            }
        }
    }

    assignHeights(grid) {
        this.traverse((i, j) => {
            grid[i][j].height = Math.floor(util.lerp(this.y - this.ry, this.a1.height, this.y + this.ry, this.a2.height, j));
        });
    }

    genObstacles(grid) {
        this.traverse((i, j) => {
            if (j % 2 === 0 && j !== 0) {
                grid[i][j] = new Tile(this.obstacleFill, true);
            }
        });
    }

    repairObstacles(grid) {
        this.traverse((i, j) => {
            if (grid[i][j].spriteID === this.obstacleFill && grid[i][j].offy === 0) {
                grid[i][j + 1] = new Tile(this.obstacleFill, true, 0, 1);
            } else if (grid[i][j].spriteID === this.obstacleFill && grid[i][j].offy === 1) {
                grid[i][j - 1] = new Tile(this.obstacleFill, true);
            }
        })
    }

    genWalkable(grid) {
        let maxbx = this.x + this.rx;
        let minbx = this.x - this.rx;
        let maxby = this.y + this.ry;
        let minby = this.y - this.ry;
        let x = this.x, y;
        // forward path
        for (y = minby; y <= maxby; util.random() < 0.4 ? y : y++) {
            let curve = util.random() * this.rx * Math.sin(y * 2 * Math.PI / 16);
            x = util.clamp(minbx, Math.sign(curve) + x, maxbx - 1);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (minbx <= x + i && x + i < maxbx &&
                            minby <= y + j && y + j <= maxby) {
                                grid[x + i][y + j] = new Tile(this.biome, true);
                    }
                }
            }
        }
        // backward path
        for (y = minby; y <= maxby; util.random() < 0.4 ? y : y++) {
            let curve = -util.random() * this.rx * Math.sin(y * 2 * Math.PI / 16);
            x = util.clamp(minbx, Math.sign(curve) + x, maxbx - 1);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (minbx <= x + i && x + i < maxbx &&
                            minby <= y + j && y + j <= maxby) {
                                grid[x + i][y + j] = new Tile(this.biome, true);
                    }
                }
            }
        }
    }

    genHorizWalkable(grid) {
        let maxbx = this.x + this.rx;
        let minbx = this.x - this.rx;
        let maxby = this.y + this.ry;
        let minby = this.y - this.ry;
        let y = this.y, x;

        for (x = minbx; x <= maxbx; util.random() < 0.4 ? x : x++) {
            let curve = util.random() * this.ry * Math.sin(x * 2 * Math.PI / 16);
            y = util.clamp(minby, Math.sign(curve) + y, maxby - 1);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (minbx <= x + i && x + i < maxbx &&
                            minby <= y + j && y + j <= maxby) {
                                grid[x + i][y + j] = new Tile(this.biome, true);
                    }
                }
            }
        }

        for (x = minbx; x <= maxbx; util.random() < 0.4 ? x : x++) {
            let curve = -util.random() * this.ry * Math.sin(x * 2 * Math.PI / 16);
            y = util.clamp(minby, Math.sign(curve) + y, maxby - 1);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (minbx <= x + i && x + i < maxbx &&
                            minby <= y + j && y + j <= maxby) {
                                grid[x + i][y + j] = new Tile(this.biome, true);
                    }
                }
            }
        }

    }

    genEncounterables(grid) {
        let maxbx = this.x + this.rx;
        let minbx = this.x - this.rx;
        let maxby = this.y + this.ry;
        let minby = this.y - this.ry;
        for (let k = 0; k < 20; k++) {
            let r = Math.floor(util.random() * 5) + 1;
            let rsq = r * r;
            let x = Math.floor(this.x + util.random() * this.sx - this.rx);
            let y = Math.floor(this.y + util.random() * this.sy - this.ry);
            for (let i = x - r; i <= x + r; i++) {
                for (let j = y - r; j <= y + r; j++) {
                    let tile = grid[i][j];
                    if ((x - i) * (x - i) + (y - j) * (y - j) < rsq && tile.spriteID === this.biome &&
                            util.inBound(minbx, i, maxbx) && util.inBound(minby, j, maxby)) {
                        tile.spriteID = this.encounterable;
                    }
                }
            }
        }
    }

    genHorizEncounterables(grid) {
        let maxbx = this.x + this.rx;
        let minbx = this.x - this.rx;
        let maxby = this.y + this.ry;
        let minby = this.y - this.ry;
        for (let k = 0; k < 20; k++) {
            let r = Math.floor(util.random() * 5) + 1;
            let rsq = r * r;
            let x = Math.floor(this.x + util.random() * this.sx - this.rx);
            let y = Math.floor(this.y + util.random() * this.sy - this.ry);
            for (let i = x - r; i <= x + r; i++) {
                for (let j = y - r; j <= y + r; j++) {
                    let tile = grid[i][j];
                    if ((x - i) * (x - i) + (y - j) * (y - j) < rsq && tile.spriteID === this.biome &&
                            util.inBound(minbx, i, maxbx) && util.inBound(minby, j, maxby)) {
                        tile.spriteID = this.encounterable;
                    }
                }
            }
        }
    }


    genDoodads(grid) {
        this.traverse((i, j) => {
            let tile = grid[i][j];
            // spawn berries!!! omgggggg lawl
            if (tile.spriteID === this.biome) {
                if (util.random() < 0.01) {
                    grid[i][j] = new Tile('D8', false, util.randIntRange(1, 4), 0);
                }

                let prob = 0.01;
                let neighbors = 0;
                for (let x = i - 1; x <= i + 1; x++) {
                    for (let y = j - 1; y <= j + 1; y++) {
                        if (grid[x][y].spriteID[0] === 'D') {
                            neighbors++;
                        }
                    }
                }
                prob += Math.sqrt(neighbors) * 0.3;
                if (util.random() < prob) {
                    grid[i][j] = new Tile(util.choose(this.doodads), true);
                }
            }

        });
    }

    genLedges(grid) {
        this.traverse((i, j) => {
            let tile = grid[i][j];
            let belowTile = grid[i][j + 1];
            if ([this.biome, this.encounterable].includes(tile.spriteID) &&
                  [this.biome, this.encounterable].includes(belowTile.spriteID) && tile.height !== belowTile.height) {
                let prob = 0.3;
                let rand = util.random();
                if (grid[i + 1][j].spriteID === this.ledge || grid[i - 1][j].spriteID === this.ledge) {
                    rand = 0;
                }

                if (rand < prob) {
                    tile.spriteID = this.ledge;
                    tile.offx = 0;
                    tile.offy = 0;
                }
            }
        });
    }

    genPokemon(grid) {
        // loop through cells of the route
        for (let i = this.x - this.rx; i < this.x + this.rx; i++) {
            for (let j = this.y - this.ry; j < this.y + this.ry; j++) {
                    if (grid[i][j].spriteID === 'EC0' || grid[i][j].spriteID === 'ECS' || grid[i][j].spriteID === 'ECD' || grid[i][j].biome === 'water') {
                        let rand = util.random();
                        if (grid[i][j].spriteID === 'EC0' && this.biome === 'grass') {
                            if (rand < 0.03) {
                              grid[i][j].pokemon = 'g1';
                            } else if (rand < 0.08) {
                              grid[i][j].pokemon = 'g2';
                            } else if (rand < 0.15) {
                              grid[i][j].pokemon = 'g3';
                            }
                        }
                        else if (grid[i][j].spriteID === 'ECD' && this.biome === 'sand') {
                            if (rand < 0.03) {
                              grid[i][j].pokemon = 's1';
                            } else if (rand < 0.08) {
                              grid[i][j].pokemon = 's2';
                            } else if (rand < 0.1) {
                              grid[i][j].pokemon = 's3';
                            }
                        }
                        else if (grid[i][j].biome === 'water') {
                            if (rand < 0.1) {
                              grid[i][j].pokemon = 'w1';
                            }
                        }
                        else {
                            if (rand < 0.01) {
                                grid[i][j].pokemon = 'i1';
                            }
                            else if (rand < 0.08) {
                                grid[i][j].pokemon = 'i2';
                            }
                        }

                    }
            }
        }

    }
}
