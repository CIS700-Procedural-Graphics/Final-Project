var tonal = require('tonal')

export default function generateHarmony( melody, interval ) {
	// Adjust interval to be min 0, max 2
	interval = Math.min( Math.max( 0, interval ), 2);

	// Uses the melody to generate a harmonic sequence
	var harmonic = [];
	var counter = 0;
	for ( var i = 0; i < melody.length; i++ ) {
		if ( counter < 0 ) {
			// for ( var i = counter; i < 0; i++ ) {
			// 	harmonic.push( {note: -1, time: 1} );
			// }
			// counter = 0;
			// console.log( counter );
		}

		if ( counter % 4 == 0 ) {
			var c = tonal.chord.get( 'm', tonal.note.fromMidi( melody[i].note ) );

			var n = tonal.note.midi( c[interval] );
			var t = Math.max( melody[i].time, 8 );

			switch ( interval ) {
				case 0:
					harmonic.push( {note: n, time: t} );
					break;
				case 1:
					harmonic.push( {note: n, time: t} );
					break;
				case 2:
					harmonic.push( {note: n, time: t} );
					break;
				default:
					break;
			}
			

			counter += t;
		}

		counter -= melody[i].time;
	}

	// console.log(harmonic)

	return harmonic;
}