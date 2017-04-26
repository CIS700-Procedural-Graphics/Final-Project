var tonal = require('tonal')


export function beatGenerator(rhythm, tempo, n, drumNote = 'G3') {
	var unitTime = 60 / tempo;
	var analogRhythm = getAnalogRhythm(rhythm);
	// console.log(analogRhythm)

	var notes = [[],[]];
	var t = 0;
	for (var i = 0; i < n; i++) {
		var r = rhythm[i % rhythm.length];
		var note = (r == 1) ? drumNote : -1;

		notes[0].push(tonal.note.midi(note));
		notes[1].push(1);
		
	}

	return notes;
}

export function noteBeats(rhythm, note, n) {
	var notes = [[],[]];

	var sn = tonal.note.midi(note);
	var tempPattern = [sn,sn+2,sn+3,sn-2];
	var tempTime = [3,1,1,2];

	for (var i = 0; i < n; i++) {
		if (rhythm[i % rhythm.length] == 1) {
			for (var j = 0; j < tempPattern.length; j++) {
				var toPush = tempPattern[j];
				if (j == tempPattern.length-1) {toPush += Math.floor(Math.random() * 6) - 3};

				notes[0].push(toPush);
				notes[1].push(tempTime[j]);
			}
			notes[0].push(-1);
			notes[1].push(1);

		} else {
			for (var j = 0; j < 5; j++) {
				notes[0].push(-1);
				notes[1].push(1);
			}
		}
	}


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
	var s = tonal.scale.get('major', 'C3');

	var ts = tonal.map(tonal.transpose('8P'), s)
	s = s.concat(ts);

	var rhythm = [4,1,2,1];
	var baseNote = 'C4';

	var notes = [[],[]];
	var val = init;
	var restraint = Math.pow(10, digits);
	for (var i = 0; i < n; i++) {
		val *= multi;
		val = val % restraint;

		// notes[0].push( (i % 2 == 0) ? baseNote : (tonal.note.midi(baseNote) + val % 7) );
		// notes[0].push( (tonal.note.midi(baseNote) + val % 7) );
		notes[0].push( tonal.note.midi(s[val%s.length]));

		notes[1].push( rhythm[i%rhythm.length] );
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
	var notes = [[],[]];
	var mel = melodyNotes(n, base, multi);
	var aRhythm = [2, 1, 1, 1];


	for ( var i = 0; i < mel[0].length; i++ ) {
		// var c = createChord(mel[0][i]);
		// var t = (aRhythm[i % aRhythm.length] + Math.floor(i/aRhythm.length) * (aRhythm[aRhythm.length-1] + 1)) * unitTime;
		// notes[0].push( {note: mel[0][i], time: t} );

		var noteLength = aRhythm[i%aRhythm.length];

		notes[0].push(mel[0][i]);
		notes[1].push(noteLength);

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

