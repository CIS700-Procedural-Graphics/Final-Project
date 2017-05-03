var tonal = require('tonal')

import Smooth1DNoise from './../utils/random.js'
import euclid from './../utils/euclid.js'
import {shuffle,
		findClosest} from './../utils/utilities.js'
import {MorseThueSingle} from './musicGenerator.js'


export default function generateMelody( scaleNote, time = 1 ) {

	// for ( var i = 0; i < 20; i++ ) { console.log( MorseThueSingle(2, 15, i) ); }
	// console.log('fin')

	var scaleType = 'major';

	var s = tonal.scale.get( scaleType, scaleNote);

	var n2 = tonal.note.midi( s[2] ) - 12;
	var s2 = tonal.scale.get( scaleType, tonal.note.fromMidi( n2 ) );

	var anchors = createAnchors( scaleNote, 8 );
	var noteline1 = insertHook( anchors.melody, s, scaleType, time * 16 );
	// finalNotes = insertFlairs( finalNotes, s, anchors.high, anchors.low );
	// finalNotes = anchors.melody;

	anchors = createAnchors( tonal.note.fromMidi( n2 ), 2 );
	var noteline2 = insertHook( anchors.melody, s2, scaleType, time * 4 );

	var final1 = noteline1, final2 = [];//[{note: -1, time: 32, type: 2}];
	for ( var i = 0; i < 4; i++ ) {
		if ( i % 2 == 0 ) {
			for ( var j = 0; j < noteline2.length; j++ ) {
				final2.push( noteline2[j] );
			}
		} else {
			final2.push( {note: -1, time: 32 * Math.floor( Math.random() * 2 ), type: 2} );
		}
	}


	// Remove any nulls
	for ( var i = 0; i < final2.length; i++ ) {
		if ( final2[i].note == null ) {
			final2.splice( i, 1 );
		}
	}

	for ( var i = 0; i < final1.length; i++ ) {
		if ( final1[i].note == null ) {
			final1.splice( i, 1 );
		}
	}
	// Print final note sequence

	var debug = [];
	for ( var i = 0; i < final2.length; i++ ) {
		debug.push( final2[i].note );
	}
	console.log( debug )

	return [final1, final2];
}

var noteType = {
	empty: 0,
	anchor: 1,
	hook: 2,
	flair: 3,
};

var hookPatterns = {
	3 : [ [0, 1, 1], [0, 2, -1], [-1, -1, 2] ],
	4 : [ [0, 1, -1, 1], [1, 1, -1, -1], [0, 0, -1, 1],
		  [0, 1, 3, -2], [0, 2, -2, -1], [1, 1, 1, 1] ]
}

function createTransition( start, end, scaleType ) {
	// Choose transition size, can be 1-4
	var tSize = Math.floor( Math.random() * 4 ) + 1;
	var remaining = 4 - tSize;
	var sLength = 2 + Math.ceil( remaining / 2);
	var eLength = 8 - tSize - sLength;

	// Choose a set of notes using the lower note as the base
	var lowNote = start > end ? end : start;
	var highNote = start > end ? start : end;
	var noteSet = tonal.scale.get( scaleType, tonal.note.fromMidi( lowNote - 12 ) );
	var toRemove = Math.floor( 0.6 * noteSet.length );
	noteSet = noteSet.concat( tonal.scale.get( scaleType, tonal.note.fromMidi( lowNote ) ) );
	noteSet.splice( 0, toRemove );

	// Get numberical array for notes
	var midiNoteSet = [];
	for ( var i = 0; i < noteSet.length; i++ ) {
		midiNoteSet.push( tonal.note.midi( noteSet[i] ) );
	}

	// Get transition distance
	var transDist = highNote - lowNote;

	// Find note in between low and high note
	var midNote = findClosest( midiNoteSet, lowNote + Math.floor( transDist / 2 ) );

	// Pick remaining notes from upper and lower halves
	var higherNotes = [], lowerNotes = [];
	var availableNotes = tSize - 1;
	for ( var i = 0; i < availableNotes; i++ ) {
		if ( i % 2 ) {
			// Choose a higher note
			var possibleOptions = midiNoteSet.length - midNote.index;
			higherNotes.push( midiNoteSet[Math.floor( Math.random() * possibleOptions) + midNote.index] );

		} else {
			// Choose a lower note
			var possibleOptions = midNote.index;
			lowerNotes.push( midiNoteSet[Math.floor( Math.random() * possibleOptions)] );
		}
	}

	// Assemble the temporary transition
	var tempTransition = [];
	for ( var i = 0; i < lowerNotes.length; i++ ) { tempTransition.push( lowerNotes[i] ); }
	tempTransition.push( midNote.value );	
	for ( var i = 0; i < higherNotes.length; i++ ) { tempTransition.push( higherNotes[i] ); }


	// Assemble full transition
	if ( start == highNote ) { tempTransition.reverse(); }
	var trueTransition = [start];
	for ( var i = 0; i < tempTransition.length; i++ ) {
		trueTransition.push( tempTransition[i] );
	}
	trueTransition.push( end );

	// Convert to notes
	var transitionNotes = [];
	transitionNotes.push( {note: trueTransition[0], time: sLength, type: noteType.flair });
	for ( var i = 0; i < trueTransition.length - 1; i++ ) {
		transitionNotes.push( {note: trueTransition[i], time: 1, type: noteType.flair });
	}
	transitionNotes.push( {note: trueTransition[trueTransition.length-1], time: eLength, type: noteType.flair });

	return transitionNotes;
}

