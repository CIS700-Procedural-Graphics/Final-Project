

export default function lerp( a, b, t ) {
	return a * ( 1 - t) + b * t;
}

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
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

export function findClosest( array, value ) {
	var minDiff = 10000, idx = 0, min;
	for ( var i = 0; i < array.length; i++ ) {
		min = Math.abs( array[i] - value );
		if ( min < minDiff ) {
			minDiff = min;
			idx = i;
		}
	}

	return {index: idx, value: array[idx], diff: minDiff};
}