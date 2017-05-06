import Framework from './framework'
var ObjMtlLoader = require("obj-mtl-loader");
var glm = require('glm-js');
import Camera from './camera'
import Controls from './controls'
import $ from "jquery";

var uniform = {
    TIME: 0,
    RESOLUTION: 1,
    MOUSE: 2,
    MODEL: 3,
    VIEW: 4,
    PROJECTION: 5,
    PROJECTIONVIEW: 6,
    COLOR1: 7,
    COLOR2: 8,
    MOUSECLICKED: 9,
    PARTICLESPEED: 10,
    PARTICLENOISE: 11,
    PARTICLESIZE: 12,
    FORCERADIUS: 13
};

var varying = {
    POSTION: 0,
    VELOCITY: 1,
    ACCELERATION: 2,
    MASS: 3,
    OBJPOS: 4
}

var program = {
    PARTICLES: 0,
    DRAW: 1
}

var programs = [];

var startTime;
var num_particles = 50000;
var mouseX = 0;
var mouseY = 0;

var obj_lyrics_dict = [];
var obj_lyrics_time = [];
var obj_lyrics_string = [];
var obj_change = false;

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
    force : 1,
    force_radius : 5,
	grid_width : 20,
	marker_density : 5.0,
	agent_density : 0.5,
    agent_speed : 1,
    object: 1,
    animated_object: 1,
    camera_move: false,
    restart_music: false,
    mesh_shape: 1,
    mesh_color1: "#00f0ff",
    mesh_color2: "#00f0ff",
    particle_speed: 1.0,
    particle_noise: 0.1,
    particle_size: 1.5,
    particle_mass: 1.0,
    particle_mass_variance: 0.0,
    chooseLyricFile : function() { 
        document.getElementById("lyricFile").click();
        
    },
    chooseSongFile : function() { 
        document.getElementById("songFile").click();
        
    },
    playSong : false,
    loadSong : function() {
        uploadFiles();
        config.object = 0;
    },
    sampleSong : function() {
        
        var client = new XMLHttpRequest();
        client.open('GET', 'sample/Insane.lrc');
        client.onreadystatechange = function() {
            
          if (client.readyState == 4 && client.status == 200)
          {
            if (client.responseText)
             {                             
                 var file = client.responseText;
                 parseLyricFile(file);
                //console.log(results);
              }
           }
         };

        client.send();
        
        if ("undefined" === typeof audio) {
            audio = new Audio('sample/Insane.mp3');
        } else {
            audio.src = 'sample/Insane.mp3';
        }
        //initPlayer();
        config.object = 0;
        audio.play();
    }
}
  

function uploadFiles() { 
    var fileInput = $('#lyricFile').get(0);
    var musicInput = $('#songFile').get(0);

    if (fileInput.files.length && musicInput.files.length) {

        var musicFile = musicInput.files[0];
        if ("undefined" === typeof audio) {
            audio = document.getElementById('song');
        } else {
            audio.src = URL.createObjectURL(musicFile);
        }
        //initPlayer();

        var reader = new FileReader();
        var lyricFile = fileInput.files[0];
        console.log(lyricFile);
        $(reader).on('load', processFile);
        reader.readAsText(lyricFile);
        audio.play();
    } else {
       alert('Please upload a lyric file & a music file.')
    }
}

function processFile(e) {
    var file = e.target.result;
    
    if (file && file.length) {
        parseLyricFile(file);
    }
}


function parseLyricFile(file) {
    
    var results = file.split("\n");
    obj_lyrics_time = [];
    obj_lyrics_string = [];

    for (var i = 0; i < results.length; i++) {

        var re = /\[(\d\d\:\d\d\.\d\d)\](.*)/;
        var lyricLine = results[i];
        var lyricArray = lyricLine.match(re);

        if (lyricArray == null){
            continue;
        }

        var reTime = /(\d\d)\:(\d\d\.\d\d)/;
        var time = lyricArray[1].match(reTime);
        var timeInSeconds = parseFloat(time[1]) * 60 + parseFloat(time[2]);
        var lyric = lyricArray[2];

        if (lyric == "")
            continue;

        obj_lyrics_dict[timeInSeconds] = lyric;

        obj_lyrics_time.push(timeInSeconds);
        obj_lyrics_string.push(lyric);

    }
}


