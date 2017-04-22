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
      cellType: 'voronoi', // 'square', 'hex', 'voronoi'
      numCells: 100
    },
    geographyManager: {},
    viewManager: {
      renderGraph: false,
      renderColors: 'elevation', // 'elevation', 'moisture', 'biomes'
      renderCoastline: true,
      debugShowNodes: false
    }
  };

  var map = new Map();

  var graphManager = new GraphManager(options.graphManager, map);
  var geographyManager = new GeographyManager(options.geographyManager, map);
  var viewManager = new ViewManager(options.viewManager, map, scene);

  map.graphManager = graphManager;
  map.geographyManager = geographyManager;
  map.viewManager = viewManager;

  graphManager.generateGrid()
  geographyManager.generateGeography();
  viewManager.renderMap();

  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));

  var guiGraphManager = gui.addFolder('Graph Manager');
  var guiGeographyManager = gui.addFolder('Geography Manager');
  var guiViewManager = gui.addFolder('View Manager');

  guiGraphManager.add(options.graphManager, 'cellType', ['square', 'hex', 'voronoi']).name('Cell type');
  guiGraphManager.add(options.graphManager, 'numCells').name('Num cells');

  guiViewManager.add(options.viewManager, 'renderGraph').name('Show graph');
  guiViewManager.add(options.viewManager, 'renderColors', ['elevation', 'moisture', 'biomes']).name('Show map colors');
  guiViewManager.add(options.viewManager, 'renderCoastline').name('Show coastline');
  guiViewManager.add(options.viewManager, 'debugShowNodes').name('Show debug nodes');

  gui.onFinishChange(function() {

  });
}

function onUpdate(framework) {
  var { scene, camera, renderer, gui, stats } = framework;
}

Framework.init(onLoad, onUpdate);