const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const MeshLine = require( 'three.meshline' );

// Each scene uses the following API:
//        initScene()
//        updateScene()
//        changeTrigger()
//        cleanupScene()

/*********************************** VISUAL ***********************************/
function initScene(framework, visualConfig) {
    var camera = framework.camera;
    var scene = framework.scene;

    var earthRadius = 10;

    visualConfig.camera.pos = new THREE.Vector3( 0,earthRadius + 5,0 );

    camera.position.set(visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z);
    camera.lookAt(new THREE.Vector3(0,earthRadius/1.5,earthRadius));
    camera.fov = 20;
    camera.updateProjectionMatrix();
    scene.background = new THREE.Color( 0x000000 );

    var geometry = new THREE.IcosahedronGeometry( earthRadius,6 );
    var edgeGeo = new THREE.EdgesGeometry( geometry );
    var material = new THREE.ShaderMaterial({
      uniforms: {
      },
      side: THREE.FrontSide,
      vertexShader: require('./shaders/terrain-vert.glsl'),
      fragmentShader: require('./shaders/terrain-frag.glsl')
    });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0,0,0);
    mesh.name = "earth";
    scene.add(mesh);

    var geometry = new THREE.Geometry();
    for (var i = 0; i < 500; i++) {
      var s = Math.random();
      var starGeo = new THREE.BoxGeometry( 0.05 * s, 0.05 * s, 0.05 * s );
      var starMat = new THREE.MeshBasicMaterial({ color: Math.round(Math.random() * 16777215) });
      var starMesh = new THREE.Mesh(starGeo, starMat);

      var r = Math.random() * 50 + 20;
      var theta = Math.random() * 2 * Math.PI;
      var y = r * Math.sin(theta);
      var z = r * Math.cos(theta);
      var x = (Math.random() - 0.5) * 8;
      starMesh.position.set( x, y, z );
      starMesh.updateMatrix();
      geometry.merge(starMesh.geometry, starMesh.matrix)

    }
    mesh = new THREE.Mesh( geometry );
    mesh.name = "large_star_cloud";
    mesh.visible = true;
    scene.add( mesh );

    visualConfig.sceneProps = {};
    visualConfig.sceneReady = true;
}

function updateScene(scene, visualConfig, delta) {
  if (visualConfig.sceneReady) {

  	var earth = scene.getObjectByName("earth");
  	if (earth !== undefined) {
      var earthVel = 0.5;
      earth.rotateX(delta * earthVel);
  	}

    var stars = scene.getObjectByName("large_star_cloud");
  	if (stars !== undefined) {
  		var vel = 0.1;
  		stars.rotateX(delta * vel);
  	}
  }
}

function changeTrigger(visualConfig) {
  return false;
}

function cleanupScene(scene) {
  scene.background = new THREE.Color( 0xff0000 );
  while(scene.children.length > 0){
    scene.remove(scene.children[0]);
  }
}

/*********************************** EXPORT ***********************************/

export default {
  initScene: initScene,
  updateScene: updateScene,
  changeTrigger: changeTrigger,
  cleanupScene: cleanupScene
}

export function other() {
  return 2
}