var audio, freqData;

function initPlayer() {
    var ctx = new AudioContext();
    var audioSource = ctx.createBufferSource(audio);
    var analyser = ctx.createAnalyser();

    audioSource.connect(analyser);
    audioSource.connect(ctx.destination);

    freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqData);

    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        var value = freqData[i];
    }

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(freqData);
    }
    renderFrame();
}

function onLoad(framework) {
              
    setUpGUI(framework);
    setUpWebGL(framework);
}


function setUpGUI(framework) {
    var gui = framework.gui;

    gui.add(config, 'pause').name("Pause Scene").onChange(function(value) {

        if (value) {
          config.pause = value;
        } else {
          config.pause = value;
        }
    });
    
    gui.add(config, 'sampleSong'). name('Play Sample Song');
    gui.add(config, 'chooseLyricFile'). name('Choose Lyric file');
    gui.add(config, 'chooseSongFile'). name('Choose Song file');
    gui.add(config, 'loadSong'). name('Load New Song');
    
    gui.add(config, 'playSong').name("Play/Pause Song").onChange(function(value) {

        if (value) {
            if ("undefined" === typeof audio) {
                uploadFiles();
                config.object = 0;
                return;
            }
            changeOBJ(framework, 1);
            audio.play();
            frame = 0;
        } else {
            if ("undefined" === typeof audio) {
                return;
            }
            audio.pause();
        }
    });
    
    
    var f1 = gui.addFolder('Mouse Controls');
	
    f1.add(config, 'mouse').name("Activate mouse").onChange(function(value) {

        framework.camera.active = false;
        if (value) {
          config.mouse = value;
        } else {
          config.mouse = value;
        }
    });
    
    f1.add(config, 'force', {Attract: 1, Repel: 2} ).name("Force").onChange(function() {});
    
    f1.add(config, 'force_radius', 0.0, 30.0).name("Force Radius").onChange( function() {});
    
    f1.add(config, 'camera_move').name("Move Camera").onChange(function(value) {

        config.mouse = false;
        if (value) {
            framework.camera.active = value;
        } else {
            //framework.camera.reset();
        }
    });
    
    var f2 = gui.addFolder('Particle Controls');

    f2.add(config, 'mesh_shape', { Sphere: 1, Cube: 2, Torus: 3 } ).name("Mesh Shape")
        .onChange(function(meshIndex) {
         
        framework.lyric.characters.meshType = meshIndex;
        obj_change = true;
        changeOBJ(framework, config.object);
        
    });
    
    f2.addColor(config, 'mesh_color1').name("Color 1").onChange( function(colorValue) {});
    
    f2.addColor(config, 'mesh_color2').name("Color 2").onChange( function(colorValue) {});
        
    f2.add(config, 'particle_speed', 1.0, 5.0).name("Speed").onChange( function(speed) {});
        
    f2.add(config, 'particle_size', 1.0, 5.0).name("Size").onChange( function(size) {});
    
    f2.add(config, 'particle_mass', 1.0, 20.0).name("Mass").onChange( function(mass)
    {
        changeMASS(framework, config.object);
    });
    
    f2.add(config, 'particle_mass_variance', 0.0, 20.0).name("Mass Variance").onChange( function(mass)
    {
        changeMASS(framework, config.object);
    });
    
    f2.add(config, 'particle_noise', 0.0, 5.0).name("Noise").onChange( function(noise) {});
}

