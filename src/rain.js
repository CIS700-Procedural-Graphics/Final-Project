const THREE = require('three');

var Particle = function(pos, vel) {
  this.pos = pos;
  this.index = new THREE.Vector2(pos.x, pos.z);
  this.vel = vel;
}

export default class ParticleSystem {
  constructor(App, scene, data, w, h, rain_mat) {
      this.init(App, scene, data, w, h, rain_mat);
    }

    init(App, scene, data, w, h, rain_mat) {
      this.scene = scene;
      this.particles = [];
      this.density = App.density;
      this.direction = App.direction;
      this.width = App.width;
      this.height = App.height;
      this.depth = App.depth;
      this.location = data;
      this.instances = this.width * this.height * this.depth * this.density;

      var rain_geo = new THREE.BufferGeometry();

      var positions = new Float32Array( 2 * this.instances * 3 * 3 );
      var vertices = new Float32Array( 2 * this.instances * 3 * 1 );
      var velocity = new Float32Array( 2 * this.instances * 3 * 3 );
      var count = 0; var c = 0;
      while (count < this.instances) {
        var i = Math.random() * this.width;
        var j = Math.random() * this.depth;
        var k = Math.random() * this.height;
        var index = Math.floor(i * w/this.width) * h + Math.floor(j * h/this.depth);
        if (data[4*index] > 0) {
          var p = new THREE.Vector3(i, k, j);
          var particle = new Particle(p, this.direction.clone().multiplyScalar(Math.random()));
          this.particles.push(particle);
          var arr = [0, 1, 2, 0, 3, 4];
          for (var t = 0; t < 6; t ++) {
            positions[ c ] = p.x;
            velocity[ c++ ] = particle.vel.x;
            positions[ c ] = p.y;
            velocity[ c++ ] = particle.vel.y;
            positions[ c ] = p.z;
            velocity[ c++ ] = particle.vel.z;

            vertices[ count++ ] = arr[t];
          }
        }
      }
      rain_geo.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 )  );
      rain_geo.getAttribute('position').dynamic = true;
      rain_geo.addAttribute( 'vertex', new THREE.BufferAttribute( vertices, 1 )  );
      rain_geo.addAttribute( 'velocity', new THREE.BufferAttribute( velocity, 3 )  );
      rain_geo.getAttribute('velocity').dynamic = true;

      var rainMaterial = new THREE.ShaderMaterial(rain_mat);

      this.rain = new THREE.Mesh( rain_geo, rainMaterial ); // define mesh 
      this.rain.geometry.verticesNeedUpdate = true;
      this.rain.name = "rain";
      this.scene.add( this.rain );
    }

  update(dt, velocity) {
    var accel = new THREE.Vector3(0, -9.8 * dt, 0);
    var c = 0;
    for (var i = 0; i < this.particles.length; i ++) {
      this.particles[i].vel.add(accel); // gravity
      this.particles[i].vel.clampLength ( 0, 5 ); // air drag
      this.particles[i].pos.add((this.particles[i].vel).clone().multiplyScalar(dt));
      if (this.particles[i].pos.y < 0) {
        this.particles[i].pos.y = this.height;
        this.particles[i].pos.x = this.particles[i].index.x;
        this.particles[i].pos.z = this.particles[i].index.y;
        this.particles[i].vel = this.direction.clone().multiplyScalar(Math.random());
      }  
      for (var t = 0; t < 18; t ++) {
            this.rain.geometry.getAttribute('position').array[ c ] = this.particles[i].pos.x;
            this.rain.geometry.getAttribute('velocity').array[ c++ ] = this.particles[i].vel.x;
            this.rain.geometry.getAttribute('position').array[ c ] = this.particles[i].pos.y;
            this.rain.geometry.getAttribute('velocity').array[ c++ ] = this.particles[i].vel.y;
            this.rain.geometry.getAttribute('position').array[ c ] = this.particles[i].pos.z;
            this.rain.geometry.getAttribute('velocity').array[ c++ ] = this.particles[i].vel.z;
      }       
    }
    this.rain.geometry.getAttribute('position').needsUpdate = true;
    this.rain.geometry.getAttribute('velocity').needsUpdate = true;
  }
}