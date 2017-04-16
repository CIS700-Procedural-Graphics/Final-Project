
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import AllAgents from './agents.js'

var M_PI = 3.14159265359;

var planeDim = 10; 
// ^^^^ NOTE THIS IS USED IN AGENTS.JS BUT DECLARED HERE SO CHECK AGENTS.JS SORTING ALG IF EVER CHANGE DIM

var adamMaterialOne;
var adamMaterialTwo;
var basicMaterialOne;
var basicMaterialTwo;

var scenePlane;
var planeTop;
var planeBottom; 
var mesh1;
var mesh2;

// set up so vectors where orig pos then target pos based on
//    num of agents currently being used
// holds THREE.Vector2(...)s
var positionsArray = new Array();
// array for randomly placed marker positions
// holds THREE.Vector2(...)s
var markersPositionsArray = new Array();

var obstacleRadius = 1;
var obstacleHeight = 4;

// used for determining when objects will move in onUpdate
var stepTime = 0;
var first = true;
var cont = true;

var sceneData = {
  onScene: 0,
  usingMaterial: 0,
  materialOne: null,
  materialTwo: null,
  allAgents: null,
  nAgents: 1,
  nMarkers: 500,
  vDebug: true,
  isPaused: false,
  obstacle: false,
  obstacleObj: null
};

/**************************************************************************/
/****************** Create and Update Functions ***************************/
/**************************************************************************/

function createMaterials(){
  adamMaterialOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamOne.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });

  adamMaterialTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamTwo.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });

  basicMaterialOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./simpleOne.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });
  basicMaterialTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./simpleTwo.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });
}

function updateSceneMaterials(){
  if (sceneData.usingMaterial == 0) {
    sceneData.materialOne = basicMaterialOne;
    sceneData.materialTwo = basicMaterialTwo;
  } else if (sceneData.usingMaterial == 1) {
    sceneData.materialOne = adamMaterialOne;
    sceneData.materialTwo = adamMaterialTwo;
  } else {
    console.log("main: NO PROPER MATERIAL AVAILABLE");
  }

  updateMesh();
}

function createMesh() {
  // initialize a simple plane with adam's face as material
  planeTop = new THREE.PlaneGeometry(planeDim, planeDim, planeDim, planeDim);
  planeBottom = new THREE.PlaneGeometry(planeDim, planeDim, planeDim, planeDim);
  // make appear double sided
  planeBottom.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI ) );
  planeTop.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI ));

  mesh1 = new THREE.Mesh(planeTop, sceneData.materialOne);
  mesh2 = new THREE.Mesh(planeBottom, sceneData.materialOne);
  scenePlane = new THREE.Object3D();
  //putting the planes together into one object
  scenePlane.add(mesh1);
  scenePlane.add(mesh2);
  
  // make plane horizontal
  scenePlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
}

function updateMesh() {
  mesh1 = new THREE.Mesh(planeTop, sceneData.materialOne);
  mesh2 = new THREE.Mesh(planeBottom, sceneData.materialOne);
  scenePlane = new THREE.Object3D();
  //putting the planes together into one object
  scenePlane.add(mesh1);
  scenePlane.add(mesh2);
  
  // make plane horizontal
  scenePlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
}

function addAllDataToScene(framework) {
  updateSceneStartPositions();
  sceneData.allAgents = new AllAgents(sceneData.nAgents,
                                      sceneData.nMarkers,
                                      sceneData.usingMaterial,
                                      sceneData.vDebug,
                                      positionsArray,
                                      markersPositionsArray);

  sceneData.allAgents.addDataToScene(framework);
}

/****************************************************************************/
/****************** New Orientation for Beg Scene ***************************/
/****************************************************************************/

function withinObstacle(xPos, zPos) {
  var margin = 0.5;
  console.log("obstacleRadius = " + obstacleRadius);
  var minMargin = -obstacleRadius - margin;
  var maxMargin = obstacleRadius + margin;
  var within = ((xPos >= minMargin && xPos <= maxMargin) || (zPos >= minMargin && zPos <= maxMargin));
  console.log("within:" + within);

  return within;
}

function setUpMarkerPositions() {
  markersPositionsArray = new Array();
  var offsetForGrid = 5.0;

  // looping to randomly place the objs
  for (var i = 0; i < sceneData.nMarkers; i++) {
    var xPos = Math.random() * 10.0 - offsetForGrid;
    var zPos = Math.random() * 10.0 - offsetForGrid;
    //if ((sceneData.obstacle && !withinObstacle(xPos, zPos))
    //      || !sceneData.obstacle) {
        markersPositionsArray.push(new THREE.Vector2(xPos, zPos));
    //}
  }
}

function updateSceneStartPositions() {
  if (sceneData.onScene == 0) {
    buildCircleScene();
  } else if (sceneData.onScene == 1) {
    buildDoubleCircleScene();
  } else {
    console.log("ONSCENE: NO PROPER SCENE TO BE LOADED");
  }
}

