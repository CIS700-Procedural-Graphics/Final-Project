import Framework from './framework'
var ObjMtlLoader = require("obj-mtl-loader");
var glm = require('glm-js');
import Camera from './camera'
import Controls from './controls'

var uniform = {
    TIME: 0,
    RESOLUTION: 1,
    MOUSE: 2,
    MODEL: 3,
    VIEW: 4,
    PROJECTION: 5,
    PROJECTIONVIEW: 6
    //ROTX: 3,
    //ROTY: 4
};

var varying = {
    POSTION: 0,
    VELOCITY: 1,
    OBJPOS: 2
}

var program = {
    PARTICLES: 0,
    DRAW: 1
}

var programs = [];

var startTime;
var num_particles = 9000;
var mouseX = 0;
var mouseY = 0;

var obj_vertices;
var obj_list = [];
var obj_frames = [];

function glmMatToArray(mat)
{    
    return [
        mat[0][0], mat[0][1], mat[0][2], mat[0][3], 
        mat[1][0], mat[1][1], mat[1][2], mat[1][3], 
        mat[2][0], mat[2][1], mat[2][2], mat[2][3], 
        mat[3][0], mat[3][1], mat[3][2], mat[3][3]
    ];
}

var config = {
    pause : false,
    mouse : false,
	grid_width : 20,
	marker_density : 5.0,
	agent_density : 0.5,
    agent_speed : 1,
    object: 1,
    animated_object: 1
}

function onLoad(framework) {
    
    var obj_names = ["goblin","sphere","cube","dragon"];
    //var obj_names = ["sphere","cube"];    
    //loadOBJs(obj_names, framework); 
    loadDoberman(framework, 22);
}

function loadOBJs(objNames, framework) {
    
    if (objNames.length == 0) {  
        console.log("Static OBJs loaded...");
        obj_vertices = obj_list[0].vertices;
        loadDoberman(framework, 22);
        //setUpGUI(framework);
        //setUpWebGL(framework);
        return;
    }
    
    var objMtlLoader = new ObjMtlLoader();
    objMtlLoader.load("./models/" + objNames[objNames.length-1] + ".obj", function(err, result) {
        if(err){
            console.log("obj error");
        }
        console.log("Loading " + objNames[objNames.length-1] + "...");
        obj_list.push(result);
        obj_vertices = result.vertices;
        var faces = result.faces;
        var normals = result.normals;
        console.log(obj_vertices.length);
        objNames.pop();
        loadOBJs(objNames, framework);

    });
}


function loadDoberman(framework, numFrames) {
    
    if (numFrames == 0) {  
        console.log("OBJs loaded...");
       // obj_vertices = obj_list[0].vertices;
        obj_vertices = obj_frames[0].vertices;
        setUpGUI(framework);
        setUpWebGL(framework);
        return;
    }
    
    var objMtlLoader = new ObjMtlLoader();
    objMtlLoader.load("./models/doberman/" + numFrames + ".obj", function(err, result) {
        if(err){
            console.log("obj error");
        }
        console.log("Loading doberman" + numFrames + "...");
        obj_frames.unshift(result);
        //obj_list.push(result);
        obj_vertices = result.vertices;
        console.log(obj_vertices.length);
        loadDoberman(framework, numFrames-1);

    });
}

