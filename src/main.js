const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const tonal = require('tonal')
const MeshLine = require( 'three.meshline' );

// Audio
import Framework from './framework'
import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
import {euclid} from './utils/euclid.js'
import {beatGenerator, 
		MorseThue, 
		melodyGenerator, 
		rhythmicMelodyGenerator, 
		EarthWorm,
		noteBeats} from './utils/musicGenerator.js'

import {patternedMelody,
		createMainTheme} from './utils/musicMotifs.js'

// Visual
import Scene1 from './scene1'
import Scene2 from './scene2'
var Visual = Scene1;

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

var testInstrument = Soundfont.instrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite', gain: 0.6 });//
var melodyInstr = Soundfont.instrument(ac, 'cello', { soundfont: 'MusyngKite', adsr: [0.3,0.5,0.2,0.8], gain: 3 });
var baseInstr = Soundfont.instrument(ac, 'acoustic_bass', { soundfont: 'MusyngKite', gain: 0.8 });

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

  Visual.initScene(framework, visualConfig);

  initInputHandler(framework);

  visualConfig.startTime = clock.getElapsedTime();
	visualConfig.prevTime = clock.getElapsedTime();
}

var music = [];
var beats = [];
var now = Date.now();
var indices = [0,0,0,0,0];
var time = [now,now,now,now,now];
var bpm = [1/4, 1, 1/4, 2, 1/4];
var melIdx = 4;

// called on frame updates
function onUpdate(framework) {
	if (update) {
		music.push(patternedMelody(EarthWorm(343, 13, 4, 100, 240)));
		music.push(rhythmicMelodyGenerator(100, euclid(5,8), 60, additionalControls.base, additionalControls.multi));
		music.push(noteBeats(euclid(5,8), 'A3', 100));
		music.push(beatGenerator(euclid(4,8), 180, 400, 'C4'))
		music.push(createMainTheme('C4'))

		beats.push(beatGenerator(euclid(2,8), 180, 400, 'F3'));
		beats.push(beatGenerator(euclid(9,12), 120, 400, 'C4'));
		beats.push(beatGenerator(euclid(7,15), 180, 400, 'D2'));

		console.log('Music 2:')
		console.log(music[melIdx])
		update = false;
	}

	var nTime = Date.now();


	var deltaT = (nTime - time[0]) / 1000;
	if (deltaT > music[3][1][indices[0]] * bpm[0] && indices[0] < music[3][0].length) {

		testInstrument.then(function(piano) {
			if (music[3][0][indices[0]] > 0) {
				// piano.play(music[3][0][indices[0]]).stop(ac.currentTime + music[3][1][indices[0]] * bpm[0]);
			}
		})

		indices[0]++;
		time[0] = nTime;
	}

	deltaT = (nTime - time[1]) / 1000;
	if (deltaT > music[melIdx][1][indices[1]] * bpm[1] && indices[1] < music[melIdx][0].length) {

		melodyInstr.then(function(melIn) {
			if (music[melIdx][0][indices[1]] > 0) {
				melIn.play(music[melIdx][0][indices[1]]).stop(ac.currentTime + music[melIdx][1][indices[1]] * bpm[1]);
			}
			
		})
		indices[1]++;
		time[1] = nTime;
	}

	deltaT = (nTime - time[2]) / 1000;
	if (deltaT > beats[0][1][indices[2]] * bpm[2] && indices[2] < beats[0][0].length) {

		baseInstr.then(function (baseIn) {
			if (beats[0][0][indices[2]] > 0) {
				baseIn.start(beats[0][0][indices[2]], ac.currentTime, {gain: 0.5});
			}
		})
		indices[2]++;
		time[2] = nTime;
	}

	deltaT = (nTime - time[3]) / 1000;
	if (deltaT > beats[1][1][indices[3]] * bpm[3] && indices[3] < beats[1][0].length) {

		baseInstr.then(function (baseIn) {
			if (beats[1][0][indices[3]] > 0) {
				baseIn.start(beats[1][0][indices[3]], ac.currentTime, {gain: 1});
			}
		})
		indices[3]++;
		time[3] = nTime;
	}

	deltaT = (nTime - time[4]) / 1000;
	if (deltaT > beats[2][1][indices[4]] * bpm[4] && indices[4] < beats[2][0].length) {

		baseInstr.then(function (baseIn) {
			if (beats[2][0][indices[4]] > 0)
				baseIn.start(beats[2][0][indices[4]], ac.currentTime, {gain: 1});
		})
		indices[4]++;
		time[4] = nTime;
	}


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
		visualConfig.camera.acc = new THREE.Vector3( 0,0,0 );
		Visual.cleanupScene(scene);
		Visual = Scene2;
		Visual.initScene(framework, visualConfig);
	}
	camera.position.set( visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z );
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
