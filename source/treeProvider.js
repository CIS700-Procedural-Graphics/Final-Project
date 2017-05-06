
'use strict';
const Cesium = require('cesium');

function TreeProvider(options) {
  this.generationDepth = options.generationDepth || 4;
  this.rootError = options.rootError || 100000; //100; options.rootError || 100;
  this.errorFactor = options.errorFactor || 0.25;//0.5
  this.worldRadius = options.worldRadius || 100000; // 100; options.worldRadius || 100;
  this.maxHeight = options.maxHeight || 1000; //100; options.maxHeight || 10;
  this.rootRegions = [
    // west, south, east, north, bottom, top
    [ -Math.PI, -Math.PI / 2, 0,           Math.PI / 2, 0, this.maxHeight ],
    [ 0,            -Math.PI / 2, Math.PI, Math.PI / 2, 0, this.maxHeight ]
  ];
}

function getDepth(index) {
  var depth = 0;
  while (index > 0) {
    ++depth;
    index = Math.ceil(index / 4) - 1;
  }
  return depth; //depth / 100
}

TreeProvider.prototype.getRoot = function() {
  return {
    boundingVolume: {
      sphere: [ 0, 0, 0, this.worldRadius ],
    },
    geometricError: 100000000,
    // geometricError: this.rootError,
    refine: 'replace',
    children: [
      this.generateNode(0, 1, 1),
      this.generateNode(0, 2, 1),
      this.generateNode(0, 3, 1),
      this.generateNode(0, 4, 1),

      this.generateNode(1, 1, 1),
      this.generateNode(1, 2, 1),
      this.generateNode(1, 3, 1),
      this.generateNode(1, 4, 1),
    ]
  };
}

TreeProvider.prototype.generateNode = function(hemisphere, index, generationDepth) {
  var depth = getDepth(index);
  var error = this.rootError * Math.pow(this.errorFactor, depth);

  var node = {
    boundingVolume: {
      region: this.generateBoundingRegion(hemisphere, index),
    },
    geometricError: error,
    refine: 'replace',
    content: {
      url: `${hemisphere}_${index}.b3dm`
    },
    children: undefined
  }

  if (generationDepth === this.generationDepth) {
    node.content = {
      url: `${hemisphere}_${index}.json`
    }
  } else {
    node.children = [
      this.generateNode(hemisphere, 4 * index + 1, generationDepth + 1),
      this.generateNode(hemisphere, 4 * index + 2, generationDepth + 1),
      this.generateNode(hemisphere, 4 * index + 3, generationDepth + 1),
      this.generateNode(hemisphere, 4 * index + 4, generationDepth + 1),
    ]
  }

  return node;
}

// west, south, east, north

var modifiers = [
  // south west
  function(region) {
    region[0] = region[0];
    region[1] = region[1];
    region[2] = (region[0] + region[2]) / 2;
    region[3] = (region[1] + region[3]) / 2;
  },
  // south east
  function(region) {
    region[0] = (region[0] + region[2]) / 2;
    region[1] = region[1];
    region[2] = region[2];
    region[3] = (region[1] + region[3]) / 2;
  },
  // north east
  function(region) {
    region[0] = (region[0] + region[2]) / 2;
    region[1] = (region[1] + region[3]) / 2;
    region[2] = region[2];
    region[3] = region[3];
  },
  // north west
  function(region) {
    region[0] = region[0];
    region[1] = (region[1] + region[3]) / 2;
    region[2] = (region[0] + region[2]) / 2;
    region[3] = region[3];
  },
];

var indices = [];


//ofsetting the bounds to find the maximum and minimum for the bounding box using the 3D multioctave noise
function getFractionalPart(a)
{
    if(a < 0)
        {
            return -(Math.abs(a) - Math.floor(Math.abs(a)));
        }
    else if(a > 0)
        {
            return a - Math.floor(a);
        }
    else if(a == 0)
        return 0;

}

function getIntigerPart(a)
{
    if(a < 0)
        {
            return -(Math.floor(Math.abs(a)));
        }
    else if(a > 0)
        {
            return Math.floor(a);
        }
    else if(a == 0)
        return 0;
}

function getPosition(lon, lat, height, pos) {
  Cesium.Cartographic.fromRadians(lon, lat, height, scratchCartographic);
  Cesium.Ellipsoid.WGS84.cartographicToCartesian(scratchCartographic, scratchCartesian);

    pos[0] = scratchCartesian.x;
    pos[1] = scratchCartesian.y;
    pos[2] = scratchCartesian.z;

}

function getMax(a, b, c, d)
{
    return Math.max(Math.max(Math.max(a, b), c), d);
}

function getMin(a, b, c, d)
{
    return Math.min(Math.min(Math.min(a, b), c), d);
}

function dotProduct(x1, y1, z1, x2, y2, z2)
{
    var dotproduct = ((x1 * x2) + (y1 * y2) + (z1 * z2));
    return dotproduct;
}

function Noise3D(x, y, z)
{
    var ft = Math.sin(dotProduct(x,y,z, 12.989, 78.233, 157)) * 43758.5453;

    return getFractionalPart(ft);
}


