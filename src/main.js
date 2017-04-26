
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Grid, {GridCell} from './grid.js'
import Player from './player.js'

var player;
var grid;
var gridDimension = 5.0;
var allMeshes = new Set();
var fw;

var Sliders = function() {
  this.anglefactor = 1.0;
};
var sliders = new Sliders();

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
        b = new THREE.Vector3(0.5, 0.5, 0.5);
        c = new THREE.Vector3(1.0, 1.0, 1.0);
        d = new THREE.Vector3(0.3, 0.2, 0.2);
        break;
    case 2:
        a = new THREE.Vector3(0.5, 0.5, 0.5);
        b = new THREE.Vector3(0.5, 0.5, 0.5);
        c = new THREE.Vector3(0.5, 0.5, 0.5);
        d = new THREE.Vector3(1.0, 1.0, 1.0);
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
  directionalLight.castShadow = true;
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
      cell.receiveShadow = true;
      framework.scene.add(cell);
      allMeshes.add(cell);

      /*
      var planeGeometry = new THREE.PlaneGeometry( 1, 1, 1, 1);
      var planeMaterial = new THREE.MeshLambertMaterial({color: grid.gridArray[x][z].color, 
        transparent:true, opacity:1.0, side: THREE.DoubleSide});
      var plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.x = x+0.5;
      plane.position.z = z+0.5;
      plane.rotation.x = Math.PI/2.0;
      plane.receiveShadow = true;
      framework.scene.add( plane );
      allMeshes.add(plane);
      */
    }
  }

  // PLAYER
  player = new Player(new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);
  player.cube.castShadow = true;
  framework.scene.add(player.cube);
  allMeshes.add(player.cube);

  //increase grid size for next level
  gridDimension++;
}

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
      // up arrow
      if (player.position.x - 1 >= 0 && player.faceXNegative.equals(grid.gridArray[player.position.x - 1][player.position.z].color)) {
        player.rotateZCounter();
        if (player.position.x == 0 && player.position.z == 0) {
          restart(fw);
        }
      }
    }
    else if (e.keyCode == '40') {
      // down arrow
      if (player.position.x + 1 < gridDimension && player.faceXPositive.equals(grid.gridArray[player.position.x + 1][player.position.z].color)) {
        player.rotateZClockwise();
        if (player.position.x == 0 && player.position.z == 0) {
          restart(fw);
        }
      }
    }
    else if (e.keyCode == '37') {
      // left arrow
      if (player.position.z + 1 < gridDimension && player.faceZPositive.equals(grid.gridArray[player.position.x][player.position.z + 1].color)) {
        player.rotateXCounter();
        if (player.position.x == 0 && player.position.z == 0) {
          restart(fw);
        }
      }
    }
    else if (e.keyCode == '39') {
       // right arrow
      if (player.position.z - 1 >= 0 && player.faceZNegative.equals(grid.gridArray[player.position.x][player.position.z - 1].color)) {
        player.rotateXClockwise();
        if (player.position.x == 0 && player.position.z == 0) {
          restart(fw);
        }
      }
    }

    //console.log(player.position);
}

// called on frame updates
function onUpdate(framework) {
    
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
