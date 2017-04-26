const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
require('three-lut')

import Framework from './framework'
import ConvexGeometry from '../node_modules/three/examples/js/geometries/ConvexGeometry.js'


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

// ROCK MATERIAL
var rockMat = new THREE.ShaderMaterial({
     uniforms: {
      t: {
        type: "f",
        value: 1.0
      },
      octaves: {
        type: "f",
        value: 3.0
      },
      persistence: {
        type: "f",
        value: 4.0
      }, 
      u_albedo: {
        type: 'v3',
        value: new THREE.Color(options.albedo)
      },
      u_ambient: {
          type: 'v3',
          value: new THREE.Color(options.ambient)
      },
      u_lightPos: {
          type: 'v3',
          value: new THREE.Vector3(30, 50, 40)
      },
      u_lightCol: {
          type: 'v3',
          value: new THREE.Color(options.lightColor)
      },
      u_lightIntensity: {
          type: 'f',
          value: options.lightIntensity
      }
     },
    vertexShader: require('./shaders/rock-vert.glsl'),
    fragmentShader: require('./shaders/rock-frag.glsl')
  });


// TODO: Clean this up into different functions
// called after the scene loads
// ----------------------------------
// ONLOAD
// ----------------------------------
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // CAMERA --------------------- / 
  camera.position.set(0, 0, 250);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // LIGHTS --------------------- /
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
  // END LIGHTS -------------------/

  // WATER ------------------------/
  waterMaterial.uniforms.light.value = directionalLight.position;
  var waterGeo = new THREE.PlaneGeometry(options.water.width, 
                                         options.water.height, 
                                         options.water.widthSegments, 
                                         options.water.heightSegments);

  var waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.rotateX(-Math.PI / 2.0);
  waterMesh.position.set(0, 0, 0);
  scene.add(waterMesh);


  // BOX ----------------------------/
  var boxGeo = new THREE.BoxGeometry(10, 10, 10);
  var boxMat = new THREE.MeshLambertMaterial({color: 0x42f465});
  var boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.position.set(0, 10, 0);
  //scene.add(boxMesh);

  // ROCKS -------------------------/
  // var rockGeo = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10);
  // var rockGeo = new THREE.IcosahedronGeometry(10, 4);
  // // var rockMat = new THREE.MeshLambertMaterial({color: 0x605146, wireframe: true});
  // var rockMesh = new THREE.Mesh(rockGeo, rockMat);
  // rockMesh.position.set(0, 50, 0);
  // scene.add(rockMesh);

  // STONE ------------------------/
  var stoneOptions = {
    points: 20,
    min: -10.0,
    max: 10.0
  }

  var stonePoints = [];
  for (var i = 0; i < stoneOptions.points; i++) {
    stonePoints[i] = new THREE.Vector3(randomRange(stoneOptions.min, stoneOptions.max),
                                       randomRange(stoneOptions.min, stoneOptions.max),
                                       randomRange(stoneOptions.min, stoneOptions.max));
  }

  // // Generate a list of points and then generated a convex hull for those points
  var stoneGeo = new THREE.ConvexGeometry(stonePoints);
  var stoneMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
  var stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
  scene.add(stoneMesh);


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
    side: THREE.BackSide,
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

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
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