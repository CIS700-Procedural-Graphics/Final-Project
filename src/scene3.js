const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const MeshLine = require( 'three.meshline' );

// Each scene uses the following API:
//        initScene()
//        updateScene()
//        changeTrigger()
//        cleanupScene()

/*********************************** VISUAL ***********************************/
function randomVector3(scale) {
  if (Math.random() < 0.1) {
    return new THREE.Vector3(
      (Math.random() - 0.5) * scale,
      (Math.random() - 0.2) * scale,
      (Math.random() - 0.5) * scale
    );
  } else {
    return new THREE.Vector3( 0,0,0 );
  }
}


function initScene(framework, visualConfig) {
    var camera = framework.camera;
    var scene = framework.scene;

    visualConfig.sceneProps = {};
    visualConfig.sceneProps.boids = [];

    var geometry = new THREE.ConeGeometry( 2,7,3 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    for (var i = 0; i < 100; i++) {

      var pos = randomVector3(200);
      var vel = randomVector3(5);
      var acc =  randomVector3(0.1);
      var lookAt = pos.clone().add(vel);

      var boid = new THREE.Mesh( geometry, material );
      boid.position.set( pos.x,pos.y,pos.z );
      boid.name = "boid"+i;
      visualConfig.sceneProps.boids.push({
        name: "boid"+i,
        mesh: boid,
        pos: pos,
        vel: vel,
        acc: acc,
        lookAt: lookAt,
      });
      scene.add(visualConfig.sceneProps.boids[i].mesh);
    }





    visualConfig.sceneReady = true;
}

function boidFlockCenter(b, visualConfig) {
  var center = new THREE.Vector3( 0,0,0 );
  var count = 0;
  for (var i = 0; i < visualConfig.sceneProps.boids.length; i++) {
    var dist = visualConfig.sceneProps.boids[i].pos.clone().sub(visualConfig.sceneProps.boids[b].pos);
    if (i !== b && Math.abs(dist) < 100) {
      center.add(visualConfig.sceneProps.boids[i].pos);
      count++;
    }
  }
  center.divideScalar(count);
  return visualConfig.sceneProps.boids[b].pos.clone().sub(center);
}

function boidFlockRepel(b, visualConfig) {
  var center = new THREE.Vector3( 0,0,0 );
  for (var i = 0; i < visualConfig.sceneProps.boids.length; i++) {
    var dist = visualConfig.sceneProps.boids[i].pos.clone().sub(visualConfig.sceneProps.boids[b].pos);
    if (i !== b && Math.abs(dist) < 10) {
      center.sub(dist);
    }
  }
  return center;
}

function boidFlockMatchVel(b, visualConfig) {
    var pvel = new THREE.Vector3( 0,0,0 );
    for (var i = 0; i < visualConfig.sceneProps.boids.length; i++) {
      if (i !== b) {
        pvel.add(visualConfig.sceneProps.boids[i].vel);
      }
    }
    pvel.divideScalar(visualConfig.sceneProps.boids.length-1);
    return visualConfig.sceneProps.boids[b].vel.clone().sub(pvel);
}

function updateScene(scene, visualConfig, delta) {
  if (visualConfig.sceneReady) {

    var newBoidParams = [];

    for (var i = 0; i < visualConfig.sceneProps.boids.length; i++) {
      var boid = scene.getObjectByName(visualConfig.sceneProps.boids[i].name);
      if (boid !== undefined) {

  			var v1 = boidFlockCenter(i, visualConfig).multiplyScalar(0.0001);
  			var v2 = boidFlockRepel(i, visualConfig).multiplyScalar(0.01);
  			var v3 = boidFlockMatchVel(i, visualConfig).multiplyScalar(0.5);

  			var vel = visualConfig.sceneProps.boids[i].vel.clone().add(v1).add(v2).add(v3).clampLength(-10,10);


  			var pos = visualConfig.sceneProps.boids[i].pos.clone().add(vel.clone().multiplyScalar(delta));


        newBoidParams.push({
          pos: pos,
          vel: vel
        });

        // visualConfig.sceneProps.boids[i].vel = visualConfig.sceneProps.boids[i].vel.clone().add(visualConfig.sceneProps.boids[i].acc.clone().multiplyScalar(delta));
        // visualConfig.sceneProps.boids[i].pos = visualConfig.sceneProps.boids[i].pos.clone().add(visualConfig.sceneProps.boids[i].vel.clone().multiplyScalar(delta));
        // visualConfig.sceneProps.boids[i].lookAt = visualConfig.sceneProps.boids[i].vel.clone().add(visualConfig.sceneProps.boids[i].acc.clone().multiplyScalar(delta));

        // var ori = visualConfig.sceneProps.boids[i].ori.clone().normalize();
        // var axis = visualConfig.sceneProps.boids[i].vel.clone().normalize().cross(ori);
        // var angle = Math.acos(visualConfig.sceneProps.boids[i].vel.clone().normalize().dot(ori));
        // visualConfig.sceneProps.boids[i].ori = visualConfig.sceneProps.boids[i].vel.clone();
        // boid.rotateOnAxis( axis, angle );

        // boid.rotation = new THREE.Euler().setFromQuaternion( quaternion );
        boid.position.set( pos.x,pos.y,pos.z );
        // boid.position.applyEuler(new THREE.Euler(20,20,0, "XYZ"));


        // var newDir = visualConfig.sceneProps.boids[i].vel.normalize();
        // var pos = new THREE.Vector3();
        // pos.addVectors(newDir, boid.position);
        // boid.lookAt(new THREE.Vector3(0,0,0));


      }
    }

    for (var i = 0; i < visualConfig.sceneProps.boids.length; i++) {
      visualConfig.sceneProps.boids[i].vel = newBoidParams[i].vel;
      visualConfig.sceneProps.boids[i].pos = newBoidParams[i].pos;
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
