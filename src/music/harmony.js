var tonal = require('tonal')

export default function generateHarmony( melody, interval ) {
	// Adjust interval to be min 0, max 2
	interval = Math.min( Math.max( 0, interval ), 2);

	// Uses the melody to generate a harmonic sequence
	var harmonic = [];
	var counter = 0;

	// console.log( tonal.note.fromMidi( melody[i].note ) )
	var c = tonal.chord.get( 'm', tonal.note.fromMidi( melody[0].note ) );

	var n = tonal.note.midi( c[interval] );
	var t = Math.max( melody[0].time, 8 );

	// Get note at current interval
	var n = tonal.note.fromMidi( melody[0].note );
	var sn = tonal.note.fromMidi( melody[0].note - 12 );

	// Find chord with this at the top
	var s = tonal.scale.get( 'minor', sn );
	// console.log( s )
	var c;
	for ( var j = 0; j < s.length; j++ ) {
		c = tonal.chord.get( 'm', s[j] );
		if ( c[2] == n ) { break ;}
	}
	// console.log( c )

	// Add proper note
	n = tonal.note.midi( c[interval] );
	switch ( interval ) {
		case 0:
			harmonic.push( {note: tonal.note.midi( c[0] ), time: 1} );
			harmonic.push( {note: tonal.note.midi( c[1] ), time: 1} );
			harmonic.push( {note: tonal.note.midi( c[2] ), time: 1} );
			harmonic.push( {note: -1, time: 1} );
			break;
		case 1:
			harmonic.push( {note: n, time: 4} );
			harmonic.push( {note: -1, time: 4} );
			break;
		case 2:
			harmonic.push( {note: n, time: 4} );
			harmonic.push( {note: -1, time: 4} );
			break;
		default:
			break;
	}
	
	// console.log(harmonic)

	return harmonic;
}