function createHook( startNote, endNote, scaleType ) {
	// Get midi values for notes
	var start = tonal.note.midi( startNote.note );
	var end = tonal.note.midi( endNote.note );

	// Get transition notes
	return createTransition( start, end, scaleType );
}

function genericHook( baseNote, scaleType, time = 1 ) {
	// Get string version of note
	var baseNoteString = tonal.note.fromMidi( baseNote );

	// Get scales above and below
	var curScale = tonal.scale.get( scaleType, baseNoteString );
	var lowScale = tonal.scale.get( scaleType, tonal.note.fromMidi( baseNote - 12 ) );
	lowScale.reverse();

	// Determine how many long notes to have 
	var nLong = Math.floor( Math.random() * 3 );
	var singleNotes = length - nLong * 2 - 1;
	var totalNotes = singleNotes + nLong;

	// Determine which pattern to append
	var type = Math.random() > 0.5 ? 4 : 4;
	var options = hookPatterns[type];
	var hPat = options[Math.floor( Math.random() * options.length )];
	var patternAdded = false;
	totalNotes -= type;

	var notes = [{note: tonal.note.midi( curScale[0] ), time: 2, type: noteType.flair }], pos = 0;
	for ( var i = 0; i < hPat.length; i++ ) {
		pos += hPat[i];

		var noteSet = pos >= 0 ? curScale : lowScale;
		var noteIdx = pos >= 0 ? pos : Math.abs( 1 + pos );
		notes.push( {note: tonal.note.midi( noteSet[noteIdx] ), time: time, type: noteType.flair });

	}

	// // Generate sequence
	// var firstNoteTime = (Math.random() > 0.5 && nLong > 0) ? 2 : 1;
	// nLong += firstNoteTime == 2 ? -1 : 0;
	// var notes = [{note: baseNote, time: firstNoteTime, type: noteType.flair}];
	// var pos = 0, prevDiff = 0, repeats = 0;
	// for ( var i = 1; i < totalNotes; i++ ) {
	// 	var duration = 1;
	// 	if ( nLong > 0 ) {
	// 		duration = Math.random() > 0.5 ? 2 : 1;
	// 		nLong += duration == 2 ? -1 : 0;
	// 	}

	// 	// See if we are inserting the pattern 
	// 	var insertPattern = patternAdded ? Math.random() : 0;
	// 	if ( insertPattern > 0.5 ) {
	// 		for ( var j  = 0; j < hPat.length; j++ ) {
	// 			pos += hPat[j];
	// 			var noteIdx = pos >= 0 ? pos : Math.abs( 1 + pos );
	// 			notes.push( {note: tonal.note.midi( noteSet[noteIdx] ), time: 1, type: noteType.flair });
	// 		}
	// 		patternAdded = true; 
	// 	} else {
	// 		// Choose note based on position 
	// 		var noteSet = pos >= 0 ? curScale : lowScale;
	// 		var noteIdx = pos >= 0 ? pos : Math.abs( 1 + pos );
	// 		notes.push( {note: tonal.note.midi( noteSet[noteIdx] ), time: 1, type: noteType.flair });

	// 		// Random walk to next location
	// 		var posNegProb = 0.5 + ( pos == prevDiff ? 1 : 0 ) * prevDiff * 0.2;
	// 		var diffProb = repeats > 3 ? 0 : 0.2;
	// 		var delta = Math.random() > posNegProb ? 1 : -1;
	// 		var diff = Math.random() > diffProb ? delta : 0;
	// 		repeats += ( diff == 0 );
	// 		prevDiff = diff;
	// 		pos += diff;
	// 	}
	// }

	// if ( !patternAdded ) {
	// 	for ( var j  = 0; j < hPat.length; j++ ) {
	// 		pos += hPat[j];
	// 		var noteIdx = pos >= 0 ? pos : Math.abs( 1 + pos );
	// 		notes.push( {note: tonal.note.midi( noteSet[noteIdx] ), time: 1, type: noteType.flair });
	// 	}
	// }

	// // Note rhythm
	// for ( var i = 0; i < notes.length; i++ ) {
	// 	notes[i].time = i % 3 == 0 ? 2 : 1;
	// }

	return notes;
}

