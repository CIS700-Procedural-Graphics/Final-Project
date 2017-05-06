import lerp from './utilities.js'

// http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
export default function Smooth1DNoise( amplitude, scale, length ) {
	var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;

    // Populate random variable list
    var r = [];
    for ( var i = 0; i < MAX_VERTICES; i++ ) {
        r.push(Math.random());
    } 

    // Generate enough points to create a contour
    var x = [];
    for ( var i = 0; i < Math.max(length, 100); i++ ) {
    	x.push(i);
    }

    // Calculate noise at each x value
    var y = [];
    for ( var i = 0; i < x.length; i++) {
    	var scaledX = x[i] * scale;
    	var floorX  = Math.floor(scaledX);
    	var t = scaledX - floorX;
    	var tSmooth = t * t * ( 3 - 2 * t );

    	var xMin = floorX % MAX_VERTICES_MASK;
    	var xMax = xMin + 1;

    	y.push( amplitude * lerp( r[xMin], r[xMax], tSmooth ) );
    }

    return y;
}