const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
require('three-lut')

import Framework from './framework'

const INFINITY = 1.7976931348623157E+10308;

var prevTime = new Date();
var currentTime = new Date();
var deltaTime = new THREE.Vector3(0.0, 0.0, 0.0);

// Color Look Up Table
const colors = 100;
const mode = 'rainbow';
const lookupTable = new THREE.Lut(mode, colors);

const WHITE = new THREE.Color("rgb(255, 255, 255)"); 
const RED = new THREE.Color("rgb(255, 0, 0)");


// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // set camera position
  camera.position.set(500, 1000, 500);
  camera.lookAt(new THREE.Vector3(500, 0, 500));


  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

}

function onUpdate(framework) {

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);


// WEBPACK FOOTER //
// ./src/main.js