const THREE = require('three');

var Particle = function(pos, vel) {
  this.pos1 = pos;
  this.pos2 = pos.clone().sub( vel.clone().multiplyScalar(Math.random()/4) );
  this.index = new THREE.Vector2(pos.x, pos.z);
  this.vel = vel;
}

export default class ParticleSystem {
	constructor(App, scene, data, w, h) {
    	this.init(App, scene, data, w, h);
  	}

  	init(App, scene, data, w, h) {
  		this.scene = scene;
  		this.particles = [];
  		this.density = App.density;
  		this.direction = App.direction;
  		this.width = App.width;
  		this.height = App.height;
  		this.depth = App.depth;
  		this.location = data;

  		var rainGeometry = new THREE.Geometry();

		for (var i = 0; i < this.width; i++) {
  			for (var j = 0; j < this.depth; j++) {
  				var index = Math.floor(i * w/this.width) * h + Math.floor(j * h/this.depth);
  				if (data[4*index] > 0) {
  					for (var k = 0; k < this.height; k++) {
  						if (Math.random() < this.density) {
  							var p = new THREE.Vector3(i + Math.random(), k + Math.random(), j + Math.random());
			  				var particle = new Particle(p, this.direction.clone().multiplyScalar(Math.random()));
			  				this.particles.push(particle);
			  				rainGeometry.vertices.push( particle.pos1 );
							rainGeometry.vertices.push( particle.pos2 );
  						}
	  				}
  				}
  			}
  		}

  		var rainMaterial = new THREE.LineBasicMaterial( { color: 0x555555, linewidth: 1 } )

	    this.rain = new THREE.LineSegments( rainGeometry, rainMaterial ); // define mesh 
	    this.rain.geometry.verticesNeedUpdate = true;

	    this.scene.add( this.rain );
  	}

	update(dt) {
		for (var i = 0; i < this.particles.length; i ++) {
			this.particles[i].pos1.add((this.particles[i].vel).clone().multiplyScalar(dt));
		    this.particles[i].pos2.add((this.particles[i].vel).clone().multiplyScalar(dt));
		    if (this.particles[i].pos2.y < 0) {
				this.particles[i].pos1.y = this.height;
				this.particles[i].pos1.x = this.particles[i].index.x;
				this.particles[i].pos1.z = this.particles[i].index.y;
				this.particles[i].pos2.subVectors(this.particles[i].pos1, this.particles[i].vel.clone().multiplyScalar(Math.random()/4) );
			} 		    
		}
		this.rain.geometry.verticesNeedUpdate = true;
	}
}