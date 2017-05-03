const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const Mirror = require('./Mirror')
const MeshLine = require( 'three.meshline' );


// Each scene uses the following API:
//        initScene()
//        updateScene()
//        changeTrigger()
//        cleanupScene()

/*********************************** VISUAL ***********************************/
var car, lakeCamera, groundMirror;

var lakeMat;
function initScene(framework, visualConfig) {
    var camera = framework.camera;
    var scene = framework.scene;
    var renderer = framework.renderer;
    visualConfig.camera.pos = new THREE.Vector3( -2.2573092695749275, 7.656400269550838, -16.61839425151948 );
    // camera.up.set(new THREE.Vector3(0,1,0));
    camera.position.set(visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z);
    camera.lookAt(new THREE.Vector3(0, 20, 10));
    scene.background = new THREE.Color( 0x000000 );

    lakeCamera = camera.clone();
    lakeCamera.position.set(0,0,0);
    lakeCamera.lookAt(new THREE.Vector3(0,0,-1));

    renderTarget = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBFormat } );
    var texture = THREE.ImageUtils.loadTexture('./water.jpg'); // water texture from wind waker
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var lakeGeo = new THREE.PlaneGeometry( 1000,1000,10,20 );
    lakeMat = new THREE.ShaderMaterial({
      uniforms: {
        "time": { value: 0 },
        "cameraPos": { value: visualConfig.camera.pos },
        "waterSampler": { value: texture },
        "mirrorSampler": { value: renderTarget.texture },
    		"mirrorColor": { value: new THREE.Color( 0xaaaaaa ) },
    		"textureMatrix" : { value: new THREE.Matrix4() }
      },
      side: THREE.DoubleSide,
      vertexShader: require('./shaders/terrain-vert.glsl'),
      fragmentShader: require('./shaders/terrain-frag.glsl')
    });
    var plane = new THREE.Mesh( lakeGeo, lakeMat/*new THREE.MeshBasicMaterial( { map: renderTarget } )*/ );
    plane.position.set(0,250,500);
    plane.rotateX(Math.PI/2);
    // scene.add(plane);

    groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: window.width, textureHeight: window.height, color: 0x8c8f9c } );
    var planeGeo = new THREE.PlaneGeometry( 500,500,100,100 );
    var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
		mirrorMesh.add( groundMirror );
		mirrorMesh.rotateX( - Math.PI / 2 );
		scene.add( mirrorMesh );



    var skyboxGeo = new THREE.BoxGeometry( 1000,1000,1000 );
    var skyboxMat = new THREE.MeshBasicMaterial( { color: 0x333333, side: THREE.DoubleSide } );
    var skyboxMesh = new THREE.Mesh( skyboxGeo, skyboxMat );
    skyboxMesh.position.set(0,0,0);
    scene.add(skyboxMesh);

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    visualConfig.sceneProps = {
      bouys: [],
      particles: [],
      lightning: [],
      rain: [],
      display: 1.0
    };
    visualConfig.sceneReady = true;
}

var water;
var renderTarget;

