
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Grid, {GridCell} from './grid.js'
import Player from './player.js'

var atMenu = true;
var menuMesh;
var atGameOver = false;
var gameOverMesh;

var finishCube;
var player, playerPromise;
var grid, gridDimension = 4.0;
var allMeshes = new Set();
var throughputFactor = 0.9;

//falling animation
var prevCell;
var fallingMeshes = new Set();
class FallingMesh {
    constructor(cell) {
      this.cell = cell;
      this.velocity = 0.0;
      this.accel = -0.01;
    }
}

//raymarching
var mouse = {x: -1, y: 1}; //set the mouse at the top left corner of screen or else buggy when loading
var isectObj = null; //the object in the scene currently closest to the camera 
var isectPrevMaterial;
var moved = false;

//sound
var listener = new THREE.AudioListener();
var audioLoader = new THREE.AudioLoader();
var backgroundMusic = new THREE.Audio(listener);
var thudSound = new THREE.Audio(listener);


//http://www.iquilezles.org/www/articles/palettes/palettes.htm
//http://dev.thi.ng/gradients/
function palette(colors) {
  var a, b, c, d;
  a = new THREE.Vector3(0.55+Math.random()*0.1, 0.25+Math.random()*0.05, 0.1+Math.random()*0.05); //RED >> GREEN >> BLUE
  b = new THREE.Vector3(0.3, 0.25, 0.05); //everything remains same
  c = new THREE.Vector3(0.5, 0.5, 0.5); //frequency remains same
  d = new THREE.Vector3(-0.05+Math.random()*0.1, 0.0, 0.0); //shift red phase a little away from green to make yellow

  /*
  a = new THREE.Vector3(0.5, 0.5, 0.5);
  b = new THREE.Vector3(0.3, 0.3, 0.3);
  c = new THREE.Vector3(1.0, 1.0, 1.0);
  d = new THREE.Vector3(0.0, 0.1, 0.2);
  */

  for (var t = 0; t <= 1.0; t += 0.2) {
    colors.push(new THREE.Color(
    a.x + b.x*Math.cos( 6.28318*(c.x*t+d.x) ), 
    a.y + b.y*Math.cos( 6.28318*(c.y*t+d.y) ), 
    a.z + b.z*Math.cos( 6.28318*(c.z*t+d.z) )).offsetHSL(0, -0.2, 0));
  }
  
}


// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
  var controls = framework.controls;

  //https://threejs.org/examples/?q=out#webgl_postprocessing_outline
  //prevents click from counting as a move when user is rotating camera
  controls.addEventListener( 'change', function() { moved = true; } );
  document.addEventListener( 'mousedown', function () { moved = false; }, false );
  document.addEventListener( 'mouseup', function() {
    if (atMenu) removeMenu(framework);
    if (atGameOver) removeGameOver(framework);
    if(!moved) checkClick(framework);
    moved = false;
  });

  // when the mouse moves, call the given function
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //FINISH CUBE
  var finishCubeMaterials = [ 
      new THREE.MeshBasicMaterial({color: 0xee6b5e}),
      new THREE.MeshBasicMaterial({color: 0xee6b5e}), 
      new THREE.MeshBasicMaterial({color: 0xfaee9e}),
      new THREE.MeshBasicMaterial({color: 0xfaee9e}), 
      new THREE.MeshBasicMaterial({color: 0xfaaf5b}), 
      new THREE.MeshBasicMaterial({color: 0xfaaf5b}) 
  ]; 
  var finishCubeMaterial = new THREE.MeshFaceMaterial(finishCubeMaterials);
  finishCube = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), finishCubeMaterial);
  finishCube.position.x = 0.5;
  finishCube.position.y = 0.5;
  finishCube.position.z = 0.5;
  finishCube.scale.x = 0.25;
  finishCube.scale.y = 0.25;
  finishCube.scale.z = 0.25;
  framework.scene.add(finishCube);

  //sets up menu and grid and player
  addMenu(framework);

  // global ambient audio
  audioLoader.load( './sounds/ambient.mp3', function( buffer ) {
    backgroundMusic.setBuffer( buffer );
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(1.0);
    backgroundMusic.play();
  });

  audioLoader.load( './sounds/book.mp3', function( buffer ) {
    thudSound.setBuffer( buffer );
    thudSound.setVolume(1.0);
  });
}


