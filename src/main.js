const THREE = require('three');

import Framework from './framework'
import Graph from './graph/graph.js';


function onLoad(framework) {
  var { scene, camera, renderer, gui, stats } = framework;
  var graph = Graph.generateFromSquareGrid(3);

  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}

function onUpdate(framework) {
  var { scene, camera, renderer, gui, stats } = framework;
}

Framework.init(onLoad, onUpdate);