function SmoothNoise3D(X, Y, Z)
{
    var far = (Noise3D(X-1, Y+1, Z+1) + Noise3D(X+1, Y+1, Z+1) + Noise3D(X-1, Y+1, Z-1) + Noise3D(X+1, Y+1, Z-1) + Noise3D(X-1, Y-1, Z+1) + Noise3D(X+1, Y-1, Z+1) + Noise3D(X-1, Y-1, Z-1) + Noise3D(X+1, Y-1, Z-1)) / 64.0;//80.0;

    var medium = (Noise3D(X-1, Y+1, Z) + Noise3D(X+1, Y+1, Z) + Noise3D(X-1, Y-1, Z) + Noise3D(X+1, Y-1, Z) + Noise3D(X, Y+1, Z+1) + Noise3D(X, Y+1, Z-1) + Noise3D(X, Y-1, Z+1) + Noise3D(X, Y-1, Z-1) + Noise3D(X-1, Y, Z+1) + Noise3D(X+1, Y, Z+1) + Noise3D(X-1, Y, Z-1) + Noise3D(X+1, Y, Z-1)) / 32.0;//60.0;

    var closest = (Noise3D(X-1, Y, Z) + Noise3D(X+1, Y, Z) + Noise3D(X, Y-1, Z) + Noise3D(X, Y+1, Z) + Noise3D(X, Y, Z+1) + Noise3D(X, Y, Z-1)) / 16.0;//19.999;

    var self = Noise3D(X, Y, Z) / 8.0;


    return self + closest + medium + far;
}


function Interpolate(a, b, x)
{
    var t = (1.0 - Math.cos(x * 3.14159)) * 0.5;

    return a * (1.0 - t) + b * t;
}

function InterpolateNoise3D(x, y, z, p)
{
    var int_X = getIntigerPart(x);
    var int_Y = getIntigerPart(y);
    var int_Z = getIntigerPart(z);

    var float_X = getFractionalPart(x);
    var float_Y = getFractionalPart(y);
    var float_Z = getFractionalPart(z);

    //8 Points on the lattice sorrunding the given point
    var p1 = SmoothNoise3D(int_X, int_Y, int_Z);
    var p2 = SmoothNoise3D(int_X + 1, int_Y, int_Z);
    var p3 = SmoothNoise3D(int_X, int_Y + 1, int_Z);
    var p4 = SmoothNoise3D(int_X + 1, int_Y + 1, int_Z);
    var p5 = SmoothNoise3D(int_X, int_Y, int_Z + 1);
    var p6 = SmoothNoise3D(int_X + 1, int_Y, int_Z + 1);
    var p7 = SmoothNoise3D(int_X, int_Y + 1, int_Z + 1);
    var p8 = SmoothNoise3D(int_X + 1, int_Y + 1, int_Z + 1);

    var i1 = Interpolate(p1, p2, float_X);
    var i2 = Interpolate(p3, p4, float_X);
    var i3 = Interpolate(p5, p6, float_X);
    var i4 = Interpolate(p7, p8, float_X);

    var n1 = Interpolate(i1, i2, float_Y);
    var n2 = Interpolate(i3, i4, float_Y);

    var t1 = Interpolate(n1, n2, float_Z);

    return t1;
}


function Generate_Noise3D(posx, posy, posz, persistance, octaves)
{
    var total = 0.0;
    var p = persistance;
    var n = octaves;

    //int i = 0;
    for(var i=0; i < octaves; i++)
    {
    var frequency = Math.pow(1/p, i);//Math.pow(2, i)  / 12000000.0;
    var amplitude = Math.pow(p, i);

    total = total + InterpolateNoise3D((posx)* frequency / 600000, (posy) * frequency / 600000, (posz) * frequency / 600000, amplitude) * amplitude;
    }

    return total;
}

//convert the radians to cartesian coordinates for getting the width of the tiles
var scratchCartographic = new Cesium.Cartographic();
var scratchCartesian = new Cesium.Cartesian3();

var sw_pos = [];
var se_pos = [];
var nw_pos = [];
var ne_pos = [];



TreeProvider.prototype.generateBoundingRegion = function(hemisphere, index) {
  let region = this.rootRegions[hemisphere].slice();
    var depth = getDepth(index);
  indices.length = 0;
  while (index > 0) {
    let next = Math.floor((index - 1) / 4);
    let childIndex = index - next * 4;
    indices.push(childIndex - 1);
    index = next;
  }

  for(let i = indices.length - 1; i >= 0; --i) {
    modifiers[indices[i]](region);
  }

    // west, south, east, north, bottom, top <- region
    //getting the south west position in cartesian
    getPosition(region[0],region[1],0, sw_pos);

    //getting the south east position in cartesian
    getPosition(region[2],region[1],0, se_pos);

    //getting the north west position in cartesian
    getPosition(region[0],region[3],0, nw_pos);

    //getting the north east position in cartesian
    getPosition(region[2],region[3],0, ne_pos);

    var persistance = 0.5;

    //generate the noise value for the 4 corners
    var noise_sw = Generate_Noise3D(sw_pos[0], sw_pos[1], sw_pos[2], persistance, depth);
    var noise_se = Generate_Noise3D(se_pos[0], se_pos[1], se_pos[2], persistance, depth);
    var noise_nw = Generate_Noise3D(nw_pos[0], nw_pos[1], nw_pos[2], persistance, depth);
    var noise_ne = Generate_Noise3D(ne_pos[0], ne_pos[1], ne_pos[2], persistance, depth);

    var max = getMax(noise_sw, noise_se, noise_nw, noise_ne);
    var min = getMin(noise_sw, noise_se, noise_nw, noise_ne);

    //estimating the error of the bounding box to (k + 3) octaves. Currently k = 4
    var error = Math.pow(0.5, depth + 1) +  Math.pow(0.5, depth + 2) + Math.pow(0.5, depth + 3); 

    region[region.length - 2] = (min - error) * 2000000;
    region[region.length - 1] = (max + error) * 2000000;

  return region;
}

module.exports = TreeProvider;
