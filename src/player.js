const THREE = require('three')

//bias function for more realistic animation
function bias(b, t) {
    return Math.pow(t, Math.log(b) / Math.log(0.5));
}

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
          new THREE.MeshBasicMaterial({color:colors[0]}),
          new THREE.MeshBasicMaterial({color:colors[1]}), 
          new THREE.MeshBasicMaterial({color:colors[2]}),
          new THREE.MeshBasicMaterial({color:colors[3]}),  
          new THREE.MeshBasicMaterial({color:colors[4]}), 
          new THREE.MeshBasicMaterial({color:colors[5]}) 
        ]; 
        this.cubeMaterial = new THREE.MeshFaceMaterial(this.cubeMaterials);
        this.cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), this.cubeMaterial);

        //offset so that "center" of cube is at corner (for grid)
        this.cube.position.x = pos.x+0.5;
        this.cube.position.y = 0.5;
        this.cube.position.z = pos.z+0.5;

        //ANIMATION
        this.isAnimating = false;
        this.animateType = 0;
        this.t = 0;
    }

    rotateZClockwise() {
        this.isAnimating = true;
        this.animateType = 0;

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
        this.isAnimating = true;
        this.animateType = 1;

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
        this.isAnimating = true;
        this.animateType = 2;

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
        this.isAnimating = true;
        this.animateType = 3;

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

    animate(grid) {

        //if animation is finished
        if (this.t >= 1.0) {

            //thudSound.play();

            this.isAnimating = false;
            this.t = 0.0;
            switch(this.animateType) {
            //ZClockwise
            case 0:
                this.position.x += 1;
                applyRotation(this.rotation, new THREE.Vector3(0, 0, 1), -Math.PI/2.0);
                this.cube.rotation.set(0, 0, 0);
                this.cube.setRotationFromQuaternion(this.rotation);
                this.cube.position.set(this.position.x + 0.5, 0.5, this.position.z + 0.5);
                break;
            //ZCounter
            case 1:
                this.position.x += -1;
                applyRotation(this.rotation, new THREE.Vector3(0, 0, 1), Math.PI/2.0);
                this.cube.rotation.set(0, 0, 0);
                this.cube.setRotationFromQuaternion(this.rotation);
                this.cube.position.set(this.position.x + 0.5, 0.5, this.position.z + 0.5);
                break;
            //XCounter
            case 2:
                this.position.z += 1;
                applyRotation(this.rotation, new THREE.Vector3(1, 0, 0), Math.PI/2.0);
                this.cube.rotation.set(0, 0, 0);
                this.cube.setRotationFromQuaternion(this.rotation);
                this.cube.position.set(this.position.x + 0.5, 0.5, this.position.z + 0.5);
                break;
            //XClockwise
            case 3:
                this.position.z += -1;
                applyRotation(this.rotation, new THREE.Vector3(1, 0, 0), -Math.PI/2.0);
                this.cube.rotation.set(0, 0, 0);
                this.cube.setRotationFromQuaternion(this.rotation);
                this.cube.position.set(this.position.x + 0.5, 0.5, this.position.z + 0.5);
                break;
            }
            return;
        }

        //reset cube to origin
        this.cube.matrix = new THREE.Matrix4().makeTranslation(0, 0, 0);
        //original rotation
        var originalRot = new THREE.Matrix4().makeRotationFromQuaternion(this.rotation);

        //animation tweening
        var animateMat = new THREE.Matrix4();
        switch(this.animateType) {
            //ZClockwise
            case 0:
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(-0.5, 0.5, 0));
                var angle = bias(0.1, this.t) * (-Math.PI/2.0);
                var quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
                animateMat.premultiply(new THREE.Matrix4().makeRotationFromQuaternion(quat));
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0.5, -0.5, 0));
                break;
            //ZCounter
            case 1:
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0));
                var angle = bias(0.1, this.t) * (Math.PI/2.0);
                var quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
                animateMat.premultiply(new THREE.Matrix4().makeRotationFromQuaternion(quat));
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(-0.5, -0.5, 0));
                break;
            //XCounter
            case 2:
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0, 0.5, -0.5));
                var angle = bias(0.1, this.t) * (Math.PI/2.0);
                var quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
                animateMat.premultiply(new THREE.Matrix4().makeRotationFromQuaternion(quat));
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0.5));
                break;
            //XClockwise
            case 3:
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0, 0.5, 0.5));
                var angle = bias(0.1, this.t) * (-Math.PI/2.0);
                var quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
                animateMat.premultiply(new THREE.Matrix4().makeRotationFromQuaternion(quat));
                animateMat.premultiply(new THREE.Matrix4().makeTranslation(0, -0.5, -0.5));
                break;
        }
        //apply animation rotation to original rotation
        originalRot.premultiply(animateMat);
        //apply original translation
        originalRot.premultiply(new THREE.Matrix4().makeTranslation(this.position.x + 0.5, 0.5, this.position.z + 0.5));
        this.cube.applyMatrix(originalRot);
        this.t += 0.05;
    }
}

