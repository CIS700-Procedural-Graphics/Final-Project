export default function Controls(canvas, cam) { 
       
    this.drag = 0;
    this.yRot = 0;
    this.xRot = 0;
    this.xOffs = 0;
    this.yOffs = 0;
    this.pi180 = 180/Math.PI,

    this.drag = 0;
    this.yRot = 0;
    this.xRot = 0;
    this.xOffs = 0;
    this.yOffs = 0;
    this.totalX = 90;
    this.camera = cam;

    canvas.addEventListener('DOMMouseScroll', this.wheelHandler, false);
    canvas.addEventListener('mousewheel', this.wheelHandler, false);
    canvas.addEventListener('mousedown', this.mymousedown, false);
    canvas.addEventListener('mouseup', this.mymouseup, false);
    canvas.addEventListener('mousemove', this.mymousemove, false);
}



Controls.prototype.mouseDown = function(event){
    this.drag  = 1;
    this.xOffs = event.clientX;  
    this.yOffs = event.clientY; 
}

Controls.prototype.mouseUp = function (event){
    this.drag  = 0;
}

Controls.prototype.mouseMove = function (event){

    if (this.drag == 0 ) {
        this.xOffs = event.clientX;   
        this.yOffs = event.clientY;
        return;
    }
  
    var yRot = -this.xOffs + event.clientX;  
    var xRot = -this.yOffs + event.clientY; 

    this.xOffs = event.clientX;  
    this.yOffs = event.clientY;

    this.camera.rotateAboutUp(yRot);
    this.camera.rotateAboutRight(xRot);
}


Controls.prototype.scroll = function (event) {

    var translation;
    if ((event.detail || event.wheelDelta) > 0) {     
        this.camera.translateAlongLook(0.1);
    } else {
        this.camera.translateAlongLook(-0.1);
    } 

    event.preventDefault();
}