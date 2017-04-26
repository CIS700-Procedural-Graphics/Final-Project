
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE)
import Stats from 'stats-js'
import DAT from 'dat-gui'

//Sound Global Variables
var audio;
var analyser;
var frequencyData;

window.onload = function() {
  var ctx = new AudioContext();
   audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
   analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
   frequencyData = new Uint8Array(analyser.frequencyBinCount);
 
  // we're ready to receive some data!
  // loop
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     
  }
  //audio.play();
};

// when the scene is done initializing, the function passed as `callback` will be executed
// then, every frame, the function passed as `update` will be executed
function init(callback, update) {
  var stats = new Stats();
  stats.setMode(1);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  var gui = new DAT.GUI();

  var framework = {
    gui: gui,
    stats: stats
  };

  // run this function after the window loads
  window.addEventListener('load', function() {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xdeeff5, 1);//0x87cefa, deeff5

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 2.0;

      //light
//      var light = new THREE.AmbientLight( 0x909090 ); // soft white light
//      scene.add( light );
       // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);
      
    document.body.appendChild(renderer.domElement);

    // resize the canvas when the window changes
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // assign THREE.js objects to the object we will return
    framework.scene = scene;
    framework.camera = camera;
    framework.renderer = renderer;
      framework.audio = audio;
      
    // begin the animation loop
    (function tick() {
      stats.begin();
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData
     framework.frequencyData = frequencyData;
     
      
      update(framework); // perform any requested updates
      renderer.render(scene, camera); // render the scene
      stats.end();
      requestAnimationFrame(tick); // register to call this again when the browser renders a new frame
    })();

    // we will pass the scene, gui, renderer, camera, etc... to the callback function
    return callback(framework);
  });
}

export default {
  init: init
}

export const PI = 3.14159265
export const e = 2.7181718

