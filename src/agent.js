const THREE = require('three')

var a_mat = new THREE.MeshBasicMaterial({color: 0xdddddd});
var left_mat = new THREE.MeshBasicMaterial({color: 0xffff00});
var right_mat = new THREE.MeshBasicMaterial({color: 0x0000ff});
var top_mat = new THREE.MeshBasicMaterial({color: 0x00ffff});
var bot_mat = new THREE.MeshBasicMaterial({color: 0xff00ff});

export function distance(x, y) {
  var x1 = x.x - y.x; var y1 = x.y - y.y;
  return Math.sqrt(x1*x1 + y1*y1);
}

export default class Agent {
  constructor(pos, i, ori, goal, radius, geo, left, l_mat,max) {
    this.init(pos, i, ori, goal, radius, geo, left, l_mat,max);
  }

  init (pos, i, ori, goal, radius, geo, left, l_mat,max) {
    this.pos = pos;
    this.index = i;
    this.vel = new THREE.Vector3(0,0,0);
    this.ori = ori;
    this.goal = goal;
    this.radius = radius;
    this.markers = [];    

    this.lineGeo = new THREE.BufferGeometry();
    this.l_positions = new Float32Array(max * 3);
    this.lines = new THREE.LineSegments( this.lineGeo, l_mat );
    this.lineGeo.addAttribute('position', new THREE.BufferAttribute(this.l_positions, 3));
    
    this.lines.geometry.attributes.position.dynamic = true;
    this.lines.geometry.dynamic = true;

    var geometry = new THREE.CircleGeometry( this.radius, 16 );
    if (left & 2) {
      var material = (left & 1) ? left_mat : right_mat;
    } else {
      var material = (left & 1) ? top_mat : bot_mat;
    }
    
    this.circle = new THREE.Mesh( geometry, a_mat);
    this.circle.position.set(pos.x, pos.y,0);
    this.circle.geometry.verticesNeedUpdate = true;

    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.position.set(pos.x, pos.y, 0);
    this.mesh.geometry.verticesNeedUpdate = true;
  }

  update () {
    // update velocity
    this.l_positions.fill(0);
    var weight = 0; var ind = 0;
    this.vel.x = 0; this.vel.y = 0; this.vel.z = 0;
    if (distance(this.pos, this.goal) > 0.01) {
      for (var i = 0; i < this.markers.length; i ++) {
        var mark = this.markers[i];
        var dist = distance(mark.pos, this.pos);

        var G = (this.goal).clone().sub(this.pos).normalize();
        var m = (mark.pos).clone().sub(this.pos);
        var theta = G.dot((m.clone()).normalize());
        mark.weight = (1 + theta) / (1 + dist);
        weight += mark.weight;
        this.vel.add(m.multiplyScalar(mark.weight));
        
        this.l_positions[ind++] = mark.pos.x; this.l_positions[ind++] = mark.pos.y; this.l_positions[ind++] = 0;
        this.l_positions[ind++] = this.pos.x; this.l_positions[ind++] = this.pos.y; this.l_positions[ind++] = 0;
      }
      if (this.markers.length != 0) this.vel.divideScalar(this.markers.length * weight);
      this.vel.clampLength(-this.radius, this.radius);
    }
    
    // update position
    this.pos.add(this.vel);
    this.mesh.position.set(this.pos.x, this.pos.y, 0);
    this.circle.position.set(this.pos.x, this.pos.y, 0);
    this.lines.geometry.setDrawRange(0,  2.0 * this.markers.length);
    this.lines.geometry.attributes.position.needsUpdate = true;
  }
}
