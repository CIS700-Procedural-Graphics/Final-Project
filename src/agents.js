const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much

var CYL_GEO_NORM = new THREE.CylinderGeometry( 5, 5, 20, 32 );

var mat1 = new THREE.MeshBasicMaterial( {color: 0xff22ff} );
var mat2 = calcRandomFun();

var MARKER_HEIGHT = 0.03;
var AGENTS_HEIGHT = 1;
var AGENTS_RAD = AGENTS_HEIGHT / 5;
var AGENTS_HEIGHTPOS = 0.2;

var hashMarkerPos = null;

function calcRandomFun() {
  var allCols = [ new THREE.MeshBasicMaterial( {color: 0x0000ff} ),
                  new THREE.MeshBasicMaterial( {color: 0xff00ff} ),
                  new THREE.MeshBasicMaterial( {color: 0xff0000} ),
                  new THREE.MeshBasicMaterial( {color: 0x00ffff} ),
                  new THREE.MeshBasicMaterial( {color: 0x00ff00} ),
                  new THREE.MeshBasicMaterial( {color: 0xffff00} ) ];

  return allCols[Math.floor(Math.random()*6)];
}

function posToSortingNum(pos){
  //console.log("outside: posToSortingNum");

  // pos should be given as a THREE.Vector3(...)

  // gridding example:
  // 6 7 8
  // 3 4 5
  // 0 1 2
  // my variation is 10x10 therefore -
  // for numbering: x is mag 1 & z is mag 10
  // when added we get the proper indexing

  //shift all values by half the plane's width(do the same for in length dir) so no neg values
  // PLANE DIMENSION: 10x10 so using 5 for offset
  var workingX = Math.floor(pos.x) + 5;
  var workingZ = Math.floor(pos.z) + 5;

  workingX = workingX % 10;
  workingZ = 10 * Math.floor(workingZ);

  var fin = workingX + workingZ;

  return fin;
}

/*****************************************************************/
/************ Class for all Agents as a Collective ***************/
/*****************************************************************/
export default class AllAgents {
  constructor(numAgents, numMarkers, onMat, visualDebug, allPos, allMarkerPos, isPaused) {
    this.init(numAgents, numMarkers, onMat, visualDebug, allPos, allMarkerPos, isPaused);
  }

  init(numAgents, numMarkers, onMat, visualDebug, allPos, allMarkerPos, isPaused) {
    //console.log("allAgents: init");
    this.numAgents = numAgents;
    this.numMarkers = numMarkers;
    this.onMat = onMat;
    this.visualDebug = visualDebug;

    this.allMarkers = new Array();
    this.allAgents = new Array();

    this.allPositions = allPos;
    this.markerPositions = allMarkerPos;

    this.isPaused = isPaused;

    this.makeMarkers();
    this.makeAgents();

    // sorting markers for convenience
    this.sortByPos(this.allMarkers);
    // sorting agents for practical purposes - will be resorting every iteration
    this.sortByPos(this.allAgents);
  }

  sortByPos(usingArr, len) {
    // console.log("allAgents: sortByPos");

    // insertion sort from LEAST to GREATEST
    for (var i = 0; i < len; i++) {
        var tempVal = usingArr[i].posVal;
        
        for (var j = i - 1; j >= 0 && (usingArr[j].posVal > tempVal); j--) {
          // shifting right all values that are greater than current being checked as temp
          usingArr[j + 1] = usingArr[j];
        }

        // inserting in corr position
        usingArr[i + 1] = temp;
    }
    // no need to return since sorts in place
  }

  makeAgents() {
    //console.log("allAgents: makeAgents");

    var j = 0;
    var origP = THREE.Vector2(0, 0);
    var destP = THREE.Vector2(0, 0);
    for (var i = 0; i < this.numAgents; i++) {
      origP = this.allPositions[j];
      destP = this.allPositions[j+1];
      j += 2;

      var p = new THREE.Vector3(origP.x, AGENTS_HEIGHTPOS, origP.y);
      var v = new THREE.Vector3(0, 0, 0);
      var gL = new THREE.Vector3(destP.x, AGENTS_HEIGHTPOS, destP.y);
      var or = new THREE.Vector3(1, 0, 0);
      var s = AGENTS_RAD;
      var wT = this.onMat;
      var a = new Agent(p, v, gL, or, s, wT);
      this.allAgents.push(a);
    }
  }

  makeMarkers() {
    //console.log("allAgents: makeMarkers");

    var origP = new THREE.Vector2(0, 0);
    for (var i = 0; i < this.numMarkers; i++) {
      origP = this.markerPositions[i];

      var p = new THREE.Vector3(origP.x, MARKER_HEIGHT, origP.y); 
      var o = false;
      
      var m = new Marker(p, o);
      this.allMarkers.push(m);
    }
  }

