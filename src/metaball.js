const THREE = require('three')

var SPHERE_GEO = new THREE.SphereBufferGeometry(1, 32, 32);
var LAMBERT_WHITE = new THREE.MeshLambertMaterial( { color: 0x9EB3D8, transparent: true, opacity: 0.5 });


var clock = new THREE.Clock();

//all simulation information
//to have metaballs move
//can be independent from metaball
//i could use a different simulation -- create the curving motion or any other motion here

var globalID = 0;

export default class Metaball {
  constructor(pos, radius, vel, gridWidth, visualDebug, spawnLoc, spawnVel, accel) {
    this.init(pos, radius, vel, gridWidth, visualDebug, spawnLoc, spawnVel, accel);
  }

  init(pos, radius, vel, gridWidth, visualDebug, spawnLoc, spawnVel, accel) {
    this.gridWidth = gridWidth;
    this.pos = pos;
    this.vel = vel;

    this.spawnVelocity = spawnVel;    //new THREE.Vector3(-1, this.vel.y, this.vel.z);
    this.spawnLocation = spawnLoc;    //new THREE.Vector3(this.gridWidth / 2, this.gridWidth - 2, this.gridWidth / 2); //subtract 2 from y as an offset
    this.accel = accel;               //new THREE.Vector3(0.0);
    //this.accel.y = -1;
    this.vel.x = this.spawnVelocity.x;  //set intial velocity to -1 in x direction

    this.radius = radius;
    this.radius2 = radius * radius;
    this.mesh = null;

    this.id = globalID;
    globalID += 1;

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

  resetMetaball() {
    this.pos = this.spawnLocation.clone();
    this.vel = this.spawnVelocity.clone();
  };

  update(deltaT) {
    // @TODO
    //Implement the update for metaballs to move its position based velocity.
    //Reverse the velocity whenever the metaball goes out of bounds.
    //Since the metaball function is not well defined at the boundaries,
    //maintain an additional small margin so that the metaball
    //can reverse its moving direction before reaching the bounds.

    // console.log("ID: ");
    // console.log(ball.id);
    // console.log("POS: ");
    // console.log(ball.pos);

    //var deltaT = clock.getDelta();

    var bottomOffset = 1.0;  //this should be radius of the metaball
    var topOffset = this.gridWidth - bottomOffset;


    //if the metaball hits grid boundaries, then reset to spawn location and velocity
    if((this.pos.x <= bottomOffset) || (this.pos.x > topOffset))
    {
      //this.vel.x = -this.vel.x;
      this.resetMetaball();
    }
    if((this.pos.y <= bottomOffset) || (this.pos.y > topOffset))
    {
      //this.vel.y = -this.vel.y;
      this.resetMetaball();
    }
    if((this.pos.z <= bottomOffset) || (this.pos.z > topOffset))
    {
      //this.vel.z = -this.vel.z;
      this.resetMetaball();
    }

    this.vel.x += this.accel.x * deltaT;
    this.vel.y += this.accel.y * deltaT;
    this.vel.z += this.accel.z * deltaT;

    this.pos.x += this.vel.x * deltaT;
    this.pos.y += this.vel.y * deltaT;
    this.pos.z += this.vel.z * deltaT;


    //ONLY DO THIS WHEN VISUAL_DEBUG IS SET TO TRUE
    //this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);

  }//end update function

}//end Metaball class
