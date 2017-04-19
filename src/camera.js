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