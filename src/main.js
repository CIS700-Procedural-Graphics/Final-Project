require('file-loader?name=[name].[ext]!../index.html');

// Credit:
// http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
// http://paulbourke.net/geometry/polygonise/

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
require('three-obj-loader')(THREE)

import Framework from './framework'
import LUT from './marching_cube_LUT.js'
import MarchingCubes from './marching_cubes.js'
import perlinNoise from './noise.js';

var clock = new THREE.Clock();

import WaterShader from './waterShader.js'
WaterShader(THREE);
var waterNormals;   //to get water texture
var water;

var time_update = 0.0;
var start = Date.now();

// =========================================== Ground Plane ===========================================
var gridDim = 100;
var terrainGeo = new THREE.PlaneGeometry( gridDim, gridDim, gridDim, gridDim); //width, height, widthSegments, heightSegments
terrainGeo.rotateX(-Math.PI / 2.0);  //make the grid flat

var noiseMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: {
      type : "float",
      value : time_update
    }
  },
  vertexShader : require('./glsl/noise-vert.glsl'),
  fragmentShader : require('./glsl/noise-frag.glsl')
});
var terrainMesh = new THREE.Mesh(terrainGeo, noiseMaterial);
terrainMesh.rotateY(-Math.PI / 2.0);
terrainMesh.translateZ(-10);
terrainMesh.translateY(3);


// =========================================== Application Variables ===========================================
const DEFAULT_VISUAL_DEBUG = false; //true;
const DEFAULT_ISO_LEVEL = 1.0;
const DEFAULT_GRID_RES = 25;//12;//12;//4;  //32 should make it look real nice and smooth
const DEFAULT_GRID_WIDTH = 15//15;//10;
const DEFAULT_NUM_METABALLS = 75;//50;//10;
const DEFAULT_MIN_RADIUS = 0.01//0.05;//0.1;//0.5;
const DEFAULT_MAX_RADIUS = 0.6//0.6;//1;
const DEFAULT_MAX_SPEED = 0.01;

var App = {
  //
  marchingCubes:             undefined,
  config: {
    // Global control of all visual debugging.
    // This can be set to false to disallow any memory allocation of visual debugging components.
    // **Note**: If your application experiences performance drop, disable this flag.
    visualDebug:    DEFAULT_VISUAL_DEBUG,

    // The isolevel for marching cubes
    isolevel:       DEFAULT_ISO_LEVEL,

    // Grid resolution in each dimension. If gridRes = 4, then we have a 4x4x4 grid
    gridRes:        DEFAULT_GRID_RES,

    // Total width of grid
    gridWidth:      DEFAULT_GRID_WIDTH,

    // Width of each voxel
    // Ideally, we want the voxel to be small (higher resolution)
    gridCellWidth:  DEFAULT_GRID_WIDTH / DEFAULT_GRID_RES,              //THE SMALLER THIS VALUE IS, THE BETTER METABALLS LOOK. BUT ALSO WILL MAKE IT SLOWER

    // Number of metaballs
    numMetaballs:   DEFAULT_NUM_METABALLS,

    // Minimum radius of a metaball
    minRadius:      DEFAULT_MIN_RADIUS,

    // Maxium radius of a metaball
    maxRadius:      DEFAULT_MAX_RADIUS,

    // Maximum speed of a metaball
    maxSpeed:       DEFAULT_MAX_SPEED
  },

  // Scene's framework objects
  camera:           undefined,
  scene:            undefined,
  renderer:         undefined,

  // Play/pause control for the simulation
  isPaused:         false
};

// =========================================== On load function ===========================================
// called after the scene loads
function onLoad(framework) {

  var {scene, camera, renderer, gui, stats} = framework;
  App.scene = scene;
  App.camera = camera;
  App.renderer = renderer;

  renderer.setClearColor( 0xbfd1e5 );
  //scene.add(new THREE.AxisHelper(20));

  setupCamera(App.camera);
  setupLights(App.scene);
  setupScene(App.scene);
  setupGUI(gui);

  setupBackground(App.scene);
  setupWater(App.scene, App.renderer, App.camera);

  //set up obj mesh in scene
  var lion_obj = './geometry/LionLowPoly3DModel.obj';
  setupObj(App.scene, lion_obj, 1);

  var lighthouse_obj = './geometry/lighthouse2.obj';
  setupObj(App.scene, lighthouse_obj, 2);

  //add terrain
  //scene.add(terrainMesh);
  setupTerrain(App.scene);

}//end onload

