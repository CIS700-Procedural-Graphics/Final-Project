const THREE = require('three');

// Returns a Vector2 based on 
function polarToCart2D(r, theta) {
	var x = r * Math.cos(theta);
	var y = r * Math.sin(theta);
	return new THREE.Vector2(x, y);
}

// Spherical Product
function polarToCart3D(r1, theta, r2, phi) {
	var x = r1 * Math.cos(theta) * r2 * Math.cos(phi);
	var y = r1 * Math.sin(theta) * r2 * Math.sin(phi);
	var z = r2 * Math.sin(phi);
}

function cartToPolar2D(v2, r, theta) {
	r = v2.length();
	theta = Math.atan(v2);
}


// TODO: To Cylinderal Coordinates
function cartToPolar3D(v3, r1, theta, r2, phi) {
}


// Returns radius
function superformula(a, b, m, n1, n2, n3, phi) {
	return (1.0 / n1) * (Math.pow(Math.abs(Math.cos(m * phi * 0.25) / a), n2) + 
		   				 Math.pow(Math.abs(Math.sin(m * phi * 0.25) / a), n3));
}

// Theta
export function superformulaTo2D(a, b, m, n1, n2, n3, theta) {
	var r = superformula(a, b, m, n1, n2, n3, phi);
	return polarToCart2D(r, phi);
}

export function superformulaTo3D(a, b, m, n1, n2, n3, theta, aa, bb, mm, nn1, nn2, nn3, phi) {
	var r1 = superformula(a, b, m, n1, n2, n3, theta);
	var r2 = superformula(aa, bb, mm, nn1, nn2, nn3, phi);
	return polarToCart3D(r1, theta, r2, phi);
}
