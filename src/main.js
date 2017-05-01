// const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const THREE = require('three')
const tonal = require('tonal')
const MeshLine = require( 'three.meshline' );

// Audio
import Framework from './framework'
import MusicBox from './musicBox.js'

import generateMelody from './music/melody.js'

// Visual
const EffectComposer = require('three-effectcomposer')(THREE);
import Scene1 from './scene1';
import Scene2 from './scene2';
import Scene3 from './scene3';
import Scene4 from './scene4';
var Visual = Scene4;



	THREE.DotScreenShader = {
	  uniforms: {
	    "tDiffuse": { type: "t", value: null },
	    "tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
	    "center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
	    "angle":    { type: "f", value: 1.57 },
	    "scale":    { type: "f", value: 1.0 }
	  },
	  vertexShader: [
	    "varying vec2 vUv;",
	    "void main() {",
	      "vUv = uv;",
	      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	    "}"
	  ].join("\n"),
	  fragmentShader: [
	    "uniform vec2 center;",
	    "uniform float angle;",
	    "uniform float scale;",
	    "uniform vec2 tSize;",
	    "uniform sampler2D tDiffuse;",
	    "varying vec2 vUv;",
	    "float pattern() {",
	      "float s = sin( angle ), c = cos( angle );",
	      "vec2 tex = vUv * tSize - center;",
	      "vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",
	      "return ( sin( point.x ) * sin( point.y ) ) * 4.0;",
	    "}",
	    "void main() {",
	      "vec4 color = texture2D( tDiffuse, vUv );",
	      "float average = ( color.r + color.g + color.b ) / 3.0;",
	      "gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",
	    "}"
	  ].join("\n")
	};

	THREE.RGBShiftShader = {
	  uniforms: {
	    "tDiffuse": { type: "t", value: null },
	    "amount":   { type: "f", value: 0.005 },
	    "angle":    { type: "f", value: 0.0 }
	  },
	  vertexShader: [
	    "varying vec2 vUv;",
	    "void main() {",
	      "vUv = uv;",
	      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	    "}"
	  ].join("\n"),
	  fragmentShader: [
	    "uniform sampler2D tDiffuse;",
	    "uniform float amount;",
	    "uniform float angle;",
	    "varying vec2 vUv;",
	    "void main() {",
	      "vec2 offset = amount * vec2( cos(angle), sin(angle));",
	      "vec4 cr = texture2D(tDiffuse, vUv + offset);",
	      "vec4 cga = texture2D(tDiffuse, vUv);",
	      "vec4 cb = texture2D(tDiffuse, vUv - offset);",
	      "gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
	    "}"
	  ].join("\n")
	};



/******************************************************************************/
var instrument = 26;
var instruments = [
  "accordion",
  "acoustic_bass",
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "acoustic_guitar_steel",
  "agogo",
  "alto_sax",
  "applause",
  "bag_pipe",
  "banjo",
  "baritone_sax",
  "bassoon",
  "bird_tweet",
  "blown_bottle",
  "brass_section",
  "breath_noise",
  "bright_acoustic_piano",
  "celesta",
  "cello",
  "choir_aahs",
  "church_organ",
  "clarinet",
  "clavichord",
  "contrabass",
  "distortion_guitar",
  "drawbar_organ",
  "dulcimer",
  "electric_bass_finger",
  "electric_bass_pick",
  "electric_grand_piano",
  "electric_guitar_clean",
  "electric_guitar_jazz",
  "electric_guitar_muted",
  "electric_piano_1",
  "electric_piano_2",
  "english_horn",
  "fiddle",
  "flute",
  "french_horn",
  "fretless_bass",
  "fx_1_rain",
  "fx_2_soundtrack",
  "fx_3_crystal",
  "fx_4_atmosphere",
  "fx_5_brightness",
  "fx_6_goblins",
  "fx_7_echoes",
  "fx_8_scifi",
  "glockenspiel",
  "guitar_fret_noise",
  "guitar_harmonics",
  "gunshot",
  "harmonica",
  "harpsichord",
  "helicopter",
  "honkytonk_piano",
  "kalimba",
  "koto",
  "lead_1_square",
  "lead_2_sawtooth",
  "lead_3_calliope",
  "lead_4_chiff",
  "lead_5_charang",
  "lead_6_voice",
  "lead_7_fifths",
  "lead_8_bass_lead",
  "marimba",
  "melodic_tom",
  "music_box",
  "muted_trumpet",
  "oboe",
  "ocarina",
  "orchestra_hit",
  "orchestral_harp",
  "overdriven_guitar",
  "pad_1_new_age",
  "pad_2_warm",
  "pad_3_polysynth",
  "pad_4_choir",
  "pad_5_bowed",
  "pad_6_metallic",
  "pad_7_halo",
  "pad_8_sweep",
  "pan_flute",
  "percussive_organ",
  "piccolo",
  "pizzicato_strings",
  "recorder",
  "reed_organ",
  "reverse_cymbal",
  "rock_organ",
  "seashore",
  "shakuhachi",
  "shamisen",
  "shanai",
  "sitar",
  "slap_bass_1",
  "slap_bass_2",
  "soprano_sax",
  "steel_drums",
  "string_ensemble_1",
  "string_ensemble_2",
  "synth_bass_1",
  "synth_bass_2",
  "synth_drum",
  "synth_voice",
  "synthbrass_1",
  "synthbrass_2",
  "synthstrings_1",
  "synthstrings_2",
  "taiko_drum",
  "tango_accordion",
  "telephone_ring",
  "tenor_sax",
  "timpani",
  "tinkle_bell",
  "tremolo_strings",
  "trombone",
  "trumpet",
  "tuba",
  "tubular_bells",
  "vibraphone",
  "viola",
  "violin",
  "voice_oohs",
  "whistle",
  "woodblock",
  "xylophone"
];


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


