var Sphere = require('primitive-sphere');
var Cube = require('primitive-cube');
var Torus = require('primitive-torus');

Character.prototype.A = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,1,1,1,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.B = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.C = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,0];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}


Character.prototype.D = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.E = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,0];
    grid[4] = [1,1,1,1,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.F = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,0];
    grid[4] = [1,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.G = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,0,1,1,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.H = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,1,1,1,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.I = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [0,0,1,0,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [1,1,1,1,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.J = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,1,1];
    grid[1] = [0,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.K = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,0,0,1,0];
    grid[2] = [1,1,1,0,0];
    grid[3] = [1,0,0,1,0];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.L = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,0];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,0,0,0,0];
    grid[3] = [1,0,0,0,0];
    grid[4] = [1,1,1,1,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.M = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,1,0,1,1];
    grid[2] = [1,0,1,0,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.N = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,1,0,0,1];
    grid[2] = [1,0,1,0,1];
    grid[3] = [1,0,0,1,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.O = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.P = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,0];
    grid[4] = [1,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.Q = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [1,0,0,1,0];
    grid[4] = [0,1,1,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.R = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.S = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,1];
    grid[1] = [1,0,0,0,0];
    grid[2] = [0,1,1,1,0];
    grid[3] = [0,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.T = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [0,0,1,0,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.U = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.V = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,0,0,1];
    grid[3] = [0,1,0,1,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.W = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [1,0,0,0,1];
    grid[2] = [1,0,1,0,1];
    grid[3] = [1,1,0,1,1];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.X = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [0,1,0,1,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,1,0,1,0];
    grid[4] = [1,0,0,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.Y = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,0,0,0,1];
    grid[1] = [0,1,0,1,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.Z = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [0,0,0,1,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,1,0,0,0];
    grid[4] = [1,1,1,1,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.zero = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,1,1];
    grid[2] = [1,0,1,0,1];
    grid[3] = [1,1,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.one = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,1,0,0];
    grid[1] = [0,1,1,0,0];
    grid[2] = [0,0,1,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.two = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [0,0,0,0,1];
    grid[2] = [0,1,1,1,0];
    grid[3] = [1,0,0,0,0];
    grid[4] = [1,1,1,1,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.three = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,0];
    grid[1] = [0,0,0,0,1];
    grid[2] = [0,0,1,1,0];
    grid[3] = [0,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.four = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,1,0];
    grid[1] = [0,0,1,1,0];
    grid[2] = [0,1,0,1,0];
    grid[3] = [1,1,1,1,1];
    grid[4] = [0,0,0,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.five = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,1,1,1,0];
    grid[3] = [0,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.six = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,1];
    grid[1] = [1,0,0,0,0];
    grid[2] = [1,1,1,1,0];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.seven = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [1,1,1,1,1];
    grid[1] = [0,0,0,0,1];
    grid[2] = [0,0,0,1,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,1,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.eight = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [0,1,1,1,0];
    grid[3] = [1,0,0,0,1];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.nine = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [1,0,0,0,1];
    grid[2] = [0,1,1,1,1];
    grid[3] = [0,0,0,0,1];
    grid[4] = [1,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.apostrophe = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,1,0,0];
    grid[1] = [0,0,1,0,0];
    grid[2] = [0,1,0,0,0];
    grid[3] = [0,0,0,0,0];
    grid[4] = [0,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.comma = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,0,0];
    grid[1] = [0,0,0,0,0];
    grid[2] = [0,0,0,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,1,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.period = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,0,0];
    grid[1] = [0,0,0,0,0];
    grid[2] = [0,0,0,0,0];
    grid[3] = [0,0,0,0,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.hyphen = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,0,0];
    grid[1] = [0,0,0,0,0];
    grid[2] = [0,1,1,1,0];
    grid[3] = [0,0,0,0,0];
    grid[4] = [0,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.ampersand = function(offset) {
    
    var grid = this.letterGrid;
    grid[0] = [0,1,1,0,0];
    grid[1] = [1,0,0,1,0];
    grid[2] = [0,1,1,0,1];
    grid[3] = [1,0,0,1,0];
    grid[4] = [0,1,1,0,1];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.doubleQuotation = function(offset) {
    
    var grid = this.letterGrid;
    grid[0] = [0,1,0,1,0];
    grid[1] = [0,1,0,1,0];
    grid[2] = [0,1,0,1,0];
    grid[3] = [0,0,0,0,0];
    grid[4] = [0,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.leftBracket = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [0,1,0,0,0];
    grid[2] = [0,1,0,0,0];
    grid[3] = [0,1,0,0,0];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.rightBracket = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,1,1,1,0];
    grid[1] = [0,0,0,1,0];
    grid[2] = [0,0,0,1,0];
    grid[3] = [0,0,0,1,0];
    grid[4] = [0,1,1,1,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.leftParenthesis = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,1,0,0];
    grid[1] = [0,1,0,0,0];
    grid[2] = [0,1,0,0,0];
    grid[3] = [0,1,0,0,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.rightParenthesis = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,1,0,0];
    grid[1] = [0,0,0,1,0];
    grid[2] = [0,0,0,1,0];
    grid[3] = [0,0,0,1,0];
    grid[4] = [0,0,1,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.colon = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,0,0];
    grid[1] = [0,0,1,0,0];
    grid[2] = [0,0,0,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,0,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.semiColon = function(offset) {
    
    var grid = this.letterGrid;
    
    grid[0] = [0,0,0,0,0];
    grid[1] = [0,0,1,0,0];
    grid[2] = [0,0,0,0,0];
    grid[3] = [0,0,1,0,0];
    grid[4] = [0,1,0,0,0];
    
    return this.replaceActiveGridPointsWithMesh(offset);
}

Character.prototype.replaceActiveGridPointsWithMesh = function(offset) {

    var grid = this.letterGrid;
    var allVertices = [];

    for(var x = 0; x < grid.length; x++){
        for(var y = 0; y < grid[x].length; y++){ 

            var cell = grid[y][x];
            
            if (cell) {
                            
                var pos = glm.vec3(x*this.dotSpacing,
                                   (grid[x].length-y)*this.dotSpacing,
                                   0)['+'](offset);

                var mesh;
                
                if (this.meshType == 1) {
                    mesh = Sphere(this.meshSize, {segments: 3});
                }
                else if (this.meshType == 2) {
                    mesh = Cube(this.meshSize,this.meshSize,this.meshSize, 2,2,2);
                }
                else if (this.meshType == 3) {
                    mesh = Torus({
                        majorRadius: this.meshSize/2,
                        minorRadius: this.meshSize/4,
                        majorSegments: 8,
                        minorSegments: 4
                    });
                }
                
                for (var m = 0; m < mesh.positions.length; m++) {

                    var vert = mesh.positions[m];
                    allVertices.push(glm.vec4(vert[0]+pos[0],vert[1]+pos[1],vert[2]+pos[2],1.0));
                } 
            }
        }       
    }
    
    return allVertices;
}

export default function Character() { 
    
    this.meshType = 1;
    this.meshSize = 0.2;
    this.gridWidth = 5.0;
    this.dotSpacing = 0.5;
    this.letterHeight = this.dotSpacing * this.gridWidth;
    this.letterWidth = this.dotSpacing * this.gridWidth;
    this.letterGrid = [];
}