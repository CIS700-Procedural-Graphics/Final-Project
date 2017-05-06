const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const SHOW = true;
const HIDE = true;
const MODELLING = false;

require('three-lut')

import Framework from './framework'
import superformula from './superformula'

// TODO: Haha, no really is this how I'm supposed to do this?
import ConvexGeometry from '../node_modules/three/examples/js/geometries/ConvexGeometry.js'
import SubdivisionModifier from '../node_modules/three/examples/js/modifiers/SubdivisionModifier.js'

// Reference
// Skybox: https://threejs.org/examples/?q=light#webgl_lights_hemisphere

// Constants
const INFINITY = 1.7976931348623157E+10308;
const PI = 3.14159265358979323;

// Basic Materials
var material = new THREE.MeshLambertMaterial({color: 0xffffff});
var redLambert = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true});

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

var modifer = new THREE.SubdivisionModifier(2);

var stoneOptions = {
  quantity: 100,
  points: 20,
  min: -10.0,
  max: 10.0
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

// Superforumula things.
var sf = {
  a: 1.2,
  b: 1.1,
  m: 14.0,
  n1: 3.0,
  n2: -3.82,
  n3: 1.0,
  aa: 1.9,
  bb: 0.1,
  mm: 29.0,
  nn1: 4.8,
  nn2: -1.8,
  nn3: 1.7
}

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

  if (MODELLING) {
    // Guide Box ----------------------------/
    // Basically a box with side lengths 1, 2, 3, corresponding to directions x, y, z.
    // Useful for modelling since I get to understand where all the directions are while I tumble the scene
    var guideGeo = new THREE.BoxGeometry(1, 2, 3);
    var guideMesh = new THREE.Mesh(guideGeo, redLambert);
    scene.add(guideMesh);
  }

  // Superformula Flower ------------------/
  var s = new superformula();
  s.init(); // Initialiaze
   var sfmat = new THREE.ShaderMaterial({
    uniforms: {
      u_albedo: {
        type: 'f',
        value: 0xffffff
      },
      u_center: {
        type: 'v3',
        value: new THREE.Vector3(0.0, 0.0, 0.0)
      }
    },
    side: THREE.DoubleSide,
    wireframe: false,
    vertexShader: require('./shaders/sf-vert.glsl'),
    fragmentShader: require('./shaders/sf-frag.glsl')
  });
  var smesh = new THREE.Mesh(s.geometry, sfmat);
  smesh.rotation.set(3 * Math.PI/2, 0.0, 0.0);
  smesh.scale.set(10.0, 10.0, 10.0);
  scene.add(smesh);

  // TODO: Superformula Flower Generater -------------/



if (SHOW) {
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


if (!HIDE) {
  // GREEN BOX ----------------------------/
  var boxGeo = new THREE.BoxGeometry(10, 10, 10);
  var boxMat = new THREE.MeshLambertMaterial({color: 0x42f465});
  var boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.position.set(0, 10, 0);
  scene.add(boxMesh);
}

  // STONES ------------------------/
  var radius = 150;

  var stones = [];
  for (var i = 0; i < stoneOptions.quantity; i++) {
    var angle = Math.random() * Math.PI * 2; // Random Angle
    var size = Math.random() * 2.0;
    
    stones[i] = generateStone(stoneOptions.points, stoneOptions.min, stoneOptions.max);
    stones[i].position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    stones[i].scale.set(size, size, size);
    scene.add(stones[i]);
  }
}

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

  // Audio
  var myAudio = new Audio("./src/common/music/Water_Lapping_Wind.mp3");
  myAudio.play();

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  var fcamera = gui.addFolder('Camera');
  fcamera.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  var fsuper = gui.addFolder('Flower');
  fsuper.add(sf, 'a', 0.1, 2.0).name("Decrease Radius").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });
  
  fsuper.add(sf, 'b', 0.1, 2.0).name("Round Petals").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'm', 0, 50).name("Number of Petals").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'n1', 1, 20).name("Petal width").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'n2', -10, 10).name("Petal shape").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'n3', -10, 10).name("Pointed Petals").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'aa', 0.1, 2).name("Scale").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });
  
  fsuper.add(sf, 'bb', 0.1, 2).name("Round Petals").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'mm', 0, 50).name("Levels of Petals").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'nn1', 1, 20).name("Outward petal shape").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'nn2', -10, 10).name("Size from base").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });

  fsuper.add(sf, 'nn3', -10, 10).name("Petal spread").onChange(function(newVal) {
    s.setState(sf.a, sf.b, sf.m, sf.n1, sf.n2, sf.n3, sf.aa, sf.bb, sf.mm, sf.nn1, sf.nn2, sf.nn3);
  });
}

// Stone making helper function
// Returns a mesh
function generateStone(points, min, max) {
  var stonePoints = [];
  for (var i = 0; i < stoneOptions.points; i++) {
    stonePoints[i] = new THREE.Vector3(randomRange(stoneOptions.min, stoneOptions.max),
                                       randomRange(stoneOptions.min, stoneOptions.max),
                                       randomRange(stoneOptions.min, stoneOptions.max));
  }

  // // Generate a list of points and then generated a convex hull for those points
  var stoneGeo = new THREE.ConvexGeometry(stonePoints); // Creates a 
  modifer.modify(stoneGeo); // Subdivides the stone, Comment out for lower poly

  var stoneMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
  return new THREE.Mesh(stoneGeo, stoneMat);
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