function setUpWebGL(framework) {
    
    var canvas = framework.canvas;
    var gl = framework.webgl.gl;
        
    startTime = Date.now();

    programs = framework.webgl.createPrograms(["particles", "draw"]);
    
    //provide webgl with output attributes for capture into buffers
    //GL_SEPARATE_ATTRIBS: Write attributes to multiple buffer objects
    gl.transformFeedbackVaryings(programs[program.PARTICLES], ["outPos", "outVel", "outAcc","outMass"], gl.SEPARATE_ATTRIBS);
    gl.linkProgram(programs[program.PARTICLES]);
    gl.useProgram(programs[program.PARTICLES]);
    
    //assign attribute locations to given program to access as 
    framework.webgl.setAttributeLocations(programs[program.PARTICLES],["inPos","inVel","inAcc","inMass","inObjPos"]);
    
    var particle_positions = [];
    
    var total = num_particles * 4;
              
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
            if (particle_positions.length == total)
                break;
        }
        if (particle_positions.length == total)
            break;
         x+= temp_x;
    }
    
    var particle_velocites = [];

     for (var x = 0; x < sqrt_num_particles; x++) {
        for (var y = 0; y < sqrt_num_particles; y++) {

            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push((Math.random()*2.0-1.0)/10.0);
            particle_velocites.push(1.0);
            if (particle_velocites.length == total)
                break;
        }
        if (particle_velocites.length == total)
            break;
    }
       
    var obj_positions = [];

    
    var title = "Particle Lyric";
    obj_lyrics_string[0] = title;
    var verts = framework.lyric.getLyricLineMesh(title, framework.camera);

    for (var i = 0; i < num_particles; i++) {

        var pos = verts[i%verts.length];
        obj_positions.push(pos[0]);
        obj_positions.push(pos[1]);
        obj_positions.push(pos[2]);
        obj_positions.push(1.0);
    } 
        
    var mass_positions = [];
    
    for (var i = 0; i < num_particles; i++) {

        mass_positions.push(1.0);
    } 
    
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],varying.POSTION, particle_positions);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],varying.VELOCITY, particle_velocites);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],varying.ACCELERATION, particle_velocites);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],varying.MASS, mass_positions);
    framework.webgl.setAttributeBufferAtIndex(programs[program.PARTICLES],varying.OBJPOS, obj_positions);
    
    framework.webgl.setAttributeBufferAtIndex(programs[program.DRAW],varying.POSTION, new Float32Array(4*num_particles));
    framework.webgl.setAttributeBufferAtIndex(programs[program.DRAW],varying.VELOCITY, new Float32Array(4*num_particles));
    framework.webgl.setAttributeBufferAtIndex(programs[program.DRAW],varying.ACCELERATION, new Float32Array(4*num_particles));
    framework.webgl.setAttributeBufferAtIndex(programs[program.DRAW],varying.MASS, new Float32Array(num_particles));

   // framework.webgl.setAttributeBuffers(programs[program.DRAW],["inPos","inVel"],new Float32Array(4*num_particles));

    framework.webgl.setUniformLocations(programs[program.PARTICLES],[
        "u_time","u_resolution","u_mouse","u_model","u_view","u_projection",
        "u_projectionView","u_color1","u_color2","u_mouseClicked",
        "u_particleSpeed","u_particleNoise","u_particleSize","u_forceRadius"
    ]);
    framework.webgl.setUniformLocations(programs[program.DRAW],[
        "u_time","u_resolution","u_mouse","u_model","u_view","u_projection",
        "u_projectionView","u_color1","u_color2","u_mouseClicked",
        "u_particleSpeed","u_particleNoise","u_particleSize","u_forceRadius"
    ]);
  
    
    var transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    

    window.dispatchEvent(new Event('resize'));

}

