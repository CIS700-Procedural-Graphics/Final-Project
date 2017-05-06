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
    renderTarget = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBFormat } );


    // lakeCamera = camera.clone();
    // lakeCamera.position.set(0,0,0);
    // lakeCamera.lookAt(new THREE.Vector3(0,0,-1));
    //
    // var texture = THREE.ImageUtils.loadTexture('./water.jpg'); // water texture from wind waker
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // var lakeGeo = new THREE.PlaneGeometry( 1000,1000,10,20 );
    // lakeMat = new THREE.ShaderMaterial({
    //   uniforms: {
    //     "time": { value: 0 },
    //     "cameraPos": { value: visualConfig.camera.pos },
    //     "waterSampler": { value: texture },
    //     "mirrorSampler": { value: renderTarget.texture },
    // 		"mirrorColor": { value: new THREE.Color( 0xaaaaaa ) },
    // 		"textureMatrix" : { value: new THREE.Matrix4() }
    //   },
    //   side: THREE.DoubleSide,
    //   vertexShader: require('./shaders/terrain-vert.glsl'),
    //   fragmentShader: require('./shaders/terrain-frag.glsl')
    // });
    // var plane = new THREE.Mesh( lakeGeo, lakeMat/*new THREE.MeshBasicMaterial( { map: renderTarget } )*/ );
    // plane.position.set(0,250,500);
    // plane.rotateX(Math.PI/2);
    // scene.add(plane);


    // var skyboxGeo = new THREE.BoxGeometry( 1000,1000,1000 );
    var skyboxGeo = new THREE.IcosahedronGeometry( 900,1 );
    var skyboxMat2 = new THREE.ShaderMaterial({
        uniforms: {
        },
        side: THREE.DoubleSide,
        vertexShader: require('./shaders/sky-vert.glsl'),
        fragmentShader: require('./shaders/sky-frag.glsl')
      });
    var skyboxMesh = new THREE.Mesh( skyboxGeo, skyboxMat2 );
    skyboxMesh.position.set(0,0,0);
    scene.add(skyboxMesh);


    groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: window.width, textureHeight: window.height, color: 0x8c8f9c } );
    var planeGeo = new THREE.PlaneGeometry( 1000,1000,1,1 );
    var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
		mirrorMesh.add( groundMirror );
		mirrorMesh.rotateX( - Math.PI / 2 );
		scene.add( mirrorMesh );


    // var snd = new Audio("file.wav"); // buffers automatically when created
    // snd.play();

    visualConfig.sceneProps = {
      bouys: [],
      bubbles: [],
      particles: [],
      lightning: [],
      rain: [],
      display: 1.0,
      vdisplay: 0.0,
      globalTime: 0
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
    visualConfig.sceneProps.globalTime += delta;

    visualConfig.sceneProps.display += delta * visualConfig.sceneProps.vdisplay;
    visualConfig.sceneProps.display = Math.max(0, Math.min(1, visualConfig.sceneProps.display));
    if (visualConfig.sceneProps.display === 1 || visualConfig.sceneProps.display === 0) {
      visualConfig.sceneProps.vdisplay = 0;
    }
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
    var splashes = [];
    for (var i = 0; i < visualConfig.sceneProps.rain.length; i++) {
      visualConfig.sceneProps.rain[i].update(delta);

      if (Math.abs(visualConfig.sceneProps.rain[i].pos.y) < 1) {
        splashes.push(new THREE.Vector2(visualConfig.sceneProps.rain[i].pos.x, visualConfig.sceneProps.rain[i].pos.z));
      }

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

    if (visualConfig.sceneProps.rain.length < 50 && Math.random() < display) {
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

    // Bubbles
    var newBubbles = [];
    var oldBubbles = [];
    for (var i = 0; i < visualConfig.sceneProps.bubbles.length; i++) {
      var bubble = visualConfig.sceneProps.bubbles[i];
      var name = bubble.name;
      var p = scene.getObjectByName(name);
      if (p !== undefined) {
        p.position.set(bubble.pos.x, display * bubble.pos.y + idisplay * -10,bubble.pos.z);
      }
      bubble.update(delta);

      if (!visualConfig.sceneProps.bubbles[i].shouldDelete) {
        newBubbles.push(visualConfig.sceneProps.bubbles[i]);
      } else {
        oldBubbles.push(visualConfig.sceneProps.bubbles[i]);
      }
    }
    for (var i = 0; i < oldBubbles.length; i++) {
      var selectedObject = scene.getObjectByName(oldBubbles[i].name);
      scene.remove( selectedObject );
    }
    visualConfig.sceneProps.bubbles = newBubbles;

    // Particles
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

    if (visualConfig.sceneProps.particles.length < 50) {
      visualConfig.sceneProps.particles.push(genParticle(framework.scene));
      visualConfig.sceneProps.particles.push(genParticle(framework.scene));
    }


    // lakeMat.uniforms.time.value += delta;

    groundMirror.updateSplash(splashes);
    groundMirror.updateTime(visualConfig.sceneProps.globalTime);
    groundMirror.render();

    // renderer.render( scene, lakeCamera, renderTarget, true );

  }
}

function genBouy(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 200, -10, Math.random() * 100 + 100);
  var geometry = new THREE.ConeGeometry( 50,20,16,5 );
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
    y: -10,
    bounce: -10,
    vel: new THREE.Vector3( 0,0.5,-10 ),
    acc: new THREE.Vector3( 0,0,0 ),
    t: Math.random(),
    shouldDelete: false,
    update: function(delta) {
      this.t += delta * 2;
      this.pos.x += this.vel.x * delta;
      this.bounce = 0.5 * (Math.sin(2*this.t)+ 3*Math.sin(this.t+Math.PI/4) + Math.sin(this.t) + Math.sin(this.t+Math.PI/2)) - 5;
      this.y += 0.5 * delta * (0-this.y);
      this.pos.y = this.bounce + Math.min(this.y, 0);
      this.pos.z += this.vel.z * delta;

      var dist = this.pos.distanceTo(new THREE.Vector3( 0,0,20 ));
      var acc = Math.sign(this.pos.x) * Math.exp(-dist/10 + 6);

      this.acc = new THREE.Vector3( acc, 0,0 );
      this.vel.x += this.acc.x * delta;
      // this.vel.z += this.acc.z * 10;

      if (this.pos.z < -100) {
        this.shouldDelete = true;
      }
    }
  };
}

