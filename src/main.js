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
const DEFAULT_MAX_RADIUS = 0.55//0.6;//1;
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

  //add music
  document.getElementById('music').play();

  //add terrain
  //scene.add(terrainMesh);
  setupTerrain(App.scene);

  //set up obj mesh in scene
  var lion_obj = './geometry/LionLowPoly3DModel.obj';
  setupObj(App.scene, lion_obj, 1);

  var lighthouse_obj = './geometry/lighthouse2.obj';
  setupObj(App.scene, lighthouse_obj, 2);

  var stonewall_obj = './geometry/stonewall.obj';
  setupObj(App.scene, stonewall_obj, 3);

  setupRocks(App.scene);

  // setupFerns(App.scene);

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

// =========================================== Camera setup ===========================================
function setupCamera(camera) {
  // set camera position

  camera.position.set(-11.28, 7.39, -4.31);//(-24.5, 9.59, -8.32);//(-25.26, 6.7, -20.14);
  camera.lookAt(new THREE.Vector3(5, 10, 10));   //(-12, 10, 10));//(-15,4,0));    //FIDGET WITH THIS
}

// =========================================== Lights setup ===========================================
function setupLights(scene) {
  // Directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 10, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);
}

// =========================================== GUI setup ===========================================
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

// =========================================== Background setup ===========================================
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

// =========================================== Scene setup ===========================================
function setupScene(scene) {
  App.marchingCubes = new MarchingCubes(App);
}

// =========================================== Water setup ===========================================
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
}//end setup water

// =========================================== OBJ setup ===========================================
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
  var texLoader = new  THREE.TextureLoader();

  if(type == 1) //lion's head
  {
    //material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    //material = new THREE.MeshPhongMaterial({map : THREE.ImageUtils.loadTexture('./src/assets/BrickMedievalBlock.jpg') } );
    //material = new THREE.MeshPhongMaterial({map : THREE.ImageUtils.loadTexture('./src/assets/Rock_6_Tex/Rock_6_d.png') } );

    // var texMap = texLoader.load('./src/assets/sand/rock.jpg'); //'./src/assets/Lion/Lion_Albido.tga');
    // var dispMap = texLoader.load('./src/assets/sand/rock_DISP.tga');
    // var normMap = texLoader.load('./src/assets/sand/rock_NRM.tga');
    // var aoMap = texLoader.load('./src/assets/sand/rock_OCC.tga');
    //
    // material = new THREE.MeshPhongMaterial({
    //   map : texMap,
    //   displacementMap: dispMap,
    //   //normalMap: normMap,
    //   aoMap: aoMap
    // });

    material = setupTexture('./assets/grass1.bmp', './glsl/terrain2-vert.glsl', './glsl/terrain2-frag.glsl');
  }

  if(type == 2) //lighthouse
  {
    var texMap = texLoader.load('./src/assets/walls/Brick_S.jpg');
    var dispMap = texLoader.load('./src/assets/walls/Brick_DISP.tga');
    var normMap = texLoader.load('./src/assets/walls/Brick_NRM.tga');
    var aoMap = texLoader.load('./src/assets/walls/Brick_OCC.tga');

    material = new THREE.MeshPhongMaterial({
      map : texMap,
      displacementMap: dispMap,
      normalMap: normMap,
      aoMap: aoMap
    });
  }

  if(type == 3) //stone wall
  {
    var texMap = texLoader.load('./src/assets/stonewall/stonewall_diff.jpg');
    var normMap = texLoader.load('./src/assets/stonewall/stonewall_norm.jpg');
    var specMap = texLoader.load('./src/assets/stonewall/stonewall_spec.jpg');

    material = new THREE.MeshPhongMaterial({
      map : texMap,
      normalMap : normMap,
      specularMap : specMap
    } );
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
        mesh.translateZ(200);
        mesh.translateX(100);
        mesh.translateY(15);
        mesh.rotateY(-Math.PI);
        mesh.scale.set(0.5, 0.5, 0.5);
      }

      if(type == 3) //stone wall
      {
        mesh.rotateY(-Math.PI / 3.0);
        mesh.translateX(-3);
        mesh.translateZ(-12);
        //mesh.translateY(-4);
      }

      scene.add(mesh);
  });

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);

      if(type == 3) //stone wall
      {
        mesh.rotateY(-Math.PI / 2.5);
        mesh.translateX(3);
        mesh.translateZ(-12);
        //mesh.translateY(-4);
        scene.add(mesh);
      }
  });

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);

      if(type == 3) //stone wall
      {
        mesh.rotateY(-Math.PI / 2);
        mesh.translateX(10);
        mesh.translateZ(-14);
        //mesh.translateY(-4);
        scene.add(mesh);
      }
  });

}//end setupObj

