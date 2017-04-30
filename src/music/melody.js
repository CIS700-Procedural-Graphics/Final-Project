var tonal = require('tonal')

import Smooth1DNoise from './../utils/random.js'


export default function generateMelody( scaleNote, randomVar ) {
	var s = tonal.scale.get('minor', scaleNote);
	var melodyLine = createMelodicContour( 1, s.length );

	var notes = [];
	for ( var i = 0; i < melodyLine.length; i++ ) {
		notes.push( { note: tonal.note.midi(s[melodyLine[i]]), time: 1 } );
	}

	// concat for now
	for ( var i = 1; i < 4; i++ ) {
		notes = notes.concat(notes);
	}

	return notes;
}

function createMelodicContour( seed, range ) {

	// Either create a music contour from a smooth noise function
	// or a pseudo-random number sequence
	//
	// if (seed % 2 == 0) {
		
	// } else {

	// }
	
	// Subsample a smoothed contour
	var contour = Smooth1DNoise( range, 0.05, 200 );
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

	return subsampledContour;
}

