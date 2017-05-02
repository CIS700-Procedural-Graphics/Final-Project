var tonal = require('tonal')

import Smooth1DNoise from './../utils/random.js'
import euclid from './../utils/euclid.js'
import {shuffle} from './../utils/utilities.js'


export default function generateMelody( scaleNote, randomVar ) {
	// var s = tonal.scale.get('major', scaleNote);
	// var sO = tonal.note.fromMidi( tonal.note.midi( scaleNote ) - 12 );
	// s = tonal.scale.get( 'major', sO ).concat( s );

	// var melodyLine = createMelodicContour( 2, s.length );
	// console.log( createFlairBeatAssignment( 8 ) )

	// var notes = [];
	// for ( var i = 0; i < melodyLine.length; i++ ) {
	// 	notes.push( { note: tonal.note.midi(s[melodyLine[i]]), time: 4 } );
	// }

	// notes = variateMelody( notes, s );

	// // console.log( euclid( 3, 8 ) )

	// // Remove any nulls
	// for ( var i = 0; i < notes.length; i++ ) {
	// 	if ( notes[i].note == null ) {
	// 		notes.splice( i, 1 );
	// 	}
	// }

	// // Limit length of melody
	// var finalNotes = [];
	// var mLimit = 32;
	// for ( var i = 0; i < notes.length; i++ ) {
	// 	if ( mLimit <= 0 ) { break; }
	// 	if ( notes[i].note == null ) { continue; }
	// 	mLimit -= notes[i].time;
	// 	finalNotes.push( notes[i] );
	// }

	var s = tonal.scale.get('minor pentatonic', scaleNote);
	// s = tonal.chord.get('Maj7', scaleNote);
	var anchors = createAnchors( scaleNote, 10 );
	var finalNotes = insertHook( anchors.melody, s );
	finalNotes = insertFlairs( finalNotes, s, anchors.high, anchors.low );

	// Print final note sequence
	var debug = [];
	for ( var i = 0; i < finalNotes.length; i++ ) {
		debug.push( finalNotes[i].note );
	}
	console.log( debug )

	return finalNotes;
}

var noteType = {
	empty: 0,
	anchor: 1,
	hook: 2,
	flair: 3,
};

function generateRhythm(numBeats) {
	var r = {
		1: [ [1] ],
		2: [ [1,1], [2] ],
		3: [ [2,1] ],
		4: [ [2,1,1] ],
		5: [ [2,1,2] ],
		6: [ [3,1,2] ],
		7: [ [3,1,1,2] ],
		8: [ [3,2,3] ],
		9: [ [3,5,1], [1,1,1,5,1], [5,1,3], [3,2,1,1,2] ],
		10: [ [6,4] ],
		11: [ [6,1,4] ],
		12: [ [6,2,4] ],
	}

	return r[numBeats][Math.floor(Math.random() * r[numBeats].length)];
}

function insertHook(melody, scale) {

	var pattern = [true, true, true, true, false, true, false, true, true, false, true, false];
	var newMelody = [];

	var hook = [];

	for (var i = 0; i < melody.length-1; i+=2) {
		var note1= melody[i];
		var note2 = melody[i+1];
		if (note1.type !== noteType.anchor && note2.type !== noteType.anchor) {
			console.log("Error: Cannot insert hook into non anchor type");
		}


		if (pattern[i%pattern.length]) {
			if (hook.length == 0) {
				var totalBeats = note1.time + note2.time;
				var numBeats = note1.time + 1; // CHANGE THIS
				var leftoverBeats = totalBeats - numBeats;
				var times = generateRhythm(numBeats);

				// for (var j = 0; j < times.length; j++) {
				// 	var note = -1;
				// 	if (j == 0) {
				// 		note = note1.note;
				// 	} else if (j == times.length-1) {
				// 		note = note2.note;
				// 	} else {
				// 		// note = Math.floor(Math.random() * 50);
				// 		note = tonal.note.midi( scale[Math.floor(Math.random() * scale.length)] );
				// 	}
				// 	hook.push({
				// 		note: note,
				// 		time: times[j],
				// 		type: noteType.hook,
				// 	});
				// }

				var singleFlair = createFlair( note1, scale, numBeats );
				singleFlair[singleFlair.length - 1].note = note2.note;
				for ( var j = 0; j < singleFlair.length; j++ ) {
					hook.push( singleFlair[j] );
				}

			}

			var upOctave = Math.random() < 0.4;
			console.log(upOctave)

			for (var j = 0; j < hook.length; j++) {
				newMelody.push({
					note: hook[j].note, //upOctave ? hook[j].note + 12 : hook[j].note,
					time: hook[j].time,
					type: noteType.hook,
				});
			}

			if (leftoverBeats > 0) {
				newMelody.push({
					note: -1,
					time: leftoverBeats,
					type: noteType.empty,
				});
			}
		} else {
			newMelody.push(note1);
			newMelody.push(note2);
		}

	}
	return newMelody;
}

