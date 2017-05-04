const THREE = require('three');
const _ = require('lodash');
const NOISEJS = require('noisejs');
const CHROMA = require('chroma-js');
const SEEDRANDOM = require('seedrandom');

export default class GeographyManager {
  constructor(options, map) {
    this.map = map;
    this.seedElevation = options.seedElevation;
    this.seedMoisture = options.seedMoisture;
    this.seedErosion = options.seedErosion;
    this.elevationNoisiness = options.elevationNoisiness;
    this.moistureNoisiness = options.moistureNoisiness;
    this.erosionSteps = options.erosionSteps;
    this.rainDistribution = options.rainDistribution;
    this.rainFrequency = options.rainFrequency;
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
    this._generateErosion();
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
    var f = CHROMA.scale(['008ae5', 'yellow']).domain([-1, 1]);

    nodes.forEach(function(node) {
      var elevation = noise.simplex2(node.pos.x / numCells * this.elevationNoisiness,
                                     node.pos.y / numCells * this.elevationNoisiness);

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
    var f = CHROMA.scale(['fba271', '5070ff']).domain([-1, 1]);

    nodes.forEach(function(node) {
      var moisture = noise.simplex2(node.pos.x / numCells * this.moistureNoisiness,
                                    node.pos.y / numCells * this.moistureNoisiness);

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

  _generateErosion() {
    for (var i = 0; i < this.erosionSteps; i++) {
      var droplets = this._spawnDroplets();
      var maxLimit = 1000;
      var l = 0;

      while (l < maxLimit) {
        var nextDroplets = [];
        var dropletMaxSpeed = 1.0;

        if (droplets.length === 0) l = maxLimit;

        droplets.forEach(function(droplet) {
          var node = droplet.node;
          var elevation = node.elevation;
          var lowestNeighbor = node.getLowestNeighbor();
          var lowestElevation = lowestNeighbor.elevation;

          var elevationDelta = elevation - lowestElevation;
          var lowestNeighborMoisture = lowestNeighbor.moisture;
          var sedimentChange = (elevationDelta / 10.0) * droplet.speed;

          // Lowest elevation is higher than current elevation
          if (elevation < lowestElevation) {
            sedimentChange = -1 * Math.min(droplet.sediment, -1 * elevationDelta);
          }

          node.elevation -= sedimentChange
          droplet.sediment += sedimentChange;
          droplet.node = lowestNeighbor;
          droplet.speed = Math.max(dropletMaxSpeed, droplet.speed + elevationDelta);

          // If new node is above sea level, add it
          if (lowestElevation > 0.0) {
            nextDroplets.push(droplet);
          }
        });

        droplets = nextDroplets;
        l++;
      }
    }

    this._updateCellElevations();
    this._updateElevationColors();
  }

  _spawnDroplets() {
    var nodes = this.map.graphManager.nodes;
    var rng = SEEDRANDOM(this.seedErosion);
    var droplets = [];

    class Droplet {
      constructor(node) {
        this.speed = 0.0;
        this.sediment = 0.0;
        this.node = node;
      }
    }

    nodes.forEach(function(node) {

      var rand = rng() / this.rainFrequency;
      var dropletCondition = (this.rainDistribution === 'moisture map') ? (rand < node.moisture) :
                             (this.rainDistribution === 'uniform')      ? (rand < 0.5) :
                                                                          (rand < 0.5);

      if (dropletCondition && node.elevation > 0.0) {
        var droplet = new Droplet(node);

        droplets.push(droplet);
        node.spawnedDroplet = true;
      }

      rng = SEEDRANDOM(rng());
    }, this);

    return droplets;
  }

  _updateCellElevations() {
    var cells = this.map.graphManager.cells;

    cells.forEach(function(cell) {
      var cellElevation = 0;
      var corners = cell.corners;

      corners.forEach(function(node) {
        cellElevation += node.elevation;
      });

      cell.elevation = cellElevation / corners.length;
    });
  }

  _updateElevationColors() {
    var nodes = this.map.graphManager.nodes;
    var cells = this.map.graphManager.cells;
    var f = CHROMA.scale(['008ae5', 'yellow']).domain([-1, 1]);

    nodes.forEach(function(node) {
      node.elevationColor = f(node.elevation);
    }, this);

    cells.forEach(function(cell) {
      var colors = [];

      cell.corners.forEach(function(corner) {
        colors.push(corner.elevationColor);
      });

      cell.elevationColor = CHROMA.average(colors);
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