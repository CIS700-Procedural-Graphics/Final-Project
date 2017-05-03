const THREE = require('three');

import Framework from './framework';
import MapManager from './map';
import GraphManager from './graph-manager/graph-manager';
import GeographyManager from './geography-manager/geography-manager';
import ViewManager from './view-manager/view-manager';

function setup(options, scene) {

  // Setup lighting
  var ambientLight = new THREE.AmbientLight(0xffffff, options.lighting.ambientLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff, options.lighting.directionalLight);
  var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);

  directionalLight.position.set(0, 0, 100);
  directionalLight.target.position.set(50, 50, 100);

  scene.add(ambientLight);
  scene.add(directionalLight);
  // scene.add(directionalLightHelper);

  // Setup map
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
    other: {
      random: function() {

          options.graphManager.seedVoronoi = Math.floor(Math.random() * 100);
          options.geographyManager.seedElevation = Math.floor(Math.random() * 100);
          options.geographyManager.seedMoisture = Math.floor(Math.random() * 100);
          options.viewManager.seedPolygonVariation = Math.floor(Math.random() * 100);

          teardown(scene);
          setup(options, scene);
      }
    },
    lighting: {
      ambientLight: 0.5,
      directionalLight: 0.5
    },
    graphManager: {
      cellType: 'square', // 'square', 'hex', 'voronoi'
      numCells: 50,
      seedVoronoi: 1.0,
    },
    geographyManager: {
      seedElevation: 1.0,
      seedMoisture: 2.0,
      seedErosion: 1.0,
      elevationNoisiness: 2.0,
      moistureNoisiness: 2.0,
      erosionSteps: 20,
      rainDistribution: 'uniform', // 'moisture-map', 'uniform',
      rainFrequency: 1.0
    },
    viewManager: {
      renderGraph: false,
      renderColors: 'biomes', // 'elevation', 'moisture', 'biomes'
      render3D: 'polygon', // 'polygon', 'shader', 'none'
      renderCoastline: false,
      renderPolygonVariation: true,
      seedPolygonVariation: 1.0,
      renderDepth: true,
      renderOceanDepth: false,
      debugShowNodes: false,
      debugShowCoastalNodes: false,
      debugShowDropletNodes: false
    }
  };

  setup(options, scene);

  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0,0,0));

  var guiLighting = gui.addFolder('Lighting');
  var guiGraphManager = gui.addFolder('Graph Manager');
  var guiGeographyManager = gui.addFolder('Geography Manager');
  var guiViewManager = gui.addFolder('View Manager');

  gui.add(options.other, 'random').name('Generate new map');

  guiLighting.add(options.lighting, 'ambientLight', 0, 1).name('Ambient light strength');
  guiLighting.add(options.lighting, 'directionalLight', 0, 1).name('Directional light strength');

  guiGraphManager.add(options.graphManager, 'cellType', ['square', 'hex', 'voronoi']).name('Cell type');
  guiGraphManager.add(options.graphManager, 'numCells').name('Num cells');
  guiGraphManager.add(options.graphManager, 'seedVoronoi', 0, 100).name('Voronoi seed').listen();

  guiGeographyManager.add(options.geographyManager, 'seedElevation', 0, 100).name('Elevation seed').listen();
  guiGeographyManager.add(options.geographyManager, 'seedMoisture', 0, 100).name('Moisture seed').listen();
  guiGeographyManager.add(options.geographyManager, 'seedErosion', 0, 100).name('Erosion seed').listen();
  guiGeographyManager.add(options.geographyManager, 'elevationNoisiness', 0, 10).name('Elevation noisiness');
  guiGeographyManager.add(options.geographyManager, 'moistureNoisiness', 0, 10).name('Moisture noisiness');
  guiGeographyManager.add(options.geographyManager, 'erosionSteps', 0, 100).name('Erosion steps');
  guiGeographyManager.add(options.geographyManager, 'rainDistribution', ['moisture map', 'uniform']).name('Rain distribution');
  guiGeographyManager.add(options.geographyManager, 'rainFrequency', 0, 5).name('Rain frequency');

  guiViewManager.add(options.viewManager, 'renderGraph').name('Render graph');
  guiViewManager.add(options.viewManager, 'renderColors', ['elevation', 'moisture', 'biomes']).name('Render map colors');
  guiViewManager.add(options.viewManager, 'render3D', ['none', 'polygon', 'shader']).name('Render 3D');
  guiViewManager.add(options.viewManager, 'renderCoastline').name('Render coastline');
  guiViewManager.add(options.viewManager, 'renderPolygonVariation').name('Render polygon variation');
  guiViewManager.add(options.viewManager, 'seedPolygonVariation', 0, 100).name('Polygon variation seed').listen();
  guiViewManager.add(options.viewManager, 'renderDepth').name('Render depth');
  guiViewManager.add(options.viewManager, 'renderOceanDepth').name('Render ocean depth');
  guiViewManager.add(options.viewManager, 'debugShowNodes').name('Debug nodes');
  guiViewManager.add(options.viewManager, 'debugShowCoastalNodes').name('Debug coastal nodes');
  guiViewManager.add(options.viewManager, 'debugShowDropletNodes').name('Debug droplet nodes');

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