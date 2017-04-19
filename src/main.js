import Framework from './framework'

var uniform = {
    TIME: 0,
    RESOLUTION: 1,
    mouse: 2
};

var varying = {
    POSTION: 0,
    VELOCITY: 1
}

var program = {
    PARTICLES: 0,
    DRAW: 1
}

var programs = [];

var startTime;
var num_particles = 1000000;
var mouseX = 0;
var mouseY = 0;
var mouseDown = 0;

function getClickPosition(e) {
    var xPosition = e.clientX;
    var yPosition = e.clientY;           
    var ndcX = (( xPosition - canvas.offsetLeft ) / canvas.clientWidth) * 2 - 1;
    var ndcY = (1 - (( yPosition - canvas.offsetTop ) / canvas.clientHeight)) * 2 - 1;
    mouseX = ndcX;
    mouseY = ndcY;
    mouseDown++;
}

function mouseUp(e) {
    --mouseDown;
}


function onLoad(framework) {
    
    var canvas = framework.canvas;
    var gl = framework.webgl.gl;
    
    canvas.addEventListener("mousedown", getClickPosition, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    
    var startTime = Date.now();

    programs = framework.webgl.createPrograms(["particles", "draw"]);
    
    //provide webgl with output attributes for capture into buffers
    //GL_SEPARATE_ATTRIBS: Write attributes to multiple buffer objects
    gl.transformFeedbackVaryings(programs[program.PARTICLES], ["outPos", "outVel"], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(programs[program.PARTICLES]);
    gl.useProgram(programs[program.PARTICLES]);
    
    //assign attribute locations to given program to access as programs[program.PARTICLES].attributeLocations
    framework.webgl.setAttributeLocations(programs[program.PARTICLES],["inPos","inVel"]);
   
    framework.webgl.setAttributeBuffers(programs[program.PARTICLES],["inPos","inVel"]); 
    framework.webgl.setAttributeBuffers(programs[program.DRAW],["inPos","inVel"],new Float32Array(4*num_particles));

    framework.webgl.setUniformLocations(programs[program.PARTICLES],["u_time","u_resolution","u_mouse"]);
    framework.webgl.setUniformLocations(programs[program.DRAW],["u_time","u_resolution","u_mouse"]);
  
    
    var transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    

    window.dispatchEvent(new Event('resize'));
    
}

function onUpdate(framework) {
        if (!programs[program.PARTICLES] || !programs[program.DRAW]) {
            return;
        }
        var time = Date.now() - startTime;
        
        var gl = framework.webgl.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        gl.useProgram(programs[program.PARTICLES]);
    
        framework.webgl.setVertexAttributePointers(programs[program.PARTICLES], [varying.POSTION, varying.VELOCITY])
    
        //bind the transform feedback buffers
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, programs[program.DRAW].attributeBuffers[varying.POSTION]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, programs[program.DRAW].attributeBuffers[varying.VELOCITY]); 
        
        gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.TIME], time);
        gl.uniform2f(programs[program.PARTICLES].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
        gl.uniform2f(programs[program.PARTICLES].uniformLocations[uniform.MOUSE], mouseX, mouseY);
    
                
        //no drawing
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, num_particles);
        gl.endTransformFeedback();
        
    
        gl.disable(gl.RASTERIZER_DISCARD);
        //clear transform feedback buffer binding
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);

        
        //draw the points from draw program
        gl.useProgram(programs[program.DRAW]);
        gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.TIME], time);
        gl.uniform2f(programs[program.DRAW].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
        gl.uniform2f(programs[program.DRAW].uniformLocations[uniform.MOUSE], mouseX, mouseY);
        gl.drawArrays(gl.POINTS, 0, num_particles);
    
    
        //swap the attribute buffers of particles shader with the buffers from transform feedback to be used as input in the next iteration 
        framework.webgl.swapAttributeBuffers(programs, [varying.POSTION, varying.VELOCITY]);
}


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);