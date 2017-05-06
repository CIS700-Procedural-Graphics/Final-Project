
/*global Cesium*/

var viewer = new Cesium.Viewer('cesiumContainer', {
    
});

var scene = viewer.scene;
scene.globe.show = false;

var tileset = new Cesium.Cesium3DTileset({
    url: '/'
});

scene.primitives.add(tileset);

viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
viewer.cesium3DTilesInspector.viewModel.tileset = tileset;