// =========================================== On update function ===========================================
// called on frame updates
function onUpdate(framework) {

  //to find current camera location
  //console.log(framework.camera.position);
  //console.log(framework.camera.lookAt);

  var deltaT = clock.getDelta();

  time_update = (Date.now() - start) * 0.00025;
  noiseMaterial.uniforms.time.value = time_update;

  if (App.marchingCubes) {
    App.marchingCubes.update(deltaT); //send get delta value here
  }

  if (water) {
    water.material.uniforms.time.value += 1.0 / 120.0;  //make this divisor smaller to make water move faster
    water.render();
  }

}//end onUpdate

// =========================================== On load helper functions ===========================================
function setupCamera(camera) {
  // set camera position

  //(-24.5, 9.59, -8.32)
  camera.position.set(-24.5, 9.59, -8.32);//(-25.26, 6.7, -20.14);
  camera.lookAt(new THREE.Vector3(-12, 10, 10));//(-15,4,0));    //FIDGET WITH THIS
}

function setupLights(scene) {
  // Directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 10, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);
}

function setupGUI(gui) {

  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage

  // --- CONFIG ---
  gui.add(App, 'isPaused').onChange(function(value) {
    App.isPaused = value;
    if (value) {
      App.marchingCubes.pause();
    } else {
      App.marchingCubes.play();
    }
  });

  gui.add(App.config, 'numMetaballs', 1, 50).onChange(function(value) {
    App.config.numMetaballs = value;
    App.marchingCubes.init(App);
  });

  // --- DEBUG ---

  var debugFolder = gui.addFolder('Debug');
  debugFolder.add(App.marchingCubes, 'showGrid').onChange(function(value) {
    App.marchingCubes.showGrid = value;
    if (value) {
      App.marchingCubes.show();
    } else {
      App.marchingCubes.hide();
    }
  });

  debugFolder.add(App.marchingCubes, 'showSpheres').onChange(function(value) {
    App.marchingCubes.showSpheres = value;
    if (value) {
      for (var i = 0; i < App.config.numMetaballs; i++) {
        App.marchingCubes.balls[i].show();
      }
    } else {
      for (var i = 0; i < App.config.numMetaballs; i++) {
        App.marchingCubes.balls[i].hide();
      }
    }
  });
  debugFolder.open();
}

function setupBackground(scene) {
  // set skybox
  var loader = new THREE.CubeTextureLoader();
  var urlPrefix = 'images/skymap/';

  var skymap = new THREE.CubeTextureLoader().load([
    urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
    urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
    urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  ] );

  scene.background = skymap;
}

function setupScene(scene) {
  App.marchingCubes = new MarchingCubes(App);
}

function setupWater(scene, renderer, camera){
  //water shader
  scene.add( new THREE.AmbientLight( 0x444444 ) );
  var light = new THREE.DirectionalLight( 0xffffbb, 1 );
  light.position.set( - 1, 1, - 1 );
  scene.add( light );

  waterNormals = new THREE.TextureLoader().load('textures/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  var parameters = {
    width: 2000,
    height: 2000,
    widthSegments: 250,
    heightSegments: 250,
    depth: 1500,
    param: 4,
    filterparam: 1
  };

  water = new THREE.Water(renderer, camera, scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: light.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0
  });

  var mirrorMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
    water.material
  );

  mirrorMesh.add(water);
  mirrorMesh.rotation.x = - Math.PI * 0.5;
  scene.add(mirrorMesh);
}
//
// function setupObj(scene, file) {
//
//   // load a simple obj mesh
//   var objLoader = new THREE.OBJLoader();
//   objLoader.load(file, function(obj) {
//
//       // LOOK: This function runs after the obj has finished loading
//       var geo = obj.children[0].geometry; //the actual mesh could have more than 1 part. hence the array
//       var mesh = new THREE.Mesh(geo, lambertWhite);
//       mesh.translateY(10);
//       scene.add(mesh);
//   });
// }

