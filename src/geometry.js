const THREE = require('three');
const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
OBJLoader(THREE)
MTLLoader(THREE)

export function initSceneGeo(scene, meshes, materials, spline, radius) {

  var s = 2 * radius;
  var plane_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, 0, radius);
  var plane_material = new THREE.ShaderMaterial(materials.canyon_mat);
  meshes.plane = new THREE.Mesh(plane_geo, plane_material);
  scene.add(meshes.plane);

  var ground_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).translate(radius, -2, radius);
  var ground_material = new THREE.MeshBasicMaterial( { color: 0x444444 , wireframe: true} );
  meshes.ground = new THREE.Mesh(ground_geo, ground_material);
  scene.add(meshes.ground);

  var water_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, 0.5, radius);
  var water_material = new THREE.ShaderMaterial(materials.water_mat);
  meshes.water = new THREE.Mesh(water_geo, water_material);
  scene.add(meshes.water);

  var sky_geo = new THREE.SphereBufferGeometry(500, 100, 100);
  var sky_material = new THREE.ShaderMaterial(materials.sky_mat);
  sky_material.side = THREE.BackSide;
  meshes.sky = new THREE.Mesh(sky_geo, sky_material);
  scene.add(meshes.sky);

  var objLoader = new THREE.MTLLoader();
  mtlLoader.load('OldBoat.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('OldBoat.obj', function(object) {
      meshes.boat = object;
      scene.add(meshes.boat);
    });
  });

  // var obj = objLoader.load('OldBoat.obj', function(obj) {
  //   var boat_geo = new THREE.Geometry().fromBufferGeometry(obj.children[0].geometry);
  //   var boat_material = new THREE.ShaderMaterial(materials.sky_mat);
  //   meshes.boat = new THREE.Mesh(boat_geo, boat_material);
  //   scene.add(meshes.boat);
  // });

  var vertices = spline.getPoints( meshes.num_rocks );
  // for (var i = 0; i < vertices.length; i ++) {
  // 	var cluster = Math.random() * 10;
  // 	for (var j = 0; j < cluster; j ++) {
  		var size_x = 2*Math.random(); var size_y = Math.random(); var size_z = 2*Math.random();
  		var icoOrdeco = (Math.random() > 0.6);
  		var rock_geo;
  		if (icoOrdeco) {
  			rock_geo = new THREE.DodecahedronBufferGeometry(1, 0).scale(size_x, size_y, size_z).translate(vertices[0].x, 0, vertices[0].z);
  		} else {
  			rock_geo = new THREE.IcosahedronBufferGeometry(1, 0).scale(size_x, size_y, size_z).translate(vertices[0].x, 0, vertices[0].z);

  		}

  		var rock_material = new THREE.ShaderMaterial(materials.rock_mat);
		var mesh = new THREE.Mesh(rock_geo, rock_material);
	  	meshes.rocks.push(mesh);
	  	scene.add(mesh);
  // 	}
  // }
}

export function updateRocks() {

}