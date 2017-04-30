import Soundfont from 'soundfont-player'

// Local imports
import euclid from './utils/euclid.js'
import {beatGenerator,
		MorseThue,
		melodyGenerator,
		rhythmicMelodyGenerator,
		EarthWorm,
		noteBeats} from './music/musicGenerator.js'

import {patternedMelody,
		createMainTheme,
		createMelody} from './music/musicMotifs.js'
import generateMelody from './music/melody.js'


export default class MusicBox {
	constructor() {
		this._init();
	}

	// Private functions
	_init() {
		this.instruments = [null,null,null];
		this.noise = [0.7, 0.5, 0.5];
	}

	_setInstrument( instrumentName, ac, type ) {
		var instrument = Soundfont.instrument(ac, instrumentName, { soundfont: 'MusyngKite', gain: 1 });
		var detailedInstrument = {
			'instrument':  instrument,
			'ac' 		: ac,
			'noteLength': 1/4,
			'noteCount' : [],
			'notes'     : [],
			'time'		: [],
			'played'	: [],
			'start'		: false
		};
		this.instruments[type] = detailedInstrument;
	}

	_playMusic( type, time, callback ) {
		var instrument = this.instruments[type];

		// Don't play if nothing has been created.
		if ( instrument.notes.length == 0) { return; }

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
						 .stop(instrument.notes[index][instrument.noteCount[index]].time * instrument.noteLength);

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
				if (!instrument.played[i]) { continue; }

				var delta = (time - instrument.time[i]) / 1000;
				if (delta > instrument.notes[i][instrument.noteCount[i]-1].time * instrument.noteLength &&
					instrument.noteCount[i] < instrument.notes[i].length) {
					instrument.instrument.then((function(index, instr) {

						if (instrument.notes[index][instrument.noteCount[index]].note > 0) {
							instr.start(instrument.notes[index][instrument.noteCount[index]].note, 
										instrument.ac.currentTime, 
										{gain: this.noise[type]});
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
		this.instruments[2].notes.push(beatGenerator( euclid(2,8), 180, 400, 'F3' ));
		this.instruments[2].notes.push(beatGenerator( euclid(9,12), 120, 400, 'C4' ));
		this.instruments[2].notes.push(beatGenerator( euclid(7,15), 180, 400, 'D2' ));
	}

	playBassLine( time, callback ) {
		this._playMusic( 2, time, callback );
	}

	// Functions for the harmony
	createHarmonyLine() {
		this._clearGeneratedMusic( 1 );
		this.instruments[1].notes.push(createMainTheme('C4'));
	}

	playHarmony( time, callback ) {
		this._playMusic( 1, time, callback );
	}

	// Functions for the melody
	createMelodyLine() {
		this._clearGeneratedMusic( 0 );
		this.instruments[0].notes.push(generateMelody( 'F5', 1 ));
	}

	playMelody( time, callback ) {
		this._playMusic( 0, time, callback );
	}


}