var composer;
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
	            // visualConfig.camera.acc = new THREE.Vector3( -5,0,0 );

							musicPlayer.setMelodicInstrument( instruments[instrument++], ac );
							musicPlayer.createMelodyLine();

							console.log(instrument-1)
							console.log(instruments[instrument-1])
	            break;
	    }
	  }
	}


/******************************************************************************/

// Audio vars
var ac = new AudioContext()

// parameters
var additionalControls = {
	'base' : 11,
	'multi' : 13
};

// update flag
var update = true;
var allInit = false;

// Create a music player object which handles all the behind the scenes work.
var musicPlayer = new MusicBox();


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

var mirrorCube, mirrorCubeCamera; // for mirror material

// called after the scene loads
function onLoad(framework) {

	var scene = framework.scene;
	var camera = framework.camera;
	var renderer = framework.renderer;
	var gui = framework.gui;
	var stats = framework.stats;

	camera.position.set(10,10,10);
	camera.lookAt(new THREE.Vector3(0,0,0));


	// TESTINg


	// RENDERER

	// Initialize music instruments
	musicPlayer.setMelodicInstrument( 'acoustic_grand_piano', ac );
	musicPlayer.setHarmonicInstrument( 'acoustic_grand_piano', ac );
	musicPlayer.setBassInstrument( './src/soundfonts/percussion.js', ac );

	// Initialize music
	musicPlayer.createBassLine();
	musicPlayer.createHarmonyLine();
	musicPlayer.createMelodyLine();
	// console.log(musicPlayer)

	allInit = true;

	// console.log(generateMelody( 'C4', 1 ))

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

	composer = new EffectComposer( renderer );
	composer.addPass( new EffectComposer.RenderPass( scene, camera ) );

	var effect = new EffectComposer.ShaderPass( THREE.DotScreenShader );
	effect.uniforms[ 'scale' ].value = 4;
	composer.addPass( effect );

	var effect = new EffectComposer.ShaderPass( THREE.RGBShiftShader );
	effect.uniforms[ 'amount' ].value = 0.0015;
	effect.renderToScreen = true;
	composer.addPass( effect );



	initInputHandler(framework);

	visualConfig.startTime = clock.getElapsedTime();
	visualConfig.prevTime = clock.getElapsedTime();

		// var geometry = new THREE.BoxGeometry( 1,1,1 );
		// var mesh = new THREE.Mesh(geometry);
		// scene.add(mesh);

}


// called on frame updates
function onUpdate(framework) {
	if (update) {
		update = false;
	}

	// Audio updates
	var nTime = Date.now();
	if (allInit) {
		// musicPlayer.playHarmony( nTime, function() {
		// });

		musicPlayer.playMelody( nTime, function() {
			Visual.melodyCallback(framework, visualConfig);
		});

		// musicPlayer.playBassLine( nTime, function() {
		// 	Visual.bassCallback(framework, visualConfig);
		// });
	}

return;
	// Visual
	var scene = framework.scene;
	var camera = framework.camera;
	var renderer = framework.renderer;
	var gui = framework.gui;
	var stats = framework.stats;

	var delta = clock.getElapsedTime() - visualConfig.prevTime;
	visualConfig.prevTime = clock.getElapsedTime();

	Visual.updateScene(framework, visualConfig, delta);

	// visualConfig.camera.vel = visualConfig.camera.vel.clone().add(visualConfig.camera.acc.clone().multiplyScalar(delta));
	// visualConfig.camera.pos = visualConfig.camera.pos.clone().add(visualConfig.camera.vel.clone().multiplyScalar(delta));
	// if (Visual.changeTrigger(visualConfig)) {
	// 	visualConfig.camera.vel = new THREE.Vector3( 0,0,0 );
	// 	visualConfig.camera.acc = new THREE.Vector3( 0,0,0 );
	// 	Visual.cleanupScene(scene);
	// 	Visual = Scene2;
	// 	Visual.initScene(framework, visualConfig);
	// }
	// camera.position.set( visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z );


	// if (composer){
		// composer.render();
	// } else {

//
// if (mirrorCube && mirrorCubeCamera) {
//
// 			mirrorCube.visible = false;
// 			mirrorCubeCamera.updateCubeMap( renderer, scene );
// 			mirrorCube.visible = true;
// }


		renderer.render(scene, camera); // render the scene
	// }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
