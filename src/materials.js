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
    audioFreq: {value: 0},
    horizon: {value: [135/255, 206/255, 250/255]},
    mid: {value: [0.976, 0.537, 0.718]},
    sky: {value: [254/255, 91/255, 53/255]},
    buckets: {value: 2},
    grads: {type: 'vec3', value: [
      new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        
      new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]} 
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