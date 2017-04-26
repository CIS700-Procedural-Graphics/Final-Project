const THREE = require('three')

// Rotate an object around an axis in object space
function applyRotation(quaternion, axis, radians) {
    var q = new THREE.Quaternion();
    q.setFromAxisAngle(axis, radians);
    quaternion.premultiply(q);
}

// A class used to encapsulate the state of a player at a given moment.
export default class Player {

    //col0 is the face color for global POSITIVE X axis
    //col1 is the face color for global NEGATIVE X axis
    //col2 is the face color for global POSITIVE Y axis
    //col3 is the face color for global NEGATIVE Y axis
    //col4 is the face color for global POSITIVE Z axis
    //col5 is the face color for global NEGATIVE Z axis
    constructor(pos, colors) {
        this.faceXPositive = colors[0];
        this.faceXNegative = colors[1];
        this.faceYPositive = colors[2];
        this.faceYNegative = colors[3];
        this.faceZPositive = colors[4];
        this.faceZNegative = colors[5];
        this.position = new THREE.Vector3(pos.x, 0.5, pos.z);
        this.rotation = new THREE.Quaternion();

        this.cubeMaterials = [ 
          new THREE.MeshBasicMaterial({color:colors[0], transparent:true, opacity:0.8}),
          new THREE.MeshBasicMaterial({color:colors[1], transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:colors[2], transparent:true, opacity:0.8}),
          new THREE.MeshBasicMaterial({color:colors[3], transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:colors[4], transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:colors[5], transparent:true, opacity:0.8}) 
        ]; 
        this.cubeMaterial = new THREE.MeshFaceMaterial(this.cubeMaterials);
        this.cube = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), this.cubeMaterial);

        //offset so that "center" of cube is at corner (for grid)
        this.cube.position.x = pos.x+0.5;
        this.cube.position.y = 0.5;
        this.cube.position.z = pos.z+0.5;
    }

    rotateZClockwise() {
        this.position.x += 1;
        //THIS METHOD CAUSES ROTATION ISSUES
        //this.cube.position.x += 1;
        //this.cube.rotation.z += -Math.PI/2;
        applyRotation(this.rotation, new THREE.Vector3(0, 0, 1), -Math.PI/2);
        this.cube.rotation.set(0, 0, 0);
        this.cube.setRotationFromQuaternion(this.rotation);
        this.cube.position.set(this.cube.position.x + 1.0, this.cube.position.y, this.cube.position.z);
        //faceYPositive -> faceXNegative
        //faceXNegative -> faceYNegative
        //faceYNegative -> faceXPositive
        //faceXPositive -> faceYPositive
        var tempColor = new THREE.Color(this.faceYPositive);
        this.faceYPositive = new THREE.Color(this.faceXNegative);
        this.faceXNegative = new THREE.Color(this.faceYNegative);
        this.faceYNegative = new THREE.Color(this.faceXPositive);
        this.faceXPositive = tempColor;
        
    };

    rotateZCounter() {
        this.position.x += -1;
        //THIS METHOD CAUSES ROTATION ISSUES
        //this.cube.position.x += -1;
        //this.cube.rotation.z += Math.PI/2;
        applyRotation(this.rotation, new THREE.Vector3(0, 0, 1), Math.PI/2);
        this.cube.rotation.set(0, 0, 0);
        this.cube.setRotationFromQuaternion(this.rotation);
        this.cube.position.set(this.cube.position.x - 1.0, this.cube.position.y, this.cube.position.z);
        //faceYPositive -> faceXPositive
        //faceXPositive -> faceYNegative
        //faceYNegative -> faceXNegative
        //faceXNegative -> faceYPositive
        var tempColor = new THREE.Color(this.faceYPositive);
        this.faceYPositive = new THREE.Color(this.faceXPositive);
        this.faceXPositive = new THREE.Color(this.faceYNegative);
        this.faceYNegative = new THREE.Color(this.faceXNegative);
        this.faceXNegative = tempColor;
    };

    rotateXCounter() {
        this.position.z += 1;
        //THIS METHOD CAUSES ROTATION ISSUES
        //this.cube.position.z += 1;
        //this.cube.rotation.x += Math.PI/2;
        applyRotation(this.rotation, new THREE.Vector3(1, 0, 0), Math.PI/2);
        this.cube.rotation.set(0, 0, 0);
        this.cube.setRotationFromQuaternion(this.rotation);
        this.cube.position.set(this.cube.position.x, this.cube.position.y, this.cube.position.z + 1.0);
        //faceYPositive -> faceZNegative
        //faceZNegative -> faceYNegative
        //faceYNegative -> faceZPositive
        //faceZPositive -> faceYPositive
        var tempColor = new THREE.Color(this.faceYPositive);
        this.faceYPositive = new THREE.Color(this.faceZNegative);
        this.faceZNegative = new THREE.Color(this.faceYNegative);
        this.faceYNegative = new THREE.Color(this.faceZPositive);
        this.faceZPositive = tempColor;
    };

    rotateXClockwise() {
        this.position.z += -1;
        //THIS METHOD CAUSES ROTATION ISSUES
        //this.cube.position.z += -1;
        //this.cube.rotation.x += -Math.PI/2;
        applyRotation(this.rotation, new THREE.Vector3(1, 0, 0), -Math.PI/2);
        this.cube.rotation.set(0, 0, 0);
        this.cube.setRotationFromQuaternion(this.rotation);
        this.cube.position.set(this.cube.position.x, this.cube.position.y, this.cube.position.z - 1.0);
        //faceYPositive -> faceZPositive
        //faceZPositive -> faceYNegative
        //faceYNegative -> faceZNegative
        //faceZNegative -> faceYPositive
        var tempColor = new THREE.Color(this.faceYPositive);
        this.faceYPositive = new THREE.Color(this.faceZPositive);
        this.faceZPositive = new THREE.Color(this.faceYNegative);
        this.faceYNegative = new THREE.Color(this.faceZNegative);
        this.faceZNegative = tempColor;
    };
}

