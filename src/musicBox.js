import Soundfont from 'soundfont-player'
var tonal = require('tonal')

// Local imports
import euclid from './utils/euclid.js'


import generateMelody from './music/melody.js'
import {generateBass,
	 	fillEmpty} from './music/bass.js'
import generateHarmony from './music/harmony.js'

export default class MusicBox {

	constructor() {
		this._init();
	}

	// Private functions
	_init() {
		this.instruments = [null,null,null];
		this.noise = [0.6, 0.4, 0.3];
		this.delay = 3;
		this.delayTimer = null;
		this.settings = [
			{
				envelopes : {
					0: [0.7, 0.5, 0.3, 1.0],
					1: [0.1, 0.7, 0.3, 0.1],
					3: [0.1, 0.7, 0.3, 0.1]
				},
				noise : [0.6, 0.8, 0.3],
				instruments : [
					'electric_piano_2', 'lead_2_sawtooth', './src/soundfonts/percussion.js'
				]
			},
			{
				envelopes : {
					0: [0.5, 0.5, 0.3, 1.0],
					1: [0.5, 0.5, 0.3, 1.0],
					3: [0.1, 0.7, 0.3, 0.1]
				},
				noise : [0.6, 0.4, 0.3],
				instruments : [
					'oboe', 'synthstrings_1', 'gunshot'
				]
			}
		]
	}

	_setInstrument( instrumentName, ac, type, envelope = [0, 0.5, 0, 0.2] ) {
		var instrument = Soundfont.instrument(ac, instrumentName, { soundfont: 'MusyngKite',
																	gain: 1,
																	adsr: envelope }); // time_to_high, dur_of_high, time_of_sustain, time_to_die
		var detailedInstrument = {
			'instrument': instrument,
			'ac' 		: ac,
			'noteLength': 1/4,
			'noteCount' : [],
			'notes'     : [],
			'time'		: [],
			'played'	: [],
			'start'		: false,
			'repeat'	: true
		};
		this.instruments[type] = detailedInstrument;
	}

	_playMusic( type, time, callback ) {
		var instrument = this.instruments[type];

		// Don't play if nothing has been created.
		if ( instrument.notes.length == 0) { return; }

		if ( this.delay > 0 ) {
			if ( this.delayTimer === null ) { this.delayTimer = time; }
			this.delay -= ( time = this.delayTimer ) / 1000;
			return;
		}

		// Case where music is starting
		if ( !instrument.start ) {
			instrument.start = true;

			// Loop over each music line
			for ( var i = 0; i < instrument.notes.length; i++) {
				// Initialize starting vars
				instrument.noteCount[i] = 0;
				instrument.time[i] = time;
				instrument.played[i] = false;

				// Play first note
				instrument.instrument.then( (function(index, instr) {
					instr.start(instrument.notes[index][instrument.noteCount[index]].note,
								instrument.ac.currentTime,
								{gain: this.noise[type]})
						 .stop(instrument.ac.currentTime + instrument.notes[index][instrument.noteCount[index]].time * instrument.noteLength);

					if (index == 0) { callback(); }
					instrument.played[index] = true;
					instrument.noteCount[index]++;
				}).bind(this, i) );
			}
		}

		// Case where we are currently playing music
		if ( instrument.start ) {

			// Loop over each music line
			for ( var i = 0; i < instrument.notes.length; i++) {
				if ( !instrument.played[i] ) { continue; }
				if ( instrument.repeat && instrument.noteCount[i] >= instrument.notes[i].length ) {
					instrument.noteCount[i] = 0;
				}

				var prevNote = ( instrument.noteCount[i] - 1 < 0 ) ? instrument.notes[i].length - 1 : instrument.noteCount[i] - 1;
				var delta = (time - instrument.time[i]) / 1000;
				if (delta > instrument.notes[i][prevNote].time * instrument.noteLength &&
					instrument.noteCount[i] < instrument.notes[i].length) {
					instrument.played[i] = false;

					var pNote = instrument.notes[i][instrument.noteCount[i]].note;
					var pTime = instrument.notes[i][instrument.noteCount[i]].time;
					var instr = instrument;
					var testbool = false;
					if ( instrument.notes[i][instrument.noteCount[i]].type == -1 ) {
						instr = this.instruments[3];
						testbool = true;
					}

					// console.log( instrument )
					instr.instrument.then((function(index, instr) {

						if ( pNote > 0) {
							// if ( testbool ) { console.log( pNote ); }
							instr.start(pNote,
											instrument.ac.currentTime,
											{gain: this.noise[type]})//;//[0.3,0.3,0.8,1]
									 .stop(instrument.ac.currentTime + pTime * instrument.noteLength);
								if (index == 0) { callback(); }
							}
							instrument.played[index] = true;
							instrument.noteCount[index]++;
						}).bind(this, i))
					instrument.time[i] = time;
				}
			}
		}
	}

