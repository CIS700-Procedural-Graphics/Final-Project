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

	return new THREE.Vector3(x, y, z);
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

function superformulaTo2D(a, b, m, n1, n2, n3, theta) {
	var r = superformula(a, b, m, n1, n2, n3, phi);
	return polarToCart2D(r, phi);
}

function superformulaTo3D(a, b, m, n1, n2, n3, theta, aa, bb, mm, nn1, nn2, nn3, phi) {
	var r1 = superformula(a, b, m, n1, n2, n3, theta);
	var r2 = superformula(aa, bb, mm, nn1, nn2, nn3, phi);
	return polarToCart3D(r1, theta, r2, phi);
}

// Maps a which is originally in range [start1, end1] to [start2, end2]
function map(a, start1, end1, start2, end2) {
	var part = (a - start1) / (end1 - start1);
	return part * (end2 - start2) + start2;
}

// Returns a random number within a range
function randRange(min, max) {
	return (max - min) * Math.random() + min;
}

var maxi = 128;
var maxj = 64;
export function sfmesh(a=1, b=1, m=3, n1=30, n2=15, n3=15, aa=1, bb=1, mm=3, n1=30, n2=30, n3=15) {
	for (var i = 0; i < maxi; i++) {
		for (var j = 0; j < maxj; j++) {
			var u = map(i, 0, maxi, -Math.PI, Math.PI);
			var v = map(j, 0, maxj, -Math.PI/2.0, Math.PI/2.0);

			var pt = superformulaTo3D(a, b, m, n1, n2, n3, u, aa, bb, mm, nn1, nn2, nn3, v);
		}
	}
}

export default function superformula() {
	this.maxi = 128;
	this.maxj = 64;
	this.geometry = new THREE.Geometry();  // Superformula Mesh

	this.a = 1;
	this.b = 1;
	this.m = 3;
	this.n1 = 30;
	this.n2 = 15;
	this.n3 = 15;
	this.aa = 1;
	this.bb = 1;
	this.mm = 3;
	this.nn1 = 30;
	this.nn2 = 30;
	this.nn3 = 15;

	// Use this to initialize the mesh
	this.init = function() {
		for (var i = 0; i < maxi; i++) {
			for (var j = 0; j < maxj; j++) {
				this.geometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));
			}
		}

		// Faces along the barrel
		for (var i = 0; i < maxi - 1; i++) {
			for (var j = 0; j < maxj - 1; j++) {
				// Push triangle faces
				this.geometry.faces.push(new THREE.Face3(getidx(i, j), getidx(i, j + 1), getidx(i + 1, j + 1)));
				this.geometry.faces.push(new THREE.Face3(getidx(i, j), getidx(i + 1, j), getidx(i + 1, j + 1)));
			}
		}

		// "Top" and "Bottom" Cap
		for(var i = 0; i < maxi - 1; i++) {
			this.geometry.faces.push(new THREE.Face3(getidx(0, 0), getidx(i, 0), getidx(i + 1, 0)));
			this.geometry.faces.push(new THREE.Face3(getidx(0, maxj - 1), getidx(i, maxj - 1), getidx(i + 1, maxj - 1)));
		}

		// Actually calculate the vertices
		sfvert();
	}

	this.setState = function(a, b, m, n1, n2, n3, aa, bb, mm, nn1, nn2, nn3) {
		this.a = a;
		this.b = b;
		this.m = m;
		this.n1 = n1;
		this.n2 = n2;
		this.n3 = n3;
		this.aa = aa;
		this.bb = bb;
		this.mm = mm;
		this.nn1 = nn1;
		this.nn2 = nn2;
		this.nn3 = nn3;

		// Update Vertices
		sfvert();
	}

	this.getidx = function(i, j) {
		return i * maxi + j;
	}

	// Calculates all of the vertices
	this.sfvert = function() {
		for (var i = 0; i < maxi; i++) {
			for (var j = 0; j < maxj; j++) {
				var u = map(i, 0, maxi, -Math.PI, Math.PI);
				var v = map(j, 0, maxj, -Math.PI/2.0, Math.PI/2.0);

				var pt = superformulaTo3D(this.a, this.b, this.m, this.n1, this.n2, this.n3, u, 
										  this.aa, this.bb, this.mm, this.nn1, this.nn2, this.nn3, v);
				this.geometry.vertices[getidx(i, j)] = pt; 
			}
		}		
	}

	this.update = function() {
		// Lerp
	}
}