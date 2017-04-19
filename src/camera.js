const THREE = require('three');

function distribution(previous, radius, jitter, smoothness) {
	return radius + Math.random() * jitter - jitter/2;
}

// center and radius of path loop
export function makeSpline(radius, num, jitter, smoothness) {
  var randomPoints = [];
  var two_pi = 2 * Math.PI;
  var r = radius;
  for ( var i = 0; i < two_pi; i += two_pi/num ) {
  	var angle = i + Math.random() * two_pi/num;
  	r = distribution(r, radius, jitter, smoothness);
  	var point = new THREE.Vector3(r * Math.cos(angle), 0, r * Math.sin(angle));
    randomPoints.push(point);
  }
  var spline = new THREE.CatmullRomCurve3(randomPoints);
  spline.closed = true;
  return spline;
}

export function makeSplineTexture(spline) {
	 // create an offscreen canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // size the canvas to your desired image
    canvas.width = 60;
    canvas.height = 60;

    // get the imageData and pixel array from the canvas
    var imgData = ctx.getImageData(0, 0, 40, 30);
    var data = imgData.data;

    // manipulate some pixel elements
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255; // set every red pixel element to 255
        data[i + 1] = 255; // set every red pixel element to 255
        data[i + 3] = 255; // make this pixel opaque
    }

    // put the modified pixels back on the canvas
    ctx.putImageData(imgData, 0, 0);

    // create a new img object
    var image = new Image();

    // set the img.src to the canvas data url
    image.src = canvas.toDataURL();

    // append the new img object to the page
    document.body.appendChild(image);
}

export function updateCamera(camera, spline, camPosIndex) {
      
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