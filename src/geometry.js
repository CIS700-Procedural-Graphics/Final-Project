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
  var loader = new THREE.TextureLoader();
  var obj = objLoader.load('./src/assets/boat.obj', function(obj) {
    var boat_geo = obj.children[1].geometry;
    boat_geo.scale(0.25, 0.25, 0.25);
    boat_geo.translate(0,-0.5,0);
    var boat_material = new THREE.ShaderMaterial(materials.boat_mat);
    loader.load('./src/assets/diffuse.png', function(texture) {
        materials.boat_mat.uniforms.texture.value = texture;
        meshes.boat = new THREE.Mesh(boat_geo, boat_material); meshes.boat.name = "boat";
        scene.add(meshes.boat);
    }); 
  });

}

export function update() {

}