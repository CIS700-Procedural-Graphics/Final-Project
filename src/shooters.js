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

var thresholdFor16Array = [500, 400, 250, 240, 200, 220, 50, 20];//[250, 200, 200, 200, 100, 90, 110];//[242, 240, 335, 220, 120, 100, 105];

var origin = new THREE.Vector3(0, 0, 0);
var max_x = 25;

var deathProb0 = 0.2;
var deathProb1 = 0.6;

var colorData = [0,0,0,0,0,0,0,0];
var indexData = [0,0,0,0,0,0,0,0];
var indexSums = [0,0,0,0,0,0,0,0];

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

  addShooter(index, framework, colorVal) {
    // console.log("AllShooters: addShooter");
    // index from 0 - 7 for which ball going to start at

    this.numShooters = this.numShooters + 1;

    var pos = new THREE.Vector3(0,0,0);
    pos = pos.applyMatrix4(mat4Locations[index]);
    var s = new Shooter(pos, index, colorVal);

    this.allShooters.push(s);

    framework.scene.add(s.mesh);
  }

  removeAllShootersFromScene(framework) {
    for (var i = 0; i < this.numShooters; i++) {
      // remove element from scene
      framework.scene.remove(this.allShooters[i].mesh);
    }//end for loop

    this.allShooters = new Array();
    this.numShooters = 0;
  }

  removeShootersByDistance(framework, time) {
    // console.log("AllShooters: removeShooters by Distance");

    var removShootersArr = new Array();
    var numRemoved = 0;

    for (var i = 0; i < this.numShooters; i++) {

      var d = this.dist(this.allShooters[i].pos, origin);
      if (d > max_x) {
        // var prob = (time % 100) / 100.0;
        // console.log("prob: " + prob + " deathProb0: " + deathProb0);
        // console.log("prob: " + prob + " deathProb1 mul: " + (10 * deathProb1 * ((d - max_x) / max_x)));
        // if (prob > deathProb0 && prob < deathProb1 * 10 * ((d - max_x) / max_x)) {
          // remove element from scene
          framework.scene.remove(this.allShooters[i].mesh);

          // decrement num shooters
          removShootersArr.push(i);
          numRemoved = numRemoved + 1;
        // }
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

  noiseByDist(loc, val) {
    // var ampl = loc.x / max_x / 2.0;
    // var n = this.rand(loc) * this.rand(val);
    var ampl = loc.x / max_x  / 5.0;
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
      loc = this.noiseByDist(loc, i);

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

  arrayIndexToFreqBin(i) {
    //console.log("index loc: " + (Math.floor(i/2)));
    if (i <= 11) { return Math.floor(i/2); }

    if (i == 12) { return 6; }
    if (i == 13) { return 7; }

    // if (i <= 4) { return i; }
    // if (i == 5) { return 4; }
    // if (i == 6 || i == 7) { return 5; }
    // if (i == 8 || i == 9 || i == 10) { return 6; }
    // if (i == 11 || i == 12) { return 7; }
  }

  calcShooterIndexLocations(musicData) {
    indexData = [0, 0, 0, 0, 0, 0, 0, 0];
    indexSums = [0, 0, 0, 0, 0, 0, 0, 0];
    colorData = [0,0,0,0,0,0,0,0];

    for (var i = 0; i < 16; i++) {
      indexSums[this.arrayIndexToFreqBin(i)] += musicData[i];
    }

    for (var i = 0; i < 8; i++) {
      //if (i == 7) { console.log(indexSums[i]); }
      if (indexSums[i] >= thresholdFor16Array[i]) {
        indexData[i] = 1;
        colorData[i] = this.calcColorDataFromIndexAndSums(indexSums[i], i);
      }
    }
  }

  calcColorDataFromIndexAndSums(sum, index) {
    var minThresh = thresholdFor16Array[index];

    var thresh1 = minThresh + 15;
    var thresh2 = thresh1 + 30;
    var thresh3 = thresh2 + 45;
    var thresh4 = thresh3 + 45;

    if (sum <= thresh1) { return 0xffffff; } //white
    if (sum <= thresh2) { return 0xffff00; } //yellow
    if (sum <= thresh3) { return 0xff9933; } //orange
    if (sum <= thresh4) { return 0xff0000; } //red
    else { return 0xff33cc; } //pink
  }

  update(freq, time) {
    // console.log("AllShooters: update");

    if (this.playing) {
        this.updateShootersPos();
        this.removeShootersByDistance(this.f, time);

        //if (time % 30 == 0) {
          this.calcShooterIndexLocations(freq);
          for (var i = 0; i < 8; i++) {
            if (indexData[i] == 1) {
              var cVal = colorData[i];

              this.addShooter(i, this.f, cVal);
            }
          }
        //}
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
  constructor(pos, index, col) {
    this.init(pos, index, col);
  }

  init(pos, index, col) {
    // console.log("Shooter: init");

    // console.log(pos);

    this.pos = pos;
    this.index = index;
    
    this.makeMesh(col);
  }

  makeMesh(col) {
    // console.log("Shooter: makeMesh");

    var geo = new THREE.Geometry(); 
    var colorObj = new THREE.Color( col );

    // var particleMaterial = new THREE.PointsMaterial(
    //         {color: col, 
    //          size: .1,
    //          //map: THREE.ImageUtils.loadTexture("images/snowflake.png"),
    //          //blending: THREE.AdditiveBlending,
    //          //transparent: true,
    //         });


    var material = new THREE.PointsMaterial( { size:.1, color: colorObj} );

    geo.vertices.push(new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z));
    //geo.vertices[0].setColor(colorObj);

    this.mesh = new THREE.Points(geo, material);
    this.mesh.visible = true;
  }

  update() {
    // TO DO
  }

};//end: Shooter class
