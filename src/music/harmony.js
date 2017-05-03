var tonal = require('tonal')

var harmonyPat = [ [0, 1, 2], [0, 2, 1, 2, ], [0, 1, 2, 1],
				   [0, 1, 0, 1], [0, 1, 2, 3], [0, 2, 1, 3], 
				   [0, 3, 1, 3], [1, 0, 3, 1], [1, 3, 2, 1, 0],
				   [2, 2, 3, 4, 0] ]

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
	var c;
	for ( var j = 0; j < s.length; j++ ) {
		c = tonal.chord.get( 'm', s[j] );
		if ( c[2] == n ) { break ;}
	}

	// Add proper note
	n = tonal.note.midi( c[interval] );
	switch ( interval ) {
		case 0:
			var pat1 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
			var pat2 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];

			var rep1 = Math.floor( Math.random() * 4 ) + 1;
			var rep2 = Math.floor( Math.random() * 4 ) + 1;

			var t = 1;

			// Main repeats
			for ( var k = 0; k < rep2; k++ ) {
				for ( var i = 0; i < pat1.length; i++ ) {
					for ( var j = 0; j < 1; j++ ) {
						harmonic.push( {note: tonal.note.midi( s[pat1[i]] ), time: t} );
					}
				}
				harmonic.push( {note: -1, time: t} );
			}
			for ( var k = 0; k < rep1; k++ ) {
				for ( var i = 0; i < pat2.length; i++ ) {
					for ( var j = 0; j < rep2; j++ ) {
						harmonic.push( {note: tonal.note.midi( s[pat2[i]] ), time: t} );
					}
				}
				harmonic.push( {note: -1, time: t} );
			}

			// Variations
			var trans1 = Math.random() > 0.2 ? true : false;
			var trans2 = Math.random() > 0.2 ? true : false;
			var short = Math.random() > 0.2 ? true : false;
			var total = harmonic;
			if ( trans1 ) {
				var p = [];
				for ( var k = 0; k < rep2; k++ ) {
					for ( var i = 0; i < pat1.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat1[i]] ) + 12, time: t} );
					}
				}
				total = total.concat( p );
			}

			if ( trans2 ) {
				var p = [];
				for ( var k = 0; k < rep2; k++ ) {
					for ( var i = 0; i < pat1.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat1[i]] ) + 5, time: t} );
					}
				}
				if ( total.length > harmonic.length ) { total = total.concat( harmonic ); }
				total = total.concat( p );
			}

			if ( short ) {
				var p = [];
				for ( var k = 0; k < rep2; k++ ) {
					for ( var i = 0; i < pat1.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat1[i]] ), time: t / 2} );
					}
				}
				if ( total.length > harmonic.length ) { total = total.concat( harmonic ); }
				total = total.concat( p );
			}
			console.log( total );
			harmonic = total;

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

