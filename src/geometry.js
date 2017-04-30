const THREE = require('three');
const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
OBJLoader(THREE);
MTLLoader(THREE);

export function initSceneGeo(scene, meshes, materials, spline, radius) {

  var s = 2 * radius;
  var plane_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, 0, radius);
  var plane_material = new THREE.ShaderMaterial(materials.canyon_mat);
  meshes.plane = new THREE.Mesh(plane_geo, plane_material);
  // scene.add(meshes.plane);

  var water_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, 0.5, radius);
  var water_material = new THREE.ShaderMaterial(materials.water_mat);
  meshes.water = new THREE.Mesh(water_geo, water_material);
  // scene.add(meshes.water);

  var sky_geo = new THREE.SphereBufferGeometry(500, 100, 100);
  var sky_material = new THREE.ShaderMaterial(materials.sky_mat);
  sky_material.side = THREE.BackSide;
  meshes.sky = new THREE.Mesh(sky_geo, sky_material);
  scene.add(meshes.sky);

  // var mtlLoader = new MTLLoader();
  // // mtlLoader.setPath( 'Boat/' );
  // mtlLoader.load('Boat/boat.mtl', function(materials) {
  //   materials.preload();
  //   var objLoader = new THREE.OBJLoader();
  //   objLoader.setMaterials(materials);
  //   objLoader.load('Boat/boat.obj', function(object) {
  //     meshes.boat = object;
  //     scene.add(meshes.boat);
  //   });
  // });

  // var obj = objLoader.load('OldBoat.obj', function(obj) {
  //   var boat_geo = new THREE.Geometry().fromBufferGeometry(obj.children[0].geometry);
  //   var boat_material = new THREE.ShaderMaterial(materials.sky_mat);
  //   meshes.boat = new THREE.Mesh(boat_geo, boat_material);
  //   scene.add(meshes.boat);
  // });

  var vertices = spline.getPoints( meshes.num_rocks );
  var instances = 10;

  // per mesh data
  var rocks_geo = new THREE.InstancedBufferGeometry();
  var ico = new THREE.IcosahedronBufferGeometry(1, 0);
  var vertices = ico.getAttribute('position');
  rocks_geo.addAttribute('pos', vertices);

  // per instance data
  var offsets = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
  for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
    var x = 25 * Math.random();
    var y = 25 * Math.random();
    var z = 25 * Math.random();
    offsets.setXYZ( i, x, y, z );
  }
  rocks_geo.addAttribute('offset', offsets);

  var scales = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
  for ( var i = 0, ul = scales.count; i < ul; i++ ) {
    var x = 10;
    var y = 10;
    var z = 10;
    scales.setXYZ( i, x, y, z );
  }
  rocks_geo.addAttribute('scale', scales);

  var colors = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
  for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
    colors.setXYZ( i, r, g, b );
  }
  rocks_geo.addAttribute('color', colors);

  var orientations = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
  for ( var i = 0, ul = orientations.count; i < ul; i++ ) {
    var x = 0;
    var y = 0;
    var z = 0;
    orientations.setXYZ( i, x, y, z );
  }
  rocks_geo.addAttribute('orientation', orientations);

  // var rock_material = new THREE.ShaderMaterial(materials.rock_mat);
  var rock_material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
  meshes.rocks = new THREE.Mesh(rocks_geo, rock_material);
  scene.add(meshes.rocks);

}

export function updateRocks() {

}