function addMenu(framework) {

  //SETUP MENU
  atMenu = true;
  var menuGeometry = new THREE.PlaneGeometry( 7, 7, 1, 1);;
  menuGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -5 ) );
  var menuMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('images/menu.png'), transparent: true});
  menuMesh = new THREE.Mesh( menuGeometry, menuMaterial );
  framework.camera.add(menuMesh);
  framework.scene.add(framework.camera);
  framework.controls.autoRotate = true;
  framework.controls.autoRotateSpeed = 2.0;

  //sets up grid and player
  nextLevel(framework);

  //set PERSPECTIVE CAMERA for SPECIAL menu angle specifically
  //use 30 60 90 rule so that camera is 30 degree inclination
  var distFromCenter = Math.max(1.4*gridDimension, 8.4);
  var height = distFromCenter * 0.866025;
  var translation = distFromCenter * 0.5;
  framework.camera.position.set(gridDimension/2.0 - translation, height, gridDimension/2.0 + translation);
  framework.camera.lookAt(new THREE.Vector3(gridDimension/2.0, 0.0, gridDimension/2.0));
  framework.controls.target.set(gridDimension/2.0, 0.0, gridDimension/2.0);
  framework.camera.zoom = 1.0;
  framework.camera.updateProjectionMatrix(); //must be called after updating camera parameters
}

function removeMenu(framework) {
  framework.controls.autoRotate = false;
  framework.camera.remove(menuMesh);
  atMenu = false;
}

function addGameOver(framework) {

  //SETUP GAME OVER
  var gameOverGeometry = new THREE.PlaneGeometry( 7, 7, 1, 1);;
  gameOverGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -5 ) );
  var gameOverMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('images/gameover.png'), transparent: true});
  gameOverMesh = new THREE.Mesh( gameOverGeometry, gameOverMaterial );

  gridDimension = 4.0;
  atGameOver = true;
  framework.camera.add(gameOverMesh);
  framework.scene.add(framework.camera);
  //controls.autoRotate = true;
  //controls.autoRotateSpeed = 2.0;
}

function removeGameOver(framework) {
  framework.camera.remove(gameOverMesh);
  atGameOver = false;
  addMenu(framework);
}

