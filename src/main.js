const THREE = require('three'); 
const OrbitControls = require('three-orbit-controls')(THREE)

import Framework from './framework'
import {updateCamera, makeSpline, makeSplineTexture} from './camera'
import {initSceneGeo, updateRocks} from './geometry'
import {canyon_mat, water_mat, sky_mat, ground_mat, rock_mat} from './materials'

var time, count;

var variables = {
  music : null,
  audioAnalyser : null,
  enableSound : false,
  initialized : false,
  isPaused : true, 

  // spline
  spline : null,
  smoothness : 0,
  jitter : 50, 
  path_radius : 50, 
  num_points : 25
}

var meshes = {
  plane : null, 
  ground : null,
  water : null,
  sky : null, 
  num_rocks : 50,
  rocks : []
}

var materials = {
  canyon_mat : canyon_mat,
  water_mat : water_mat,
  sky_mat : sky_mat, 
  ground_mat : ground_mat, 
  rock_mat : rock_mat
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
  variables.spline = makeSpline(variables.path_radius, variables.num_points, variables.jitter, variables.smoothness);
  materials.canyon_mat.uniforms.spline.value = variables.spline.getPoints(50);

  var geometry = new THREE.Geometry();
  geometry.vertices = variables.spline.getPoints( 100 );
  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
  var curveObject = new THREE.Line( geometry, material );
  scene.add(curveObject);

  updateCamera(camera, variables.spline, 0);

  // objects and geometry
  initSceneGeo(scene, meshes, materials, variables.spline);

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

  // gui
  gui.add(variables, 'enableSound').onChange(function(value) {
    if (value) variables.music.play();
    else variables.music.pause();
  });

  gui.add(variables, 'isPaused');
}

// called on frame updates

function onUpdate(framework) {
  if (variables.initialized) {

    if (!variables.isPaused) {
      time ++;
      if (time == 10000) {
        time = 0;
      }
      updateCamera(framework.camera, variables.spline, time % 10000);
    }

    materials.water_mat.uniforms.time.value = time;
    materials.canyon_mat.uniforms.time.value = time;
    materials.sky_mat.uniforms.time.value = time;
    materials.rock_mat.uniforms.time.value = time;

    var avgFreq = variables.audioAnalyser.getAverageFrequency() / 256.0;
    var dataArray = variables.audioAnalyser.getFrequencyData();
    materials.sky_mat.uniforms.audioFreq.value = avgFreq;
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);