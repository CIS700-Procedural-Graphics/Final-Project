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

	var notes = [];
	var s = tonal.scale.get('major', 'C4');
	for (var i = 0; i < analogRhythm.length; i++) {
		// notes.push({note : (i==0 ? 20:31), time : analogRhythm[i] * unitTime});
		notes.push({note : MorseThueSingle(2, 1, i, s), time : analogRhythm[i] * unitTime});
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