function nextLevel(framework) {

  //increase grid size for next level
  //MUST TO THIS AT THE BEGINNING AND NOT END OF nextLevel, 
  //key press event uses gridDimension for checks
  gridDimension++;
  throughputFactor = Math.max(throughputFactor - 0.1, 0.4);

  //disposes all meshses in scene
  for (var mesh of allMeshes) {
      //mesh.material.dispose();
      //mesh.geometry.dispose();
      framework.scene.remove(mesh);
      //framework.renderer.deallocateObject( mesh );
  }

  isectObj = null; //the object in the scene currently closest to the camera 
  isectPrevMaterial = null;
  moved = false;

  /*
  //set ORTHOGRAPHIC CAMERA
  //1.5 is a rough estimate of root(2), moves camera 45 degrees above horizon line for isometric view
  framework.camera.position.set(gridDimension/2.0+2.0*gridDimension, 1.41421*gridDimension, gridDimension/2.0+2.0*gridDimension);
  framework.camera.lookAt(new THREE.Vector3(gridDimension/2.0, 0.0, gridDimension/2.0));
  framework.controls.target.set(gridDimension/2.0, 0.0, gridDimension/2.0);
  framework.camera.zoom = 400/gridDimension;
  framework.camera.updateProjectionMatrix(); //must be called after updating camera parameters
  */
  
  //set PERSPECTIVE CAMERA
  //use 30 60 90 rule so that camera is 30 degree inclination
  var distFromCenter = Math.max(1.1*gridDimension, 7.7);
  var height = distFromCenter * 0.5;
  var translation = distFromCenter * 0.866025;
  framework.camera.position.set(gridDimension/2.0 - translation, height, gridDimension/2.0 + translation);
  framework.camera.lookAt(new THREE.Vector3(gridDimension/2.0, 0.0, gridDimension/2.0));
  framework.controls.target.set(gridDimension/2.0, 0.0, gridDimension/2.0);
  framework.camera.zoom = 1.0;
  framework.camera.updateProjectionMatrix(); //must be called after updating camera parameters

  //procedurally pick a color pallette
  var colorOption = Math.floor(Math.random()*3.0);
  var colors = [];
  palette(colors);

  //GRID AND LEVEL GENERATION
  grid = new Grid(framework.scene, gridDimension, new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors, throughputFactor);
  //add planes to scene
  for (var x = 0.0; x < gridDimension; x += 1) {
    for (var z = 0.0; z < gridDimension; z += 1) {

      var cellMaterials = [ 
          new THREE.MeshBasicMaterial({color: 0x606060}),
          new THREE.MeshBasicMaterial({color: 0x606060}), 
          new THREE.MeshBasicMaterial({color: grid.gridArray[x][z].color}),
          new THREE.MeshBasicMaterial({color: 0x383838}), 
          new THREE.MeshBasicMaterial({color: 0x808080}), 
          new THREE.MeshBasicMaterial({color: 0x808080}) 
      ]; 
      var cellMaterial = new THREE.MeshFaceMaterial(cellMaterials);
      var cell = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), cellMaterial);

      cell.position.x = x+0.5;
      cell.position.y = -0.5;
      cell.position.z = z+0.5;
      framework.scene.add(cell);
      allMeshes.add(cell);

      //for falling blocks animation
      if (x == gridDimension-1 && z == gridDimension-1) {
        prevCell = cell;
      }

    }
  }

  // PLAYER
  playerPromise = new Promise((resolve, reject) => { 
      player = new Player(new THREE.Vector3(gridDimension-1, 0, gridDimension-1), colors);
      if (player.position.x == gridDimension-1) {
          resolve();
      }
  }); 

  framework.scene.add(player.cube);
  allMeshes.add(player.cube);
}


