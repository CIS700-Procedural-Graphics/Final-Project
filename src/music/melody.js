var tonal = require('tonal')

import Smooth1DNoise from './../utils/random.js'
import euclid from './../utils/euclid.js'


export default function generateMelody( scaleNote, randomVar ) {
	var s = tonal.scale.get('major', scaleNote);
	

	// var sO = tonal.note.fromMidi( tonal.note.midi( scaleNote ) - 12 );
	// s = tonal.scale.get( 'major pentatonic', sO ).concat( s );

	var melodyLine = createMelodicContour( 2, s.length );
	console.log( melodyLine )

	var notes = [];
	for ( var i = 0; i < melodyLine.length; i++ ) {
		notes.push( { note: tonal.note.midi(s[melodyLine[i]]), time: 1 } );
	}

	notes = applyRhythm( notes, euclid( 3, 8 ) );
	notes = variateMelody( notes, s );

	// Remove any nulls
	for ( var i = 0; i < notes.length; i++ ) {
		if ( notes[i].note == null ) {
			notes.splice( i, 1 );
		}
	}

	// Limit length of melody
	var finalNotes = [];
	var mLimit = 24;
	for ( var i = 0; i < notes.length; i++ ) {
		if ( mLimit <= 0 ) { break; }
		if ( notes[i].note == null ) { continue; }
		mLimit -= notes[i].time;
		finalNotes.push( notes[i] );
	}

	// Print final note sequence
	var debug = [];
	for ( var i = 0; i < finalNotes.length; i++ ) {
		debug.push( finalNotes[i].note );
	}
	console.log( debug )

	return finalNotes;
}

function createMelodicContour( seed, range ) {

	// Either create a music contour from a smooth noise function
	// or a pseudo-random number sequence
	//
	if (seed % 2 == 0) {
		// Subsample a smoothed contour
		var contour = Smooth1DNoise( range, 0.1, 200 );
		var subsampledContour = [];
		for ( var i = 0; i < contour.length; i+=4 ) {
			subsampledContour.push(Math.floor( contour[i] ));
		}

		// Remove repeats of more than 3
		var max_length = subsampledContour.length - 2;
		for ( var i = 0; i < max_length; i++ ) {
			if ( subsampledContour[i] == subsampledContour[i+1] && subsampledContour[i+1] == subsampledContour[i+2] ) {
				subsampledContour.splice( i, 1 );
				max_length--;
				i--;
			}
		}

		// Make sure length is a multiple of 4
		if ( subsampledContour.length % 4 > 0 ) {
			var bound = 4 - subsampledContour.length % 4;
			for ( var i = 0; i < bound; i++ ) {
				subsampledContour.push(subsampledContour[i]);
			}
		}
	} else {
		// In this case, use a random sequence of numbers to determine the slope 
		// of each segment of 4-8 notes
		var subsampledContour = [];
		var duration = ( Math.floor( Math.random() * 2 + 1 ) * 2 + 6 ) * 4;
		var index = 0, sign = 1, sCounter = 0, note = 0;
		while ( index < duration ) {
			var segmentLength = Math.floor( Math.random() * 3 ) * 2 + 4;
			if ( duration - index < segmentLength ) { segmentLength = duration - index };

			// var slope = sign * Math.floor( Math.random() * range / 2  + range / 2) ;
			var delta = sign * Math.floor( Math.random() * 4 + 1 );
			for ( var i = 0; i < segmentLength; i+=2 ) {
				subsampledContour.push( note );
				subsampledContour.push( note );
				note += delta;
				note = Math.min( Math.max( 0, note ), range - 1 );
				index += 2;
			}

			sCounter++;
			sign = Math.pow(-1, sCounter);
		}
	}
	


	return subsampledContour;
}

function applyRhythm( melody, rhythm ) {
	// Convert rhythm
	rhythm = rhythmicConversion( rhythm );

	// Pad rhythm to be a multiple of 4
	var rSum = rhythmSum( rhythm );

	if ( rSum % 4 > 0 ) {
		var bound = 4 - ( rSum % 4 );
		for ( var i = 0; i < bound ; ++i ) {
			rhythm.push( (i+1) % 2 );
		}
	}

	// Make sure rhythm isn't longer that melody
	if ( rhythm.length > melody.length ) {
		rhythm.splice( melody.length - 1, rhythm.length - melody.length );
	}

	// Create melody with rhythm.
	var rMelody = [], counter = 0, mCounter = 0;
	while ( mCounter < melody.length ) {
		var r = rhythm[counter % rhythm.length];
		if ( r > 0 ) {
			rMelody.push( {note: melody[mCounter].note, time: r });
			mCounter++;
		} else {
			rMelody.push( {note: -1, time: 1 });
		}
		counter++;
	}

	return rMelody;
}

