
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework';


// var declared so in working material can make the object fluctuate depending on the ticked time
//    note: updated in the on Update method

/*********************/
/* OBJECTS FOR SCENE */
/*********************/

var scenePlane;
var planeTop;
var planeBottom; 
var mesh1;
var mesh2;

var planeMatOne;
var planeMatTwo;

var ballBrightBlue;
var ballBright;

var icosahedron = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron0 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron1 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron2 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron3 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron4 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron5 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron6 = new THREE.IcosahedronGeometry(0.5, 5);
var icosahedron7 = new THREE.IcosahedronGeometry(0.5, 5);

var planeDim = 20;

var visElements = {
  volume: 2,
  loop: false,
  sound: null,
  play: true,
  materialOne: planeMatOne,
  materialTwo: planeMatTwo
}

/******************/
/* Helper Methods */
/******************/
function loadMusic()
{  
  var listener = new THREE.AudioListener();
  visElements.sound = new THREE.Audio(listener);

  var audioLoader = new THREE.AudioLoader();

  //Load a sound and set it as the Audio object's buffer
  audioLoader.load('./music/MapleStory_Ellinia.mp3', function( buffer ) {
      visElements.sound.setBuffer( buffer );
      visElements.sound.setLoop(visElements.loop);
      visElements.sound.setVolume(visElements.volume);
      visElements.sound.play();
  });
}

function createMaterials() {
  planeMatOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./images/simpleOne.jpg')
      }
    },
    vertexShader: require('./shaders/workingRef-vert.glsl'),
    fragmentShader: require('./shaders/workingRef-frag.glsl')
  });
  planeMatTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./images/simpleTwo.jpg')
      }
    },
    vertexShader: require('./shaders/workingRef-vert.glsl'),
    fragmentShader: require('./shaders/workingRef-frag.glsl')
  });

  ballBrightBlue = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./images/simpleTwo.jpg')
      }
    },
    vertexShader: require('./shaders/ball-vert.glsl'),
    fragmentShader: require('./shaders/ball-frag.glsl')
  });

  ballBright = new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                type: "t", 
                value: null
            },
            u_useTexture: {
                type: 'i',
                value: true
            },
            u_albedo: {
                type: 'v3',
                value: new THREE.Color(new THREE.Vector3(0,0,1))
            },
            u_ambient: {
                type: 'v3',
                value: new THREE.Color('#111111')
            },
            u_lightPos: {
                type: 'v3',
                value: new THREE.Vector3(30, 50, 40)
            },
            u_lightCol: {
                type: 'v3',
                value: new THREE.Color(new THREE.Vector3(1,1,0))
            },
            u_lightIntensity: {
                type: 'f',
                value: 1.5
            }
        },
        vertexShader: require('./shaders/lambert-vert.glsl'),
        fragmentShader: require('./shaders/iridescence-frag.glsl')
    });
  ballBright.transparent = true;
  planeMatTwo.transparent = true;
  planeMatOne.transparent = true;

}

function createMesh() {
// initialize a simple plane with adam's face as material
  planeTop = new THREE.PlaneGeometry(planeDim, planeDim, planeDim, planeDim);
  planeBottom = new THREE.PlaneGeometry(planeDim, planeDim, planeDim, planeDim);
  // make appear double sided
  planeBottom.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI ) );
  planeTop.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI ));

  planeBottom.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI/2.0) );
  planeTop.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI/2.0 ));

  mesh1 = new THREE.Mesh(planeTop, planeMatOne);
  mesh2 = new THREE.Mesh(planeBottom, planeMatTwo);
  scenePlane = new THREE.Object3D();
  //putting the planes together into one object
  scenePlane.add(mesh1);
  scenePlane.add(mesh2);
  
  // make plane horizontal
  scenePlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
}

/***********/
/* ON LOAD */
/***********/
// called after the scene loads
function onLoad(framework) {

  var {scene, camera, renderer, gui, stats} = framework; 

  // set skybox
  var loader = new THREE.CubeTextureLoader();
  var urlPrefix = './images/skymap/';
  var skymap = new THREE.CubeTextureLoader().load([
      urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
      urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
      urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  ] );
  scene.background = skymap;
  
  /*****************************/
  /* PUTTING MATERIALS ON OBJS */
  /*****************************/

  createMaterials();

  var centerSphere = new THREE.Mesh(icosahedron, ballBright);
  var sphere0 = new THREE.Mesh(icosahedron0, ballBright);
  var sphere1 = new THREE.Mesh(icosahedron1, ballBright);
  var sphere2 = new THREE.Mesh(icosahedron2, ballBright);
  var sphere3 = new THREE.Mesh(icosahedron3, ballBright);
  var sphere4 = new THREE.Mesh(icosahedron4, ballBright);
  var sphere5 = new THREE.Mesh(icosahedron5, ballBright);
  var sphere6 = new THREE.Mesh(icosahedron6, ballBright);
  var sphere7 = new THREE.Mesh(icosahedron7, ballBright);

  var dim = 4;


  sphere0.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(0* 2*Math.PI/8.0), dim * Math.cos(0* 2*Math.PI/8.0) )   );
  sphere1.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(1* 2*Math.PI/8.0), dim * Math.cos(1* 2*Math.PI/8.0) )   );
  sphere2.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(2* 2*Math.PI/8.0), dim * Math.cos(2* 2*Math.PI/8.0) )   );
  sphere3.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(3* 2*Math.PI/8.0), dim * Math.cos(3* 2*Math.PI/8.0) )   );
  sphere4.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(4* 2*Math.PI/8.0), dim * Math.cos(4* 2*Math.PI/8.0) )   );
  sphere5.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(5* 2*Math.PI/8.0), dim * Math.cos(5* 2*Math.PI/8.0) )   );
  sphere6.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(6* 2*Math.PI/8.0), dim * Math.cos(6* 2*Math.PI/8.0) )   );
  sphere7.applyMatrix( new THREE.Matrix4().makeTranslation(0, dim * Math.sin(7* 2*Math.PI/8.0), dim * Math.cos(7* 2*Math.PI/8.0) )   );

  /************************************/
  /* SET UP CAMERA AND SCENE TOGETHER */
  /************************************/

  // set camera position
  camera.position.set(8, -7, -8);
  camera.lookAt(new THREE.Vector3(0,0,0));

  createMesh();
  scene.add(scenePlane);

  scene.add(centerSphere);
  scene.add(sphere0);
  scene.add(sphere1);
  scene.add(sphere2);
  scene.add(sphere3);
  scene.add(sphere4);
  scene.add(sphere5);
  scene.add(sphere6);
  scene.add(sphere7);

  /***********************/
  /* SET UP GUI ELEMENTS */
  /***********************/

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(visElements, 'volume', 0, 10).onChange(function(newVal) {
    visElements.sound.setVolume(visElements.volume);
  });

  gui.add(visElements, 'loop').onChange(function(newVal) {
    visElements.sound.setLoop(visElements.loop);
  });

  gui.add(visElements, 'play').onChange(function(newVal) {
    if (visElements.play && !visElements.sound.isPlaying) {
      // play
      visElements.sound.play();
    } else if (!visElements.play && visElements.sound.isPlaying) {
      // pause
      visElements.sound.pause();
    }
    // otherwise do nothing
  });

  // start music
  loadMusic();
  
}

/*************/
/* ON UPDATE */
/*************/
// called on frame updates
function onUpdate(framework) {


}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);