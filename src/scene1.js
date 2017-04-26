
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

    visualConfig.camera.pos = new THREE.Vector3( 50,0,0 );
  	camera.position.set(visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z);
  	camera.lookAt(new THREE.Vector3(0,0,0));
  	scene.background = new THREE.Color( 0xffffff );

    var geometry = new THREE.IcosahedronGeometry(5,4);
    var material = new THREE.MeshBasicMaterial({ color: 0, side: THREE.DoubleSide  });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    visualConfig.sceneProps = { particles: [] };
    visualConfig.sceneProps.particles.push(genParticle(scene));
    visualConfig.sceneReady = true;
}

function updateScene(scene, visualConfig, delta) {
  if (visualConfig.sceneReady) {

    for (var i = 0; i < visualConfig.sceneProps.particles.length; i++) {
      visualConfig.sceneProps.particles[i].update(0.01);
      visualConfig.sceneProps.particles[i].meshLine.advance(visualConfig.sceneProps.particles[i].pos);
    }

    if (Math.random() < 0.01) {
      visualConfig.sceneProps.particles.push(genParticle(scene));
    }
  }
}

function genParticle(scene) {
  var meshLine = new MeshLine.MeshLine();
  var meshLineGeo = new THREE.Geometry();
	for (var i = 0; i < 5000; i++) {
		meshLineGeo.vertices.push(new THREE.Vector3( 0,0,0 ));
	}
  meshLine.setGeometry( meshLineGeo,  function( p ) { return p; }  );

  var meshLineMat = new MeshLine.MeshLineMaterial( {
						color: new THREE.Color( "rgb( 0,0,0 )" ),
						opacity: 1,
						resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
						sizeAttenuation: 1,
						lineWidth: 0.5,
						near: 1,
						far: 100000,
						depthTest: false,
						blending: THREE.AdditiveBlending,
						transparent: false,
						side: THREE.DoubleSide
					});
  var meshLineMesh = new THREE.Mesh( meshLine.geometry, meshLineMat ); // this syntax could definitely be improved!
  meshLineMesh.frustumCulled = false;

  scene.add(meshLineMesh);

  return {
    meshLine: meshLine,
    pos: new THREE.Vector3( 0,0,0 ),
    vel: new THREE.Vector3( (Math.random()-0.5) * 20,(Math.random()-0.5) * 20,(Math.random()-0.5) * 20  ),
    acc: new THREE.Vector3( (Math.random()-0.5) * 20,(Math.random()-0.5) * 20,(Math.random()-0.5) * 20  ),
    lastChange: 0,
    update(delta) {

      if (this.lastChange > 1) {
        this.lastChange = 0;
        this.acc = new THREE.Vector3( (Math.random()-0.5) * 20,(Math.random()-0.5) * 20,(Math.random()-0.5) * 20  );
      } else {
        this.lastChange += delta;
      }

      this.vel = this.vel.clone().add(this.acc.clone().multiplyScalar(delta));
      this.pos = this.pos.clone().add(this.vel.clone().multiplyScalar(delta));

    }
  };
}

function changeTrigger(visualConfig) {
  return visualConfig.camera.pos.x < 1;
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
