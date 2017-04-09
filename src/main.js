const THREE = require('three'); 
const OrbitControls = require('three-orbit-controls')(THREE)

import Framework from './framework'
import {left_canyon_mat, right_canyon_mat, water_mat, sky_mat} from './materials'

var time;

var variables = {
  music : null,
  audioAnalyser : null,
  enableSound : true,
  initialized : false
}

// called after the scene loads
function onLoad(framework) {
  time = 0;
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // objects and geometry
  var left_plane_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateY(Math.PI/2).translate(-2,2,0);
  var left_material = new THREE.MeshBasicMaterial( { color: 0x00FF00 , wireframe: true } );
  var left_plane = new THREE.Mesh(left_plane_geo, left_material);
  scene.add(left_plane);

  var right_plane_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateY(-Math.PI/2).translate(2,2,0);
  var right_material = new THREE.MeshBasicMaterial( { color: 0xFF0000 , wireframe: true} );
  var right_plane = new THREE.Mesh(right_plane_geo, right_material);
  scene.add(right_plane);

  var ground_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-2,0);
  var ground_material = new THREE.MeshBasicMaterial( { color: 0x444444 , wireframe: true} );
  var ground = new THREE.Mesh(ground_geo, ground_material);
  scene.add(ground);

  var water_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-1,0);
  var water_material = new THREE.MeshBasicMaterial( { color: 0x0000FF , wireframe: true} );
  var water = new THREE.Mesh(water_geo, water_material);
  scene.add(water);

  var sky_geo = new THREE.PlaneBufferGeometry(10,10).rotateX(Math.PI/8).translate(0,2,-10);
  var sky_material = new THREE.ShaderMaterial(sky_mat);
  var sky = new THREE.Mesh(sky_geo, sky_material);
  scene.add(sky);

  scene.add(new THREE.AxisHelper(20));

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

  // set camera position
  camera.position.set(0,0,0);
  camera.lookAt(new THREE.Vector3(0,0,-1));

  // gui
  gui.add(variables, 'enableSound').onChange(function(value) {
    if (value) variables.music.play();
    else variables.music.pause();
  });
}

// called on frame updates
function onUpdate(framework) {
  if (variables.initialized) {
    time = (time + 1);

    water_mat.uniforms.time.value = time;
    left_canyon_mat.uniforms.time.value = time;
    right_canyon_mat.uniforms.time.value = time;
    sky_mat.uniforms.time.value = time;

    var avgFreq = variables.audioAnalyser.getAverageFrequency() / 256.0;
    var dataArray = variables.audioAnalyser.getFrequencyData();
    sky_mat.uniforms.audioFreq.value = avgFreq;
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);