function setupObj(scene, file, type) {
  var objLoaded = new Promise((resolve, reject) => {
      (new THREE.OBJLoader()).load(require(file), function(obj) {
          var geo = obj.children[0].geometry;
          geo.computeBoundingSphere();
          resolve(geo);
      });
  })

  var mesh;
  var material;

  if(type == 1)
  {
    material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
  }
  if(type == 2)
  {
    material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    //material = setupTexture('./assets/ocean.bmp', './glsl/terrain-vert.glsl', './glsl/terrain-frag.glsl')
  }

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);

      if(type == 1) //lion head
      {
        mesh.rotateY(-Math.PI / 2.0);
        mesh.translateZ(-50);
        mesh.translateX(5);
        mesh.translateY(-20);
        mesh.scale.set(0.5, 0.5, 0.5);
      }

      if(type == 2) //lighthouse
      {
        mesh.translateZ(400);
        mesh.translateX(200);
        mesh.translateY(30);
        mesh.scale.set(0.5, 0.5, 0.5);
      }

      scene.add(mesh);
  });

}//end setupObj


// =========================================== Terrain setup ===========================================
function setupTerrain(scene)
{
  var gridDim = 200;
  var terrainGeo = new THREE.PlaneGeometry( gridDim, gridDim, gridDim, gridDim); //width, height, widthSegments, heightSegments
  terrainGeo.rotateX(-Math.PI / 2.0);  //make the grid flat

  var newVerticesList = [];
  var height = 5.0;
  var noise_output;
  for(var i = 0; i < terrainGeo.vertices.length; i++)
  {
    var currPos = terrainGeo.vertices[i];
    noise_output = height * perlinNoise(currPos.x, currPos.y, currPos.z);
    var newPos = new THREE.Vector3(currPos.x, currPos.y + noise_output, currPos.z);
    newVerticesList.push(newPos);
  }
  terrainGeo.vertices = newVerticesList;
  terrainGeo.verticesNeedUpdate = true;

  //
  // var terrainMaterial = new THREE.ShaderMaterial({
  //   uniforms: {
  //     time: {
  //       type : "float",
  //       value : time_update
  //     }
  //   },
  //   vertexShader : require('./glsl/noise-vert.glsl'),
  //   fragmentShader : require('./glsl/noise-frag.glsl')
  // });


  // var terrainTextureLoaded = new Promise((resolve, reject) => {
  //     (new THREE.TextureLoader()).load(require('./assets/grass1.bmp'), function(texture) {
  //         resolve(texture);
  //     })
  // })
  //
  // var terrainMaterial = new THREE.ShaderMaterial({
  //   uniforms: {
  //     texture: {
  //         type: "t",
  //         value: null
  //     },
  //   },
  //   vertexShader : require('./glsl/terrain-vert.glsl'),
  //   fragmentShader : require('./glsl/terrain-frag.glsl')
  // });
  //
  // // once the texture loads, bind it to the material
  // terrainTextureLoaded.then(function(texture) {
  //     terrainMaterial.uniforms.texture.value = texture;
  // });


  //var terrainMaterial = setupTexture('./assets/grass1.bmp', './glsl/terrain-vert.glsl', './glsl/terrain-frag.glsl');
  var terrainMaterial = setupTexture('./assets/grass1.bmp', './glsl/noise-vert.glsl', './glsl/noise-frag.glsl');


  // var grasstexture = new THREE.TextureLoader().load('./assets/grasslight-big.jpg');
  // var terrainMaterial = new THREE.MeshPhongMaterial({map: grasstexture});



  var terrainMesh = new THREE.Mesh(terrainGeo, terrainMaterial);
  terrainMesh.rotateY(-Math.PI / 2.0);
  terrainMesh.translateZ(-4);
  terrainMesh.translateX(70);
  terrainMesh.translateY(6.5);
  scene.add(terrainMesh);
}


function setupTexture(materialfile, vertfile, fragfile)
{
  var textureLoaded = new Promise((resolve, reject) => {
      (new THREE.TextureLoader()).load(require(materialfile), function(texture) {
          resolve(texture);
      })
  })

  var material = new THREE.ShaderMaterial({
    uniforms: {
      texture: {
          type: "t",
          value: null
      }
    },
    vertexShader : require(vertfile),
    fragmentShader : require(fragfile)
  });

  // once the texture loads, bind it to the material
  textureLoaded.then(function(texture) {
      material.uniforms.texture.value = texture;
  });

  return material;
}


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
