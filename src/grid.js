const THREE = require('three')

export class GridCell {
	constructor() {
		this.isMarked = false;
		this.color = new THREE.Color(0, 0, 0);
	}
}

// A class used to simulate the player for depth first search level generation
class FakePlayer {
	//col0 is the face color for global POSITIVE X axis
    //col1 is the face color for global NEGATIVE X axis
    //col2 is the face color for global POSITIVE Y axis
    //col3 is the face color for global NEGATIVE Y axis
    //col4 is the face color for global POSITIVE Z axis
    //col5 is the face color for global NEGATIVE Z axis
    constructor(pos, colors) {
        this.faceXPositive = new THREE.Color(colors[0]);
        this.faceXNegative = new THREE.Color(colors[1]);
        this.faceYPositive = new THREE.Color(colors[2]);
        this.faceYNegative = new THREE.Color(colors[3]);
        this.faceZPositive = new THREE.Color(colors[4]);
        this.faceZNegative = new THREE.Color(colors[5]);
        this.position = new THREE.Vector3(pos.x, 0, pos.z);

        /*
        console.log("faceXPositive is color (" +
					this.faceXPositive.r + ", " + this.faceXPositive.g + ", " + this.faceXPositive.b + ")");
        console.log("faceXNegative is color (" +
					this.faceXNegative.r + ", " + this.faceXNegative.g + ", " + this.faceXNegative.b + ")");
        console.log("faceYPositive is color (" +
					this.faceYPositive.r + ", " + this.faceYPositive.g + ", " + this.faceYPositive.b + ")");
        console.log("faceYNegative is color (" +
					this.faceYNegative.r + ", " + this.faceYNegative.g + ", " + this.faceYNegative.b + ")");
        console.log("faceZPositive is color (" +
					this.faceZPositive.r + ", " + this.faceZPositive.g + ", " + this.faceZPositive.b + ")");
        console.log("faceZNegative is color (" +
					this.faceZNegative.r + ", " + this.faceZNegative.g + ", " + this.faceZNegative.b + ")");
		*/
    }

    rotateZClockwise() {
        this.position.x += 1;
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

export default class Grid {

	constructor(scene, gridDimension, start, colors) {
		
		this.gridArray = [];
		//initialize grid
		for (var i = 0; i < gridDimension; i++) {
			this.gridArray[i] = [];
			for (var j = 0; j < gridDimension; j++) {
				this.gridArray[i][j] = new GridCell();
			}
		}

		//DEPTH FIRST SEARCH LEVEL GENERATION into this.gridArray
		var fakePlayer = new FakePlayer( start, colors );
		this.gridArray[start.x][start.z].isMarked = true;
		this.gridArray[start.x][start.z].color = fakePlayer.faceYNegative;
		var stack = [];
		stack.push(new THREE.Vector3(start.x, 0, start.z));
		while (stack.length > 0) {

			//check the 4 directions the fake player can move, add it to possible options
			var currPos = stack[stack.length-1];
			var options = [];
			if (currPos.x+1 >= 0 && currPos.x+1 < gridDimension && this.gridArray[currPos.x+1][currPos.z].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x+1, 0, currPos.z) );
				//rotate Z clockwise
			}
			if (currPos.x-1 >= 0 && currPos.x-1 < gridDimension && this.gridArray[currPos.x-1][currPos.z].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x-1, 0, currPos.z) );
				//rotate Z counterclockwise
			}
			if (currPos.z+1 >= 0 && currPos.z+1 < gridDimension && this.gridArray[currPos.x][currPos.z+1].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x, 0, currPos.z+1) );
				//rotate X counterclockwise
			}
			if (currPos.z-1 >= 0 && currPos.z-1 < gridDimension && this.gridArray[currPos.x][currPos.z-1].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x, 0, currPos.z-1) );
				//rotate X clockwise
			}

			if (options.length > 0) {
				//randomly pick a move option and move fakePlayer
				var pickedOption = options[Math.floor(Math.random()*options.length)];
				if (pickedOption.x > currPos.x && pickedOption.z == currPos.z) {
					//console.log("option x+1");
					fakePlayer.rotateZClockwise();
				}
				else if (pickedOption.x < currPos.x && pickedOption.z == currPos.z) {
					//console.log("option x-1");
					fakePlayer.rotateZCounter();
				}
				else if (pickedOption.z > currPos.z && pickedOption.x == currPos.x) {
					//console.log("option z+1");
					fakePlayer.rotateXCounter();
				}
				else {
					//console.log("option z-1");
					fakePlayer.rotateXClockwise();
				}

				//add new position to stack, set gridCell to marked, and color to bottom of cube
				stack.push(new THREE.Vector3(fakePlayer.position.x, fakePlayer.position.y, fakePlayer.position.z));
				this.gridArray[fakePlayer.position.x][fakePlayer.position.z].isMarked = true;
				this.gridArray[fakePlayer.position.x][fakePlayer.position.z].color = fakePlayer.faceYNegative;
				console.log("(" + fakePlayer.position.x + ", " + fakePlayer.position.z + ") is now color (" + 
					fakePlayer.faceYNegative.r + ", " + fakePlayer.faceYNegative.g + ", " + fakePlayer.faceYNegative.b + ")");
			}
			else {
				//no options, step back one
				stack.pop();
				if (stack.length > 0) {
					var stepBack = stack[stack.length-1];
					if (stepBack.x > currPos.x) {
						//console.log("stepped back to x+1");
						fakePlayer.rotateZClockwise();
					}
					else if (stepBack.x < currPos.x) {
						//console.log("stepped back to x-1");
						fakePlayer.rotateZCounter();
					}
					else if (stepBack.z > currPos.z) {
						//console.log("stepped back to z+1");
						fakePlayer.rotateXCounter();
					}
					else {
						//console.log("stepped back to z-1");
						fakePlayer.rotateXClockwise();
					}
				}
			}
		}

		//add planes to grid
		for (var x = 0.0; x < gridDimension; x += 1) {
			for (var z = 0.0; z < gridDimension; z += 1) {
				var planeGeometry = new THREE.PlaneGeometry( 1, 1, 1, 1);
				var planeMaterial = new THREE.MeshBasicMaterial({color: this.gridArray[x][z].color, 
					transparent:true, opacity:1.0, side: THREE.DoubleSide});
				var plane = new THREE.Mesh( planeGeometry, planeMaterial );
				plane.position.x = x+0.5;
				plane.position.z = z+0.5;
				plane.rotation.x = Math.PI/2.0;
				scene.add( plane );
			}
		}

	}

}

