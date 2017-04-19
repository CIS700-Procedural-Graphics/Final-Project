
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const tonal = require('tonal')

import Framework from './framework'
import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
import {euclid} from './utils/euclid.js'
import {beatGenerator, MorseThue, melodyGenerator, rhythmicMelodyGenerator, EarthWorm} from './utils/musicGenerator.js'
import Lsystem from './fractals/lsystem.js'


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

var testInstrument = Soundfont.instrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite', gain: 1.25, adsr: [0.5, 0.8, 1, 0.7] });
var instrument2 = Soundfont.instrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite', gain: 1 });
var synthDrums = Soundfont.instrument(ac, 'synth_drum', { soundfont: 'MusyngKite', gain: 0.5 });

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
	// console.log(euclid(8,8));

	// var grammar = {};
	// grammar['0'] = {probability: 1.0, successorString: '01'};
	// grammar['1'] = {probability: 1.0, successorString: '10'};
	// var L = new Lsystem('0',grammar, 2);
	// console.log(L.doIterations(3));

	// var s = tonal.scale.get('major', 'C4');
	// console.log(s)
	// console.log(tonal.transpose('C2', 'P8'))
	// console.log(tonal.ivl.invert(['C4', 'E4']))
	// console.log(tonal.chord.names())

	var scene = framework.scene;
	var camera = framework.camera;
	var renderer = framework.renderer;
	var gui = framework.gui;
	var stats = framework.stats;

	// LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
	// var {scene, camera, renderer, gui, stats} = framework; 
 	var adamMaterial = new THREE.MeshBasicMaterial({ 
         color:0xFFFFFF, 
         side:THREE.DoubleSide 
     }); 

	var iso = new THREE.IcosahedronBufferGeometry(0.7, 6);
	noiseCloud.mesh = new THREE.Mesh(iso, adamMaterial);
	noiseCloud.mesh.name = "adamCube";

	// set camera position
	camera.position.set(1, 1, 6);
	camera.lookAt(new THREE.Vector3(0,0,0));

	scene.add(noiseCloud.mesh);


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
}

// called on frame updates
function onUpdate(framework) {
	if (update) {
		var music = melodyGenerator(100, 120, additionalControls.base, additionalControls.multi);
		var music2 = EarthWorm(345,17,5,100,120);
		var rMusic = rhythmicMelodyGenerator(100, euclid(3,8), 60, additionalControls.base, additionalControls.multi);
		var rMusic2 = rhythmicMelodyGenerator(200, euclid(6,8), 240, additionalControls.base + 3, additionalControls.multi + 4);
		var beat = beatGenerator(euclid(4,6), 120, 100);

		var t = 10;

		testInstrument.then(function (marimba) {
			marimba.stop();
			marimba.schedule(ac.currentTime, music[0]);

		})
		synthDrums.then(function (marimba) {
			marimba.stop();
			marimba.schedule(ac.currentTime, beat);
		})

		instrument2.then(function (marimba) {
			marimba.stop();
			marimba.schedule(ac.currentTime, music2);
		})

		update = false;
	}
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);