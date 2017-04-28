const THREE = require('three');

var width;
var depth;

// radius: max
// previous radius
// smoothness: how much radius can change from previous
function distribution(previous, radius, smoothness) 
{
	// var delta = Math.random();
	// var r += Math.min(smoothness, delta);
	// return Math.min(r, radius);
	return Math.min(radius, previous + (Math.random() - 0.5) * 20);
}

function clamp(x, min, max) {
	return Math.min(Math.max(x, min), max);
}

function widen(data, num, w, h) {
	var new_arr = new Uint8Array(data.length);
	for (var i = 0; i < w; i ++) {
		for (var j = 0; j < h; j++) {
			var start = [Math.max(0, i - num), Math.max(0, j - num)];
			var end = [Math.min(i + num, w - 1), Math.min(j + num, h - 1)];
			var maxVal = 0;
			for (var a = start[0]; a <= end[0]; a ++) {
				for (var b = start[1]; b <= end[1]; b ++) {
					var index = a * h + b; 
					if (data[index] > maxVal) maxVal = data[index];
				}
			}
			new_arr[i * h + j] = maxVal;
		}
	}
	return new_arr;
}

// arr: gaussian kernel or widening
function gaussian(data, num, w, h) 
{
    // blur Z
    for (var c = 0; c < num; c++) {
    	var new_arr = new Uint8Array(data.length);
    	for (var j = 0; j < h; j ++) {
    		for (var i = 0; i < w; i++) {
    			var index = i * h + j;
	    		var x0 = data[index];
			    var x_1 = data[(index - h) < 0 ? index : index - h];
			    var x_2 = data[(index - 2 *h) < 0 ? ((index - h < 0) ? index : index - h) : index - 2 * h];
			    var x1 = data[(index + h) >= data.length ? index : index + h];
			    var x2 = data[(index + 2 *h) >= data.length ? ((index + h >= data.length) ? index : index + h) : index + 2 * h];
			    var value = 0.1784*x_2 + 0.210431*x_1 + 0.222338*x0 + 0.210431*x1 + 0.1784*x2;
			    new_arr[index] = value;
    		}
    	}
    	data = new Uint8Array(new_arr);
    }

    // blur X
    for (var c = 0; c < num; c++) {
    	var new_arr = new Uint8Array(data.length);
    	for (var i = 0; i < w; i ++) {
    		for (var j = 0; j < h; j++) {
    			var index = i * h + j;
	    		var x0 = data[clamp(index, i*h, (i+1)*h - 1)];
			    var x_1 = data[clamp(index - 1, i*h, (i+1)*h - 1)];
			    var x_2 = data[clamp(index - 2, i*h, (i+1)*h - 1)];
			    var x1 = data[clamp(index + 1, i*h, (i+1)*h - 1)];
			    var x2 = data[clamp(index + 2, i*h, (i+1)*h - 1)];
			    var value = 0.1784*x_2 + 0.210431*x_1 + 0.222338*x0 + 0.210431*x1 + 0.1784*x2;			    new_arr[index] = value;
    		}    		
    	}
    	data = new Uint8Array(new_arr);
    }
    return data;
}

// center and radius of path loop
export function makeSpline(radius, num, smoothness) 
{
  var randomPoints = [];
  var two_pi = 2 * Math.PI;
  var r = radius;
  for ( var i = 0; i < two_pi; i += two_pi/num ) {
  	// stratified angle sampling
  	var angle = i + Math.random() * two_pi/num;
  	r = distribution(r, radius, smoothness);
  	var point = new THREE.Vector3(r * Math.cos(angle) + radius, 0, r * Math.sin(angle) + radius);

    randomPoints.push(point);
  }
  var spline = new THREE.CatmullRomCurve3(randomPoints);
  spline.closed = true;
  return spline;
}

export function makeSplineTexture(spline, radius) 
{
	var w = 128;
	var h = 128;
	var r2 = 2 * radius;
	var data = new Uint8Array( w * h);
	data.fill(0);

	// initialize data
	var points = spline.getPoints( 1024 );
	for (var i = 0; i < points.length; i ++) {
		var index = Math.floor(points[i].x / r2 * w) * h + Math.floor(points[i].z / r2 * h);
		data[index] = 255;
	}

	data = widen(data, 3, w, h);
	data = gaussian(data, 6, w, h);

	var data4 = new Uint8Array( 4 * w * h);
	for (var i = 0; i < data.length; i ++) {
		data4[4*i] = data[i];
		data4[4*i + 1] = data[i];
		data4[4*i + 2] = data[i];
		data4[4*i + 3] = data[i];
	}

	var texture = new THREE.DataTexture(data4, w, h, THREE.RGBAFormat);
	texture.type = THREE.UnsignedByteType;
	texture.needsUpdate = true;

	return texture;
}

export function updateCamera(camera, spline, camPosIndex) 
{
      
      var camPos = spline.getPoint(camPosIndex / 10000);
      var camRot = spline.getTangent(camPosIndex / 10000);

      camera.position.x = camPos.x;
      camera.position.y = camPos.y;
      camera.position.z = camPos.z;

      camera.rotation.x = camRot.x;
      camera.rotation.y = camRot.y;
      camera.rotation.z = camRot.z;

      camera.lookAt(spline.getPoint((camPosIndex+1) / 10000));
}