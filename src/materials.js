const THREE = require('three');

export var left_canyon_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 0.8},
    frequency: {value: 2.0},
    num_octaves: {value: 5},
    bcolor: {value: [0,128/255, 0]},
    rcolor: {value: [25/255, 25/255,112/255]},
    tcolor: {value: [205/255,133/255,63/255]},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        
      new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/canyon-vert.glsl'),
  fragmentShader: require('./shaders/canyon-frag.glsl')
};

export var right_canyon_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 0.8},
    frequency: {value: 2.0},
    num_octaves: {value: 5},
    bcolor: {value: [0,128/255, 0]},
    rcolor: {value: [25/255, 25/255,112/255]},
    tcolor: {value: [205/255,133/255,63/255]},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        
      new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/canyon-vert.glsl'),
  fragmentShader: require('./shaders/canyon-frag.glsl')
};

export var sky_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 3},
    frequency: {value: 50},
    buckets: {value: 2},
    grads: {type: 'vec2', value: [
      new THREE.Vector2(1, 0), new THREE.Vector2(0.707, 0.707),   // 0, 45    
      new THREE.Vector2(0, 1), new THREE.Vector2(-0.707, 0.707), // 90, 135
      new THREE.Vector2(-1,0), new THREE.Vector2(-0.707, -0.707), // 180, 225
      new THREE.Vector2(0,-1), new THREE.Vector3(0.707,-0.707)]} // 270, 315
    },
  vertexShader: require('./shaders/sky-vert.glsl'),
  fragmentShader: require('./shaders/sky-frag.glsl')
};

export var water_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 0.8},
    frequency: {value: 2.0},
    num_octaves: {value: 5},
    bcolor: {value: [0,128/255, 0]},
    rcolor: {value: [25/255, 25/255,112/255]},
    tcolor: {value: [205/255,133/255,63/255]},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/water-vert.glsl'),
  fragmentShader: require('./shaders/water-frag.glsl')
};