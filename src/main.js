const THREE = require('three');

import Framework from './framework';
import MapManager from './map';
import GraphManager from './graph-manager/graph-manager';
import GeographyManager from './geography-manager/geography-manager';
import ViewManager from './view-manager/view-manager';

function setup(options, scene) {
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
}

function teardown(scene) {
  for (var i = scene.children.length - 1; i >= 0; i--) {
    scene.remove(scene.children[i]);
  }
}

function onLoad(framework) {
  var { scene, camera, renderer, gui, stats } = framework;

  var options = {
    graphManager: {
      cellType: 'voronoi', // 'square', 'hex', 'voronoi'
      numCells: 100
    },
    geographyManager: {},
    viewManager: {
      renderGraph: true,
      renderColors: 'elevation', // 'elevation', 'moisture', 'biomes'
      render3D: true,
      renderCoastline: true,
      debugShowNodes: false,
      debugShowCoastalNodes: true
    }
  };

  setup(options, scene);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  var directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );

  directionalLight.position.set(0, 0, 100);

  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(directionalLightHelper);

  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));

  var guiGraphManager = gui.addFolder('Graph Manager');
  var guiGeographyManager = gui.addFolder('Geography Manager');
  var guiViewManager = gui.addFolder('View Manager');

  guiGraphManager.add(options.graphManager, 'cellType', ['square', 'hex', 'voronoi']).name('Cell type');
  guiGraphManager.add(options.graphManager, 'numCells').name('Num cells');

  guiViewManager.add(options.viewManager, 'renderGraph').name('Show graph');
  guiViewManager.add(options.viewManager, 'renderColors', ['elevation', 'moisture', 'biomes']).name('Show map colors');
  guiViewManager.add(options.viewManager, 'render3D').name('Show 3D');
  guiViewManager.add(options.viewManager, 'renderCoastline').name('Show coastline');
  guiViewManager.add(options.viewManager, 'debugShowNodes').name('Debug nodes');
  guiViewManager.add(options.viewManager, 'debugShowCoastalNodes').name('Debug coastal nodes');

  for (var i in gui.__folders) {
      var folder = gui.__folders[i];

      for (var j in folder.__controllers) {
        folder.__controllers[j].onFinishChange(function() {
          teardown(scene);
          setup(options, scene);
        });
      }
  }
}

function onUpdate(framework) {
  var { scene, camera, renderer, gui, stats } = framework;
}

Framework.init(onLoad, onUpdate);