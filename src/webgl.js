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
            this.programs[i].attributeBuffers = [];
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
    
    this.setAttributeLocationAtIndex = function (program, name, index) {
        
        var gl = this.gl;
        
        program.attributeLocations[index] = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(program.attributeLocations[index]);
        
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
    
    this.setAttributeBufferAtIndex = function (program, bufferIndex, data) {
        
        var gl = this.gl;
        var index = bufferIndex;
        
        program.attributeBuffers[index] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);

        return program.attributeBuffers;
    }
    
    
    this.setVertexAttributePointerAtIndex = function (program, bufferIndex, components, offset) {
        
        var gl = this.gl;     
        gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[bufferIndex]);
        //components per iteration, data is 32bit floats, don't normalize the data
        gl.vertexAttribPointer(program.attributeLocations[bufferIndex],
                           components, gl.FLOAT, gl.FALSE, 0, offset);
    }
    
    this.setVertexAttributePointers = function (program, bufferIndices) {
        
        var gl = this.gl;
        
        for (var i = 0; i < bufferIndices.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributeBuffers[bufferIndices[i]]);
            //4 components per iteration, data is 32bit floats, don't normalize the data
            gl.vertexAttribPointer(program.attributeLocations[bufferIndices[i]],
                               4, gl.FLOAT, gl.FALSE, 0, 0);
        }
    }
    
    this.swapAttributeBuffers = function (programs, bufferIndices) {
                
        for (var i = 0; i < bufferIndices.length; i++) {
            var t = programs[0].attributeBuffers[bufferIndices[i]];  
            programs[0].attributeBuffers[bufferIndices[i]] = programs[1].attributeBuffers[bufferIndices[i]]; 
            programs[1].attributeBuffers[bufferIndices[i]] = t;
        }  
        
    }
}