function checkClick(framework) {

  if (player.isAnimating) {
    return;
  }

  //PERSPECTIVE CAMERA
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5); //z = 0.5 IMPORTANT!
  vector.unproject(framework.camera);
  var direction = new THREE.Vector3(0, 0, -1).transformDirection(framework.camera.matrixWorld);
  var raycaster = new THREE.Raycaster();
  raycaster.set( framework.camera.position, vector.sub( framework.camera.position ).normalize() );
  
  /*
  //ORTHOGRAPHIC CAMERA
  var vector = new THREE.Vector3(mouse.x, mouse.y, -1); //z = -1 IMPORTANT!
  vector.unproject(framework.camera);
  var direction = new THREE.Vector3(0, 0, -1).transformDirection(framework.camera.matrixWorld);
  var raycaster = new THREE.Raycaster();
  raycaster.set(vector, direction);
  */

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects(framework.scene.children);

  if (intersects.length > 0 && intersects[0].object != player.cube && intersects[0].object != finishCube)
  {
    isectObj = intersects[0].object;
    if (isectObj.position.x == player.position.x+0.5-1 && isectObj.position.z == player.position.z+0.5 &&
      (player.position.x - 1 >= 0 && player.faceXNegative.equals(grid.gridArray[player.position.x - 1][player.position.z].color) ||
        intersects[0].object.geometry.type == "PlaneGeometry")) 
    {
      //equivalent to up arrow
      player.rotateZCounter();
      dropCellAnimation(prevCell, framework);
      prevCell = isectObj;
    }
    else if (isectObj.position.x == player.position.x+0.5+1 && isectObj.position.z == player.position.z+0.5 &&
      (player.position.x + 1 < gridDimension && player.faceXPositive.equals(grid.gridArray[player.position.x + 1][player.position.z].color) ||
        intersects[0].object.geometry.type == "PlaneGeometry")) {
      //equivalent to down arrow
      player.rotateZClockwise();
      dropCellAnimation(prevCell, framework);
      prevCell = isectObj;
    }
    else if (isectObj.position.x == player.position.x+0.5 && isectObj.position.z == player.position.z+0.5+1 && 
      (player.position.z + 1 < gridDimension && player.faceZPositive.equals(grid.gridArray[player.position.x][player.position.z + 1].color) ||
        intersects[0].object.geometry.type == "PlaneGeometry")) {
      //equivalent to left arrow
      player.rotateXCounter();
      dropCellAnimation(prevCell, framework);
      prevCell = isectObj;
    }
    else if (isectObj.position.x == player.position.x+0.5 && isectObj.position.z == player.position.z+0.5-1 &&
      (player.position.z - 1 >= 0 && player.faceZNegative.equals(grid.gridArray[player.position.x][player.position.z - 1].color) ||
      intersects[0].object.geometry.type == "PlaneGeometry")) {
      //equivalent to right arrow
      player.rotateXClockwise();
      dropCellAnimation(prevCell, framework);
      prevCell = isectObj;
    }
  } 

}

