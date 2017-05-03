
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Grid, {GridCell} from './grid.js'
import Player from './player.js'

var player, playerPromise;
var grid, gridDimension = 5.0;
var allMeshes = new Set();
var fw; //framework for restart

//raymarching
var mouse = {x: -1, y: 1}; //set the mouse at the top left corner of screen
var isectObj = null; //the object in the scene currently closest to the camera 
var isectPrevMaterial;

/*
var Sliders = function() {
  this.anglefactor = 1.0;
};
var sliders = new Sliders();
*/

//http://www.iquilezles.org/www/articles/palettes/palettes.htm
function palette(t, option) {
  var a, b, c, d;
  switch(option) {
    case 0:
        a = new THREE.Vector3(0.5, 0.5, 0.5);
        b = new THREE.Vector3(0.3, 0.3, 0.3);
        c = new THREE.Vector3(1.0, 1.0, 1.0);
        d = new THREE.Vector3(0.0, 0.1, 0.2);
        break;
    case 1:
        a = new THREE.Vector3(0.5, 0.5, 0.5);
        b = new THREE.Vector3(0.3, 0.3, 0.3);
        c = new THREE.Vector3(1.0, 1.0, 1.0);
        d = new THREE.Vector3(0.3, 0.2, 0.2);
        break;
    case 2:
        a = new THREE.Vector3(0.5, 0.5, 0.5);
        b = new THREE.Vector3(0.3, 0.3, 0.3);
        c = new THREE.Vector3(0.5, 0.5, 0.5);
        d = new THREE.Vector3(0.1, 0.1, 0.0);
        break;
    default:
        a = new THREE.Vector3(0.5, 0.5, 0.5);
        b = new THREE.Vector3(0.3, 0.3, 0.3);
        c = new THREE.Vector3(1.0, 1.0, 1.0);
        d = new THREE.Vector3(0.0, 0.1, 0.2);
  }

  return new THREE.Color(
    a.x + b.x*Math.cos( 6.28318*(c.x*t+d.x) ), 
    a.y + b.y*Math.cos( 6.28318*(c.y*t+d.y) ), 
    a.z + b.z*Math.cos( 6.28318*(c.z*t+d.z) ));
}

// called after the scene loads
function onLoad(framework) {
  fw = framework;
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
  var controls = framework.controls;

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.set(0xffffff);
  //directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(-10, 50, 20);
  //directionalLight.position.multiplyScalar(10);
  //directionalLight.castShadow = true;
  scene.add(directionalLight);

  /*
  //shadows
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowCameraNear = 1;
  renderer.shadowCameraFar = 1000;
  renderer.shadowCameraFov = 50;
  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 0.9;
  renderer.shadowMapWidth = 2048;
  renderer.shadowMapHeight = 2048;
  */

  // when the mouse moves, call the given function
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  restart(framework);

  /*
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle, sliders.anglefactor);
  });

  gui.add(lsys, 'iterations', 0, 5).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle, sliders.anglefactor);
  });

  gui.add(sliders, 'anglefactor', 0.5, 1.5).step(0.05).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle, sliders.anglefactor);
  });
  */
}


function restart(framework) {

  //increase grid size for next level
  //MUST TO THIS AT THE BEGINNING AND NOT END OF RESTART, 
  //key press event uses gridDimension for checks
  gridDimension++;

  //disposes all meshses in scene
  for (var mesh of allMeshes) {
      //mesh.material.dispose();
      //mesh.geometry.dispose();
      framework.scene.remove(mesh);
      //framework.renderer.deallocateObject( mesh );
  }

  //set camera position
  //1.5 is a rough estimate of root(2), moves camera 45 degrees above horizon line for isometric view
  framework.camera.position.set(2.0*gridDimension, 1.5*gridDimension, 2.0*gridDimension);
  framework.camera.lookAt(new THREE.Vector3(gridDimension/2.0, 0.0, gridDimension/2.0));
  framework.controls.target.set(gridDimension/2.0, 0.0, gridDimension/2.0);
  framework.camera.zoom = 500/gridDimension;
  framework.camera.updateProjectionMatrix(); //must be called after updating camera parameters

  //randomly pick a color pallette
  var colorOption = Math.floor(Math.random()*3.0);
  var colors = [];
  colors.push(palette(0.0, colorOption));
  colors.push(palette(0.167, colorOption));
  colors.push(palette(0.333, colorOption));
  colors.push(palette(0.5, colorOption));
  colors.push(palette(0.666, colorOption));
  colors.push(palette(0.833, colorOption));
  //[ palette(0.0), palette(0.167), palette(0.333), palette(0.5), palette(0.666), palette(0.833) ];

  //GRID AND LEVEL GENERATION
  grid = new Grid(framework.scene, gridDimension, new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);
  //add planes to scene
  for (var x = 0.0; x < gridDimension; x += 1) {
    for (var z = 0.0; z < gridDimension; z += 1) {

      var cellMaterials = [ 
          new THREE.MeshBasicMaterial({color: 0x606060}),
          new THREE.MeshBasicMaterial({color: 0xffffff}), 
          new THREE.MeshLambertMaterial({color: grid.gridArray[x][z].color}),
          new THREE.MeshBasicMaterial({color: 0xffffff}), 
          new THREE.MeshBasicMaterial({color: 0x808080}), 
          new THREE.MeshBasicMaterial({color: 0xffffff}) 
      ]; 
      var cellMaterial = new THREE.MeshFaceMaterial(cellMaterials);
      var cell = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), cellMaterial);

      cell.position.x = x+0.5;
      cell.position.y = -0.5;
      cell.position.z = z+0.5;
      //cell.receiveShadow = true;
      framework.scene.add(cell);
      allMeshes.add(cell);
    }
  }

  // PLAYER
  playerPromise = new Promise((resolve, reject) => { 
      player = new Player(new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);
      if (player.position.x == gridDimension-1) {
          resolve();
      }
  }); 
  
  //player.cube.castShadow = true;
  framework.scene.add(player.cube);
  allMeshes.add(player.cube);
}


