export const TERRAIN_TILEMAP = {
  '0': {x: 0, y: 0},
  'grass': {x: 0, y: 2 * 16}, // grass
  'snow': {x: 144, y: 48}, // snow
  'water': {x: 240, y: 1536}, // water
  'dwater': {x: 96, y: 1536},
  'DR': {x: 64, y: 224}, // dirt rock
  'F': {x:0, y: 9 * 16}, // flower
  'B': {x:16, y: 128}, // bush
  'F2': {x:16, y: 192}, // more flowers
  'sand': {x: 721, y: 48}, // sand
  'SB': {x: 192, y: 112}, // snow bush
  'WR': {x: 416, y: 128}, // water rock
  'PC': {x: 416, y: 384},
  'PC1': {x: 336, y: 384},
  'BPC': {x: 224, y: 384},
  'BPC1': {x: 112, y: 384},
  'PM': {x: 560, y: 400},
  'PM1': {x: 496, y: 400},
  'H0': {x: 0, y: 544},
  'H1': {x: 64, y: 544},
  'H2': {x: 64 * 2, y: 544},
  'H3': {x: 64 * 3, y: 544},
  'H4': {x: 64 * 4, y: 544},
  'H5': {x: 64 * 5, y: 544},
  'H6': {x: 400, y: 544},
  'H7': {x: 512, y: 544},
  'R0': {x: 368, y: 32},
  'R1': {x: 496, y: 224},
  'R2': {x: 80, y: 32},
  'R01': {x: 384, y: 0},
  'T0': {x: 16, y: 144},
  'T1': {x: 384, y: 224},
  'T2': {x: 304, y: 144},
  'T3': {x: 576, y: 144},
  'W0': {x: 464, y: 32},
  'mtn-d': {x: 432, y: 1328},
  'mtn-s': {x: 1056, y: 1200},
  'wtr-1': {x: 144, y: 1504},
  'wtr-2': {x: 244, y: 1504},
  'D0': {x: 0, y: 256},
  'D1': {x: 0, y: 272},
  'D2': {x: 0, y: 288},
  'D3': {x: 48, y: 208},
  'D4': {x: 64, y: 208},
  'D5': {x: 80, y: 208},
  'D6': {x: 96, y: 208},
  'D7': {x: 16, y: 192},
  'D8': {x: 48, y: 192},
  'OB0': {x: 0, y: 208},
  'OBS': {x: 752, y: 976},
  'OBD': {x: 32, y: 1568},
  'EC0': {x: 48, y: 32},
  'ECS': {x: 192, y: 80},
  'ECD': {x: 544, y: 96},
  'LG0': {x: 384, y: 96},
  'LGS': {x: 512, y: 1600},
  'DW0': {x: 416, y: 128},
  'DW1': {x: 464, y: 128},
  'DW2': {x: 480, y: 128},
  'DW3': {x: 496, y: 128},
  'DS0': {x: 160, y: 128},
  'DS1': {x: 176, y: 112},
  'DS2': {x: 192, y: 112},
  'DS3': {x: 192, y: 80},
  'DD0': {x: 544, y: 96},
  'DD1': {x: 560, y: 80},
  // more to come...
};

export const POKE_TILEMAP = {
  'g1': {x: 0, y: 0},
  'g2': {x: 64, y: 384},
  'g3': {x: 384, y: 448},
  's1': {x: 192, y: 0},
  's2': {x: 192, y: 256},
  's3': {x: 192, y: 768},
  'w1': {x: 192, y: 320},
  'i1': {x: 18 * 64, y: 5 * 64},
  'i2': {x: 704, y: 896}
};

export const CHARACTER_TILEMAP = {
  'F': {x: 0, y: 0},
};

export default class Sprite {
  constructor(src, w, h, onload) {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = onload
    this.tileWidth = w;
    this.tileHeight = h;
    this.width = this.image.clientWidth / this.tileWidth;
    this.height = this.image.clientHeight / this.tileHeight;
  }

  getTile(x, y) {
    return {x: x * this.width, y: y * this.height};
  }
}
