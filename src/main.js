
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
var ac = new AudioContext()

// Colors
var additionalControls = {
	'Color' : [255, 255, 255],
	'scale' : 1.,
	'music' : true,
	'inv persistence' : 2.,
	'radius' : 0.7,
	'detail' : 6.
};

// Local global to allow for modifying variables
var noiseCloud = {
	mesh : {},
};

var t = Date.now();

// called after the scene loads
function onLoad(framework) {
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

	gui.add(additionalControls, 'inv persistence', 1., 10.).onChange(function(newVal) {
		noiseCloud.mesh.material.uniforms.inv_persistence.value = newVal;
	});

	gui.add(additionalControls, 'music').onChange(function(newVal) {
		additionalControls.music = newVal;
	});

	// Color menu
	gui.addColor(additionalControls, 'Color').onChange(function(newVal) {
		noiseCloud.mesh.material.uniforms.colorMult.value = new THREE.Vector3(newVal[0]/255, newVal[1]/255, newVal[2]/255,);
	});

}

// called on frame updates
function onUpdate(framework) {
	var newTime = Date.now();
	var instrumentName = "acoustic_grand_piano";
	if (newTime - t > 1500) {
		// MIDI.loadPlugin({
		// 	soundfontUrl: "./soundfont/",
		// 	instrument: instrumentName,
		// 	onprogress: function(state, progress) {
		// 		console.log(state, progress);
		// 	},
		// 	onsuccess: function() {
		// 		MIDI.programChange(0, MIDI.GM.byName[instrumentName].number); 

		// 		var delay = 0; // play one note every quarter second
		// 		var note = 50; // the MIDI note
		// 		var velocity = 127; // how hard the note hits
		// 		// play the note
		// 		MIDI.setVolume(0, 127);
		// 		MIDI.noteOn(0, note, velocity, delay);
		// 		MIDI.noteOn(0, note + 2, velocity, delay);
		// 		MIDI.noteOn(0, note + 5, velocity, delay);
		// 		// MIDI.noteOff(0, note, delay + 0.75);
		// 	}
		// });
		Soundfont.instrument(ac, 'marimba', { soundfont: 'MusyngKite' }).then(function (marimba) {
		  marimba.play('C4')
		})
		Soundfont.instrument(ac, 'clarinet', { soundfont: 'MusyngKite' }).then(function (marimba) {
		  marimba.play('D4')
		})
		t = newTime;
	}

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);