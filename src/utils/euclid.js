export {euclid}

// http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf
// The euclid function is an implementation of the Bjorklund algorithm
// described in the paper linked above.

function euclid(m, k) {
	// Create the head 1's and tail 0's
	var head = [];
	var tail = [];
	for (var i = 0; i < m; i++) { head.push([1]) };
	for (var i = 0; i < k-m; i++) { tail.push(0) };

	// When m>=k/2, we need to add the extra 1's to the tail.
	if (m >= Math.floor(k/2)) {
		// Remove extra 1's from head. Then assign all 0's to each head.
		var overflow = k - m;
		head.splice(overflow, m-overflow);
		for (var i = 0; i < head.length; i++) {
			var t = tail.pop();
			head[i].push(t);
		}

		// Create new tail of 1's
		for (var i = 0; i < m - overflow; i++) { tail.push(1) };
	}
	
	if (head.length == 0) { head = [[]]; }

	// Run algorithm as usual.
	var result = euclidHelper(head, tail);
	head = result.h;

	var rhythm = [];
	for (var i = 0; i < head.length; i++) {
		rhythm = rhythm.concat(head[i]);
	}
	return rhythm;
}

function euclidHelper(head, tail) {
	while (tail.length > 0) {
		if (tail.length < head.length) {
			head[head.length-1] = head[head.length-1].concat(tail);
			break;
		}

		for (var i = 0; i < head.length; i++) {
			if (tail.length == 0)
				break;
			var t = tail.pop();
			head[i].push(t);
		}
	}
	return {h: head, t: tail};
}