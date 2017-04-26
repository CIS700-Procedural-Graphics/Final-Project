export default function Camera(canvas) {
    
    this.canvas = canvas;
    this.model = glm.mat4();
    this.projection = glm.mat4();
    this.view = glm.mat4();
    this.projectionView;
    this.look = glm.vec3(0,0,-1);
    this.up = glm.vec3(0,1,0);
    this.world_up = glm.vec3(0,1,0);
    this.right = glm.vec3(1,0,0);
    this.eye = glm.vec3(0,0,10);
    this.ref = glm.vec3(0,0,0);

    this.fovy =45;
    this.aspectRatio = canvas.width / canvas.height;
    this.nearClip = 0.1;
    this.farClip = 1001;

    this.totalX = 90;
}

Camera.prototype.getModel = function() {
    return this.model;
}

Camera.prototype.getProjection = function() {
    return this.projection;
}

Camera.prototype.getView = function() {
    return this.view;
}

Camera.prototype.getViewProj = function() {
    
    var glmPers = glm.perspective(glm.radians(this.fovy), this.aspectRatio, this.nearClip, this.farClip);    
    var glmView = glm.lookAt(this.eye,this.ref,this.up);
       
    return glmPers['*'](glmView);
}


Camera.prototype.updateAttributes = function() {
    
    this.look = glm.normalize(this.ref['-'](this.eye));
    this.right = glm.normalize(glm.cross(this.look,this.world_up));
    this.up = glm.cross(this.right, this.look);
}

Camera.prototype.rotateAboutUp = function(upRot) {
    
    var rotation = glm.rotate(glm.mat4(1.0), glm.radians(-upRot), this.up);
    this.eye = glm.vec3(rotation.mul(glm.vec4(this.eye, 1.0))); 
    this.updateAttributes();
}

Camera.prototype.rotateAboutRight = function(rightRot) {
       
    if (rightRot > 100)
        return;
    
    if (this.totalX+rightRot <= 2 || this.totalX+rightRot >= 178) {
        return;
    }
        
    var rotation = glm.rotate(glm.mat4(1.0), glm.radians(-rightRot), this.right);
    this.eye = glm.vec3(rotation.mul(glm.vec4(this.eye, 1.0)));
    this.totalX += rightRot;
    this.updateAttributes();       
}

Camera.prototype.translateAlongLook = function(trans) {
    
    var translation = this.eye.mul(trans);
    this.eye = this.eye['+'](translation);
    
}