function changeMASS(framework, index) {

    config.object = index;
    
    var mass_positions = [];
    
    for (var i = 0; i < num_particles; i++) {
        mass_positions.push(config.particle_mass + (Math.random()*config.particle_mass_variance) );
    }   
    
    var gl = framework.webgl.gl;
    var data = mass_positions;   
    
    gl.bindBuffer(gl.ARRAY_BUFFER, programs[program.PARTICLES].attributeBuffers[varying.MASS]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data), 0, 0);
}


function changeOBJ(framework, index) {

    config.object = index;
    
    var obj_positions = [];
    
    var verts = framework.lyric.getLyricLineMesh(obj_lyrics_string[config.object-1]);

    for (var i = 0; i < num_particles; i++) {

        var pos = verts[i%verts.length];
        obj_positions.push(pos[0]);
        obj_positions.push(pos[1]);
        obj_positions.push(pos[2]);
        obj_positions.push(1.0);
    } 
    
    var gl = framework.webgl.gl;
    var offset = (num_particles*4)*0;
    var data = obj_positions.slice(offset, offset+num_particles*4);   
    
    gl.bindBuffer(gl.ARRAY_BUFFER, programs[program.PARTICLES].attributeBuffers[varying.OBJPOS]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data), 0, 0);
}


function updateLyricOnScreen(framework) {
    
    if ("undefined" === typeof audio || audio.paused) {
        return;
    }
    
    if (audio.currentTime == 0)
        return;
    
    var camera = framework.camera;
    
    var rotation = 0.1;

    if ( Math.floor(audio.currentTime/5)%2 ==0) {
        camera.rotateAboutUp(rotation);
        camera.rotateAboutRight(rotation/2);
    }
    else {
        camera.rotateAboutUp(-rotation);
        camera.rotateAboutRight(-rotation/2);
    }

    for (var i = obj_lyrics_time.length; i >= 0; i--) {
        
        var time = obj_lyrics_time[i];
        if (audio.currentTime > time) {
            if (config.object != i+1) {
                changeOBJ(framework, i+1);
                frame = 0;
            } 
            return;
        }
        
    }
}

var frame = 0;