function genLightning(scene) {
  var pos = new THREE.Vector3( genRange(50,200,true), 200, genRange(100,300,false) );
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
						lineWidth: genRange(10,20,false),
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

function genRange(start, end, negative) {
  return negative ? Math.sign(Math.random() - 0.5) * (Math.random() * (end - start)) + start : (Math.random() * (end - start)) + start;

}

function genParticle(scene) {
  var pos = new THREE.Vector3( genRange(50,300,true), Math.random() * 100, genRange(100,300,false) );
  var geometry = new THREE.IcosahedronGeometry( Math.random()*0.5,1 );
  var material = new THREE.MeshBasicMaterial( {color: 0xccffcc, side: THREE.DoubleSide} );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.name = "particle"+Math.random();
  mesh.position.set(pos.x, pos.y, pos.z);
  scene.add(mesh);
  return {
    name: mesh.name,
    pos: pos,
    vel: new THREE.Vector3( 0,0,-genRange(10,30) ),
    shouldDelete: false,
    update: function(delta) {
      this.pos.x += this.vel.x * delta;
      this.pos.y += this.vel.y * delta;
      this.pos.z += this.vel.z * delta;

      if (this.pos.z < -10) {
        this.shouldDelete = true;
      }
    }
  };
}

function genBubble(scene) {
  var pos = new THREE.Vector3( (Math.random()-0.5) * 200, 0, Math.random() * 200 + 100);
  var geometry = new THREE.IcosahedronGeometry(Math.random()*5, 2);
  var material = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.name = "bubble"+Math.random();
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
  if (Math.random() < 0.3)
    visualConfig.sceneProps.bouys.push(genBouy(framework.scene));
}

function harmonyCallback(framework, visualConfig) {
  var scene = framework.scene;
  if (Math.random() < 0.9 && visualConfig.sceneProps.bubbles.length < 10) {
    visualConfig.sceneProps.bubbles.push(genBubble(framework.scene));
  } else {
    for (var j = 0; j < visualConfig.sceneProps.bubbles.length; j++) {
      var name = visualConfig.sceneProps.bubbles[j].name;
      var b = scene.getObjectByName(name);
      if (b !== undefined) {
        b.material.color.setHex(0xcccccc);
      }
    }

    var i = Math.floor(Math.random() * visualConfig.sceneProps.bubbles.length);
    var name = visualConfig.sceneProps.bubbles[i].name;
    var b = scene.getObjectByName(name);
    if (b !== undefined) {
      b.material.color.setHex(0xf44242);
    }

    var i = Math.floor(Math.random() * visualConfig.sceneProps.bubbles.length);
    var name = visualConfig.sceneProps.bubbles[i].name;
    var b = scene.getObjectByName(name);
    if (b !== undefined) {
      b.material.color.setHex(0xf4be41);
    }

    var i = Math.floor(Math.random() * visualConfig.sceneProps.bubbles.length);
    var name = visualConfig.sceneProps.bubbles[i].name;
    var b = scene.getObjectByName(name);
    if (b !== undefined) {
      b.material.color.setHex(0x5bc124);
    }

    var i = Math.floor(Math.random() * visualConfig.sceneProps.bubbles.length);
    var name = visualConfig.sceneProps.bubbles[i].name;
    var b = scene.getObjectByName(name);
    if (b !== undefined) {
      b.material.color.setHex(0x91f0f7);
    }

    var i = Math.floor(Math.random() * visualConfig.sceneProps.bubbles.length);
    var name = visualConfig.sceneProps.bubbles[i].name;
    var b = scene.getObjectByName(name);
    if (b !== undefined) {
      b.material.color.setHex(0xe48be5);
    }
  }
  // if (Math.random() < 0.8)
    // visualConfig.sceneProps.lightning.push(genLightning(framework.scene));
}


function melodyCallback(framework, visualConfig) {
  // if (Math.random() < 0.1)
    // visualConfig.sceneProps.bubbles.push(genBubble(framework.scene));
  if (Math.random() < 0.8)
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
  harmonyCallback: harmonyCallback,
  changeTrigger: changeTrigger,
  cleanupScene: cleanupScene
}

export function other() {
  return 2
}
