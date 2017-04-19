const THREE = require('three');

export function initSceneGeo(scene, meshes, materials, spline) {
  var plane_geo = new THREE.PlaneBufferGeometry(200, 200, 100, 100).rotateX(-Math.PI/2);
  var plane_material = new THREE.ShaderMaterial(materials.canyon_mat);
  meshes.plane = new THREE.Mesh(plane_geo, plane_material);
  scene.add(meshes.plane);

  var ground_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-2,0);
  var ground_material = new THREE.MeshBasicMaterial( { color: 0x444444 , wireframe: true} );
  meshes.ground = new THREE.Mesh(ground_geo, ground_material);
  scene.add(meshes.ground);

  var water_geo = new THREE.PlaneBufferGeometry(10, 10, 100, 100).rotateX(-Math.PI/2).translate(0,-1,0);
  var water_material = new THREE.MeshBasicMaterial( { color: 0x0000FF , wireframe: true} );
  meshes.water = new THREE.Mesh(water_geo, water_material);
  scene.add(meshes.water);

  var sky_geo = new THREE.SphereBufferGeometry(500, 100, 100);
  var sky_material = new THREE.ShaderMaterial(materials.sky_mat);
  sky_material.side = THREE.BackSide;
  meshes.sky = new THREE.Mesh(sky_geo, sky_material);
  scene.add(meshes.sky);

  var vertices = spline.getPoints( meshes.num_rocks );
  // for (var i = 0; i < vertices.length; i ++) {
  // 	var cluster = Math.random() * 10;
  // 	for (var j = 0; j < cluster; j ++) {
  		var size_x = 3*Math.random() + 2; var size_y = Math.random() + 2; var size_z = 3*Math.random() + 2;
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