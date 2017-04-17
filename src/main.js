
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import MIDI from 'midi.js'
import Soundfont from 'soundfont-player'
import {euclid} from './utils/euclid.js'
import beatGenerator from './utils/musicGenerator.js'

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
	console.log(euclid(5,16));
	console.log(beatGenerator(euclid(5,16), 120))

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
	var NOTES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	var notes = NOTES.map(function (n, i) {
	  return { time: i * 0.3, note: n + 60 }
	})

	// console.log(notes);
	if (newTime - t > 3000) {

		Soundfont.instrument(ac, 'pad_6_metallic', { soundfont: 'MusyngKite' }).then(function (marimba) {
			marimba.schedule(ac.currentTime, beatGenerator(euclid(7,16), 120));
			// marimba.play('E4')
			// marimba.play('A3')
		 //  	Soundfont.instrument(ac, 'cello', { soundfont: 'MusyngKite' }).then(function (marimba) {
		 //  		marimba.schedule(ac.currentTime, notes);
			// })
		})

		t = newTime;
	}

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);