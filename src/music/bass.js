var tonal = require('tonal')

import euclid from './../utils/euclid.js'

export function generateBass( voiceNumber, length = 8 ) {
	// Exports several lines of bass.
	var bassLine = [];
	
	switch ( voiceNumber ) {
		// 1. Default standard meter
		case 1: 
			var v = 36, v2 = 46;
			for ( var i = 0; i < length; i++ ) {
				bassLine.push( {note: v, time: 1} );
				bassLine.push( {note: v2, time: 1} );
				bassLine.push( {note: v, time: 1} );
				bassLine.push( {note: v2, time: 1} );
			}
			break;
		// 2. Random Euclidian meter
		case 2:
			var v = 46;
			bassLine = randomBeat( euclid( Math.floor(Math.random() * length), length ), v );
			break;
		case 3:
			var v = Math.floor( Math.random() * 40 ) + 35;
			bassLine = randomBeat( euclid( Math.floor(Math.random() * length / 2) + 1, length ), v );
			break;
		default:
			break;
	}

	return bassLine;

}

export function fillEmpty( music ) {
	var notes = [];
	var fNote = 62;
	for ( var i = 0; i < music.length; i++ ) {
		var n = music[i].note == -1 ? fNote : -1;
		notes.push( {note: n, time: music[i].time, type: 1} );
	}

	return notes;
}

function randomBeat( rhythm, drumNote = 'G3' ) {
	var notes = [];
	for ( var i = 0; i < rhythm.length; i++ ) {
		var r = rhythm[i];
		var note = ( r == 1 ) ? drumNote : -1;
		notes.push( {note: tonal.note.midi(note), time: 1});
	}
	return notes;
}