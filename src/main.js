
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Grid from './grid.js'
import Player from './player.js'

var player;
var grid;
var gridDimension = 9;

var Sliders = function() {
  this.anglefactor = 1.0;
};
var sliders = new Sliders();

function palette(t) {
  return new THREE.Color(
    0.5 + 0.3*Math.cos( 6.28318*(1.0*t+0.0) ), 
    0.5 + 0.3*Math.cos( 6.28318*(1.0*t+0.1) ), 
    0.5 + 0.3*Math.cos( 6.28318*(1.0*t+0.2) ));
}

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.set(0xffffff);
  //directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  var colors = [];
  colors.push(palette(0.0));
  colors.push(palette(0.167));
  colors.push(palette(0.333));
  colors.push(palette(0.5));
  colors.push(palette(0.666));
  colors.push(palette(0.833));
  //[ palette(0.0), palette(0.167), palette(0.333), palette(0.5), palette(0.666), palette(0.833) ];
  
  // GRID
  /*
  var gridDimension = 7;
  var cellDimension = 1;
  for (var x = 0.0; x < gridDimension; x += cellDimension) {
    for (var z = 0.0; z < gridDimension; z += cellDimension) {
      var planeGeometry = new THREE.PlaneGeometry( cellDimension, cellDimension, 1, 1);
      //var planeMaterial = new THREE.MeshLambertMaterial(cubeMaterials[Math.floor(Math.random()*6.0)]);
      var planeMaterial = new THREE.MeshBasicMaterial({color: colors[Math.floor(Math.random()*6.0)], transparent:true, opacity:1.0, side: THREE.DoubleSide});
      planeMaterial.opacity = 1.0;
      var plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.x = x+cellDimension/2.0;
      plane.position.z = z+cellDimension/2.0;
      plane.rotation.x = Math.PI/2.0;
      scene.add( plane );
    }
  }
  */

  grid = new Grid(scene, gridDimension, new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);

  // PLAYER
  player = new Player(new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);
  scene.add(player.cube);

  

  /*
  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);
  */

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

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
      // up arrow
      if (player.position.x - 1 >= 0) {
        player.rotateZCounter();
      }
    }
    else if (e.keyCode == '40') {
      // down arrow
      if (player.position.x + 1 < gridDimension) {
        player.rotateZClockwise();
      }
    }
    else if (e.keyCode == '37') {
      // left arrow
      if (player.position.z + 1 < gridDimension) {
        player.rotateXCounter();
      }
    }
    else if (e.keyCode == '39') {
       // right arrow
       if (player.position.z - 1 >= 0) {
         player.rotateXClockwise();
       }
    }
    //console.log(player.position);
}

/*
// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 2; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
}

function doLsystem(lsystem, iterations, turtle, anglefactor) {
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene, iterations, anglefactor);
    turtle.renderSymbols(result);
}
*/

// called on frame updates
function onUpdate(framework) {

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
