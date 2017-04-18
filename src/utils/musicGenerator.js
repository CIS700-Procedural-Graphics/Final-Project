var tonal = require('tonal')


export function beatGenerator(rhythm, tempo) {
	var unitTime = 60 / tempo / rhythm.length * 4;
	var analogRhythm = [];
	var beatLength = 0;
	for (var i = 0; i < rhythm.length; i++) {
		if (rhythm[i] == 1 && i > 0) {
			analogRhythm.push(i-1);
		} 
	}
	analogRhythm.push(rhythm.length - 1);
	// console.log(analogRhythm)

	var notes = [[],[],[],[]];
	var s = tonal.scale.get('minor', 'C4');
	var chordTypes = tonal.chord.names();
	var chordIdx = Math.floor(Math.random() * chordTypes.length);
	// console.log(tonal.chord.get('Maj7','C4'))
	for (var i = 0; i < analogRhythm.length; i++) {
		// notes.push({note : (i==0 ? 20:31), time : analogRhythm[i] * unitTime});
		var baseNote = MorseThueSingle(6, 7, i, s);
		var thisChord = tonal.chord.get(chordTypes[chordIdx], baseNote);
		notes[0].push({note : thisChord[0], time : analogRhythm[i] * unitTime});
		if (i % 4 == 0) {
			notes[1].push({note : thisChord[1], time : analogRhythm[i] * unitTime});
			notes[2].push({note : thisChord[2], time : analogRhythm[i] * unitTime});
			if (thisChord.length > 3)
				notes[3].push({note : thisChord[3], time : analogRhythm[i] * unitTime});
		}

	}
	// console.log(notes)
	return notes;
}

// n is number of notes
export function MorseThue(base, multi, n, tempo) {
	var s = tonal.scale.get('major', 'C4');
	var unitTime = 60 / tempo / n * 4;
	var notes = [];
	for (var i = 0; i < n; i++) {
		notes.push({note: MorseThueSingle(base, multi, i, s), time: i * unitTime});
	}
	return notes;
}

// n is total number of notes
export function melodyGenerator(n, tempo) {
	var unitTime = 60 / tempo;
	// var scaleTypes = tonal.scale.names();
	// var scaleIdx = Math.floor( Math.random() * scaleTypes.length );
	// var s = tonal.scale.get(scaleTypes[scaleIdx], 'C2');
	// s.reverse();

	// var chordTypes = tonal.chord.names();
	// var chordIdx = Math.floor( Math.random() * chordTypes.length );	

	// var notes = [[],[]];
	// for ( var i = 0; i < n; i++ ) {
	// 	var note = MorseThueSingle( 6, 7, i, s )
	// 	notes[0].push( {note: note, time: i * unitTime} );


	// 	// Transpose note up 3 octaves for the arpeggios.
	// 	var tNote = note;
	// 	tNote = tonal.transpose( tNote, '8P' );
	// 	tNote = tonal.transpose( tNote, '8P' );
	// 	// tNote = tonal.transpose( tNote, '8P' );

	// 	// Create a chord
	// 	var chord = tonal.chord.get( chordTypes[chordIdx], tNote );
	// 	// chord = tonal.chord.inversion(0, chord);

	// 	// Adjust arpeggio pattern if 3 note chord.
	// 	if ( chord.length == 3 ) { chord.push(chord[1]); }

	// 	// Push notes at 16th time
	// 	for ( var j = 0; j < 4; j++ ) {
	// 		notes[1].push( {note: chord[j], time: i * unitTime + j * unitTime / 4} );
	// 	}
	// }
	var notes = [[],[]];
	var mel = melodyNotes(n);
	for ( var i = 0; i < mel[0].length; i++ ) {
		notes[0].push( {note: mel[0][i], time: i * unitTime})
	}
	for ( var i = 0; i < mel[1].length; i++ ) {
		notes[1].push( {note: mel[1][i], time: i * unitTime / 4})
	}

	return notes;
}

function melodyNotes(n) {
	var scaleTypes = tonal.scale.names();
	var scaleIdx = Math.floor( Math.random() * scaleTypes.length );
	var s = tonal.scale.get(scaleTypes[scaleIdx], 'C4');
	s.reverse();

	var chordTypes = tonal.chord.names();
	var chordIdx = Math.floor( Math.random() * chordTypes.length );	

	var notes = [[],[]];
	for ( var i = 0; i < n; i++ ) {
		var note = MorseThueSingle( 3, 4, i, s )
		notes[0].push( note );

		// Transpose note up 3 octaves for the arpeggios.
		var tNote = note;
		tNote = tonal.transpose( tNote, '3M' );
		// tNote = tonal.transpose( tNote, '8P' );
		// tNote = tonal.transpose( tNote, '8P' );

		// Create a chord
		// var chord = tonal.chord.get( chordTypes[chordIdx], tNote );
		var chord = createChord(tNote);
		// chord = tonal.chord.inversion(0, chord);

		// Adjust arpeggio pattern if 3 note chord.
		if ( chord.length == 3 ) { chord.push(chord[1]); }

		// Push notes at 16th time
		for ( var j = 0; j < 4; j++ ) {
			notes[1].push( chord[j] );
		}
	}

	return notes;
}

// Alternative chord creation
// https://github.com/devinroth/GenerativeMusic/blob/master/Moonlight.playground/Contents.swift
function createChord(note) {
	var midiNote = tonal.note.midi(note);
	var third = midiNote + 3 + Math.round(Math.random() * 2);
	var fifth = midiNote + 7;
	return [midiNote, third, fifth];
}

function MorseThueSingle(base, multi, n, scale) {
	var val = n * multi;
	val = parseInt(val.toString(base), 10);
	val = sumDigits(val) % scale.length;
	return scale[val]
}

// http://stackoverflow.com/questions/9138064/sum-of-the-digits-of-a-number-javascript
function sumDigits(number) {
  var str = number.toString();
  var sum = 0;

  for (var i = 0; i < str.length; i++) {
    sum += parseInt(str.charAt(i), 10);
  }

  return sum;
}