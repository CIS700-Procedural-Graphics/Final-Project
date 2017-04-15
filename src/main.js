
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {linkedListToString} from './grid.js'
import Turtle from './cube.js'

var turtle;

var Sliders = function() {
  this.anglefactor = 1.0;
};
var sliders = new Sliders();

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
      new THREE.MeshBasicMaterial({color:0xf21d12, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({color:0xff9933, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:0xf2cc2f, transparent:true, opacity:0.8, side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({color:0xa2e66c, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:0x74abdc, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
      new THREE.MeshBasicMaterial({color:0xed1e80, transparent:true, opacity:0.8, side: THREE.DoubleSide}), 
  ]; 
  // Create a MeshFaceMaterial, which allows the cube to have different materials on each face 
  var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials); 
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.y += 1;
  scene.add( cube );

  // PLANE
  var gridDimension = 14;
  var cellDimension = 2;
  for (var x = -gridDimension/2.0; x < gridDimension/2.0; x += cellDimension) {
    for (var z = -gridDimension/2.0; z < gridDimension/2.0; z += cellDimension) {
      var planeGeometry = new THREE.PlaneGeometry( cellDimension, cellDimension, 1, 1);
      //var planeMaterial = new THREE.MeshLambertMaterial(cubeMaterials[Math.floor(Math.random()*6.0)]);
      var planeMaterial = new THREE.MeshLambertMaterial({color: cubeMaterials[Math.floor(Math.random()*6.0)].color, transparent:true, opacity:1.0, side: THREE.DoubleSide});
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

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
