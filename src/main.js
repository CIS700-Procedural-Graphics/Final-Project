const THREE = require('three'); 
const OrbitControls = require('three-orbit-controls')(THREE)
require('three-obj-loader')(THREE)

import Framework from './framework'
import {updateCamera, makeSpline, makeCircle, makeSplineTexture} from './camera'
import {initSceneGeo, initPlanes, initRocks} from './geometry'
import {canyon_mat, water_mat, sky_mat, rock_mat, boat_mat, rain_mat} from './materials'
import ParticleSystem from './rain'

var time, count;
var particleSys;

var options = {
  music : null,
  audioAnalyser : null,
  enableSound : false,
  initialized : false,
  isPaused : false
}

var variables = {
  res: 128,
  spline : null,
  texture_data : null,
  circle : null,
  smoothness : 0.5,
  radius : 50, 
  num_points : 25
}

var meshes = {
  plane : null,
  water : null,
  sky : null, 
  boat : null,
  displayBoat : true,
  num_rocks : 32,
  number_rocks : 32,
  rocks : []
}

var colors = {
  boat_color : [0.0,0.0,0.0],
  sky_low_color : [0.0,0.0,0.0],

}

var materials = {
  canyon_mat : canyon_mat,
  water_mat : water_mat,
  sky_mat : sky_mat,  
  rock_mat : rock_mat,
  boat_mat : boat_mat,
  rain_mat : rain_mat, 
  rock_color : 0x5b5048
}

var rain = {
  density : 0.05,
  direction : new THREE.Vector3(0,-1,0),
  width : 2 * variables.radius,
  depth : 2 * variables.radius,
  height : 25
}

// called after the scene loads
function onLoad(framework) {
  time = 0; count = 0;
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  options.isPaused = framework.paused;

  // set camera position
  var splineData = makeSpline(variables.radius, variables.num_points, variables.smoothness);
  variables.spline = splineData;
  variables.circle = makeCircle(variables.radius, variables.num_points);
  // pass spline to material
   variables.texture_data = makeSplineTexture(variables.spline, variables.radius, variables.res, variables.res);
   var texture = new THREE.DataTexture(variables.texture_data, variables.res, variables.res, THREE.RGBAFormat);
   texture.type = THREE.UnsignedByteType;
   texture.needsUpdate = true;
   materials.canyon_mat.uniforms.spline_tex.value = texture;
   materials.water_mat.uniforms.spline_tex.value = texture;
   materials.rain_mat.uniforms.spline_tex.value = texture;

  updateCamera(framework.viewpoint, camera, variables.spline, variables.circle, 0, meshes.boat);

  // objects and geometry
  materials.rain_mat.uniforms.dim.value = new THREE.Vector2(rain.width, rain.depth);
  initSceneGeo(scene, meshes, materials, variables);

  // audio
  var listener = new THREE.AudioListener();
  camera.add(listener);
  options.music = new THREE.Audio(listener);
  var audioLoader = new THREE.AudioLoader();

  audioLoader.load('./src/assets/song.mp3', function (buffer) {
    options.music.setBuffer( buffer );
    options.music.setLoop(true);
    options.music.setVolume(1.0);

    if (options.enableSound) options.music.play();

    options.initialized = true;

  });
  options.audioAnalyser = new THREE.AudioAnalyser( options.music, 64 );

  // rain
  particleSys = new ParticleSystem(rain, scene, variables, materials.rain_mat);

  // gui
  setUpGUI(framework, scene, gui);
}

// called on frame updates

function onUpdate(framework) {
  options.isPaused = framework.paused;
  if (options.initialized) {

    materials.water_mat.uniforms.time.value = time;
    materials.canyon_mat.uniforms.time.value = time;
    materials.sky_mat.uniforms.time.value = time;
    materials.rock_mat.uniforms.time.value = time;
    materials.rain_mat.uniforms.time.value = time;

    if (!options.isPaused) {
      time ++;
      if (time == 10000) {
        time = 0;
      }
      updateCamera(framework.viewpoint, framework.camera, variables.spline, variables.circle, time % 10000, meshes.boat);
      // framework.controls.target.set(framework.camera.position);
      particleSys.update(0.1);
    } 
  }
}

function setUpGUI(framework, scene, gui) {
  gui.add(options, 'enableSound').onChange(function(value) {
    if (value) options.music.play();
    else options.music.pause();
  });

  gui.add(options, 'isPaused').onChange(function(value) {
    framework.paused = value;
  });

  // var r = gui.addFolder('Camera Parameters');
  // r.add(variables, 'smoothness', );
  // r.add(variables, 'num_points', );
  // r.add(particleSys, 'gaussian');
  // r.add(particleSys, 'widen');
  // r.add(variables, 'res', );

  // var s = gui.addFolder('Sky Parameters');
  // s.addColor(materials.sky_mat.uniforms, 'low');
  // s.addColor(colors, 'sky_low_color').onChange(function(newVal) {
  //   materials.sky_mat.uniforms.low.value = new THREE.Color(newVal);
  // });
  // s.addColor(materials.sky_mat.uniforms, 'mid');
  // s.addColor(materials.sky_mat.uniforms, 'high');
  // s.add(materials.sky_mat.uniforms, 'buckets', 1, 10).step(1);
  // s.add(materials.sky_mat.uniforms, 'amplitude', 1, 10);
  // s.add(materials.sky_mat.uniforms, 'frequency', 0, 1);

  // var w = gui.addFolder('Water Parameters');
  // w.add(materials.water_mat.uniforms, 'buckets', 1, 10).step(1);
  // w.add(materials.water_mat.uniforms, 'buckets', 1, 10).step(1);
  // w.add(materials.water_mat.uniforms, 'amplitude', 1, 10);
  // w.add(materials.water_mat.uniforms, 'frequency', 0, 1);
  // w.addColor(materials.water_mat.uniforms, 'shallow_water');
  // w.addColor(materials.water_mat.uniforms, 'deep_water');

  // var c = gui.addFolder('Canyon Parameters');
  // c.addColor(materials.canyon_mat.uniforms, 'base_color');
  // c.addColor(materials.canyon_mat.uniforms, 'mid_color');
  // c.addColor(materials.canyon_mat.uniforms, 'tip_color');

  // var d = gui.addFolder('Rain Parameters');
  // d.add(particleSys, 'density', 0, 1).step(0.1);
    // d.addColor(particleSys, 'color').onChange(function(newVal) {
    //   materials.boat_mat.uniforms.boat_color.value = new THREE.Color(newVal);
    // });
  // d.add(particleSys, 'size', 0, 1).step(0.1);

  var g = gui.addFolder('Geometry');

  // g.addColor(colors, 'boat_color').onChange(function(newVal) {
  //   materials.boat_mat.uniforms.boat_color.value = new THREE.Color(newVal);
  // });

  g.add(meshes, 'displayBoat').onChange(function(value) {
    if (value) scene.add(meshes.boat);
    else scene.remove(meshes.boat);
  });
  g.add(meshes, 'number_rocks', 0, 128).step(1).onChange(function(value) {
    // remove and dispose
    for (var i = 0; i < meshes.num_rocks; i ++) {
      scene.remove(meshes.rocks[i]);
      meshes.rocks[i].geometry.dispose();
      meshes.rocks[i].material.dispose();
      meshes.rocks[i] = undefined;
    }
    meshes.rocks = [];
    meshes.num_rocks = meshes.number_rocks;
    // add 
    initRocks(scene, meshes, materials.rock_color, variables);

  });
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);