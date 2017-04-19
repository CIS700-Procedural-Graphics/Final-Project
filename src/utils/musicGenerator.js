var tonal = require('tonal')


export function beatGenerator(rhythm, tempo, n) {
	var unitTime = 60 / tempo;
	var analogRhythm = getAnalogRhythm(rhythm);
	// console.log(analogRhythm)

	var notes = [];
	var t = 0;
	for (var i = 0; i < n; i++) {
		var t = analogRhythm[i % analogRhythm.length] + Math.floor(i / analogRhythm.length) * analogRhythm[analogRhythm.length-1];

		notes.push({note : 'D3', time : t * unitTime});

	}
	// console.log(notes)
	// console.log(baseConversion(101,2));
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

// n is number of notes
export function EarthWorm(init, multi, digits, n, tempo) {
	var unitTime = 60 / tempo;
	var scaleTypes = tonal.scale.names();
	var scaleIdx = Math.floor( Math.random() * scaleTypes.length );
	var s = tonal.scale.get('major', 'C4');

	var ts = tonal.map(tonal.transpose('8P'), s)
	s = s.concat(ts);


	var notes = [];
	var val = init;
	var restraint = Math.pow(10, digits);
	for (var i = 0; i < n; i++) {
		val *= multi;
		val = val % restraint;
		notes[i] = { note: s[val % s.length], time: i*unitTime };
	}

	// console.log(notes) 
	return notes;
}

// n is total number of notes
export function melodyGenerator(n, tempo, base, multi) {
	var unitTime = 60 / tempo;
	var notes = [[],[]];
	var mel = melodyNotes(n, base, multi);
	for ( var i = 0; i < mel[0].length; i++ ) {
		var t = i * unitTime;
		notes[0].push({ note: tonal.note.midi(mel[0][i]), time: t });
	}
	for ( var i = 0; i < mel[1].length; i++ ) {
		notes[1].push({ note: tonal.note.midi(mel[1][i]), time: i * unitTime / 4 });
	}

	return notes;
}

export function rhythmicMelodyGenerator(n, rhythm, tempo, base, multi) {
	var unitTime = 60 / tempo;
	var notes = [[],[],[]];
	var mel = melodyNotes(n, base, multi);
	// console.log(mel)

	var aRhythm = getAnalogRhythm(rhythm);

	// var timetest = [];
	for ( var i = 0; i < mel[0].length; i++ ) {
		var c = createChord(mel[0][i]);
		var t = (aRhythm[i % aRhythm.length] + Math.floor(i/aRhythm.length) * (aRhythm[aRhythm.length-1] + 1)) * unitTime;
		notes[0].push( {note: mel[0][i], time: t} );
		// notes[1].push( {note: c[1], time: t} );

		// notes[2].push( {note: c[2], time: t} );
		// timetest.push(Math.log((t+2) * (t+2)))
	} 

	// console.log(timetest)
	return notes;
}

function melodyNotes(n, base, multi) {
	var scaleTypes = tonal.scale.names();
	var scaleIdx = Math.floor( Math.random() * scaleTypes.length );
	var s = tonal.scale.get('major', 'C4');

	var ts = tonal.map(tonal.transpose('8P'), s)
	s = s.concat(ts);
	// s = s.concat(tonal.map(tonal.transpose('8P'), ts));
	// console.log(s)

	// s.reverse();

	var chordTypes = tonal.chord.names();
	var chordIdx = Math.floor( Math.random() * chordTypes.length );	

	var notes = [[],[]];
	for ( var i = 0; i < n; i++ ) {
		var note = MorseThueSingle( base, multi, i, s )
		

		// Transpose note up 3 octaves for the arpeggios.
		var tNote = note;
		// tNote = tonal.transpose( tNote, 'P5' );
		// tNote = tonal.transpose( tNote, '8P' );
		// tNote = tonal.transpose( tNote, '8P' );

		// Create a chord
		// var chord = tonal.chord.get( chordTypes[chordIdx], tNote );
		var chord = createChord(note);
		notes[0].push( tNote );

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
	val = baseConversion(val, base);
	val = sumDigits(val) % scale.length;
	// console.log(n + " val: " + val)
	return scale[val];
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

function baseConversion(number, base) {
	var base10Num = 0;
	var str = number.toString();

	for (var i = 0; i < str.length; i++) {
		base10Num += parseInt(str.charAt(i), 10) * Math.pow(base, str.length - i - 1);
	}

	return base10Num;
}

function getAnalogRhythm(digitalRhythm) {
	var analogRhythm = [];
	for (var i = 0; i < digitalRhythm.length; i++) {
		if (digitalRhythm[i] == 1 && i > 0) {
			analogRhythm.push(i-1);
		} 
	}
	analogRhythm.push(digitalRhythm.length - 1);
	return analogRhythm;
}