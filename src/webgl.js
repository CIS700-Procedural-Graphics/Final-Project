function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export default function WebGL2() {
	
    
    this.canvas = document.getElementById('canvas');
    this.gl = canvas.getContext('webgl2');
    this.programs = [];

    this.attributeBuffers = [];
    
    this.createPrograms = function(fileNames) {
        
        var gl = this.gl;

        for (var i = 0; i < fileNames.length; i++) {

            var vertexShaderSource = require('./shaders/' + fileNames[i] + '-vert.glsl');
            var fragmentShaderSource = require('./shaders/' + fileNames[i] + '-frag.glsl');

            var vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
            var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
            this.programs[i] = createProgram(gl, vertexShader, fragmentShader);
        }
        
        return this.programs;
    }
    
    this.setAttributeLocations = function (program, attributeNames) {
        
        var gl = this.gl;
        program.attributeLocations = [];
        
        for (var i = 0; i < attributeNames.length; i++) {        
            program.attributeLocations[i] = gl.getAttribLocation(program, attributeNames[i]);
            gl.enableVertexAttribArray(program.attributeLocations[i]);
        }  
        
        return program.attributeLocations;
    }
    
    this.setUniformLocations = function (program, uniformNames) {
        
        var gl = this.gl;
        program.uniformLocations = [];
        
        for (var i = 0; i < uniformNames.length; i++) {
            program.uniformLocations[i] = gl.getUniformLocation(program, uniformNames[i]);
        }  
        
        return program.uniformLocations;
    }
	   

    this.setAttributeBuffers = function (program, bufferNames, data) {
        
        var gl = this.gl;
        program.attributeBuffers = [];
        
        for (var i = 0; i < bufferNames.length; i++) {
            program.attributeBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[i]);
            
            if (data) {
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY);
            }    
            //DEBUG: Setting initial positions and random velocities for particles
            else if (i == 0) {
                var particle_positions = [];
              
                var num_particles = 1000000;
                var angleOffset = 2.0 * Math.PI / num_particles;
                var sqrt_num_particles = Math.sqrt(num_particles);

                 for (var x = -1.0; x < 1.0; x) {
                     var temp_x = (2.0/sqrt_num_particles);
                    for (var y = -1.0; y < 1.0; y) {
                     var temp_y = (2.0/sqrt_num_particles);

                        particle_positions.push(x);
                        particle_positions.push(y);
                        particle_positions.push(0.0);
                        particle_positions.push(1.0);
                        y+= temp_y;
                    }
                     x+= temp_x;

                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particle_positions), gl.DYNAMIC_COPY);
            }
            else if (i == 1) {
                var particle_velocites = [];

                var num_particles = 1000000;
                var sqrt_num_particles = Math.sqrt(num_particles);
                var angleOffset = 2.0 * Math.PI / num_particles;

                 for (var x = 0; x < sqrt_num_particles; x++) {
                    for (var y = 0; y < sqrt_num_particles; y++) {

                        particle_velocites.push((Math.random()*2.0-1.0)/1000.0);
                        particle_velocites.push((Math.random()*2.0-1.0)/1000.0);
                        particle_velocites.push((Math.random()*2.0-1.0)/1000.0);
                        particle_velocites.push(1.0);
                    }

                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particle_velocites), gl.DYNAMIC_COPY);
            }            
            
        }  
        
        return program.attributeBuffers;
    }
    
    this.setVertexAttributePointers = function (program, bufferIndices) {
        
        var gl = this.gl;
        
        for (var i = 0; i < bufferIndices.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[bufferIndices[i]]);
            //4 components per iteration, data is 32bit floats, don't normalize the data
            gl.vertexAttribPointer(program.attributeLocations[bufferIndices[i]],
                               4, gl.FLOAT, gl.FALSE, 0, 0);
        }  
        
        return program.uniformLocations;
    }
    
    this.swapAttributeBuffers = function (programs, bufferIndices) {
                
        for (var i = 0; i < bufferIndices.length; i++) {
            var t = programs[0].attributeBuffers[bufferIndices[i]];  
            programs[0].attributeBuffers[bufferIndices[i]] = programs[1].attributeBuffers[bufferIndices[i]]; 
            programs[1].attributeBuffers[bufferIndices[i]] = t;
        }  
        
    }
}