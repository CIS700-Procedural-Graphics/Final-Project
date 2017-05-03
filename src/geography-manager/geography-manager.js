const THREE = require('three');
const _ = require('lodash');
const NOISEJS = require('noisejs');
const CHROMA = require('chroma-js');

export default class GeographyManager {
  constructor(options, map) {
    this.map = map;
    this.seedElevation = options.seedElevation;
    this.seedMoisture = options.seedMoisture;
    this.elevationNoisiness = options.elevationNoisiness;
    this.moistureNoisiness = options.moistureNoisiness;
    this.biomes = {
      SNOW: 'SNOW',
      TUNDRA: 'TUNDRA',
      BARE: 'BARE',
      SCORCHED: 'SCORCHED',
      TAIGA: 'TAIGA',
      SHRUBLAND: 'SHRUBLAND',
      TEMPERATE_DESERT: 'TEMPERATE_DESERT',
      TEMPERATE_RAIN_FOREST: 'TEMPERATE_RAIN_FOREST',
      TEMPERATE_DECIDUOUS_FOREST: "TEMPERATE_DECIDUOUS_FOREST",
      GRASSLAND: 'GRASSLAND',
      TROPICAL_RAIN_FOREST: 'TROPICAL_RAIN_FOREST',
      TROPICAL_SEASONAL_FOREST: 'TROPICAL_SEASONAL_FOREST',
      SUBTROPICAL_DESERT: 'SUBTROPICAL_DESERT',
      BEACH: 'BEACH',
      OCEAN: 'OCEAN'
    };
    this.biomeColors = {
      SNOW: CHROMA(248, 248, 248),
      TUNDRA: CHROMA(221, 222, 185),
      BARE: CHROMA(187, 187, 187),
      SCORCHED: CHROMA(153, 153, 153),
      TAIGA: CHROMA(204, 212, 186),
      SHRUBLAND: CHROMA(196, 204, 186),
      TEMPERATE_DESERT: CHROMA(205, 215, 166),
      TEMPERATE_RAIN_FOREST: CHROMA(96, 154, 111),
      TEMPERATE_DECIDUOUS_FOREST: CHROMA(179, 202, 168),
      GRASSLAND: CHROMA(152, 181, 109),
      TROPICAL_RAIN_FOREST: CHROMA(83, 140, 111),
      TROPICAL_SEASONAL_FOREST: CHROMA(110, 167, 95),
      SUBTROPICAL_DESERT: CHROMA(213, 193, 153),
      BEACH: CHROMA(172, 159, 138),
      OCEAN: CHROMA(54, 53, 98)
    };
  }

  generateGeography() {
    this._generateElevationMap();
    this._generateMoistureMap();
    this._generateCoastline();
    this._distributeBiomes();
  }

  _generateCoastline() {
    var nodes = this.map.graphManager.nodes;

    nodes.forEach(function(node) {
      var adjToLand = false;
      var adjToOcean = false;

      node.cells.forEach(function(cell) {
        if (cell.elevation <= 0) adjToOcean = true;
        if (cell.elevation > 0) adjToLand = true;
      });

      if (adjToOcean && adjToLand) {
        node.isCoastal = true;
      }
    });
  }

  _generateElevationMap() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;
    var numCells = this.map.graphManager.numCells;
    var seed = this.seedElevation;
    var noise = new NOISEJS.Noise(seed);

    nodes.forEach(function(node) {
      var elevation = noise.simplex2(node.pos.x / numCells * this.elevationNoisiness,
                                     node.pos.y / numCells * this.elevationNoisiness);
      var f = CHROMA.scale(['008ae5', 'yellow']).domain([-1, 1]);

      node.elevationColor = f(elevation);
      node.elevation = elevation;
    }, this);

