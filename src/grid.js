class GridCell {
	constructor() {
		this.isMarked = false;
		this.color = null;
	}
}

class FakePlayer {
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
        this.position = new THREE.Vector3(pos.x, pos.y, pos.z);
    }

    rotateZClockwise() {
        this.position.x += 1;
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
        this.position.x += -1;
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
        this.position.z += 1;
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
        this.position.z += -1;
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

export default class Grid {

	constructor(scene, gridDimension, start, colors) {
		
		var gridArray = [];
		//initialize grid
		for (var i = 0; i < gridDimension; i++) {
			grid[i] = [];
			for (var j = 0; j < gridDimension; j++) {
				gridArray[i][j] = new GridCell();
			}
		}

		//DEPTH FIRST SEARCH LEVEL GENERATION into gridArray
		var fakePlayer = new FakePlayer( start, colors );
		gridArray[start.x][start.z].isMarked = true;
		gridArray[start.x][start.z].color = fakePlayer.faceYNegative;
		var stack = [];
		stack.push(new THREE.Vector3(start.x, 0.5, start.z));
		while (stack.length != 0) {

			//check the 4 directions the fake player can move, add it to possible options
			var currPos = stack[stack.length-1];
			var options = [];
			if (currPos.x+1 > 0 && currPos.x+1 <= gridDimension-1 && gridArray[currPos.x+1][currPos.z].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x+1, 0.5, currPos.z) );
				//rotate Z clockwise
			}
			if (currPos.x-1 > 0 && currPos.x-1 <= gridDimension-1 && gridArray[currPos.x-1][currPos.z].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x-1, 0.5, currPos.z) );
				//rotate Z counterclockwise
			}
			if (currPos.z+1 > 0 && currPos.z+1 <= gridDimension-1 && gridArray[currPos.x][currPos.z+1].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x, 0.5, currPos.z+1) );
				//rotate X counterclockwise
			}
			if (currPos.z-1 > 0 && currPos.z-1 <= gridDimension -1 && gridArray[currPos.x][currPos.z-1].isMarked == false) {
				options.push( new THREE.Vector3(currPos.x, 0.5, currPos.z-1) );
				//rotate X clockwise
			}

			if (options.length > 0) {
				//randomly pick a move option and move fakePlayer
				var pickedOption = options[Math.floor(Math.random()*stack.length)];
				if (pickedOption.x > currPos.x) {
					fakePlayer.rotateZClockwise();
				}
				else if (pickedOption.x < currPos.x) {
					fakePlayer.rotateZCounter();
				}
				else if (pickedOption.z > currPos.z) {
					fakePlayer.rotateXCounter();
				}
				else {
					fakePlayer.rotateXClockwise();
				}

				//add new position to stack, set gridCell to marked, and color to bottom of cube
				stack.push(new THREE.Vector3(fakePlayer.position.x, fakePlayer.position.y, fakePlayer.position.z));
				gridArray[fakePlayer.position.x][fakePlayer.position.z].isMarked = true;
				gridArray[fakePlayer.position.x][fakePlayer.position.z].color = fakePlayer.faceYNegative;
			}
			else {
				//no options, step back one
				stack.pop();
				var stepBack = stack[stack.length-1];
				if (stepBack.x > currPos.x) {
					fakePlayer.rotateZClockwise();
				}
				else if (stepBack.x < currPos.x) {
					fakePlayer.rotateZCounter();
				}
				else if (stepBack.z > currPos.z) {
					fakePlayer.rotateXCounter();
				}
				else {
					fakePlayer.rotateXClockwise();
				}
			}
		}

		//add planes to grid
		for (var x = 0.0; x < gridDimension; x += 1) {
			for (var z = 0.0; z < gridDimension; z += 1) {
				var planeGeometry = new THREE.PlaneGeometry( 1, 1, 1, 1);
				var planeMaterial = new THREE.MeshBasicMaterial({color: gridArray[x][z].color, transparent:true, opacity:1.0, side: THREE.DoubleSide});
				var plane = new THREE.Mesh( planeGeometry, planeMaterial );
				plane.position.x = x+0.5;
				plane.position.z = z+0.5;
				plane.rotation.x = Math.PI/2.0;
				scene.add( plane );
			}
		}

	}

}