function onUpdate(framework) {
    if (config.pause)
        return;
    frame++;
    if (!programs[program.PARTICLES] || !programs[program.DRAW]) {
        return;
    }
    var time = Date.now() - startTime;

    var canvas = framework.canvas;
    var camera = framework.camera;
    var controls = framework.controls;
    
   updateLyricOnScreen(framework);
    
    if (obj_change) {
        obj_change = false;
        changeOBJ(framework, config.object);
    }
    
    var ndcX = (( controls.xOffset - canvas.offsetLeft ) / canvas.clientWidth) * 2 - 1;
    var ndcY = (1 - (( controls.yOffset - canvas.offsetTop ) / canvas.clientHeight)) * 2 - 1;
    var worldPoint = glm.inverse(camera.getViewProj())['*'](glm.vec4(ndcX,ndcY,1.0,1.0))['*'](camera.farClip);

    var dir = camera.eye['-'](glm.vec3(worldPoint.x,worldPoint.y,worldPoint.z));
    dir = glm.normalize(dir);    
    
    var point = controls.camera.eye;

    //raymarch to get mouse postion close to particles
    //not the best solution, but works for now
    while (Math.abs(point.z) > 2.0 && Math.abs(point.z) < 500.0) {
        point = point['-'](dir);
    }
    
    worldPoint = glm.vec4(point.x, point.y, point.z, 1);
    
    var mouse_type = -1;
    
    if (config.mouse && controls.drag == 1) {   
        mouse_type = config.force;   
    }
    
    
    var gl = framework.webgl.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(programs[program.PARTICLES]);

    
    framework.webgl.setVertexAttributePointerAtIndex(programs[program.PARTICLES], varying.POSTION,4, 0);
    framework.webgl.setVertexAttributePointerAtIndex(programs[program.PARTICLES], varying.VELOCITY,4, 0);
    framework.webgl.setVertexAttributePointerAtIndex(programs[program.PARTICLES], varying.ACCELERATION,4, 0);
    framework.webgl.setVertexAttributePointerAtIndex(programs[program.PARTICLES], varying.MASS,1, 0);
    framework.webgl.setVertexAttributePointerAtIndex(programs[program.PARTICLES], varying.OBJPOS,4, 0);
    
    
    //bind the transform feedback buffers
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.POSTION, programs[program.DRAW].attributeBuffers[varying.POSTION]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.VELOCITY, programs[program.DRAW].attributeBuffers[varying.VELOCITY]); 
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.ACCELERATION, programs[program.DRAW].attributeBuffers[varying.ACCELERATION]); 
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.MASS, programs[program.DRAW].attributeBuffers[varying.MASS]); 

    
    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.TIME], frame);
    gl.uniform2f(programs[program.PARTICLES].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
    gl.uniform4f(programs[program.PARTICLES].uniformLocations[uniform.MOUSE], worldPoint.x,worldPoint.y,worldPoint.z,worldPoint.w);
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
    gl.uniformMatrix4fv(programs[program.PARTICLES].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));
    var color1 = hexToRgb(config.mesh_color1);
    var color2 = hexToRgb(config.mesh_color2);
    gl.uniform4f(programs[program.PARTICLES].uniformLocations[uniform.COLOR1], color1.r/255,color1.g/255,color1.b/255,1.0);
    gl.uniform4f(programs[program.PARTICLES].uniformLocations[uniform.COLOR2], color2.r/255,color2.g/255,color2.b/255,1.0); 
    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.MOUSECLICKED], mouse_type);
    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.PARTICLESPEED], config.particle_speed);
    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.PARTICLENOISE], config.particle_noise);
    gl.uniform1f(programs[program.PARTICLES].uniformLocations[uniform.FORCERADIUS], config.force_radius);

    //no drawing
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, num_particles);
    gl.endTransformFeedback();


    gl.disable(gl.RASTERIZER_DISCARD);
    //clear transform feedback buffer binding
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.POSTION, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.VELOCITY, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.ACCELERATION, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, varying.MASS, null);

    //draw the points from draw program
    gl.useProgram(programs[program.DRAW]);
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.TIME], frame);
    gl.uniform2f(programs[program.DRAW].uniformLocations[uniform.RESOLUTION], gl.canvas.width, gl.canvas.height);
    gl.uniform4f(programs[program.DRAW].uniformLocations[uniform.MOUSE],worldPoint.x,worldPoint.y,worldPoint.z,worldPoint.w);
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.MODEL], false, new Float32Array(glmMatToArray(camera.getModel())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.VIEW], false, glmMatToArray(glmMatToArray(camera.getView())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTION], false, new Float32Array(glmMatToArray(camera.getProjection())));
    gl.uniformMatrix4fv(programs[program.DRAW].uniformLocations[uniform.PROJECTIONVIEW], false, glmMatToArray(camera.getViewProj()));
    gl.uniform4f(programs[program.DRAW].uniformLocations[uniform.COLOR1], color1.r/255,color1.g/255,color1.b/255,1.0);
    gl.uniform4f(programs[program.DRAW].uniformLocations[uniform.COLOR2], color2.r/255,color2.g/255,color2.b/255,1.0);   
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.MOUSECLICKED], mouse_type);
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.PARTICLESPEED], config.particle_speed);
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.PARTICLENOISE], config.particle_noise);
    gl.uniform1f(programs[program.DRAW].uniformLocations[uniform.PARTICLESIZE], config.particle_size);
    
    gl.enable(gl.DEPTH_TEST);
    gl.drawArrays(gl.POINTS, 0, num_particles);


    //swap the attribute buffers of particles shader with the buffers from transform feedback to be used as input in the next iteration 
    framework.webgl.swapAttributeBuffers(programs, [varying.POSTION, varying.VELOCITY, varying.ACCELERATION, varying.MASS]);
}

//Source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);