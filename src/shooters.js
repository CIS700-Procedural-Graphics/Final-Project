const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much

var dim = 4;

var mat4Locations = [
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(0* 2*Math.PI/8.0), dim * Math.cos(0* 2*Math.PI/8.0) ), 
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(1* 2*Math.PI/8.0), dim * Math.cos(1* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(2* 2*Math.PI/8.0), dim * Math.cos(2* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(3* 2*Math.PI/8.0), dim * Math.cos(3* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(4* 2*Math.PI/8.0), dim * Math.cos(4* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(5* 2*Math.PI/8.0), dim * Math.cos(5* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(6* 2*Math.PI/8.0), dim * Math.cos(6* 2*Math.PI/8.0) ),
                new THREE.Matrix4().makeTranslation(0, dim * Math.sin(7* 2*Math.PI/8.0), dim * Math.cos(7* 2*Math.PI/8.0) ) ];

var origin = new THREE.Vector3(0, 0, 0);
var max_x = 15;

function calcShooterOrigLocation(musicData) {
    // TO BE IMPLEMENTED
    // returns proper index

    return 0;
}

/*******************************************************************/
/************ Class for all Shooters as a Collective ***************/
/*******************************************************************/
export default class AllShooters {
  constructor(framework) {
    // console.log("AllShooters: shooter constructor");
    this.init(framework);
  }

  init(framework) {
    // console.log("AllShooters: init shooter");
    this.numShooters = 0;
    this.playing = true;

    this.f = framework;

    this.allShooters = new Array();
    this.addShooter(0, framework); // for testing
  }

  addShooter(index, framework) {
    // console.log("AllShooters: addShooter");
    // index from 0 - 7 for which ball going to start at

    this.numShooters = this.numShooters + 1;

    var pos = new THREE.Vector3(0,0,0);
    pos = pos.applyMatrix4(mat4Locations[index]);
    var s = new Shooter(pos, index);

    this.allShooters.push(s);

    framework.scene.add(s.mesh);
  }

  removeShootersByDistance(framework) {
    // console.log("AllShooters: removeShooters by Distance");

    var removShootersArr = new Array();
    var numRemoved = 0;

    for (var i = 0; i < this.numShooters; i++) {
      if (this.dist(this.allShooters[i].pos, origin) > max_x) {
        // remove element from scene
        framework.scene.remove(this.allShooters[i].mesh);

        // decrement num shooters
        removShootersArr.push(i);
        numRemoved = numRemoved + 1;
      }
    }//end for loop

    for (var i = 0; i < numRemoved; i++) {
        this.allShooters.splice(removShootersArr[i], 1);
    }

    this.numShooters = this.numShooters - numRemoved;
  }

  rand(co){
    var val = (Math.sin( (new THREE.Vector2(co.x, co.y)).dot(new THREE.Vector2(12.9898,78.233)) ) * 43758.5453);

    return val - Math.floor(val);
  }

  noiseByDist(loc) {
    var ampl = loc.x / max_x;
    var n = this.rand(loc);
    loc.applyMatrix4( new THREE.Matrix4().makeTranslation(0, Math.cos(2 * Math.PI * n) * ampl, Math.sin(2 * Math.PI * n) * ampl) );

    return loc;
  }

  updateShootersPos() {
    // console.log("AllShooters: updateShootersPos");

    var moveLeft = new THREE.Matrix4().makeTranslation(0.05, 0, 0);

    var usingPos = new THREE.Vector3(0, 0, 0);
    for (var i = 0; i < this.numShooters; i++) {
      usingPos = this.allShooters[i].pos;
      var loc = usingPos.applyMatrix4(moveLeft);
      // console.log(loc);

      // adjust loc by dist
      loc = this.noiseByDist(loc);

      // update positions
      this.allShooters[i].mesh.geometry.vertices[0].x = loc.x;
      this.allShooters[i].mesh.geometry.vertices[0].y = loc.y;
      this.allShooters[i].mesh.geometry.vertices[0].z = loc.z;

      this.allShooters[i].mesh.geometry.verticesNeedUpdate = true;
    }
    
  }

  dist(pos1, pos2) {
    // console.log("AllShooters: dist");
    // pos1 and pos2 are THREE.Vector3(...)
    var ret = Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.z - pos2.z) * (pos1.z - pos2.z));
    return ret;
  }

  play(bool) {
    // console.log("AllShooters: play");
    this.playing = bool;
  }

  update() {
    // console.log("AllShooters: update");

    if (this.playing) {
      // console.log(this.playing);
        this.updateShootersPos();
        this.removeShootersByDistance(this.f);
    }
  }

};//end: AllShooters class

/***************************************************************/
/************ Class for each Marker in the Scene ***************/
/***************************************************************/
class Shooter {

  /*
   * necessary parts of Shooter:
   *
   * Location, index of which ball to shoot out of
   */
  constructor(pos, index) {
    this.init(pos, index);
  }

  init(pos, index) {
    // console.log("Shooter: init");

    // console.log(pos);

    this.pos = pos;
    this.index = index;
    
    this.makeMesh();
  }

  makeMesh() {
    // console.log("Shooter: makeMesh");

    var geo = new THREE.Geometry();
    var material = new THREE.PointsMaterial( { size:.1 } );

    geo.vertices.push(new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z));

    this.mesh = new THREE.Points(geo, material);
    this.mesh.visible = true;
  }

  update() {
    // TO DO
  }

};//end: Shooter class
