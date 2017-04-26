const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
require('three-lut')

import Framework from './framework'


// Reference
// Skybox: https://threejs.org/examples/?q=light#webgl_lights_hemisphere

// Constants
const INFINITY = 1.7976931348623157E+10308;
const PI = 3.14159265358979323;

// Clock
var startTime = 0.0;
var prevTime = 0.0;
var currentTime = 0.0;

// GUI
var options = {
  water: {
    width: 500.0,
    height: 500.0,
    widthSegments: 100,
    heightSegments: 100
  }
}

// Water Material
var waterMaterial = new THREE.ShaderMaterial({
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
      // Random generated directions generated in matlab...
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

  // LIGHTS ------------------- /
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  // scene.add(directionalLight);

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -1, 1.75, 1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );


  // Hemisphere Light
  var hemiLight = hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );


  // END LIGHTS ----------------/

  // waterMaterial.uniforms.light.value = directionalLight.position;

  // set camera position
  camera.position.set(0, 0, 250);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // Water
  var waterGeo = new THREE.PlaneGeometry(options.water.width, 
                                         options.water.height, 
                                         options.water.widthSegments, 
                                         options.water.heightSegments);
  //var waterMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe: true});
  var waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.rotateX(-Math.PI / 2.0);
  waterMesh.position.set(0, 0, 0);
  scene.add(waterMesh);


  // // TODO: Remove Test Box
  var boxGeo = new THREE.BoxGeometry(10, 10, 10);
  var boxMaterial = new THREE.MeshLambertMaterial({color: 0x42f465});
  var boxMesh = new THREE.Mesh(boxGeo, boxMaterial);
  scene.add(boxMesh);


  // SKY BOX ----------------------/
  // // GROUND
  var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
  var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
  groundMat.color.setHSL( 0.095, 1, 0.75 );
  var ground = new THREE.Mesh( groundGeo, groundMat );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -33;
  scene.add( ground );
  ground.receiveShadow = true;

  // SKYDOME
  var skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor:    { value: new THREE.Color( 0x0077ff ) },
      bottomColor: { value: new THREE.Color( 0xffffff ) },
      offset:      { value: 33 },
      exponent:    { value: 0.6 }
    },
    side: THREE.DoubleSide,
    vertexShader: require('./shaders/sky-vert.glsl'),
    fragmentShader: require('./shaders/sky-frag.glsl')
  });
  skyMat.uniforms.topColor.value.copy( hemiLight.color );
  var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
  var sky = new THREE.Mesh( skyGeo, skyMat );
  scene.add( sky );

  // Set up time
  startTime = Date.now();
  prevTime = startTime;
  currentTime = startTime;

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  var fcamera = gui.addFolder('Camera');
  fcamera.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}


function onUpdate(framework) {
  // Update Time
  prevTime = currentTime;
  currentTime = Date.now();

  // Update time in water shader
  waterMaterial.uniforms.time.value = (currentTime - startTime) / 1000;


}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);


// WEBPACK FOOTER //
// ./src/main.js