document.onkeydown = checkKey;
function checkKey(e) {
    //if player is still animating, ignore keyPress
    if (player.isAnimating) {
      return;
    }

    e = e || window.event;
    if (e.keyCode == '38') {
      // up arrow
      if (player.position.x - 1 >= 0 && player.faceXNegative.equals(grid.gridArray[player.position.x - 1][player.position.z].color)) {
        player.rotateZCounter();
      }
    }
    else if (e.keyCode == '40') {
      // down arrow
      if (player.position.x + 1 < gridDimension && player.faceXPositive.equals(grid.gridArray[player.position.x + 1][player.position.z].color)) {
        player.rotateZClockwise();
      }
    }
    else if (e.keyCode == '37') {
      // left arrow
      if (player.position.z + 1 < gridDimension && player.faceZPositive.equals(grid.gridArray[player.position.x][player.position.z + 1].color)) {
        player.rotateXCounter();
      }
    }
    else if (e.keyCode == '39') {
       // right arrow
      if (player.position.z - 1 >= 0 && player.faceZNegative.equals(grid.gridArray[player.position.x][player.position.z - 1].color)) {
        player.rotateXClockwise();
      }
    }
    //console.log(player.position);
}


function onDocumentMouseMove( event ) 
{
  //the following line would stop any other event handler from firing
  //(such as the mouse's TrackballControls)
  //event.preventDefault();
  
  // update the mouse variable
  mouse.x = 2*(event.clientX/window.innerWidth) - 1;
  mouse.y = -2*(event.clientY/window.innerHeight) + 1;
}


// called on frame updates
function onUpdate(framework) {

  Promise.all([playerPromise]).then(values => { 
    if (player.isAnimating) {
      player.animate();
    }  

    if (player.position.x == 0 && player.position.z == 0) {
      restart(fw);
    }

  });

  //RAYMARCHING
  //https://stemkoski.github.io/Three.js/Mouse-Over.html
  //https://github.com/mrdoob/three.js/issues/5587
  //http://stackoverflow.com/questions/20361776/orthographic-camera-and-pickingray

  //create ray with origin at the mouse position, direction as camera direction
  var vector = new THREE.Vector3(mouse.x, mouse.y, -1); //z = -1 IMPORTANT!
  vector.unproject(framework.camera);
  var direction = new THREE.Vector3(0, 0, -1).transformDirection(framework.camera.matrixWorld);
  var raycaster = new THREE.Raycaster();
  raycaster.set(vector, direction);

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects(framework.scene.children);

  if (intersects.length > 0)
  {
    //if the closest object isectObj is not the currently stored intersection object
    if (intersects[0].object != isectObj) 
    {
      //restore previous intersection object (if it exists) to its original color
      if (isectObj) {
        isectObj.material = isectPrevMaterial;
      }
      //store reference to closest object as current intersection object
      isectObj = intersects[0].object;
      //store color of closest object (for later restoration)
      isectPrevMaterial = isectObj.material;
      //set a new color for closest object
      isectObj.material = new THREE.MeshLambertMaterial({color: 0xffffff});
      
    }
  } 
  else
  {
    //restore previous intersection object (if it exists) to its original color
    if (isectObj)  {
      isectObj.material = isectPrevMaterial;
    }
    //remove previous intersection object reference
    //by setting current intersection object to "nothing"
    isectObj = null;
  }
    
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
