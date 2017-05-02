const THREE = require('three');

var Particle = function(pos, vel) {
  this.pos1 = pos;
  this.pos2 = pos.clone().sub( vel.clone().multiplyScalar(Math.random()/10) );
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
      var rainGeometry = new THREE.Geometry();
      var drop_geo = new THREE.BufferGeometry();

      var positions = new Float32Array(this.instances * 3);

    //   var c = 0;
    // for (var i = 0; i < this.width; i++) {
    //     for (var j = 0; j < this.depth; j++) {
    //       var index = Math.floor(i * w/this.width) * h + Math.floor(j * h/this.depth);
    //       if (data[4*index] > 0) {
    //         for (var k = 0; k < this.height; k++) {
    //           if (Math.random() < this.density) {
    //             var p = new THREE.Vector3(i + Math.random(), k + Math.random(), j + Math.random());
    //             var particle = new Particle(p, this.direction.clone().multiplyScalar(Math.random()));
    //             this.particles.push(particle);
    //             rainGeometry.vertices.push( particle.pos1 );
    //             rainGeometry.vertices.push( particle.pos2 );
    //             positions[c++] = particle.pos1.x;
    //             positions[c++] = 1;
    //             positions[c++] = particle.pos1.z;
    //           }
    //         }
    //       }
    //     }
    //   }

      var count = 0; var c = 0;
      while (count < this.instances) {
        var i = Math.random() * this.width;
        var j = Math.random() * this.depth;
        var k = Math.random() * this.height;
        var index = Math.floor(i * w/this.width) * h + Math.floor(j * h/this.depth);
        if (data[4*index] > 0) {
          count++;
          var p = new THREE.Vector3(i + Math.random(), k + Math.random(), j + Math.random());
          var particle = new Particle(p, this.direction.clone().multiplyScalar(Math.random()));
          this.particles.push(particle);
          rainGeometry.vertices.push( particle.pos1 );
          rainGeometry.vertices.push( particle.pos2 );
          positions[c++] = particle.pos1.x;
          positions[c++] = 1;
          positions[c++] = particle.pos1.z;
        }
      }

    drop_geo.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    var drops = new THREE.Points( drop_geo, new THREE.ShaderMaterial(rain_mat) );

     var loader = new THREE.TextureLoader();
    loader.load('./src/assets/splash.png', function(texture) {
        rain_mat.uniforms.texture.value = texture;
        
    }); 

    this.scene.add(drops);
      var rainMaterial = new THREE.LineBasicMaterial( { color: 0x555555, linewidth: 0.5 } )

      this.rain = new THREE.LineSegments( rainGeometry, rainMaterial ); // define mesh 
      this.rain.geometry.verticesNeedUpdate = true;

      this.scene.add( this.rain );
    }

  update(dt) {
    var accel = new THREE.Vector3(0, -9.8 * dt, 0);
    for (var i = 0; i < this.particles.length; i ++) {
      this.particles[i].vel.add(accel); // gravity
      this.particles[i].vel.clampLength ( 0, 5 ); // air drag
      this.particles[i].pos1.add((this.particles[i].vel).clone().multiplyScalar(dt));
        this.particles[i].pos2.add((this.particles[i].vel).clone().multiplyScalar(dt));
        if (this.particles[i].pos2.y < 0) {
        this.particles[i].pos1.y = this.height;
        this.particles[i].pos1.x = this.particles[i].index.x;
        this.particles[i].pos1.z = this.particles[i].index.y;
        this.particles[i].pos2.subVectors(this.particles[i].pos1, this.particles[i].vel.clone().multiplyScalar(Math.random()/10) );
      }         
    }
    this.rain.geometry.verticesNeedUpdate = true;
  }
}