  addDataToScene(framework) {
    // console.log("allAgents: addDataToScene");

    var usingPos = new THREE.Vector3(0, 0, 0);
    var usingSize = 0;
    for (var i = 0; i < this.numAgents; i++) {
      usingPos = this.allAgents[i].pos;
      usingSize = this.allAgents[i].size;
      this.allAgents[i].mesh.scale.set(usingSize, usingSize, usingSize);
      this.allAgents[i].mesh.position.set( usingPos.x, usingPos.y, usingPos.z );

      framework.scene.add(this.allAgents[i].mesh);
    }
    for (var i = 0; i < this.numMarkers; i++) {
      usingPos = this.allMarkers[i].pos;
      usingSize = this.allMarkers[i].size;
      this.allMarkers[i].mesh.scale.set(usingSize, usingSize, usingSize);
      this.allMarkers[i].mesh.position.set( usingPos.x, usingPos.y, usingPos.z );

      framework.scene.add(this.allMarkers[i].mesh);
    }
  }

  removeDataFromScene(framework) {
    // console.log("allAgents: removeDataFromScene");

    for (var i = 0; i < this.numAgents; i++) {
      framework.scene.remove(this.allAgents[i].mesh);
    }
    for (var i = 0; i < this.numMarkers; i++) {
      framework.scene.remove(this.allMarkers[i].mesh);
    }
  }

  updateAgentsPos() {
    // console.log("allAgents: updateAgents");
    
    // this clearing must be done before calling assignAgentsToMarkers
    for (var i = 0; i < this.numAgents; i++) {
      this.allAgents[i].resetMarkers();
    }
    // precondition for below: each agent's markers is empty
    this.assignAgentsToMarkers();

    // recalc agents posVal following convention
    for (var i = 0; i < this.numAgents; i++) {
      var onAgent = this.allAgents[i];
      onAgent.computeVelo();
      onAgent.computePos();
      onAgent.posVal = posToSortingNum(this.allAgents[i].pos);
    }
  }

  assignAgentsToMarkers() {
    // console.log("allAgents: assignMarkersToAgents");

    // for each marker - searchForClosestAgent that is avail until all markers are assigned
    // marker knows its assigned value
    for (var i = 0; i < this.numMarkers; i++) {
      var currMarker = this.allMarkers[i];
      currMarker.occupied = false;
      var rad = 0.5;
      var chosenAgent = this.searchForClosestAgent(currMarker.posVal, currMarker.pos, rad);
      chosenAgent.addMarker(currMarker);
      currMarker.occupied = true;
    }
  }

  withinRange(onesMin, onesMax, tensMin, tensMax, valCheck) {
    var ones = valCheck%10;
    var tens = Math.floor(valCheck/10);
    return (ones >= onesMin && ones <= onesMax && tens >= tensMin && tens <= tensMax);
  }

  dist(pos1, pos2) {
    // pos1 and pos2 are THREE.Vector3(...)
    var ret = Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.z - pos2.z) * (pos1.z - pos2.z));
    return ret;
  }

  searchForClosestAgent(centerVal, centerPos, squareRad) {
    // center val: is given as an int following the posToSortingNum convention
    // center pos: THREE.Vector3(...) of actual position in world space
    // square rad: radius to search for closest agent
 
    // search for closest agent within the range
    var currClosest = null;
    // range based on convention that x: ones & z: tens
    var rangeOnesMin = centerVal%10 - squareRad;
    var rangeOnesMax = centerVal%10 + squareRad;
    var rangeTensMin = Math.floor(centerVal/10) - squareRad*10;
    var rangeTensMax = Math.floor(centerVal/10) + squareRad*10;

    for (var i = 0; i < this.numAgents; i++) {
      var temp = this.allAgents[i];
      if (currClosest == null) {
        currClosest = temp;
      } else if (this.withinRange(rangeOnesMin, rangeOnesMax, rangeTensMin, rangeTensMax, temp.posVal)
                 & this.dist(centerPos, temp.pos) < this.dist(centerPos, currClosest.pos)) {
        currClosest = temp;
      }
    }

    return currClosest;
  }

  show() {
    // console.log("allAgents: show");

    for (var i = 0; i < this.numMarkers; i++) {
      this.allMarkers[i].show();
    }
  };

  hide() {
    // console.log("allAgents: hide");

    for (var i = 0; i < this.numMarkers; i++) {
      this.allMarkers[i].hide();
    }
  };

  update() {
    // TO DO

    if (!this.isPaused) {
      this.updateAgentsPos();
    }
  }

};//end: AllAgents class

/************************************************************/
/************ Class for each Individual Agent ***************/
/************************************************************/
class Agent {

  /*
   * necessary parts of Agent:
   *
   * Position
   * Velocity
   * Goal
   * Orientation
   * Size
   * Markers
   */
  constructor(pos, vel, goalLoc, orientation, size, whichTexture) {
    this.init(pos, vel, goalLoc, orientation, size, whichTexture);
  }