function rhythmicConversion( rhythm ) {
	// Convert digital rhythms based on the following rules
	// 1. Keep all strings of 1,1
	// 2. Convert all 1,0 into 2, unless previous value was a 2

	var newRhythm = [], i = 0;
	while ( i < rhythm.length - 1 ) {
		// Check for 1,1,1
		if ( rhythm[i] == 1 && rhythm[i+1] == 1 ) {
			newRhythm.push( 1 );
			newRhythm.push( 1 );
			i+=2;
		} else if ( rhythm[i] == 1 && rhythm[i+1] == 0 ) {
			newRhythm.push( 2 );
			i+=2;
		} else {
			newRhythm.push( rhythm[i] );
			i++;
		}

	}

	return newRhythm;
}

function rhythmSum( rhythm ) {
	var s = 0;
	for ( var i = 0; i < rhythm.length; i++ ) {
		var v = rhythm[i];
		if ( v == 0 ) { v = 1; }
		s+=v;
	}
	return v;
}

function variateMelody( melody, scale ) {
	// Let's assume we have a rhythmic melody and assume that the melody 
	// parameter here represents 1 repeat of the theme.
	// Then, we add some variations to the music.

	// Note extension: so far, the only note lengths should be 2 and 1. Add a
	// 4 to the score and an 8 to the score.
	var start4 = Math.floor( melody.length / 3 );
	for ( var i = start4; i < melody.length; i++ ) {
		if ( melody[i].note < 0 ) { continue; }
		
		var r = Math.random();
		if ( r > 0.35 - 0.5 * (start4 - i) ) {
			melody[i].time = 4;
			break;
		}
	}

	var start8 = Math.floor( melody.length / 3 * 2 );
	for ( var i = start8; i < melody.length; i++ ) {
		if ( melody[i].note < 0 ) { continue; }
		
		var r = Math.random();
		if ( r > 0.5 - 0.5 * (start8 - i) ) {
			melody[i].time = 8;
			break;
		}
	}

	// Add flairs if the note is length 2, and no flairs have been added recently
	var numFlair = 0;
	for ( var i = 0; i < melody.length; i++ ) {
		if ( numFlair >= melody.length / 6 ) { break; }
		if ( melody[i].time > 2 ) { continue; }

		var r = Math.random();
		if ( r > 0.3 ) {
			var note = scale[Math.floor( Math.random() * scale.length )];
			if ( melody[i].time == 2 ) { melody[i].time = 1; }
			melody.splice( i, 0, {note: tonal.note.midi( note ), time: 1} );
			numFlair++;
		}
	}

	// Change some repeat notes to have more repeats and others to
	// have some pattern to them
	// numFlair = 0;
	// for ( var i = 0; i < melody.length - 1; i++ ) {
	// 	if ( numFlair >= melody.length / 8 ) { break; }
	// 	if ( melody[i].time > 2 ) { continue; }

	// 	var r = Math.random();
	// 	if ( r > 0.3 && melody[i].note == melody[i+1].note ) {
	// 		if ( melody[i].time == 2 ) { melody[i].time = 1; }
	// 		if ( melody[i+1].time == 2 ) { melody[i+1].time = 1; }

	// 		r = Math.random();
	// 		if ( r > 0.7 ) {
	// 			var note = melody[i].note;
	// 			melody.splice( i, 0, {note: tonal.note.midi( note ), time: 1} );
	// 			melody.splice( i, 0, {note: tonal.note.midi( note ), time: 1} );
	// 			i+=4;
	// 		} else {
	// 			var note = tonal.transpose( tonal.note.fromMidi( melody[i].note ), 'm3' );
	// 			melody[i+1].note = note;
	// 			melody[i+1].time = 0.5;
	// 			melody.splice( i+2, 0, {note: tonal.note.midi( melody[i].note ), time: 5} );
	// 			i+=3;
	// 		}
	// 		numFlair++;
	// 	}
	// }


	// console.log(melody)

	return melody;
}