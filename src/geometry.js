const THREE = require('three');
const OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

export function initSceneGeo(scene, meshes, materials, spline, radius) {

  var s = 2 * radius;
  var plane_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, -4, radius);
  var plane_material = new THREE.ShaderMaterial(materials.canyon_mat);
  meshes.plane = new THREE.Mesh(plane_geo, plane_material); meshes.plane.name = "canyon";
  scene.add(meshes.plane);

  var water_geo = new THREE.PlaneBufferGeometry(s,s,s,s).rotateX(-Math.PI/2).rotateY(-Math.PI/2).translate(radius, 1.0, radius);
  var water_material = new THREE.ShaderMaterial(materials.water_mat);
  water_material.transparent = true;
  meshes.water = new THREE.Mesh(water_geo, water_material); meshes.water.name = "water";
  scene.add(meshes.water);

  var sky_geo = new THREE.SphereBufferGeometry(500, 100, 100);
  var sky_material = new THREE.ShaderMaterial(materials.sky_mat);
  sky_material.side = THREE.BackSide;
  meshes.sky = new THREE.Mesh(sky_geo, sky_material); meshes.sky.name = "sky";
  scene.add(meshes.sky);

  var objLoader = new THREE.OBJLoader();
  var obj = objLoader.load('./src/assets/boat.obj', function(obj) {
    var boat_geo = obj.children[1].geometry;
    boat_geo.scale(0.25, 0.25, 0.25);
    boat_geo.translate(0,-0.5,0);
    var loader = new THREE.TextureLoader();
    var boat_material = new THREE.ShaderMaterial(materials.boat_mat);
    loader.load('./src/assets/diffuse.png', function(texture) {
        materials.boat_mat.uniforms.texture.value = texture;
        meshes.boat = new THREE.Mesh(boat_geo, boat_material); meshes.boat.name = "boat";
        scene.add(meshes.boat);
    }); 
  });

  var vertices = spline.getPoints( meshes.num_rocks );
  var instances = 10;

  // per mesh data
  var rocks_geo = new THREE.InstancedBufferGeometry();

  var obj = objLoader.load('isohedron.obj', function(obj) {
    var rock_geo = obj.children[2].geometry;
    rock_geo.scale(10,10,10);
    var vertices = rock_geo.getAttribute('position');
    rocks_geo.addAttribute('position', vertices);
    rocks_geo.setIndex(rock_geo.getIndex());

    // // per instance data
    // var offsets = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
    // for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
    //   var x = 25 * Math.random();
    //   var y = 25 * Math.random();
    //   var z = 25 * Math.random();
    //   offsets.setXYZ( i, x, y, z );
    // }
    // rocks_geo.addAttribute('offset', offsets);

    // var scales = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
    // for ( var i = 0, ul = scales.count; i < ul; i++ ) {
    //   var x = 10;
    //   var y = 10;
    //   var z = 10;
    //   scales.setXYZ( i, x, y, z );
    // }
    // rocks_geo.addAttribute('scale', scales);

    // var colors = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
    // for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
    //   var r = Math.random();
    //   var g = Math.random();
    //   var b = Math.random();
    //   colors.setXYZ( i, r, g, b );
    // }
    // rocks_geo.addAttribute('color', colors);

    // var orientations = new THREE.InstancedBufferAttribute(new Float32Array( instances * 3 ), 3, 1 );
    // for ( var i = 0, ul = orientations.count; i < ul; i++ ) {
    //   var x = 0;
    //   var y = 0;
    //   var z = 0;
    //   orientations.setXYZ( i, x, y, z );
    // }
    // rocks_geo.addAttribute('orientation', orientations);

    // var rock_material = new THREE.ShaderMaterial(materials.rock_mat);
    var rock_material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    meshes.rocks = new THREE.Mesh(rocks_geo, rock_material); meshes.rocks.name = "rocks";
    scene.add(meshes.rocks); 
  });

}

export function update() {

}