  init(pos, vel, goalLoc, orientation, size, whichTexture) {
    // console.log("Agent: init");

    this.pos = pos;
    this.vel = vel;
    this.goalLoc = goalLoc;
    this.orientation = orientation;
    this.size = size;
    this.markers = new Array();
    this.whichTexture = whichTexture;

    this.mesh = null;
    this.geo = null;
    this.material = null;

    this.posVal = posToSortingNum(this.pos);
      
    this.makeMesh();
  }

  makeMesh() {
    // console.log("Agent: makeMesh");

    this.geo = new THREE.CylinderGeometry(AGENTS_RAD, AGENTS_RAD, AGENTS_HEIGHT);
    this.updateMesh();
  }

  updateMaterials() {
    // console.log("Agent: updateMaterials");

    if (this.whichTexture == 0) {
      this.material = mat1;
    } else if (this.whichTexture == 1) {
      this.material = mat2;
    } else {
      console.log("main: NO PROPER MATERIAL AVAILABLE");
    }
  }

  updateMesh() {
    // console.log("Agent: updateMesh");

    this.updateMaterials();
    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.updatePosition();
  }

  addMarker(m) {
    // console.log("Agent: addMarker");

    this.markers.push(m);
  }

  resetMarkers() {
    // console.log("Agent: resetMarkers");

    this.markers = new Array();
  }

  computeVelo() {
    // console.log("Agent: computeVelo");

    var numMarkers = this.markers.length;

    var sumMarkerDists = 0;
    for (var i = 0; i<numMarkers; i++) {
      var onMarker = this.markers[i];
      var d = onMarker.pos.distanceTo(this.pos);
      sumMarkerDists += d;
    }

    // zero the velocity before accumulating based on markers
    this.vel = new THREE.Vector3(0, 0, 0);

    // case where if within dist to destination - velocity is now zero so it stops:
    var distToGoal = new THREE.Vector2(this.goalLoc.x - this.pos.x, this.goalLoc.z - this.pos.z);
    if (distToGoal.length() < 0.2) {
      return;
    }

    // accounting for case where num markers for an agent is 0 bc will be dividing by num Markers for velo calc
    if (numMarkers == 0) {
      return;
    }

    for (var i = 0; i < numMarkers; i++) {
      var onMarker = this.markers[i];

      var displVec_AtoM = new THREE.Vector2(onMarker.pos.x - this.pos.x, onMarker.pos.z - this.pos.z);
      var d_AtoM = displVec_AtoM.length();

      var displVec_AtoG = distToGoal;
      var d_AtoG = displVec_AtoG.length();

      var lenAM = displVec_AtoM.length();
      var dN_AtoM = new THREE.Vector3(displVec_AtoM.x / lenAM, displVec_AtoM.y / lenAM, displVec_AtoM.z / lenAM);
      var lenAG = displVec_AtoG.length();
      var dN_AtoG = new THREE.Vector3(displVec_AtoG.x / lenAG, displVec_AtoG.y / lenAG, displVec_AtoG.z / lenAG);
      var dot = dN_AtoG.dot(dN_AtoM);

      var weight = d_AtoM / sumMarkerDists * dot;
      var vector = new THREE.Vector2(displVec_AtoM.x * weight, displVec_AtoM.y * weight);

      this.vel.add(new THREE.Vector3(vector.x, 0, vector.y));
    }

    // clamping to min/max values for velocity
    var min = -0.05;
    var max = 0.05;
    if (this.vel.x < min) this.vel.x = min;
    else if (this.vel.x > max) this.vel.x = max;
    if (this.vel.z < min) this.vel.z = min;
    else if (this.vel.z > max) this.vel.z = max;
  }

  computePos() {
    // console.log("Agent: computePos");

    this.pos.add(this.vel);
    this.updatePosition();
  }

  updatePosition() {
    // console.log("Agent: updatePosition");

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }

  update() {
    // TO DO
  }

};//end: Agent class

/***************************************************************/
/************ Class for each Marker in the Scene ***************/
/***************************************************************/
class Marker {

  /*
   * necessary parts of Marker:
   *
   * Location
   * occupied: bool if already used as marker for an obj or not
   * visualDebug: Bool for if seen or not
   */
  constructor(pos, occupied) {
    this.init(pos, occupied);
  }

  init(pos, occupied) {
    // console.log("Marker: init");

    this.pos = pos;
    this.occupied = occupied;

    this.posVal = posToSortingNum(pos);
    
    this.makeMesh();
    this.show();
  }

  makeMesh() {
    // console.log("Marker: makeMesh");

    var geo = new THREE.Geometry();
    var material = new THREE.PointsMaterial( { size:.1 } );
    geo.vertices.push(new THREE.Vector3(this.pos[0], this.pos[1], this.pos[2]));

    this.mesh = new THREE.Points(geo, material);
  }

  show() {
    console.log("Marker: show");

    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    console.log("Marker: hide");
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

  update() {
    // TO DO
  }

};//end: Marker class
