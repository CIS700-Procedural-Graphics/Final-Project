const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
require('three-lut')

import Framework from './framework'

const INFINITY = 1.7976931348623157E+10308;
const PI = 3.14159265358979323;

var startTime = 0.0;
var prevTime = 0.0;
var currentTime = 0.0;
var deltaTime = new THREE.Vector3(0.0, 0.0, 0.0);

// Color Look Up Table
const colors = 100;
const mode = 'rainbow';
const lookupTable = new THREE.Lut(mode, colors);

const WHITE = new THREE.Color("rgb(255, 255, 255)"); 
const RED = new THREE.Color("rgb(255, 0, 0)");

var options = {
  water: {
    width: 500.0,
    height: 500.0,
    widthSegments: 100,
    heightSegments: 100
  }
}

  var planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_amount: {
        type: "f",
        value: 1.0
      },
      u_albedo: {
        type: 'v3',
        value: new THREE.Color('#0000ff')
      },
      time: {
        type: "f",
        value: 0
      },
      waterHeight: {
        type: "f",
        value: 0
      },
      light: {
        type: "vec3",
        value: new THREE.Vector3(0.0, 0.0, 0.0)
      },
      numWaves: {
        type: "i",
        value: 4
      },
      amplitude: {
        type: "1fv",
        value: [0.2, 0.25, 0.125, 0.0625, 0.0, 0.0, 0.0, 0.0]
      },
      wavelength: {
        type: "1fv",
        value: [8 * PI, 4 * PI, 2 * PI, PI, 0.0, 0.0, 0.0, 0.0]
      },
      speed: {
        type: "1fv",
        value: [1.0, 3.0, 5.0, 7.0, 0.0, 0.0, 0.0, 0.0]
      },
      direction: {
        type: "v2v",
        value: [new THREE.Vector2(0, 1), 
                new THREE.Vector2(1, 0),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(1, 1)]
      }
    },
    // wireframe: true,
    vertexShader: require('./shaders/water-vert.glsl'),
    fragmentShader: require('./shaders/water-frag.glsl')
  });


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

  planeMaterial.uniforms.light.value = directionalLight.position;

  // set camera position
  camera.position.set(500, 500, 500);
  camera.lookAt(new THREE.Vector3(500, 0, 500));

  // Water
  var planeGeo = new THREE.PlaneGeometry(options.water.width, 
                                         options.water.height, 
                                         options.water.widthSegments, 
                                         options.water.heightSegments);
  //var planeMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe: true});
  var planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
  planeMesh.rotateX(-Math.PI / 2.0);
  planeMesh.position.set(500, 0, 500);
  scene.add(planeMesh);



  // Set up time
  startTime = Date.now();
  prevTime = startTime;
  currentTime = startTime;

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}


function onUpdate(framework) {
  // Update Time
  prevTime = currentTime;
  currentTime = Date.now();

  // Update time in water shader
  planeMaterial.uniforms.time.value = (currentTime - startTime) / 1000;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);


// WEBPACK FOOTER //
// ./src/main.js