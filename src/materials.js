const THREE = require('three');

export var boat_mat = {

  uniforms: {
    texture: { type: "t", value: null},
    boat_color: {value: [0.545, 0.27, 0.0745]},
    u_lightPos: {type: 'v3', value: new THREE.Vector3(0, 50, 0)}
  },
  vertexShader: require('./shaders/boat-vert.glsl'),
  fragmentShader: require('./shaders/boat-frag.glsl')

};

export var rock_mat = {

  uniforms: {
    time: {value: new Date().getMilliseconds()},
    u_albedo: {type: 'v3', value: new THREE.Color('#dddddd')},
    u_ambient: {type: 'v3', value: new THREE.Color('#111111')},
    u_lightPos: {type: 'v3', value: new THREE.Vector3(30, 50, 40)},
    u_lightCol: {type: 'v3', value: [1, 1, 1]},
    u_lightIntensity: {type: 'f', value: 2}
  },
  vertexShader: require('./shaders/rock-vert.glsl'),
  fragmentShader: require('./shaders/rock-frag.glsl')

  };

export var canyon_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    base_color: {value: [0,128/255, 0]},
    mid_color: {value: [0,128/255, 0]},
    tip_color: {value: [25/255, 25/255,112/255]},
    spline_tex: {type: "t", value: null},
    },
  vertexShader: require('./shaders/canyon-vert.glsl'),
  fragmentShader: require('./shaders/canyon-frag.glsl')
};

export var water_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 0.8},
    frequency: {value: 2.0},
    buckets: {value: 10},
    spline_tex: {type: "t", value: null},
    shallow_water: {value: [0, 139/255, 139/255]},
    deep_water: {value: [0, 128/255, 128/255]},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/water-vert.glsl'),
  fragmentShader: require('./shaders/water-frag.glsl')
};

export var rain_mat = {

  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: water_mat.uniforms.amplitude.value},
    frequency: {value: water_mat.uniforms.frequency.value},
    dim: {value: new THREE.Vector2(100,100)},
    buckets: {value: water_mat.uniforms.buckets.value},
    splash_color: {value: [148/255, 0, 211/255]},
    spline_tex: {type: "t", value: null},
    texture: {type: "t", value: null},
    grads: {type: 'vec3', value: [new THREE.Vector3(1,1,0), new THREE.Vector3(-1,1,0), new THREE.Vector3(1,-1,0),        new THREE.Vector3(-1,-1,0), new THREE.Vector3(1,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(1,0,-1), 
      new THREE.Vector3(-1,0,-1), new THREE.Vector3(0,1,1), new THREE.Vector3(0,-1,1), new THREE.Vector3(0,1,-1), 
      new THREE.Vector3(0,-1,-1)]}
    },
  vertexShader: require('./shaders/rain-vert.glsl'),
  fragmentShader: require('./shaders/rain-frag.glsl'),
  blending:       THREE.AdditiveBlending,
  transparent:    true

};

export var sky_mat = {
  uniforms: {
    time: {value: new Date().getMilliseconds()},
    amplitude: {value: 3},
    frequency: {value: 0.2},
    audioFreq: {value: 0},
    low: {value: [40/255, 60/255, 90/255]},
    mid: {value: [0.276, 0.537, 0.718]},
    high: {value: [20/255, 30/255, 70/255]},
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