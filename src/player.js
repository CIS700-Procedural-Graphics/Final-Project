const THREE = require('three')

// A class used to encapsulate the state of a player at a given moment.
export default class Player {

    //col0 is the face color for global POSITIVE X axis
    //col1 is the face color for global NEGATIVE X axis
    //col2 is the face color for global POSITIVE Y axis
    //col3 is the face color for global NEGATIVE Y axis
    //col4 is the face color for global POSITIVE Z axis
    //col5 is the face color for global NEGATIVE Z axis
    constructor(col0, col1, col2, col3, col4, col5, pos) {
        this.faceXPositive = col0;
        this.faceXNegative = col1;
        this.faceYPositive = col2;
        this.faceYNegative = col3;
        this.faceZPositive = col4;
        this.faceZNegative = col5;
        this.cubeMaterials = [ 
          new THREE.MeshBasicMaterial({color:col0, transparent:true, opacity:0.8}),
          new THREE.MeshBasicMaterial({color:col1, transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:col2, transparent:true, opacity:0.8}),
          new THREE.MeshBasicMaterial({color:col3, transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:col4, transparent:true, opacity:0.8}), 
          new THREE.MeshBasicMaterial({color:col5, transparent:true, opacity:0.8}) 
        ]; 
        this.cubeMaterial = new THREE.MeshFaceMaterial(this.cubeMaterials);
        this.cube = new THREE.Mesh( new THREE.CubeGeometry(1,1,1), this.cubeMaterial);
        this.cube.position.x = pos.x;
        this.cube.position.y = pos.y;
        this.cube.position.z = pos.z;
    }

    rotateZClockwise() {
        this.cube.position.x += 1;
        this.cube.rotation.z += Math.PI/2;
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

    rotateZCounter() {
        this.cube.position.x += -1;
        this.cube.rotation.z += -Math.PI/2;
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

    rotateXCounter() {
        this.cube.position.z += 1;
        this.cube.rotation.x += -Math.PI/2;
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

    rotateXClockwise() {
        this.cube.position.z += -1;
        this.cube.rotation.x += Math.PI/2;
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
}

