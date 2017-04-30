import Soundfont from 'soundfont-player'

import {euclid} from './utils/euclid.js'
import {beatGenerator,
	MorseThue,
	melodyGenerator,
	rhythmicMelodyGenerator,
	EarthWorm,
	noteBeats} from './utils/musicGenerator.js'

	import {patternedMelody,
		createMainTheme,
		createMelody} from './utils/musicMotifs.js'


export default class MusicBox {
	constructor() {
		this.instruments = [null,null,null];
	}

	// Private functions
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
				// console.log(instrument.ac.currentTime)

				// Play first note
				instrument.instrument.then( (function(index, instr) {
					// instr.start(instrument.notes[i][instrument.noteCount[i]].note, instrument.ac.currentTime, {gain: 0.5});
					// console.log(instrument.noteCount[index])
					// console.log(instrument.notes[index])
					// console.log(instrument.notes[index][instrument.noteCount[index]].note)
					instr.start(instrument.notes[index][instrument.noteCount[index]].note, 
								instrument.ac.currentTime, {gain: 0.5});
					if (index == 0) { callback(); }
					instrument.played[index] = true;
					
				}).bind(this, i) );

				instrument.noteCount[i]++;
			}

		}

		// Case where we are currently playing music
		if ( instrument.start ) {

			// Loop over each music line
			for ( var i = 0; i < instrument.notes.length; i++) {
				if (!instrument.played[i]) { continue; }

				var delta = ( time - instrument.time[i] ) / 1000;
				if (delta > instrument.notes[i][instrument.noteCount[i]-1].time * instrument.noteLength &&
					instrument.noteCount[i] < instrument.notes[i].length) {

					instrument.instrument.then((function(index, instr) {
						// console.log(instrument.notes[index])

						if (instrument.notes[index][instrument.noteCount[index]].note > 0) {
							instr.start(instrument.notes[index][instrument.noteCount[index]].note, instrument.ac.currentTime, {gain: 0.5});
							if (index == 0) { callback(); }
						}
						instrument.played[index] = true;
						
					}).bind(this, i))

					instrument.noteCount[i]++;
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

	// Functions for creating bass line
	createBassLine() {
		this._clearGeneratedMusic( 2 );
		this.instruments[2].notes.push(beatGenerator( euclid(2,8), 180, 400, 'F3' ));
		this.instruments[2].notes.push(beatGenerator( euclid(9,12), 120, 400, 'C4' ));
		this.instruments[2].notes.push(beatGenerator( euclid(7,15), 180, 400, 'D2' ));
	}

	playBassLine( time, callback ) {
		this._playMusic( 2, time, callback );
	}


}