function insertHook(melody, scale, scaleType, time = 1) {

	var pattern = [true, true, false, false];
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
				var numBeats = totalBeats - 2; // CHANGE THIS
				var leftoverBeats = totalBeats - numBeats;


				// var singleFlair = createFlair( note1, scale, numBeats );
				// singleFlair[singleFlair.length - 1].note = note2.note;
				// var transition = createTransition( note1.note, note2.note, 'minor' );
				var gen = genericHook( note1.note, scaleType, time );
				for ( var j = 0; j < gen.length; j++ ) {
					hook.push( gen[j] );
				}
				// console.log( " made hook " )

			}

			var upOctave = Math.random() < 0.4;
			// console.log(upOctave)

			for (var j = 0; j < hook.length; j++) {
				newMelody.push({
					note: hook[j].note, //upOctave ? hook[j].note + 12 : hook[j].note,
					time: hook[j].time,
					type: noteType.hook,
				});

				// console.log( hook[j].note )
			}

			if (leftoverBeats > 0) {
				newMelody.push({
					note: -1,
					time: leftoverBeats,
					type: noteType.empty,
				});
			}
		} else {
			// newMelody.push(note1);
			// newMelody.push(note2);
			var r = Math.random();
			if ( r > 0.6 ) {
				for ( var j = 0; j < hook.length; j++ ) {
					var newNote = tonal.note.fromMidi( hook[j].note );
					newNote = tonal.transpose( 'P5', newNote );
					newMelody.push({
						note: tonal.note.midi( newNote ),
						time: hook[j].time,
						type: noteType.hook,
					});
				}
				for ( var j = 0; j < hook.length; j++ ) {
					var newNote = tonal.note.fromMidi( hook[j].note );
					newNote = tonal.transpose( 'M4', newNote );
					newMelody.push({
						note: tonal.note.midi( newNote ),
						time: hook[j].time,
						type: noteType.hook,
					});
				}
			} else {
				var n = tonal.note.fromMidi( note1.note );
				var n2 = tonal.transpose( 'P3', n );
				newMelody.push({
					note: tonal.note.midi( n ),
					time: 4,
					type: noteType.hook,
				});

				newMelody.push({
					note: tonal.note.midi( n2 ),
					time: 4,
					type: noteType.hook,
				});
			}
		}

	}
	return newMelody;
}

function insertFlairs( melody, scale, highAnchor, lowAnchor ) {
	// Create flairs for the different anchors
	var lowFlairs = [], highFlairs = [];
	var numTotal = 3;
	for ( var i = 0; i < numTotal; i++ ) {
		lowFlairs.push( createFlair( lowAnchor, scale ) );
		highFlairs.push( createFlair( highAnchor, scale ) );
	}

	// Loop over the melody and replace anchors with flairs
	var newMelody = [];
	for ( var i = 0; i < melody.length; i++ ) {
		if ( melody[i].type == noteType.anchor ) {
			var r = Math.random(), flair;
			if ( melody[i].note == lowAnchor.note ) {
				flair = lowFlairs[Math.floor( Math.random() * numTotal )];
			} else {
				flair = highFlairs[Math.floor( Math.random() * numTotal )];
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
	var flair = [];

	var flair = [{note: anchor.note, time: beats[0], type: noteType.flair}];
	for ( var i = 1; i < beats.length; i++ ) {
		flair.push( {note: tonal.note.midi( scale[pattern[i]] ), time: beats[1], type: noteType.flair} );
	}


	return flair;
}

function createFlairBeatAssignment( numBeats ) {
	// Set max number of long beats
	var usedLong = false;
	var maxShort = 3;
	var beats = [], sum = 0, r, b;
	var l = Math.random() > 0 ? 4 : 6;
	var remainingBeats = numBeats - maxShort - l;

	beats.push( l );
	for ( var i = 0; i < maxShort; i++ ) { beats.push( 1 ); }
	for ( var i = 0; i < remainingBeats; i+=2 ) { beats.push( 2 ); }
	

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
		var contour = Smooth1DNoise( Math.round( range * 0.8 ) , Math.random() * 0.1, 200 );
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



