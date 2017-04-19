const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const tonal = require('tonal')
const MeshLine = require( 'three.meshline' );

// Audio
import Framework from './framework'
import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
import {euclid} from './utils/euclid.js'
import {beatGenerator, MorseThue, melodyGenerator, rhythmicMelodyGenerator, EarthWorm} from './utils/musicGenerator.js'
import Lsystem from './fractals/lsystem.js'

// Visual
import Visual from './visual'

/******************************************************************************/

	var clock = new THREE.Clock();
	var visualConfig = {
	  startTime: 0,
	  prevTime: 0,
	  camera: {
	    pos: new THREE.Vector3( 80,0,0 ),
	    vel: new THREE.Vector3( 0,0,0 ),
	    acc: new THREE.Vector3( 0,0,0 ),
	    look: new THREE.Vector3( 0,0,0 ),
	  },
	  sceneReady: false,
	};

	function initInputHandler(framework) {
	  document.onkeydown = function(e) {
	    switch (e.keyCode) {
	        case 83:
	            //alert('s');
	  					earthVel = -10;
	            break;
	        case 68:
	  					var stars = framework.scene.getObjectByName("small_star_cloud");
	  					if (stars !== undefined) {
	  						stars.visible = !stars.visible;
	  					}
	            break;
	        case 70:
	  					var stars = framework.scene.getObjectByName("large_star_cloud");
	  					if (stars !== undefined) {
	  						stars.visible = !stars.visible;
	  					}
	            break;
	        case 74:
	            alert('j');
	            break;
	  			case 75:
	            alert('k');
	            break;
	  			case 76:
	            alert('l');
	            break;
	        case 32:
	            visualConfig.camera.acc = new THREE.Vector3( -5,0,0 );
	            break;
	    }
	  }
	}


/******************************************************************************/

var ac = new AudioContext()

// parameters
var additionalControls = {
	'base' : 11,
	'multi' : 13
};

// update flag
var update = true;

// Local global to allow for modifying variables
var noiseCloud = {
	mesh : {},
};

var testInstrument = Soundfont.instrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite', gain: 1.0 });//
var instrument2 = Soundfont.instrument(ac, 'pad_3_polysynth', { soundfont: 'MusyngKite', adsr: [0,0,0,0], gain: 0.5 });
var synthDrums = Soundfont.instrument(ac, 'synth_drum', { soundfont: 'MusyngKite', gain: 1.0 });

function rate_limit(func) {
    var running = false;
    var next = undefined;

    function onDone() {
        running = false; // set the flag to allow the function to be called again
        if (typeof next !== 'undefined') {
            callFunc(next); // call the function again with the queued args
        }
    }

    function callFunc(args) {
        if (running) {
            // if the function is already running, remember the arguments passed in so we can call the func with them after we're ready
            next = args;
        } else {
            running = true; // prevent other function calls from running until we're done
            next = undefined;
            func.apply(func, args); // call the func with the arguments
        }
    }

    // return a new function wrapping the function we want to rate limit
    return function() {
        // we use the same arguments but add the onDone callback as the last argument
        var args = new Array(arguments.length + 1);
        for (var i = 0; i < arguments.length; ++i) {
            args[i] = arguments[i];
        }
        args[arguments.length] = onDone;
        callFunc(args);
    }
}

// called after the scene loads
function onLoad(framework) {

	var scene = framework.scene;
	var camera = framework.camera;
	var renderer = framework.renderer;
	var gui = framework.gui;
	var stats = framework.stats;

	// edit params and listen to changes like this
	// more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
	gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
		camera.updateProjectionMatrix();
	});

	gui.add(additionalControls, 'base', 1, 20).onChange(rate_limit(function(newVal, done) {
		additionalControls['base'] = Math.round(newVal);
		update = true;
	}));

	gui.add(additionalControls, 'multi', 1, 20).onChange(rate_limit(function(newVal, done) {
		additionalControls['multi'] = Math.round(newVal);
		update = true;
	}));

	// Visual
	camera.position.set(50, 0, 0);
	camera.lookAt(new THREE.Vector3(0,0,0));
	scene.background = new THREE.Color( 0xffffff );

  Visual.initScene(scene, visualConfig);

  initInputHandler(framework);

  visualConfig.startTime = clock.getElapsedTime();
	visualConfig.prevTime = clock.getElapsedTime();
}

var music = [];
var beats = [];
var time = Date.now();

// called on frame updates
function onUpdate(framework) {
	if (update) {
		// var music = melodyGenerator(100, 120,  2, 3);
		music.push(EarthWorm(343, 13, 4, 140, 240));
		music.push(rhythmicMelodyGenerator(40, euclid(5,8), 60, additionalControls.base, additionalControls.multi));
		// var rMusic2 = rhythmicMelodyGenerator(200, euclid(6,8), 240, additionalControls.base + 3, additionalControls.multi + 4);
		beats.push(beatGenerator(euclid(5,7), 180, 100));
		beats.push(beatGenerator(euclid(3,7), 120, 70, 'C4'));
		beats.push(beatGenerator(euclid(6,9), 180, 100, 'G2'));

		// console.log(euclid(5,7))

		testInstrument.then(function (marimba) {
			marimba.stop();
			marimba.schedule(ac.currentTime, music[1][0]);
		})

		synthDrums.then(function (marimba) {
			marimba.stop();
			marimba.schedule(ac.currentTime, beats[0]);
			marimba.schedule(ac.currentTime, beats[1]);
			// marimba.schedule(ac.currentTime, beat3);
		})

		instrument2.then(function (marimba) {
			marimba.stop();
			// console.log(music2)
			marimba.schedule(ac.currentTime, music[0]);
		})

		update = false;
	}

	var nTime = Date.now();
	var indices = [0,0,0,0,0];
	var times = [1/240, 1/60, 1/180, 1/120, 1/180];
	var deltaT = (nTime - time) / 1000;

	// Visual
	var camera = framework.camera;
	var scene = framework.scene;

	var delta = visualConfig.prevTime - clock.getElapsedTime();
	visualConfig.prevTime = clock.getElapsedTime();


	Visual.updateScene(scene, visualConfig, delta);

	visualConfig.camera.vel = visualConfig.camera.vel.clone().add(visualConfig.camera.acc.clone().multiplyScalar(delta));
	visualConfig.camera.pos = visualConfig.camera.pos.clone().add(visualConfig.camera.vel.clone().multiplyScalar(delta));
	if (Visual.changeTrigger(visualConfig)) {
		visualConfig.camera.vel = new THREE.Vector3( 0,0,0 );
		visualConfig.camera.pos = new THREE.Vector3( 0,0,0 );
		Visual.cleanupScene(scene);
	}
	camera.position.set( visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z );
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
