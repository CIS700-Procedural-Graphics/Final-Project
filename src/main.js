const THREE = require('three');

import Framework from './framework';
import MapManager from './map';
import GraphManager from './graph-manager/graph-manager';
import GeographyManager from './geography-manager/geography-manager';
import ViewManager from './view-manager/view-manager';

function onLoad(framework) {
  var { scene, camera, renderer, gui, stats } = framework;

  var options = {
    graphManager: {
      numCells: 50
    }
  }

  var map = new Map();

  var graphManager = new GraphManager(map);
  var geographyManager = new GeographyManager(map);
  var viewManager = new ViewManager(map, scene);

  map.graphManager = graphManager;
  map.geographyManager = geographyManager;
  map.viewManager = viewManager;

  graphManager.generateFromSquareGrid(options.graphManager.numCells);
  geographyManager.generateElevationMap();
  viewManager.renderGraph();
  viewManager.renderElevation();

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