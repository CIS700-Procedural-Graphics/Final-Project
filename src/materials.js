const THREE = require('three');

export var rock_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    u_albedo: {
        type: 'v3',
        value: new THREE.Color('#dddddd')
    },
    u_ambient: {
        type: 'v3',
        value: new THREE.Color('#111111')
    },
    u_lightPos: {
        type: 'v3',
        value: new THREE.Vector3(30, 50, 40)
    },
    u_lightCol: {
        type: 'v3',
        value: [1, 1, 1]
    },
    u_lightIntensity: {
        type: 'f',
        value: 2
    }
},
  vertexShader: require('./shaders/rock-vert.glsl'),
  fragmentShader: require('./shaders/rock-frag.glsl')
};

export var canyon_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 0.8},
    frequency: {value: 2.0},
    num_octaves: {value: 5},
    bcolor: {value: [0,128/255, 0]},
    rcolor: {value: [25/255, 25/255,112/255]},
    tcolor: {value: [205/255,133/255,63/255]},
    spline: {type: 'vec3', value: []},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        
      new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/canyon-vert.glsl'),
  fragmentShader: require('./shaders/canyon-frag.glsl')
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

export var ground_mat = {
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
  vertexShader: require('./shaders/ground-vert.glsl'),
  fragmentShader: require('./shaders/ground-frag.glsl')
};

export var sky_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 3},
    frequency: {value: 0.2},
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