    cells.forEach(function(cell) {
      var colors = [];
      var elevations = [];

      cell.corners.forEach(function(corner) {
        colors.push(corner.elevationColor);
        elevations.push(corner.elevation);
      });

      cell.elevationColor = CHROMA.average(colors);
      cell.elevation = _.mean(elevations);
    });
  }

  _generateMoistureMap() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;
    var numCells = this.map.graphManager.numCells;
    var seed = this.seedMoisture;
    var noise = new NOISEJS.Noise(seed);

    nodes.forEach(function(node) {
      var moisture = noise.simplex2(node.pos.x / numCells * this.moistureNoisiness,
                                    node.pos.y / numCells * this.moistureNoisiness);
      var f = CHROMA.scale(['fba271', '5070ff']).domain([-1, 1]);

      node.moistureColor = f(moisture);
      node.moisture = moisture;
    }, this);

    cells.forEach(function(cell) {
      var colors = [];
      var moistures = [];

      cell.corners.forEach(function(corner) {
        colors.push(corner.moistureColor);
        moistures.push(corner.moisture);
      });

      cell.moistureColor = CHROMA.average(colors);
      cell.moisture = _.mean(moistures);
    });
  }

  _distributeBiomes() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;

    cells.forEach(function(cell) {
      var elevation = cell.elevation;
      var moisture = cell.moisture;
      var biome = this._getBiome(elevation, moisture);

      if (cell.isCoastal()) {
        biome = this.biomes.BEACH;
      }

      cell.biome = biome;
      cell.biomeColor = this.biomeColors[biome];
    }, this);

    nodes.forEach(function(node) {
      var elevation = node.elevation;
      var moisture = node.moisture;
      var biome = this._getBiome(elevation, moisture);

      if (node.isCoastal) {
        biome = this.biomes.BEACH;
      }

      node.biome = biome;
      node.biomeColor = this.biomeColors[biome];
    }, this);
  }

  _getBiome(elevation, moisture) {
    if (elevation <= 0) return this.biomes.OCEAN;

    if (elevation <= 0.25) {
      if (moisture <= -0.66)  return this.biomes.TROPICAL_RAIN_FOREST;
      if (moisture <= -0.33)  return this.biomes.TROPICAL_RAIN_FOREST;
      if (moisture <= 0)      return this.biomes.TROPICAL_SEASONAL_FOREST;
      if (moisture <= 0.33)   return this.biomes.TROPICAL_SEASONAL_FOREST;
      if (moisture <= 0.66)   return this.biomes.GRASSLAND;
      if (moisture <= 1)      return this.biomes.SUBTROPICAL_DESERT;
    }

    if (elevation <= 0.5) {
      if (moisture <= -0.66)  return this.biomes.TEMPERATE_RAIN_FOREST;
      if (moisture <= -0.33)  return this.biomes.TEMPERATE_DECIDUOUS_FOREST;
      if (moisture <= 0)      return this.biomes.TEMPERATE_DECIDUOUS_FOREST;
      if (moisture <= 0.33)   return this.biomes.GRASSLAND;
      if (moisture <= 0.66)   return this.biomes.GRASSLAND;
      if (moisture <= 1)      return this.biomes.TEMPERATE_DESERT;
    }

    if (elevation <= 0.75) {
      if (moisture <= -0.66)  return this.biomes.TAIGA;
      if (moisture <= -0.33)  return this.biomes.TAIGA;
      if (moisture <= 0)      return this.biomes.SHRUBLAND;
      if (moisture <= 0.33)   return this.biomes.SHRUBLAND;
      if (moisture <= 0.66)   return this.biomes.TEMPERATE_DESERT;
      if (moisture <= 1)      return this.biomes.TEMPERATE_DESERT;
    }

    if (elevation <= 1) {
      if (moisture <= -0.66)  return this.biomes.SNOW;
      if (moisture <= -0.33)  return this.biomes.SNOW;
      if (moisture <= 0)      return this.biomes.SNOW;
      if (moisture <= 0.33)   return this.biomes.TUNDRA;
      if (moisture <= 0.66)   return this.biomes.BARE;
      if (moisture <= 1)      return this.biomes.SCORCHED;
    }
  }
}