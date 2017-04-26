const THREE = require('three');

var width;
var depth;

function distribution(previous, radius, jitter, smoothness) 
{
	return radius + Math.random() * jitter - jitter/2;
}

function gaussian(data, num, w, h) 
{
    // blur X
    for (var i = 0; i < num; i++) {
    	var new_arr = new Uint8Array(data.length);
    	for (var i = 0; i < w; i ++) {
    		for (var j = 0; j < h; j++) {
    			var index = i * w + j;
	    		var x0 = data[index];
			    var x_1 = data[index - 1];
			    var x_2 = data[index - 2];
			    var x1 = data[index + 1];
			    var x2 = data[index + 2];
			    var value = 0.06136*x_2 + 0.24477*x_1 + 0.38774*x0 + 0.24477*x1 + 0.06136*x2;
			    new_arr[index] = value;
    		}    		
    	}
    	data = new Uint8Array(new_arr);
    }
    // blur Z
    for (var c = 0; c < num; c++) {
    	var new_arr = new Uint8Array(data.length);
    	for (var j = 0; j < h; j ++) {
    		for (var i = 0; i < w; i++) {
    			var index = i * w + j;
	    		var x0 = data[index];
			    var x_1 = data[index - w];
			    var x_2 = data[index - w];
			    var x1 = data[index + w];
			    var x2 = data[index + w];
			    var value = 0.06136*x_2 + 0.24477*x_1 + 0.38774*x0 + 0.24477*x1 + 0.06136*x2;
			    new_arr[index] = value;
    		}
    	}
    	data = new Uint8Array(new_arr);
    }
}

// center and radius of path loop
export function makeSpline(radius, num, jitter, smoothness) 
{
  var randomPoints = [];
  var two_pi = 2 * Math.PI;
  var r = radius;
  var minX, minZ = Infinity; 
  var maxX, minZ = - Infinity;
  for ( var i = 0; i < two_pi; i += two_pi/num ) {
  	var angle = i + Math.random() * two_pi/num;
  	r = distribution(r, radius, jitter, smoothness);
  	var point = new THREE.Vector3(r * Math.cos(angle), 0, r * Math.sin(angle));

  	if (point.x < minX) minX = point.x;
  	if (point.x > maxX) maxX = point.x;
  	if (point.z < minZ) minZ = point.z;
  	if (point.z > maxZ) maxZ = point.z;

    randomPoints.push(point);
  }
  width = maxX - minX;
  depth = maxZ - minZ;
  var spline = new THREE.CatmullRomCurve3(randomPoints);
  spline.closed = true;
  return {
      spline: spline,
      dim: [width, depth],
      center: [minX + width/2, minZ + depth/2]
    };
}

export function makeSplineTexture(spline, dim) 
{
	var w = dim[0];
	var h = dim[1]
	var data = new Uint8Array( w * h);
	data.fill(0);

	// initialize data
	var points = spline.getPoints( 100 );
	for (var i = 0; i < 100; i ++) {
		var index = w * points[i].x + points[i].z;
		data[index] = 1;
	}

	gaussian(data, 4, w, h);

	var texture = new THREE.DataTexture(data, width, height, THREE.FloatType);
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