var tonal = require('tonal')

import euclid from './../utils/euclid.js'

export default function generateBass( voiceNumber, length = 8 ) {
	// Exports several lines of bass.
	var bassLine = [];
	
	switch ( voiceNumber ) {
		// 1. Default standard meter
		case 1: 
			var v = 62;
			for ( var i = 0; i < length; i++ ) {
				bassLine.push( {note: v, time: 1} );
				bassLine.push( {note: -1, time: 1} );
				bassLine.push( {note: v, time: 1} );
				bassLine.push( {note: -1, time: 1} );
			}
			break;
		// 2. Random Euclidian meter
		case 2:
			var v = 70;
			bassLine = randomBeat( euclid( Math.floor(Math.random() * length), length ), v );
			break;
		default:
			break;
	}

	return bassLine;

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