function setUpGUI(framework) {
    var gui = framework.gui;

    gui.add(config, 'pause').name("Pause").onChange(function(value) {

        if (value) {
          config.pause = value;
        } else {
          config.pause = value;
        }
    });

//    gui.add(config, 'mouse').name("Mouse").onChange(function(value) {
//
//        if (value) {
//          config.mouse = value;
//        } else {
//          config.mouse = value;
//        }
//    });

//    gui.add(config, 'object', { Dragon: 1, Cube: 2, Sphere: 3, Goblin: 4 } ).name("Object").onChange(function(obj_index) {
//        config.object = obj_index;
//        
//        
//        var obj_positions = [];
//        obj_vertices = obj_list[obj_index-1].vertices;
//        for (var i = 0; i < num_particles; i++) {
//
//            var pos = obj_vertices[i%obj_vertices.length];
//            obj_positions.push(pos[0]);
//            obj_positions.push(pos[1]);
//            obj_positions.push(pos[2]);
//            obj_positions.push(1.0);
//
//        } 
//       
//        framework.webgl.gl.useProgram(programs[program.PARTICLES]);
//        framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],2, obj_positions);
//        
//    });  
    
    gui.add(config, 'animated_object', { Doberman: 1} ).name("Animated Object").onChange(function(obj_index) {
        config.object = obj_index;
        
        
        var obj_positions = [];
        obj_vertices = obj_frames[obj_index-1].vertices;
        for (var i = 0; i < num_particles; i++) {

            var pos = obj_vertices[i%obj_vertices.length];
            obj_positions.push(pos[0]);
            obj_positions.push(pos[1]);
            obj_positions.push(pos[2]);
            obj_positions.push(1.0);

        } 
       
        framework.webgl.gl.useProgram(programs[program.PARTICLES]);
        framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],2, obj_positions);
        
    }); 
} 

/**************************

Start: Mouse controls
TODO: Move to separate class

**************************/

var drag = 0;
var yRotation = 0;
var xRotation = 0;
var xOffset = 0;
var yOffset = 0;
var totalX = 90;

function mymousedown(event){
    drag = 1;
    xOffset = event.clientX;  
    yOffset = event.clientY;
}

function mymouseup(event){
    drag  = 0;
}

function mymousemove( event ){

    if (drag == 0 ) {
        xOffset = event.clientX;   
        yOffset = event.clientY;
        return;
    }
    
    yRotation = - xOffset + event.clientX;  
    xRotation = - yOffset + event.clientY;
    
    xOffset = event.clientX;  
    yOffset = event.clientY;

    camera.rotateAboutUp(yRotation);
    camera.rotateAboutRight(xRotation);
}

function wheelHandler(event) {

    var translation;
    if ((event.detail || event.wheelDelta) > 0) {     
        camera.translateAlongLook(0.1);
    } else {
        camera.translateAlongLook(-0.1);
    } 
    event.preventDefault();
}

/**************************

End: Mouse controls

**************************/


var camera;
var controls;

function setUpWebGL(framework) {
    
    var canvas = framework.canvas;
    var gl = framework.webgl.gl;
    
    canvas.addEventListener('DOMMouseScroll', wheelHandler, false);
    canvas.addEventListener('mousewheel', wheelHandler, false);
    canvas.addEventListener('mousedown', mymousedown, false);
    canvas.addEventListener('mouseup', mymouseup, false);
    canvas.addEventListener('mousemove', mymousemove, false);
       
    camera = new Camera(canvas);
    //controls = new Controls(canvas, camera);
    
    startTime = Date.now();

    programs = framework.webgl.createPrograms(["particles", "draw"]);
    
    //provide webgl with output attributes for capture into buffers
    //GL_SEPARATE_ATTRIBS: Write attributes to multiple buffer objects
    gl.transformFeedbackVaryings(programs[program.PARTICLES], ["outPos", "outVel"], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(programs[program.PARTICLES]);
    gl.useProgram(programs[program.PARTICLES]);
    
    //assign attribute locations to given program to access as programs[program.PARTICLES].attributeLocations
    framework.webgl.setAttributeLocations(programs[program.PARTICLES],["inPos","inVel","inObjPos"]);
    
    
    var particle_positions = [];
              
    var angleOffset = 2.0 * Math.PI / num_particles;
    var sqrt_num_particles = Math.sqrt(num_particles);

    for (var x = -0.5; x < 0.5; x) {
         var temp_x = (1.0/sqrt_num_particles);
        for (var y = -0.5; y < 0.5; y) {
         var temp_y = (1.0/sqrt_num_particles);

            particle_positions.push(x);
            particle_positions.push(y);
            particle_positions.push(0);
            particle_positions.push(1);
            y+= temp_y;
        }
         x+= temp_x;
    }
    
    var particle_velocites = [];

     for (var x = 0; x < sqrt_num_particles; x++) {
        for (var y = 0; y < sqrt_num_particles; y++) {

            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push(1.0);
        }

    }
    
    var obj_positions = [];
    
    for (var i = 0; i < num_particles; i++) {
        
        var pos = obj_vertices[i%obj_vertices.length];
        obj_positions.push(pos[0]);
        obj_positions.push(pos[1]-2);
        obj_positions.push(pos[2]);
        obj_positions.push(1.0);
        
    }   
    //console.log(obj_positions);
    
    framework.webgl.setAttributeBuffer(programs[program.PARTICLES],"inPos", particle_positions);
    framework.webgl.setAttributeBuffer(programs[program.PARTICLES],"inVel", particle_velocites);
    framework.webgl.setAttributeBuffer(programs[program.PARTICLES],"inObjPos", obj_positions);
    framework.webgl.setAttributeBuffers(programs[program.DRAW],["inPos","inVel"],new Float32Array(4*num_particles));

    framework.webgl.setUniformLocations(programs[program.PARTICLES],["u_time","u_resolution","u_mouse","u_model","u_view","u_projection","u_projectionView"]);
    framework.webgl.setUniformLocations(programs[program.DRAW],["u_time","u_resolution","u_mouse","u_model","u_view","u_projection","u_projectionView"]);
  
    
    var transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    

    window.dispatchEvent(new Event('resize'));

}

var frame = 0;

function updateAnimationFrame(curr_frame, framework) {
    
    var f = (curr_frame%22);
    //console.log(f);
    var obj_positions = [];
    obj_vertices = obj_frames[f].vertices;
    for (var i = 0; i < num_particles; i++) {

            var pos = obj_vertices[i%obj_vertices.length];
            obj_positions.push(pos[0]);
            obj_positions.push(pos[1]);
            obj_positions.push(pos[2]);
            obj_positions.push(1.0);

    } 
       
    framework.webgl.gl.useProgram(programs[program.PARTICLES]);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],2, obj_positions);
}

