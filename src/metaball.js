const THREE = require('three')

var SPHERE_GEO = new THREE.SphereBufferGeometry(1, 32, 32);
var LAMBERT_WHITE = new THREE.MeshLambertMaterial( { color: 0x9EB3D8, transparent: true, opacity: 0.5 });


//all simulation information
//to have metaballs move
//can be independent from metaball
//i could use a different simulation -- create the curving motion or any other motion here 


export default class Metaball {
  constructor(pos, radius, vel, gridWidth, visualDebug) {
    this.init(pos, radius, vel, gridWidth, visualDebug);
  }

  init(pos, radius, vel, gridWidth, visualDebug) {
    this.gridWidth = gridWidth;
    this.pos = pos;
    this.vel = vel;

    this.radius = radius;
    this.radius2 = radius * radius;
    this.mesh = null;

    if (visualDebug) {
      this.makeMesh();
    }
  }

  makeMesh() {
    this.mesh = new THREE.Mesh(SPHERE_GEO, LAMBERT_WHITE);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.scale.set(this.radius, this.radius, this.radius);
  }

  show() {
    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

  update() {
    // @TODO
    //Implement the update for metaballs to move its position based velocity.
    //Reverse the velocity whenever the metaball goes out of bounds.
    //Since the metaball function is not well defined at the boundaries,
    //maintain an additional small margin so that the metaball
    //can reverse its moving direction before reaching the bounds.

    //if there's a collision detected between the metaball position + EPSILON and the boundary position
        //reverse the velocity (subtract velocity from position??)
    //else ( if x, y, z of position is inside 0 to gridwidth, then you're still inside the boundary )
        //add velocity to position

    var offset2 = 1.0;//0.5; --> //according to sally, this should be radius of the metaball
    var offset = this.gridWidth - offset2;


    //if the metaball is NOT within the grid boundaries, then reverse velocity
    if((this.pos.x <= offset2) || (this.pos.x > offset))
    {
      this.vel.x = -this.vel.x;
    }
    if((this.pos.y <= offset2) || (this.pos.y > offset))
    {
      this.vel.y = -this.vel.y;
    }
    if((this.pos.z <= offset2) || (this.pos.z > offset))
    {
      this.vel.z = -this.vel.z;
    }
    // this.pos += this.vel;
    // this.pos = new THREE.Vector3(this.pos.x + this.vel.x, this.pos.y  + this.vel.y, this.pos.z  + this.vel.z);
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.pos.z += this.vel.z;

    //ONLY DO THIS WHEN VISUAL_DEBUG IS SET TO TRUE
    //this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);

  }//end update function
}
