import Soundfont from 'soundfont-player'

// Local imports
import euclid from './utils/euclid.js'

import {patternedMelody,
		createMainTheme,
		createMelody} from './music/musicMotifs.js'

import generateMelody from './music/melody.js'
import generateBass from './music/bass.js'
import generateHarmony from './music/harmony.js'


export default class MusicBox {
	constructor() {
		this._init();
	}

	// Private functions
	_init() {
		this.instruments = [null,null,null];
		this.noise = [1, 0.35, 0.75];
	}

	_setInstrument( instrumentName, ac, type ) {
		var instrument = Soundfont.instrument(ac, instrumentName, { soundfont: 'fuildR3',
																	gain: 1,
																	adsr: [0, 0, 0, 0] });
		var detailedInstrument = {
			'instrument': instrument,
			'ac' 		: ac,
			'noteLength': 1/8,
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

		// Check for repeats
		if ( instrument.repeat ) {

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
					instrument.instrument.then((function(index, instr) {

					if (instrument.notes[index][instrument.noteCount[index]].note > 0) {
							instr.start(instrument.notes[index][instrument.noteCount[index]].note, 
										instrument.ac.currentTime, 
										{gain: this.noise[type],
										 adsr: [0,0,0,0]});//[0.3,0.3,0.8,1]
								 //.stop(instrument.ac.currentTime + instrument.notes[index][instrument.noteCount[index]].time * instrument.noteLength);
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
		this.instruments[type].start = false;
		this.instruments[type].noteCount = [];
		this.instruments[type].notes = [];
		this.instruments[type].time = [];
		this.instruments[type].played = [];
	}

	// Public functions
	setMelodicInstrument( instrumentName, ac ) {
		this._setInstrument( instrumentName, ac, 0 );
		this.instruments[0].noteLength = 1/8;
	}

	setHarmonicInstrument( instrumentName, ac ) {
		this._setInstrument( instrumentName, ac, 1 );
	}

	setBassInstrument( instrumentName, ac ) {
		this._setInstrument( instrumentName, ac, 2 );
	}

	// Functions for bass line
	createBassLine() {
		this._clearGeneratedMusic( 2 );
		// this.instruments[2].notes.push(beatGenerator( euclid(2,8), 180, 400, 'F3' ));
		// this.instruments[2].notes.push(beatGenerator( euclid(9,12), 120, 400, 'C4' ));
		// this.instruments[2].notes.push(beatGenerator( euclid(7,15), 180, 400, 'D2' ));
		this.instruments[2].notes.push(generateBass( 1, 4 ));
		this.instruments[2].notes.push(generateBass( 2, 8 ));
	}

	playBassLine( time, callback ) {
		this._playMusic( 2, time, callback );
	}

	// Functions for the harmony
	createHarmonyLine() {
		this._clearGeneratedMusic( 1 );
		this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], 0 ));
		this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], 1 ));
		this.instruments[1].notes.push(generateHarmony( this.instruments[0].notes[0], 2 ));
	}

	playHarmony( time, callback ) {
		this._playMusic( 1, time, callback );
	}

	// Functions for the melody
	createMelodyLine() {
		this._clearGeneratedMusic( 0 );
		this.instruments[0].notes.push(generateMelody( 'C3', 1 ));
	}

	playMelody( time, callback ) {
		this._playMusic( 0, time, callback );
	}

	// Make full music
	createMusic() {
		this.createMelodyLine();
		this.createHarmonyLine();
		this.createBassLine();
	}

}

