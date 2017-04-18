const THREE = require('three'); 
const OrbitControls = require('three-orbit-controls')(THREE)

import Framework from './framework'
import {left_canyon_mat, right_canyon_mat, water_mat, sky_mat, ground_mat} from './materials'

var time, offset, count;
var left_plane, right_plane, ground, water, sky;
var spline;

var variables = {
  music : null,
  audioAnalyser : null,
  enableSound : true,
  initialized : false,
  isPaused : false
}

// called after the scene loads
function onLoad(framework) {
  time = 0; offset = 0; count = 0;
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // objects and geometry
  var left_plane_geo = new THREE.PlaneBufferGeometry(5, 100, 50, 100).rotateX(-Math.PI/2).translate(-4,-1,0);
  var left_material = new THREE.ShaderMaterial(left_canyon_mat);
  left_plane = new THREE.Mesh(left_plane_geo, left_material);
  scene.add(left_plane);

  // var right_plane_geo = new THREE.PlaneBufferGeometry(10, 10, 10, 5).rotateX(Math.PI/2).translate(4,-1,0);
  // var right_material = new THREE.ShaderMaterial(left_canyon_mat);
  // right_plane = new THREE.Mesh(right_plane_geo, right_material);
  // scene.add(right_plane);

  var ground_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-2,0);
  var ground_material = new THREE.MeshBasicMaterial( { color: 0x444444 , wireframe: true} );
  ground = new THREE.Mesh(ground_geo, ground_material);
  scene.add(ground);

  var water_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-1,0);
  var water_material = new THREE.MeshBasicMaterial( { color: 0x0000FF , wireframe: true} );
  water = new THREE.Mesh(water_geo, water_material);
  scene.add(water);

  var sky_geo = new THREE.SphereBufferGeometry(500, 100, 100);
  var sky_material = new THREE.ShaderMaterial(sky_mat);
  sky_material.side = THREE.BackSide;
  sky = new THREE.Mesh(sky_geo, sky_material);
  scene.add(sky);

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
  makeSpline(new THREE.Vector3(0,0,0));
  updateCamera(camera, 0);

  // gui
  gui.add(variables, 'enableSound').onChange(function(value) {
    if (value) variables.music.play();
    else variables.music.pause();
  });

  gui.add(variables, 'isPaused');
}

function makeSpline(position) {
  var randomPoints = [];
  var last = position;
  var rot = 0;
  for ( var i = 0; i < 50; i ++ ) {
    randomPoints.push(last.clone());
    var dir = Math.random() * Math.PI/2 + 7*Math.PI/4;
    rot += dir;
    rot % (2 * Math.PI);
    last.add(new THREE.Vector3(5 * Math.cos(rot), 0, 5 * Math.sin(rot)));
  }
  spline = new THREE.CatmullRomCurve3(randomPoints);
}

function updateCamera(camera, camPosIndex) {
      
      var camPos = spline.getPoint(camPosIndex / 10000);
      var camRot = spline.getTangent(camPosIndex / 10000);

      camera.position.x = camPos.x;
      camera.position.y = camPos.y;
      camera.position.z = camPos.z;

      camera.rotation.x = camRot.x;
      camera.rotation.y = camRot.y;
      camera.rotation.z = camRot.z;

      camera.lookAt(spline.getPoint((camPosIndex+1) / 10000));
}
// called on frame updates

function onUpdate(framework) {
  if (variables.initialized) {

    if (!variables.isPaused) {
      time ++;
      if (time == 10000) {
        time = 0;
        makeSpline();
      }
      updateCamera(framework.camera, time % 10000);
    }

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