function updateScene(framework, visualConfig, delta) {
  var camera = framework.camera;
  var scene = framework.scene;
  var renderer = framework.renderer;

  // camera.position.set(visualConfig.camera.pos.x, visualConfig.camera.pos.y, visualConfig.camera.pos.z);
  // camera.lookAt(new THREE.Vector3(0,10,10));

  if (visualConfig.sceneReady) {
    var display = visualConfig.sceneProps.display;
    var idisplay = 1-display;

    // Lightning
    var newLightning = [];
    var oldLightning = [];
    for (var i = 0; i < visualConfig.sceneProps.lightning.length; i++) {
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      visualConfig.sceneProps.lightning[i].update(delta);
      if (!visualConfig.sceneProps.lightning[i].shouldDelete) {
        newLightning.push(visualConfig.sceneProps.lightning[i]);
      } else {
        oldLightning.push(visualConfig.sceneProps.lightning[i]);
      }
    }
    for (var i = 0; i < oldLightning.length; i++) {
      var selectedObject = scene.getObjectByName(oldLightning[i].name);
      scene.remove( selectedObject );
    }
    visualConfig.sceneProps.lightning = newLightning;

    // Rain
    var newRain = [];
    var oldRain = [];
    for (var i = 0; i < visualConfig.sceneProps.rain.length; i++) {
      visualConfig.sceneProps.rain[i].update(delta);

      if (!visualConfig.sceneProps.rain[i].shouldDelete) {
        newRain.push(visualConfig.sceneProps.rain[i]);
      } else {
        oldRain.push(visualConfig.sceneProps.rain[i]);
      }
    }
    for (var i = 0; i < oldRain.length; i++) {
      var selectedObject = scene.getObjectByName(oldRain[i].name);
      scene.remove( selectedObject );
    }
    visualConfig.sceneProps.rain = newRain;

    if (visualConfig.sceneProps.rain.length < 50) {
      visualConfig.sceneProps.rain.push(genRain(scene));
      visualConfig.sceneProps.rain.push(genRain(scene));
    }

    var newBouys = [];
    var oldBouys = [];
    for (var i = 0; i < visualConfig.sceneProps.bouys.length; i++) {
      var bouy = visualConfig.sceneProps.bouys[i];
      var name = bouy.name;
      var b = scene.getObjectByName(name);
    	if (b !== undefined) {
    		b.position.set(bouy.pos.x, display * bouy.pos.y + idisplay * -20,bouy.pos.z);
    	}
      bouy.update(delta);

      if (!visualConfig.sceneProps.bouys[i].shouldDelete) {
        newBouys.push(visualConfig.sceneProps.bouys[i]);
      } else {
        oldBouys.push(visualConfig.sceneProps.bouys[i]);
      }
    }
    for (var i = 0; i < oldBouys.length; i++) {
      var selectedObject = scene.getObjectByName(oldBouys[i].name);
      scene.remove( selectedObject );
    }
    visualConfig.sceneProps.bouys = newBouys;

    var newParticles = [];
    var oldParticles = [];
    for (var i = 0; i < visualConfig.sceneProps.particles.length; i++) {
      var particle = visualConfig.sceneProps.particles[i];
      var name = particle.name;
      var p = scene.getObjectByName(name);
      if (p !== undefined) {
        p.position.set(particle.pos.x, display * particle.pos.y + idisplay * -10,particle.pos.z);
      }
      particle.update(delta);

      if (!visualConfig.sceneProps.particles[i].shouldDelete) {
        newParticles.push(visualConfig.sceneProps.particles[i]);
      } else {
        oldParticles.push(visualConfig.sceneProps.particles[i]);
      }
    }
    for (var i = 0; i < oldParticles.length; i++) {
      var selectedObject = scene.getObjectByName(oldParticles[i].name);
      scene.remove( selectedObject );
    }
    visualConfig.sceneProps.particles = newParticles;


    lakeMat.uniforms.time.value += delta;

    groundMirror.render();

    renderer.render( scene, lakeCamera, renderTarget, true );

  }
}

