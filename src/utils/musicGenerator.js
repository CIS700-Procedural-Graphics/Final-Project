


export default function beatGenerator(rhythm, tempo) {
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
	for (var i = 0; i < analogRhythm.length; i++) {
		notes.push({note : (i==0 ? 30:60), time : analogRhythm[i] * unitTime});
	}
	// console.log(notes)
	return notes;
}