function mouseDown(event, controls){
    controls.drag  = 1;
    controls.xOffset = event.clientX;  
    controls.yOffset = event.clientY; 
    
    //debug(event, controls);
}

function debug(event, controls) {
    
     var ndcX = (( controls.xOffset - canvas.offsetLeft ) / canvas.clientWidth) * 2 - 1;
    var ndcY = (1 - (( controls.yOffset - canvas.offsetTop ) / canvas.clientHeight)) * 2 - 1;
    var worldPoint = glm.inverse(controls.camera.getViewProj())['*'](glm.vec4(ndcX,ndcY,1.0,1.0))['*'](controls.camera.farClip-1);    
    console.log("ndc: [" + ndcX + ", " + ndcY + "]");
    
    //worldPoint = worldPoint['/'](worldPoint.w);
    console.log("world point :" + worldPoint);
    
    var dir = controls.camera.eye['-'](glm.vec3(worldPoint.x,worldPoint.y,worldPoint.z));
    dir = glm.normalize(dir);
    console.log("Direction: " + dir);
    
    var point = controls.camera.eye;

    while (Math.abs(point.z) > 2.0 && Math.abs(point.z) < 500.0) {
        point = point['-'](dir);
    }
    
    console.log("Point: " + point);

    
//    var pixelSpace = controls.camera.getViewProj().mul(worldPoint);
//    
//    console.log("pixel space :" + pixelSpace);
}

function mouseUp(event, controls){
    controls.drag  = 0;
}

function mouseMove(event, controls){
    if (controls.drag == 0 ) {
        controls.xOffset = event.clientX;   
        controls.yOffset = event.clientY;
        return;
    }
  
    var yRotation = -controls.xOffset + event.clientX;  
    var xRotation = -controls.yOffset + event.clientY; 

    controls.xOffset = event.clientX;  
    controls.yOffset = event.clientY;
    
    if (!controls.camera.active)
        return;

    controls.camera.rotateAboutUp(yRotation);
    controls.camera.rotateAboutRight(xRotation);
}


function scroll(event, controls) {
    if (!controls.camera.active)
        return;
    
    if ((event.detail || event.wheelDelta) > 0) {     
        controls.camera.translateAlongLook(0.1);
    } else {
        controls.camera.translateAlongLook(-0.1);
    } 

    event.preventDefault();
}

function pan(event, controls) {
    if (!controls.camera.active)
        return;
    
    console.log("pan");
    event = event || window.event;

    if (event.keyCode == '38') {
        //up
        controls.camera.translateAlongUp(0.1);
    }
    else if (event.keyCode == '40') {
        // down
        controls.camera.translateAlongUp(-0.1);
    }
    else if (event.keyCode == '37') {
       // left
        controls.camera.translateAlongRight(-0.1);
    }
    else if (event.keyCode == '39') {
       // right
        controls.camera.translateAlongRight(0.1);
    }
    
}

function getWorldPoint(canvas, controls) {
        
    var camera = controls.camera;
    
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
    
    return glm.vec4(point.x, point.y, point.z, 1);
}


export default function Controls(canvas, cam) { 
       
    var controls = {
        drag: 0,
        yRotation: 0,
        xRotation: 0,
        xOffset: 0,
        yOffset: 0,
        totalX: 90,
        camera: cam,
        getWorldPoint: function() {
            return getWorldPoint(canvas, controls);
        }
    };
    


    canvas.setAttribute("tabindex", 0);
    canvas.addEventListener('DOMMouseScroll', function(e) { 
        scroll(e, controls);
    } , false);
    canvas.addEventListener('mousewheel', function(e) { 
        scroll(e, controls);
    }, false);
    canvas.addEventListener('mousedown', function(e) {
        mouseDown(e, controls);
    }, false);
    canvas.addEventListener('mouseup', function(e) {      
        mouseUp(e, controls);
    }, false);
    canvas.addEventListener('mousemove', function(e) {
        mouseMove(e, controls);
    }, false);
//    canvas.addEventListener('keydown', function(e) {
//        pan(e, controls);
//    });
    
    return controls;
}