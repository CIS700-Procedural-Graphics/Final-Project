
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework';

// var declared so in working material can make the object fluctuate depending on the ticked time
//    note: updated in the on Update method

/*********************/
/* OBJECTS FOR SCENE */
/*********************/

var icosahedron = new THREE.IcosahedronGeometry(1, 5); //THREE.IcosahedronBufferGeometry(1, 0); //-HB

var visElements = {
  volume: 0,
  loop: false,
  sound: null,
  play: true
}

/*********************/
/* To Load the Music */
/*********************/
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

/*************/
/* MATERIALS */
/*************/

var adamMaterial = new THREE.ShaderMaterial({
  uniforms: {
    image: { // Check the Three.JS documentation for the different allowed types and values
      type: "t", 
      value: THREE.ImageUtils.loadTexture('./images/adam.jpg')
    }
  },
  vertexShader: require('./shaders/workingRef-vert.glsl'),
  fragmentShader: require('./shaders/workingRef-frag.glsl')
});

/***********/
/* ON LOAD */
/***********/
// called after the scene loads
function onLoad(framework) {

  var {scene, camera, renderer, gui, stats} = framework; 
  
  /*****************************/
  /* PUTTING MATERIALS ON OBJS */
  /*****************************/

  var workingSphere = new THREE.Mesh(icosahedron, adamMaterial);

  /************************************/
  /* SET UP CAMERA AND SCENE TOGETHER */
  /************************************/

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(workingSphere);

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