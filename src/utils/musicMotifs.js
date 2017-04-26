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
	if (r < 0.25) {
		return [ABA(baseNote),[1,1,1]];
	} else if (r < 0.5) {
		return [ABC(baseNote),[1,1,1]];
	} else if (r < 0.75) {
		return [CBA(baseNote),[1,1,1]];
	} else {
		return [[baseNote],[3]];
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
	var ss = shuffle(s);

	var theme = [[],[]];
	for (var i = 0; i < ss.length; i++) {
		var m = randMofif(tonal.note.midi(ss[i]));
		
		for (var j = 0; j < m[0].length; j++) {
			console.log('i: ' + i + 'j: ' + j + ' Pushing note: ' + m[0][j] + ' length: ' + m[1][j]);
			theme[0].push(m[0][j]);
			theme[1].push(m[1][j]);
		}
	}

	return theme;
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