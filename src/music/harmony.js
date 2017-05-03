var tonal = require('tonal')

var harmonyPat = [ [0, 1, 2, 2], [0, 2, 1, 2], [0, 1, 2, 1],
				   [0, 1, 0, 1], [0, 1, 2, 3], [0, 2, 1, 3], 
				   [0, 3, 1, 3], [1, 0, 3, 1], [1, 3, 2, 1, 0],
				   [2, 2, 3, 4, 0] ];

var rhythms = {
	4: [ [2, 1, 1], [1, 1, 2], [1, 1, 1, 1] ],
	5: [ [2, 1, 1, 1, 1], [2, 1, 1, 1, 2], [1, 1, 2, 1, 2]]
}



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
	var sn = tonal.note.fromMidi( melody[0].note + 12 );

	// Find chord with this at the top
	var s = tonal.scale.get( 'ionian pentatonic', sn );
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

			var rep1 = Math.floor( Math.random() * 1 ) + 1;
			var rep2 = Math.floor( Math.random() * 1 ) + 1;

			var r1Set = rhythms[pat1.length];
			var r2Set = rhythms[pat2.length];

			var r1 = r1Set[ Math.floor( Math.random() * r1Set.length) ];
			var r2 = r2Set[ Math.floor( Math.random() * r2Set.length) ];

			var t = 1;
			var pNote = 78;

			// Main repeats
			for ( var k = 0; k < rep2; k++ ) {
				for ( var i = 0; i < pat1.length; i++ ) {
					for ( var j = 0; j < 1; j++ ) {
						harmonic.push( {note: tonal.note.midi( s[pat1[i]] ), time: t * r1[j]} );
					}
				}
				
			}
			harmonic.push( {note: pNote, time: t * 2, type: -1} );

			for ( var k = 0; k < rep1; k++ ) {
				for ( var i = 0; i < pat2.length; i++ ) {
					for ( var j = 0; j < rep2; j++ ) {
						harmonic.push( {note: tonal.note.midi( s[pat2[i]] ), time: t * r2[j]} );
					}
				}
				
			}
			harmonic.push( {note: pNote, time: t * 2, type: -1} );

			// Variations
			var trans1 = Math.random() > 0.2 ? true : false;
			var trans2 = Math.random() > 0.2 ? true : false;
			var short  = Math.random() > 0.2 ? true : false;
			var quickDrop = Math.random() > 0 ? true : false;
			var total = harmonic;
			var pat3 = [];
			if ( trans1 ) {
				var p = [];

				pat3 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
				for ( var k = 0; k < rep2; k++ ) {
					for ( var i = 0; i < pat3.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat3[i]] ) + 12, time: t} );
					}
				}

				pat3 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
				for ( var i = 0; i < pat3.length; i++ ) {
					p.push( {note: tonal.note.midi( s[pat3[i]] ) + 12, time: t} );
				}
				total = total.concat( p );
			}

			if ( trans2 ) {
				var p = [];
				pat3 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
				for ( var k = 0; k < rep2; k++ ) {
					for ( var i = 0; i < pat3.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat3[i]] ) + 5, time: t} );
					}
				}
				pat3 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
				for ( var i = 0; i < pat3.length; i++ ) {
					p.push( {note: tonal.note.midi( s[pat3[i]] ) + 5, time: t} );
				}
				if ( total.length > harmonic.length ) { total = total.concat( harmonic ); }
				total = total.concat( p );
			}

			if ( short ) {
				var p = [];
				pat3 = harmonyPat[ Math.floor( Math.random() * harmonyPat.length ) ];
				for ( var k = 0; k < rep2 * 3; k++ ) {
					for ( var i = 0; i < pat3.length; i++ ) {
						p.push( {note: tonal.note.midi( s[pat3[i]] ), time: t / 2} );
					}
				}
				if ( total.length > harmonic.length ) { total = total.concat( harmonic ); }
				total = total.concat( p );
			}

			if ( quickDrop ) {
				var dropLength = Math.floor( Math.random() * 8 ) + 4;
				var p = [], pause = true, dur = 2;
				for ( var i = 0; i < dropLength; i++ ) {
					pause = dur > 0.5 ? true : false;
					p.push( {note: n, time: dur, type: 1} );
					// if ( pause ) { p.push( {note: -1, time: dur / 2, type: 1} ); }
					p.push( {note: n, time: dur, type: 1} );
					// if ( pause ) { p.push( {note: -1, time: dur / 2, type: 1} ); }

					dur /= 1.25 ;
					dur = Math.max( dur, 0.25 );
				}
				p.push( {note: -1, time: 6, type: 1} );

				if ( total.length > harmonic.length ) { total = total.concat( harmonic ); }
				total = total.concat( p );
			}

			// console.log( total );
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

