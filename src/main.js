const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
//const OBJLoader = require('three-obj-loader');
//OBJLoader(THREE)
const OrbitControls = require('three-orbit-controls')(THREE)

import Framework from './framework'
import BioCrowd from './bio_crowd.js'

const DEFAULT_VISUAL_DEBUG = false;
const DEFAULT_CELL_RES = 25;
const DEFAULT_GRID_RES = 8;
const DEFAULT_GRID_WIDTH = 8;
const DEFAULT_GRID_HEIGHT = 8;
const DEFAULT_NUM_AGENTS = 8;
const DEFAULT_NUM_MARKERS = 1000;
const DEFAULT_RADIUS = 0.5;
const DEFAULT_OBSTACLES = 2;
const DEFAULT_MAX_VELOCITY = 5;

var App = {
  //
  bioCrowd:             undefined,
  agentGeometry:        new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8).rotateX(Math.PI/2),
  scenario:             'line',
  obstacles:            DEFAULT_OBSTACLES,
  config: {
    visualDebug:      DEFAULT_VISUAL_DEBUG,
    isPaused:         false,
    gridRes:          DEFAULT_GRID_RES,
    cellRes:          DEFAULT_CELL_RES, 

    gridWidth:        DEFAULT_GRID_WIDTH,
    gridHeight:       DEFAULT_GRID_HEIGHT,

    maxMarkers:       DEFAULT_NUM_MARKERS,
    numAgents:        DEFAULT_NUM_AGENTS,
    agentRadius:      DEFAULT_RADIUS,
    maxVelocity:      DEFAULT_MAX_VELOCITY 
  },

  // Scene's framework objects
  camera:           undefined,
  scene:            undefined,
  renderer:         undefined,
  controls:          undefined,
  plane:            undefined
};

// called after the scene loads
function onLoad(framework) {

  var {scene, camera, renderer, gui, stats, controls} = framework;
  App.scene = scene;
  App.camera = camera;
  App.renderer = renderer;
  App.controls = controls;

  renderer.setClearColor( 0x111111 );

  setupCamera(App.camera);
  //setupLights(App.scene);
  setupScene(App.scene);
  setupGUI(gui);
}

// called on frame updates
function onUpdate(framework) {
  if (App.bioCrowd) {
    App.bioCrowd.update();
  }
}

function setupCamera(camera) {
  // set camera position
  camera.position.set(App.config.gridWidth/2, App.config.gridHeight/2, App.config.gridWidth);
  camera.lookAt(App.config.gridWidth/2, App.config.gridHeight/2, 0);
  App.controls.target.set(App.config.gridWidth/2, App.config.gridHeight/2, 0);
}

function setupScene(scene) {
  var geo = new THREE.PlaneGeometry(App.config.gridWidth, App.config.gridHeight, 
  App.config.gridRes, App.config.gridRes);
  geo.translate(App.config.gridWidth/2,App.config.gridHeight/2,-0.01);
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: true} );
  App.plane = new THREE.Mesh( geo, material );
  scene.add( App.plane );
  App.bioCrowd = new BioCrowd(App);
}

function setupGUI(gui) {

  var a = gui.addFolder('Agent_Controls');
  var g = gui.addFolder('Grid_Controls');

  gui.add(App.config, 'isPaused').onChange(function(value) {
    App.isPaused = value;
    if (value) App.bioCrowd.pause();
    else App.bioCrowd.play();
  });
  gui.add(App.config, 'visualDebug').onChange(function(value) {
    if (value) App.bioCrowd.show();
    else App.bioCrowd.hide();
  });
  a.add(App.config, 'numAgents', 1, 50).step(1).onChange(function(value) {
    App.bioCrowd.reset();
    App.bioCrowd = new BioCrowd(App);
  });
  a.add(App.config, 'agentRadius', 0, 1).onChange(function(value) {
    App.bioCrowd.reset();
    App.bioCrowd = new BioCrowd(App);
  });
  a.add(App, 'scenario', ['line', 'quad', 'random']).onChange(function(val) {
    App.bioCrowd.reset();
    App.bioCrowd = new BioCrowd(App);
  });
  g.add(App.config, 'cellRes', 0, 100).step(1).onChange(function(value) {
    App.bioCrowd.reset();
    App.bioCrowd = new BioCrowd(App);
  });
  g.add(App.config, 'gridWidth', 0, 50).step(1).onChange(function(value) {
    App.config.gridHeight = value;
    App.scene.remove(App.plane);
    App.plane.geometry.dispose(); App.plane.material.dispose(); 
    App.bioCrowd.reset();
    setupScene(App.scene);
    setupCamera(App.camera);
  });
  g.add(App.config, 'gridRes', 0, 10).step(1).onChange(function(value) {
    App.scene.remove(App.plane);
    App.plane.geometry.dispose(); App.plane.material.dispose(); 
    App.bioCrowd.reset();
    setupScene(App.scene);
  });
  gui.add(App, 'obstacles', 0, 5).onChange(function(value) {
    App.bioCrowd.reset();
    App.bioCrowd = new BioCrowd(App);
  }); 
}

function setupLights(scene) {

  // Directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 10, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