function dropCellAnimation(prevCell, framework) {
  var planeGeometry = new THREE.PlaneGeometry( 1, 1, 1, 1);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent:true, opacity:0.0});
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  var quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2.0);
  var mat4 = new THREE.Matrix4().makeRotationFromQuaternion(quat);
  mat4.premultiply(new THREE.Matrix4().makeTranslation(prevCell.position.x, 0, prevCell.position.z));
  plane.applyMatrix(mat4);
  framework.scene.add(plane);
  allMeshes.add(plane);

  grid.gridArray[prevCell.position.x-0.5][prevCell.position.z-0.5].hasFell = true;
  fallingMeshes.add(new FallingMesh(prevCell));
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

  if (atMenu) {
    framework.controls.update(); //update camera rotation
    return;
  }

  Promise.all([playerPromise]).then(values => { 

    //nextLevel the game
    if (player.position.x == 0 && player.position.z == 0)
      nextLevel(framework);

    if (player.isAnimating) {

      player.animate(grid);

      //if the player just finished animating, and it lands on a cell, play thud sound
      if (!player.isAnimating && !grid.gridArray[player.position.x][player.position.z].hasFell) {
        thudSound.play();
      }
      //if the player just finished, and it doesn't land on cell, make it fall
      else if (!player.isAnimating && grid.gridArray[player.position.x][player.position.z].hasFell){
        fallingMeshes.add(new FallingMesh(player.cube));
      }

      if (isectObj) {
        //need to repeatedly update cell selection
        isectObj.material = isectPrevMaterial;
        isectObj = null;
      }

    }

  });

  //moves all meshes falling in scene
  for (var fm of fallingMeshes) {
      fm.cell.position.y += fm.velocity;
      fm.velocity += fm.accel;
      //GAME OVER CASE
      if (!atGameOver && fm.cell === player.cube && fm.cell.position.y < -50) {
        addGameOver(framework);
      }
  }

  //if mouse is not dragging
  if (!moved) {

    //RAYMARCHING
    //https://stemkoski.github.io/Three.js/Mouse-Over.html
    //https://github.com/mrdoob/three.js/issues/5587
    //http://stackoverflow.com/questions/20361776/orthographic-camera-and-pickingray

    //PERSPECTIVE CAMERA
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5); //z = 0.5 IMPORTANT!
    vector.unproject(framework.camera);
    var direction = new THREE.Vector3(0, 0, -1).transformDirection(framework.camera.matrixWorld);
    var raycaster = new THREE.Raycaster();
    raycaster.set( framework.camera.position, vector.sub( framework.camera.position ).normalize() );

    /*
    //ORTHOGRAPHIC CAMERA
    var vector = new THREE.Vector3(mouse.x, mouse.y, -1); //z = -1 IMPORTANT!
    vector.unproject(framework.camera);
    var direction = new THREE.Vector3(0, 0, -1).transformDirection(framework.camera.matrixWorld);
    var raycaster = new THREE.Raycaster();
    raycaster.set(vector, direction);
    */

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = raycaster.intersectObjects(framework.scene.children);

    if (intersects.length > 0)
    {
      //if the closest object isectObj is not the currently stored intersection object
      if (intersects[0].object != player.cube && intersects[0].object != finishCube && intersects[0].object != isectObj) 
      {
        //restore previous intersection object (if it exists) to its original color
        if (isectObj) {
          isectObj.material = isectPrevMaterial;
        }
        //store reference to closest object as current intersection object
        isectObj = intersects[0].object;
        //store material of closest object (for later restoration)
        isectPrevMaterial = isectObj.material;

        var cellMaterial;
        if (isectObj.geometry.type == "PlaneGeometry") {
          cellMaterial = new THREE.MeshBasicMaterial({color: 0xA8A8A8});
        }
        else if ( (isectObj.position.x == player.position.x+0.5 && isectObj.position.z == player.position.z+0.5) ||
                  (isectObj.position.x == player.position.x+0.5-1 && isectObj.position.z == player.position.z+0.5 &&
                    player.position.x - 1 >= 0 && player.faceXNegative.equals(grid.gridArray[player.position.x - 1][player.position.z].color)) ||
                  (isectObj.position.x == player.position.x+0.5+1 && isectObj.position.z == player.position.z+0.5 &&
                    player.position.x + 1 < gridDimension && player.faceXPositive.equals(grid.gridArray[player.position.x + 1][player.position.z].color)) ||
                  (isectObj.position.x == player.position.x+0.5 && isectObj.position.z == player.position.z+0.5+1 && 
                    player.position.z + 1 < gridDimension && player.faceZPositive.equals(grid.gridArray[player.position.x][player.position.z + 1].color)) ||
                  (isectObj.position.x == player.position.x+0.5 && isectObj.position.z == player.position.z+0.5-1 &&
                    player.position.z - 1 >= 0 && player.faceZNegative.equals(grid.gridArray[player.position.x][player.position.z - 1].color)) ) {

          //set a new material for closest object
          var cellMaterials = [ 
              new THREE.MeshBasicMaterial({color: 0x606060}),
              new THREE.MeshBasicMaterial({color: 0x606060}), 
              new THREE.MeshBasicMaterial({color: 0xA8A8A8}),
              new THREE.MeshBasicMaterial({color: 0x383838}), 
              new THREE.MeshBasicMaterial({color: 0x808080}), 
              new THREE.MeshBasicMaterial({color: 0x808080}) 
          ]; 
          cellMaterial = new THREE.MeshFaceMaterial(cellMaterials);
        }
        else {
          //set a new material for closest object
          var cellMaterials = [ 
              new THREE.MeshBasicMaterial({color: 0x606060}),
              new THREE.MeshBasicMaterial({color: 0x606060}), 
              new THREE.MeshBasicMaterial({color: 0x383838}),
              new THREE.MeshBasicMaterial({color: 0x383838}), 
              new THREE.MeshBasicMaterial({color: 0x808080}), 
              new THREE.MeshBasicMaterial({color: 0x808080}) 
          ]; 
          cellMaterial = new THREE.MeshFaceMaterial(cellMaterials);
        }

        isectObj.material = cellMaterial;
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

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