	_clearGeneratedMusic ( type ) {
		if ( this.instruments[type] !== null ) {
			this.instruments[type].start = false;
			this.instruments[type].noteCount = [];
			this.instruments[type].notes = [];
			this.instruments[type].time = [];
			this.instruments[type].played = [];
		}
	}

	// Public functions
	setMelodicInstrument( instrumentName, ac, option = 0 ) {
		var setting = this.settings[option];
		this._setInstrument( instrumentName, ac, 0, setting.envelopes[0] );
		this.instruments[0].noteLength = 1/4;
		// [0.7, 0.5, 0.3, 1.0] 
	}

	setHarmonicInstrument( instrumentName, ac, option = 0 ) {
		var setting = this.settings[option];

		this._setInstrument( instrumentName, ac, 1, setting.envelopes[1] ); 
		this._setInstrument( 'pad_3_polysynth', ac, 3, setting.envelopes[3] );
		this.instruments[1].noteLength = 1/4;
	}

	setBassInstrument( instrumentName, ac ) {
		this._setInstrument( instrumentName, ac, 2 );
		this.instruments[2].noteLength = 1/2;
	}

	// Functions for bass line
	createBassLine( option = 0 ) {
		this._clearGeneratedMusic( 2 );
		this.instruments[2].notes.push(generateBass( 1, 4 ));

		// if ( option == 0 ) {
		// 	this.instruments[2].notes.push(generateBass( 3, 24 ));
		// 	// this.instruments[2].notes.push(generateBass( 3, 32 ));
		// }
		// this.instruments[2].notes.push(generateBass( 2, 8 ));
		// this.instruments[2].notes.push(generateBass( 3, 16 ));

	}

	playBassLine( time, callback ) {
		this._playMusic( 2, time, callback );
	}

	// Functions for the harmony
	createHarmonyLine( option = 0 ) {
		this._clearGeneratedMusic( 1 );
		this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], option ));
		// this.instruments[2].notes.push(fillEmpty( this.instruments[1].notes[0] ));
		// this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], 1 ));
		// this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], 2 ));
	}

	playHarmony( time, callback ) {
		this._playMusic( 1, time, callback );
	}

	// Functions for the melody
	createMelodyLine( option = 0 ) {
		this._clearGeneratedMusic( 0 );
		// this.instruments[0].notes.push(generateMelody( 'C3', 1 ));
		// this.instruments[0].notes.push(generateMelody( 'F3', 4 ));
		this.instruments[0].notes = generateMelody( 'C3', option )
	}

	playMelody( time, callback ) {
		this._playMusic( 0, time, callback );
	}

	// Make full music
	createMusic( ac, type = 0 ) {
		// Set instruments
		var instruments = this.settings[type].instruments;
		this.setMelodicInstrument( instruments[0], ac );
		this.setHarmonicInstrument( instruments[1], ac );
		this.setBassInstrument( instruments[2], ac );

		// Other settings
		this.noise = this.settings[type].noise;

		// Create music
		this.createMelodyLine( type );
		this.createHarmonyLine( type );
		this.createBassLine( type );
	}

}