function setupRocks(scene)
{
  var objLoaded = new Promise((resolve, reject) => {
      (new THREE.OBJLoader()).load(require('./geometry/Rock_6.obj'), function(obj) {
          var geo = obj.children[0].geometry;
          geo.computeBoundingSphere();
          resolve(geo);
      });
  })

  var mesh;
  var material;
  var texLoader = new  THREE.TextureLoader();

  var texMap = texLoader.load('./src/assets/Rock_6_Tex/Rock_6_d.png');
  var normMap = texLoader.load('./src/assets/Rock_6_Tex/Rock_6_n.png');
  var aoMap = texLoader.load('./src/assets/Rock_6_Tex/Rock_6_ao.png');

  material = new THREE.MeshPhongMaterial({
    map : texMap,
    normalMap : normMap,
    aoMap : aoMap
  } );

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);
      mesh.translateY(1);
      mesh.translateX(10);
      mesh.translateZ(15);
      mesh.scale.set(2.0, 2.0, 2.0);
      scene.add(mesh);
  });

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);
      mesh.translateY(1);
      mesh.translateX(5);
      mesh.translateZ(20);
      mesh.scale.set(4.0, 4.0, 4.0);
      scene.add(mesh);
  });

  // objLoaded.then(function(geo) {
  //     mesh = new THREE.Mesh(geo, material);
  //     mesh.translateY(1);
  //     mesh.translateX(10);
  //     mesh.translateZ(-7);
  //     scene.add(mesh);
  // });
  //
  // objLoaded.then(function(geo) {
  //     mesh = new THREE.Mesh(geo, material);
  //     mesh.translateY(1);
  //     mesh.translateX(10);
  //     mesh.translateZ(-5);
  //     scene.add(mesh);
  // });
  //
  // objLoaded.then(function(geo) {
  //     mesh = new THREE.Mesh(geo, material);
  //     mesh.translateY(1);
  //     mesh.translateX(10);
  //     mesh.translateZ(-3);
  //     scene.add(mesh);
  // });



}//end setuprocks function


function setupFerns(scene)
{
  var objLoaded = new Promise((resolve, reject) => {
      (new THREE.OBJLoader()).load(require('./geometry/Ferns.obj'), function(obj) {
          var geo = obj.children[0].geometry;
          geo.computeBoundingSphere();
          resolve(geo);
      });
  })

  var mesh;
  var material;
  var texLoader = new  THREE.TextureLoader();

  var texMap = texLoader.load('./src/assets/fern/Branches0030_1_M.png');
  var normMap = texLoader.load('./src/assets/fern/Branches0030_1_M_NRM.jpg');

  material = new THREE.MeshPhongMaterial({
    map : texMap
    //normalMap : normMap
  } );

  objLoaded.then(function(geo) {
      mesh = new THREE.Mesh(geo, material);
      mesh.translateY(10);
      //mesh.translateX(10);
      //mesh.translateZ(15);
      mesh.scale.set(2.0, 2.0, 2.0);
      scene.add(mesh);
  });


}//end setup ferns function


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

  var terrainMaterial = setupTexture('./assets/grass1.bmp', './glsl/noise-vert.glsl', './glsl/noise-frag.glsl');

  //var terrainMaterial = setupTexture('./assets/grass1.bmp', './glsl/tiling-vert.glsl', './glsl/tiling-frag.glsl');
  //terrainMaterial.extensions.derivatives = true;

  //var terrainMaterial = setupTexture('./assets/grass1.bmp', './glsl/terrain2-vert.glsl', './glsl/terrain2-frag.glsl');

  var terrainMesh = new THREE.Mesh(terrainGeo, terrainMaterial);
  terrainMesh.rotateY(-Math.PI / 2.0);
  terrainMesh.translateZ(-4);
  terrainMesh.translateX(70);
  terrainMesh.translateY(6.5);
  scene.add(terrainMesh);
}

// =========================================== Texture setup ===========================================
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
}//end setup texture


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);


/* NOTES:

  //TEXTURE MAPPING
  // var grasstexture = new THREE.TextureLoader().load('./assets/grasslight-big.jpg');    //HAS TO BE JPG
  // var terrainMaterial = new THREE.MeshPhongMaterial({map: grasstexture});

*/