// set orig position and ending position based on num agents in the scene
function buildCircleScene() {
  var posOrig = new THREE.Vector2(0, 0, 0); 
  var posTarget = new THREE.Vector2(0, 0, 0); 
  var num = sceneData.nAgents;
  var radius = 4;

  positionsArray = new Array();

  for (var i = 0; i < num; i++) {
    // circle shape
    var theta = 2*M_PI/num * i;
    var xLoc = radius * Math.cos(theta);
    var zLoc = radius * Math.sin(theta);
    var xLocDest = radius * Math.cos(theta + M_PI);
    var zLocDest = radius * Math.sin(theta + M_PI);

    posOrig = new THREE.Vector3(xLoc, zLoc);
    posTarget = new THREE.Vector3(xLocDest, zLocDest);

    positionsArray.push(posOrig);
    positionsArray.push(posTarget);
  }
}

function buildDoubleCircleScene() {
  var posOrig = new THREE.Vector2(0, 0, 0); 
  var posTarget = new THREE.Vector2(0, 0, 0); 
  var num = sceneData.nAgents;
  var radiusOne = 1.5;
  var radiusTwo = 4;

  positionsArray = new Array();

  for (var i = 0; i < num; i++) {
    // circle shape
    var theta = 2*M_PI/num * i;
    var xLoc = radiusOne * Math.cos(theta);
    var zLoc = radiusOne * Math.sin(theta);
    var xLocDest = radiusTwo * Math.cos(theta + M_PI);
    var zLocDest = radiusTwo * Math.sin(theta + M_PI);

    posOrig = new THREE.Vector3(xLoc, zLoc);
    posTarget = new THREE.Vector3(xLocDest, zLocDest);

    positionsArray.push(posOrig);
    positionsArray.push(posTarget);
  }
}

/**************************************************************************/
/****************** Load and onUpdate Functions ***************************/
/**************************************************************************/

// called after the scene loads
function onLoad(framework) {

  // declaring all left variables in this scope as same as member obj from framework with same names
  var {scene, camera, renderer, gui, stats} = framework; 

  // set skybox
  var loader = new THREE.CubeTextureLoader();
  var urlPrefix = './skymap/';
  var skymap = new THREE.CubeTextureLoader().load([
      urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
      urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
      urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  ] );
  scene.background = skymap;

  // adding directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

   // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // creating base scene mesh
  createMaterials();
  updateSceneMaterials();

  createMesh();
  updateMesh();
  scene.add(scenePlane);

  // set up markers for the scene
  // only need to do this once bc same data reused over whole program
  setUpMarkerPositions();
  // adding elements to the scene
  addAllDataToScene(framework);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(sceneData, 'usingMaterial', 0, 1).step(1).onChange(function(newVal) {
    scene.remove(scenePlane);

    for (var i = scenePlane.children.length - 1; i >= 0; i--) {
        scenePlane.remove(scenePlane.children[i]);
    }

    updateSceneMaterials();
    updateMesh();

    scene.remove(sceneData.allAgents);
    sceneData.allAgents.removeDataFromScene(framework);

    updateSceneStartPositions();
    addAllDataToScene(framework);

    scene.add(scenePlane);
  });

  gui.add(sceneData, 'onScene', 0, 1).step(1).onChange(function(newVal) {
    scene.remove(sceneData.allAgents);
    sceneData.allAgents.removeDataFromScene(framework);

    updateSceneStartPositions();
    addAllDataToScene(framework);
  });

  gui.add(sceneData, 'nAgents', 1, 20).step(1).onChange(function(newVal) {
    scene.remove(sceneData.allAgents);
    sceneData.allAgents.removeDataFromScene(framework);

    updateSceneStartPositions();
    addAllDataToScene(framework);
  });

  gui.add(sceneData, 'vDebug').onChange(function(value) {
    // hiding and showing all markers
    if (value) {
      sceneData.allAgents.show();
    } else {
      sceneData.allAgents.hide();
    }
  });

  gui.add(sceneData, 'isPaused').onChange(function(value) {
    // hiding and showing all markers
    sceneData.allAgents.isPaused = sceneData.isPaused;
  });

  // gui.add(sceneData, 'obstacle').onChange(function(value) {
  //   // hiding and showing all markers

  //   if (sceneData.obstacle && sceneData.allAgents != null) {
  //     scene.remove(sceneData.allAgents);
  //     sceneData.allAgents.removeDataFromScene(framework);

  //     // mark positions have to be updated bc obstacle now

  //     updateSceneStartPositions();
  //     setUpMarkerPositions();
  //     // doing the following to avoid having a null scene due to markers being set
  //     //    up after the scene is created
  //     sceneData.allAgents.markerPositions = markersPositionsArray;
  //     sceneData.allAgents.makeMarkers();
  //     sceneData.allAgents.sortByPos(sceneData.allMarkers);

  //     addAllDataToScene(framework);
  //   }
  // });
}

// called on frame updates
function onUpdate(framework) {
  stepTime += 1.0;

  var timeStep = 5.0

  if (cont || first) {
    if (stepTime % timeStep == 0) {
      //console.log("first: " + first);
      //console.log(sceneData);
      sceneData.allAgents.update();
      if (first) first = !first;
      //console.log("step:"+stepTime);
    }
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