function genBouy(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 100, 0, Math.random() * 200);
  var geometry = new THREE.ConeGeometry( 30,20,16,5 );
  var material = new THREE.ShaderMaterial( {
    uniforms: {
      "time": { value: 0 },
      "random": { value: new THREE.Vector3((Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 10.0, (Math.random() - 0.5) * 10.0 ) }
    },
    side: THREE.DoubleSide,
    vertexShader: require('./shaders/bouy-vert.glsl'),
    fragmentShader: require('./shaders/bouy-frag.glsl')
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.name = "bouy"+Math.random();
  mesh.position.set(pos.x, pos.y, pos.z);
  scene.add(mesh);
  return {
    name: mesh.name,
    mass: 1000,
    pos: pos,
    vel: new THREE.Vector3( 0,0,-40 ),
    t: Math.random(),
    shouldDelete: false,
    update: function(delta) {
      this.t += delta;
      this.pos.x += this.vel.y * delta;
      this.pos.y = 0.2*(Math.sin(2*this.t)+ 3*Math.sin(this.t+Math.PI/4) + Math.sin(this.t) + Math.sin(this.t+Math.PI/2)) - 5;
      this.pos.z += this.vel.z * delta;

      if (this.pos.z < -100) {
        this.shouldDelete = true;
      }
    }
  };
}

function genLightning(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 500, 200, Math.random() * 10 + 100);
  var meshLine = new MeshLine.MeshLine();
  var meshLineGeo = new THREE.Geometry();
	for (var i = 0; i < 100; i++) {
		meshLineGeo.vertices.push(pos);
	}
  meshLine.setGeometry( meshLineGeo,  function( p ) { return p; }  );

  var meshLineMat = new MeshLine.MeshLineMaterial( {
						color: new THREE.Color( "rgb(233, 255, 0)" ),
						opacity: 1,
						resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
						sizeAttenuation: 10,
						lineWidth: 20,
						near: 1,
						far: 100000,
						depthTest: true,
						blending: THREE.AdditiveBlending,
						transparent: false,
						side: THREE.DoubleSide
					});
  var meshLineMesh = new THREE.Mesh( meshLine.geometry, meshLineMat ); // this syntax could definitely be improved!
  meshLineMesh.name = "meshline"+Math.random();
  meshLineMesh.frustumCulled = false;

  scene.add(meshLineMesh);

  return {
    meshLine: meshLine,
    name: meshLineMesh.name,
    pos: pos,
    vel: new THREE.Vector3( (Math.random()-0.5) * 200,(Math.random()-1) * 500,(Math.random()-0.5) * 200  ),
    acc: new THREE.Vector3( 0,0,0 ),
    lastChange: 0,
    shouldDelete: false,
    update(delta) {

      if (Math.random() < 0.5) {
        this.vel = new THREE.Vector3( (Math.random()-0.5) * 200,(Math.random()-1) * 500,(Math.random()-0.5) * 200  );
      }

      this.vel = this.vel.clone().add(this.acc.clone().multiplyScalar(delta));
      this.pos = this.pos.clone().add(this.vel.clone().multiplyScalar(delta));

      this.meshLine.advance(this.pos);

      if (this.pos.y < -100) {
        this.shouldDelete = true;
      }
    }
  };
}

function genRain(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 500, 200, Math.random() * 10 + 100);
  var meshLine = new MeshLine.MeshLine();
  var meshLineGeo = new THREE.Geometry();
  var length = Math.floor(Math.random() * 5 + 2);
	for (var i = 0; i < length; i++) {
		meshLineGeo.vertices.push(pos);
	}
  meshLine.setGeometry( meshLineGeo,  function( p ) { return p; }  );

  var meshLineMat = new MeshLine.MeshLineMaterial( {
						color: new THREE.Color( "rgb(188, 203, 226)" ),
						opacity: 1,
						resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
						sizeAttenuation: 1,
						lineWidth: 0.25,
						near: 1,
						far: 100000,
						depthTest: true,
						blending: THREE.AdditiveBlending,
						transparent: false,
						side: THREE.DoubleSide
					});
  var meshLineMesh = new THREE.Mesh( meshLine.geometry, meshLineMat ); // this syntax could definitely be improved!
  meshLineMesh.name = "rain"+Math.random();
  meshLineMesh.frustumCulled = false;

  scene.add(meshLineMesh);

  return {
    meshLine: meshLine,
    name: meshLineMesh.name,
    pos: pos,
    vel: new THREE.Vector3( 10 * Math.random(),-100 * (Math.random() + 0.5),10 * Math.random()  ),
    acc: new THREE.Vector3( 0,0,0 ),
    lastChange: 0,
    shouldDelete: false,
    update(delta) {


      this.vel = this.vel.clone().add(this.acc.clone().multiplyScalar(delta));
      this.pos = this.pos.clone().add(this.vel.clone().multiplyScalar(delta));

      this.meshLine.advance(this.pos);

      if (this.pos.y < -100) {
        this.shouldDelete = true;
      }
    }
  };
}

function genParticle(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 200, 0, Math.random() * 200 + 100);
  var geometry = new THREE.IcosahedronGeometry(Math.random()*5, 2);
  var mesh = new THREE.Mesh( geometry );
  mesh.name = "particle"+Math.random();
  mesh.position.set(pos.x, pos.y, pos.z);
  scene.add(mesh);
  return {
    name: mesh.name,
    pos: pos,
    vel: new THREE.Vector3( 0,Math.random()*5,0 ),
    shouldDelete: false,
    update: function(delta) {
      this.pos.y += this.vel.y * delta;

      if (this.pos.y > 100) {
        this.shouldDelete = true;
      }
    }
  };
}

function bassCallback(framework, visualConfig) {
  if (Math.random() < 0.5)
    visualConfig.sceneProps.bouys.push(genBouy(framework.scene));
}

function melodyCallback(framework, visualConfig) {
  visualConfig.sceneProps.particles.push(genParticle(framework.scene));
  visualConfig.sceneProps.lightning.push(genLightning(framework.scene));
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
  bassCallback: bassCallback,
  melodyCallback: melodyCallback,
  changeTrigger: changeTrigger,
  cleanupScene: cleanupScene
}

export function other() {
  return 2
}
