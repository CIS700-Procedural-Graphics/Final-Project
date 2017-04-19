
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Grid from './grid.js'
import Player from './player.js'

var player;

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

  
  // CUBE
  var cubeGeometry = new THREE.CubeGeometry(2,2,2);
  var cubeMaterials = [ 
      new THREE.MeshBasicMaterial({color:palette(0.0), transparent:true, opacity:0.8, side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({color:palette(0.167), transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:palette(0.333), transparent:true, opacity:0.8, side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({color:palette(0.5), transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:palette(0.666), transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:palette(0.833), transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
  ]; 
  // Create a MeshFaceMaterial, which allows the cube to have different materials on each face 
  //var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials); 
  //var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  //cube.position.y += 1;
  //scene.add( cube );
  
  player = new Player(palette(0.0), palette(0.167), palette(0.333), palette(0.5), palette(0.666), palette(0.833), new THREE.Vector3(0.5, 0.5, 0.5));
  scene.add(player.cube);

  // PLANE
  var gridDimension = 6;
  var cellDimension = 1;
  for (var x = -gridDimension/2.0; x < gridDimension/2.0; x += cellDimension) {
    for (var z = -gridDimension/2.0; z < gridDimension/2.0; z += cellDimension) {
      var planeGeometry = new THREE.PlaneGeometry( cellDimension, cellDimension, 1, 1);
      //var planeMaterial = new THREE.MeshLambertMaterial(cubeMaterials[Math.floor(Math.random()*6.0)]);
      var planeMaterial = new THREE.MeshBasicMaterial({color: cubeMaterials[Math.floor(Math.random()*6.0)].color, transparent:true, opacity:1.0, side: THREE.DoubleSide});
      planeMaterial.opacity = 1.0;
      var plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.x = x+cellDimension/2.0;
      plane.position.z = z+cellDimension/2.0;
      plane.rotation.x = Math.PI/2.0;
      scene.add( plane );
    }
  }

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
        player.rotateZCounter();
    }
    else if (e.keyCode == '40') {
        // down arrow
        player.rotateZClockwise();
    }
    else if (e.keyCode == '37') {
       // left arrow
       player.rotateXCounter();
    }
    else if (e.keyCode == '39') {
       // right arrow
       player.rotateXClockwise();
    }
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
