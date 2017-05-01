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

      var rain_geo = new THREE.InstancedBufferGeometry();
      var vertices = new THREE.BufferAttribute( new Float32Array( 3 * 3 ), 3 );
        vertices.setXYZ( 0, 0.025, -0.025, 0 );
        vertices.setXYZ( 1, -0.025, 0.025, 0 );
        vertices.setXYZ( 2, 0, 0, 0.025 );
      rain_geo.addAttribute( 'position', vertices );

      var offsets = new THREE.InstancedBufferAttribute( new Float32Array( this.width * this.height * this.depth * 3 ), 3, 1 );
      offsets.dynamic = true;
      var count = 0;
      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.depth; j++) {
          var index = Math.floor(i * w/this.width) * h + Math.floor(j * h/this.depth);
          if (data[4*index] > 0) {
            for (var k = 0; k < this.height; k++) {
              if (Math.random() < this.density) {
                var p = new THREE.Vector3(i + Math.random(), k + Math.random(), j + Math.random());
                var particle = new Particle(p, this.direction.clone().multiplyScalar(Math.random()));
                this.particles.push(particle);
                offsets.setXYZ(count++, p.x, p.y, p.z);
              }
            }
          }
        }   
      }
      rain_geo.addAttribute( 'offset', offsets );

      var rain_material = new THREE.ShaderMaterial(rain_mat);

      this.rain = new THREE.Mesh( rain_geo, rain_material ); // define mesh 
      // this.rain.geometry.verticesNeedUpdate = true;

      this.scene.add( this.rain );
    }

  update(dt) {
    var accel = new THREE.Vector3(0, -9.8 * dt, 0);
    for (var i = 0; i < this.particles.length; i ++) {
      this.particles[i].vel.add(accel); // gravity
      this.particles[i].vel.clampLength ( 0, 20 ); // air drag
      this.particles[i].pos.add((this.particles[i].vel).clone().multiplyScalar(dt));

      if (this.particles[i].pos.y < 0) {
        this.particles[i].pos.y = this.height;
        this.particles[i].pos.x = this.particles[i].index.x;
        this.particles[i].pos.z = this.particles[i].index.y;
        this.particles[i].vel = this.direction.clone().multiplyScalar(Math.random());
      }  
      this.rain.geometry.getAttribute('offset').setXYZ(i, this.particles[i].x, this.particles[i].y, this.particles[i].z)       
    }
    this.rain.geometry.getAttribute('offset').needsUpdate = true;
  }
}