function onUpdate(framework) {
    if (config.pause)
        return;
    frame++;
    if (!programs[program.PARTICLES] || !programs[program.DRAW]) {
        return;
    }
    var time = Date.now() - startTime;
    //console.log(time);
    if (frame % 20 == 0) {
        updateAnimationFrame(frame/20, framework);
    }

    var canvas = framework.canvas;
    var ndcX = (( xOffset - canvas.offsetLeft ) / canvas.clientWidth) * 2 - 1;
    var ndcY = (1 - (( yOffset - canvas.offsetTop ) / canvas.clientHeight)) * 2 - 1;

    var worldPoint = glm.inverse(camera.getViewProj())['*'](glm.vec4(ndcX,ndcY,1.0,1.0))['*'](camera.farClip-1);
   // worldPoint = worldPoint['/'](worldPoint.w);
    //ndcX = worldPoint.x;
    //ndcY = worldPoint.y;
    //console.log(ndcY);
    
    if (drag == 0)
        worldPoint = glm.vec4(Number.NEGATIVE_INFINITY);
    
        var gl = framework.webgl.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        gl.useProgram(programs[program.PARTICLES]);
    
        framework.webgl.setVertexAttributePointers(programs[program.PARTICLES], [varying.POSTION, varying.VELOCITY, varying.OBJPOS])
    
        //bind the transform feedback buffers
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, programs[program.DRAW].attributeBuffers[varying.POSTION]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, programs[program.DRAW].attributeBuffers[varying.VELOCITY]); 
        
        gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.TIME], time);
        gl.uniform2f(programs[program.PARTICLES].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
        gl.uniform4f(programs[program.PARTICLES].uniformLocations[uniform.MOUSE], worldPoint.x,worldPoint.y,worldPoint.z,worldPoint.w);

        gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
        gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
        gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
       gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));
                
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
        gl.uniform4f(programs[program.DRAW].uniformLocations[uniform.MOUSE], worldPoint.x,worldPoint.y,worldPoint.z,worldPoint.w);
        gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
        gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
        gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
       gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));
        
        gl.enable(gl.DEPTH_TEST);
        gl.drawArrays(gl.POINTS, 0, num_particles);
    
    
        //swap the attribute buffers of particles shader with the buffers from transform feedback to be used as input in the next iteration 
        framework.webgl.swapAttributeBuffers(programs, [varying.POSTION, varying.VELOCITY]);
}


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);