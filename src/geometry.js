const THREE = require('three');
const OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

function size_distribution(min, max) {
  return (max - min) * Math.random() + min;
}

export function initSceneGeo(scene, meshes, materials, variables) {

  initPlanes(scene, meshes, materials, variables.radius);

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

  var light = new THREE.PointLight( 0xffffff, 1, 0 )
  light.position.set( 0, 200, 0 );
  scene.add( light);

  initRocks(scene, meshes, materials.rock_color, variables);
};

export function initRocks(scene, meshes, color, variables) {
  var iso_material = new THREE.MeshLambertMaterial( {color: color, shading: THREE.FlatShading} );
  for (var i = 0; i < meshes.num_rocks; i ++) {
    var size = size_distribution(0.5,2);
    var iso_geo = (Math.random() > 0.5) ? new THREE.IcosahedronGeometry(size, 0) : new THREE.IcosahedronGeometry(size, 0);
    var rock = new THREE.Mesh(iso_geo, iso_material); 
    var pos = variables.spline.getPoint(Math.random());
    var index = Math.floor(pos.x * variables.res/(2*variables.radius)) * variables.res + Math.floor(pos.z * variables.res/(2*variables.radius));
    var inten = variables.texture_data[4*index];
    var dir = Math.random();
    while (inten > 127) {
      if (dir < 0.25) {
        pos.x -= 0.5;
      } else if (dir < 0.5) {
        pos.z -= 0.5;
      } else if (dir < 0.75) {
        pos.x += 0.5;
      } else {
        pos.z += 0.5;
      }
      var index = Math.floor(pos.x * variables.res/(2*variables.radius)) * variables.res + Math.floor(pos.z * variables.res/(2*variables.radius));
      inten = variables.texture_data[4*index];
    }
    rock.position.set(pos.x, pos.y - 2, pos.z);
    rock.name = "rock" + i;
    meshes.rocks.push(rock);
    scene.add(rock); 
  }
} 

export function initPlanes(scene, meshes, materials, radius) {
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
}