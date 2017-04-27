var tonal = require('tonal')

function ABA(baseNote) {
	var sequence = [0, 2, 0];
	for (var i = 0; i < sequence.length; i++) {sequence[i] += baseNote};
	return sequence;
}

function ABC(baseNote) {
	var sequence = [];
	sequence.push(0);
	sequence.push(sequence[0] + 7);
	sequence.push(sequence[0] + Math.floor(Math.random() * 2) + 3);
	

	for (var i = 0; i < sequence.length; i++) {sequence[i] += baseNote};
	return sequence;
}

function CBA(baseNote) {
	var sequence = [];
	sequence.push(0);
	sequence.push(sequence[0] - Math.floor(Math.random() * 2) - 3);
	sequence.push(sequence[0] - 7);

	for (var i = 0; i < sequence.length; i++) {sequence[i] += baseNote};
	return sequence;
}

function randMofif(baseNote) {
	var r = Math.random();
	if (r < 0.4) {
		return ABA(baseNote);
	} else if (r < 0.7) {
		return ABC(baseNote);
	} else if (r <= 1) {
		return CBA(baseNote);
	} else {
		return [baseNote];
	}
}

// ABCD
// AAAB
// ABAC
// ACBD -> extendable

// Variation based on theme
// Use all notes in scale once?
export function createMainTheme(note) {
	var s = tonal.scale.get('major', note);
	
	// 1st and 3rd notes are beat keeping
	var tempo = [2,1];
	var notes = [s[0],s[2]];

	// Pick 3 random notes, not 1 or 3 to create harmony/melody line
	var options = [];
	for (var i = 0; i < s.length; i++) {
		if (i != 0 && 1 != 2) { options.push(s[i]); }
	}
	options = shuffle(options);

	// Create 3 random delays for the 3 main notes. 
	var delays = [];
	for (var i = 0; i < 3; i++) {
		delays.push(1);
	}

	// Create main music line
	var sumTerm = [0,3,7];
	var mainNotes = [[],[]];
	for (var i = 0; i < 6; i++) {
		// // Add delay
		// for (var j = 0; j < delays[i%3]; j++) {
		// 	mainNotes[0].push(-1);
		// 	mainNotes[1].push(1);
		// }

		// Push motif
		var m = randMofif(tonal.note.midi(options[0]) + sumTerm[i%3] );
		for (var j = 0; j < m.length; j++) {
			mainNotes[0].push(m[j]);
			mainNotes[1].push(1);

			// mainNotes[0].push(-1);
			// mainNotes[1].push(1);
		}
	}

	// Create beat line based on length of main line
	var l = mainNotes[0].length;
	var tl = (Math.ceil(l/2));
	var beatNotes = [[],[]];
	for (var i = 0; i < tl; i++) {
		for (var j = 0; j < tempo.length; j++) {
			if (isNaN(notes[j]))
				beatNotes[0].push(tonal.note.midi(notes[j]));
			else
				beatNotes[0].push(notes[j]);
			beatNotes[1].push(tempo[j]);
		}
	}

	// repeat the melodies a few times
	var repeat = 3;
	for (var i = 0; i < repeat; i++) {
		mainNotes[0] = mainNotes[0].concat(mainNotes[0]);
		mainNotes[1] = mainNotes[1].concat(mainNotes[1]);
		beatNotes[0] = beatNotes[0].concat(beatNotes[0]);
		beatNotes[1] = beatNotes[1].concat(beatNotes[1]);
	}

	return [mainNotes, beatNotes];
}

export function patternedMelody(notes) {
	var newNotes = [[],[]];
	// console.log(notes[0].length);

	for (var i = 0; i < notes[0].length; i++) {
		if (isNaN(notes[0][i])) {
			notes[0][i] = tonal.note.midi(notes[0][i]);
		}
		
		if (i == 0) {
			console.log(notes[0][i] + ' repeat: ' + notes[1][i])
		}

		
		for (var j = 0; j < notes[1][i]; j++) {
			var s = ABC(notes[0][i]);
			newNotes[0].push(s[0]);
			newNotes[0].push(s[1]);
			newNotes[0].push(s[2]);
			newNotes[0].push(-1);

			newNotes[1].push(2);
			newNotes[1].push(1);
			newNotes[1].push(2);
			newNotes[1].push(2);
		}
	}

	console.log(newNotes)
	return newNotes;
}

export function createMelody(note) {
	var s = tonal.scale.get('major', note);

	// pick 4 notes to descend along scale
	var noteNum = [];
	for (var i = 0; i < s.length; i++) { noteNum.push(i); };
	noteNum = shuffle(noteNum);
	noteNum = noteNum.slice(0,4);
	noteNum = noteNum.sort();
	noteNum = noteNum.reverse();

	console.log(noteNum)

	var notes = [[],[]];

	// Variation 1
	for (var i = 0; i < noteNum.length; i++) {
		notes[0].push(tonal.note.midi(s[noteNum[i]]));
		notes[1].push(1);
	}

	var rIdx = Math.floor(Math.random() * 3);
	for (var i = 0; i < 2; i++) {
		notes[0].push(tonal.note.midi(s[noteNum[rIdx]]));
		notes[0].push(tonal.note.midi(s[noteNum[rIdx + 1]]));
		notes[1].push(1);
		notes[1].push(1);
	}

	notes[0].push(tonal.note.midi(s[noteNum[rIdx + 1]]) - 3);
	notes[0].push(-1);
	notes[1].push(2);
	notes[1].push(1);

	// Variation 2
	for (var i = 0; i < noteNum.length; i++) {
		notes[0].push(tonal.note.midi(s[noteNum[i]]));
		notes[1].push(1);
	}

	var delta = [0,3,4];
	rIdx = Math.floor(Math.random() * 2) + 1;
	for (var i = 0; i < 3; i++) {
		var j = i + rIdx;
		notes[0].push(tonal.note.midi(s[noteNum[j % 4]]) - Math.floor(j/4) * 12);
		notes[1].push(1);
	}

	rIdx = Math.floor(Math.random() * 2) + 2;
	for (var i = 0; i < 3; i++) {
		var j = i + rIdx;
		notes[0].push(tonal.note.midi(s[noteNum[j % 4]]) - Math.floor(j/4) * 12);
		notes[1].push(1);
	}

	notes[0].push(tonal.note.midi(s[noteNum[rIdx]]) - delta[i] - 3);
	notes[0].push(-1);
	notes[1].push(4);
	notes[1].push(1);

	// repeat the melodies a few times
	var repeat = 3;
	for (var i = 0; i < repeat; i++) {
		notes[0] = notes[0].concat(notes[0]);
		notes[1] = notes[1].concat(notes[1]);

	}

	return notes;
}

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}