function insertFlairs( melody, scale, highAnchor, lowAnchor ) {
	// Create flairs for the different anchors
	var lowFlairs = [], highFlairs = [];
	for ( var i = 0; i < 3; i++ ) {
		lowFlairs.push( createFlair( lowAnchor, scale ) );
		highFlairs.push( createFlair( highAnchor, scale ) );
	}

	// Loop over the melody and replace anchors with flairs
	var newMelody = [];
	for ( var i = 0; i < melody.length; i++ ) {
		if ( melody[i].type == noteType.anchor ) {
			var r = Math.random(), flair;
			if ( r > 0.5 ) {
				flair = lowFlairs[Math.floor( Math.random() * 3 )];
			} else {
				flair = highFlairs[Math.floor( Math.random() * 3 )];
			}

			for ( var j = 0; j < flair.length; j++ ) {
				newMelody.push( flair[j] );
			}
		} else {
			newMelody.push( melody[i] );
		}
	}

	return newMelody;
}

function createFlair( anchor, scale, length = 8 ) {
	var beats = createFlairBeatAssignment( length );
	var pattern = createMelodicContour( 2, scale.length );

	var flair = [{note: anchor.note, time: beats[0], type: noteType.flair}];
	for ( var i = 1; i < beats.length; i++ ) {
		flair.push( {note: tonal.note.midi( scale[pattern[i]] ), time: beats[i], type: noteType.flair} );
	}

	return flair;
}

function createFlairBeatAssignment( numBeats ) {
	// Set max number of long beats
	var usedLong = false;
	var maxShort = 2;
	var beats = [], sum = 0, r, b;
	var l = Math.random() > 0.3 ? 4 : 6;
	var remainingBeats = numBeats - maxShort - l;

	beats.push( l );
	for ( var i = 0; i < maxShort; i++ ) { beats.push( 1 ); }
	for ( var i = 0; i < remainingBeats; i+=2 ) { beats.push( 2 ); }

	// while (sum < numBeats) {
	// 	// Randomly select beat length
	// 	r = Math.random();
	// 	if ( r > 0.8 && !usedLong ) {
	// 		b = Math.random() > 0.3 ? 4 : 6;
	// 	} else if ( r > 0.4 ) {
	// 		b = 1;
	// 	} else {
	// 		b = 2;
	// 	}

	// 	// If beat fits, then allocate it, otherwise skip
	// 	if ( sum + b <= numBeats) {
	// 		beats.push( b );
	// 		sum += b;
	// 		if ( b > 3 ) { usedLong = true; }
	// 		if ( b == 1) { maxShort++; }
	// 	}
	// }

	return shuffle( beats );
}

function createAnchors( baseNote, length ) {
	var decider = Math.floor( Math.random() * 2 );
	var highAnchor = (decider == 1) ? tonal.transpose( baseNote, 'P5') : tonal.transpose( baseNote, 'M4');

	// Get numbers
	baseNote = tonal.note.midi( baseNote );
	highAnchor = tonal.note.midi( highAnchor );

	// Fill in anchors
	var anchor = [];
	for ( var i = 0; i < length; i++ ) {
		anchor.push( {note: highAnchor, time: 8, type: noteType.anchor} );
		anchor.push( {note: baseNote, time: 8, type: noteType.anchor} );
	}

	return {melody: anchor, high: anchor[0], low: anchor[1]};
}


function createMelodicContour( seed, range ) {

	// Either create a music contour from a smooth noise function
	// or a pseudo-random number sequence
	//
	if (seed % 2 == 0) {
		// Subsample a smoothed contour
		var contour = Smooth1DNoise( Math.round( range * 0.8 ) , 0.03, 200 );
		var subsampledContour = [];
		for ( var i = 0; i < contour.length; i+=10 ) {
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
	// while ( i < rhythm.length - 1 ) {
	// 	// Check for 1,1,1
	// 	if ( rhythm[i] == 1 && rhythm[i+1] == 1 ) {
	// 		newRhythm.push( 1 );
	// 		newRhythm.push( 1 );
	// 		i+=2;
	// 	} else if ( rhythm[i] == 1 && rhythm[i+1] == 0 ) {
	// 		newRhythm.push( 2 );
	// 		i+=2;
	// 	} else {
	// 		newRhythm.push( rhythm[i] );
	// 		i++;
	// 	}

	// }
	for ( var i = 0; i < rhythm.length; i++ ) {
		newRhythm.push( rhythm[i] == 1 ? 1:-1 );
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
