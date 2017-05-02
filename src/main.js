const THREE = require('three'); 
const OrbitControls = require('three-orbit-controls')(THREE)
require('three-obj-loader')(THREE)

import Framework from './framework'
import {updateCamera, makeSpline, makeCircle, makeSplineTexture} from './camera'
import {initSceneGeo} from './geometry'
import {canyon_mat, water_mat, sky_mat, rock_mat, boat_mat, rain_mat} from './materials'
import ParticleSystem from './rain'

var time, count;
var particleSys;

var variables = {
  music : null,
  audioAnalyser : null,
  enableSound : true,
  initialized : false,
  isPaused : false, 
  res: 128,

  // spline
  spline : null,
  circle : null,
  smoothness : 0.5,
  path_radius : 50, 
  num_points : 25
}

var meshes = {
  plane : null,
  water : null,
  sky : null, 
  boat : null,
  num_rocks : 32,
  rocks : []
}

var materials = {
  canyon_mat : canyon_mat,
  water_mat : water_mat,
  sky_mat : sky_mat,  
  rock_mat : rock_mat,
  boat_mat : boat_mat,
  rain_mat : rain_mat
}

var rain = {
  density : 0.1,
  direction : new THREE.Vector3(0,-1,0),
  width : 2 * variables.path_radius,
  depth : 2 * variables.path_radius,
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

  // set camera position
  var splineData = makeSpline(variables.path_radius, variables.num_points, variables.smoothness);
  variables.spline = splineData;
  variables.circle = makeCircle(variables.path_radius, variables.num_points);
  // pass spline to material
   var data = makeSplineTexture(variables.spline, variables.path_radius, variables.res, variables.res);
   var texture = new THREE.DataTexture(data, variables.res, variables.res, THREE.RGBAFormat);
   texture.type = THREE.UnsignedByteType;
   texture.needsUpdate = true;
   materials.canyon_mat.uniforms.spline_tex.value = texture;
   materials.water_mat.uniforms.spline_tex.value = texture;
   materials.rain_mat.uniforms.spline_tex.value = texture;

  updateCamera(framework.viewpoint, camera, variables.spline, variables.circle, 0, meshes.boat);

  // objects and geometry
  materials.water_mat.uniforms.density.value = 5 * rain.density;
  materials.rain_mat.uniforms.dim.value = new THREE.Vector2(rain.width, rain.depth);
  initSceneGeo(scene, meshes, materials, variables.spline, variables.path_radius, data, variables.res);

  // audio
  var listener = new THREE.AudioListener();
  camera.add(listener);
  variables.music = new THREE.Audio(listener);
  var audioLoader = new THREE.AudioLoader();

  audioLoader.load('./src/assets/song.mp3', function (buffer) {
    variables.music.setBuffer( buffer );
    variables.music.setLoop(true);
    variables.music.setVolume(1.0);

    if (variables.enableSound) variables.music.play();

    variables.initialized = true;

  });
  variables.audioAnalyser = new THREE.AudioAnalyser( variables.music, 64 );

  // rain
  particleSys = new ParticleSystem(rain, scene, data, variables.res, variables.res, materials.rain_mat);

  // gui
  setUpGUI(gui);
}

// called on frame updates

function onUpdate(framework) {
  if (variables.initialized) {

    materials.water_mat.uniforms.time.value = time;
    materials.canyon_mat.uniforms.time.value = time;
    materials.sky_mat.uniforms.time.value = time;
    materials.rock_mat.uniforms.time.value = time;
    materials.rain_mat.uniforms.time.value = time;

    if (!variables.isPaused) {
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

function setUpGUI(gui) {
  gui.add(variables, 'enableSound').onChange(function(value) {
    if (value) variables.music.play();
    else variables.music.pause();
  });

  gui.add(variables, 'isPaused');

  var r = gui.addFolder('Camera Parameters');
  r.add(variables, 'smoothness', );
  r.add(variables, 'num_points', );
  r.add(particleSys, 'gaussian');
  r.add(particleSys, 'widen');
  r.add(variables, 'res', );

  var s = gui.addFolder('Sky Parameters');
  s.addColor(materials.sky_mat.uniforms, 'low');
  s.addColor(materials.sky_mat.uniforms, 'mid');
  s.addColor(materials.sky_mat.uniforms, 'high');
  s.add(materials.sky_mat.uniforms, 'buckets', 1, 10).step(1);
  s.add(materials.sky_mat.uniforms, 'amplitude', 1, 10);
  s.add(materials.sky_mat.uniforms, 'frequency', 0, 1);

  var w = gui.addFolder('Water Parameters');
  w.add(materials.water_mat.uniforms, 'buckets', 1, 10).step(1);
  w.add(materials.water_mat.uniforms, 'buckets', 1, 10).step(1);
  w.add(materials.water_mat.uniforms, 'amplitude', 1, 10);
  w.add(materials.water_mat.uniforms, 'frequency', 0, 1);
  w.addColor(materials.water_mat.uniforms, 'shallow_water');
  w.addColor(materials.water_mat.uniforms, 'deep_water');

  var c = gui.addFolder('Canyon Parameters');
  c.addColor(materials.canyon_mat.uniforms, 'base_color');
  c.addColor(materials.canyon_mat.uniforms, 'mid_color');
  c.addColor(materials.canyon_mat.uniforms, 'tip_color');

  var d = gui.addFolder('Rain Parameters');
  d.add(particleSys, 'density', 0, 1).step(0.1);
  d.addColor(particleSys, 'color');
  d.add(particleSys, 'size', 0, 1).step(0.1);

  var g = gui.addFolder('Geometry Parameters');
  d.add(variables, 'displayBoat');
  d.add(meshes, 'num_rocks', 0, 64).step(1);
  d.addColor(materials.boat_mat.uniforms, 'boat_color');

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);