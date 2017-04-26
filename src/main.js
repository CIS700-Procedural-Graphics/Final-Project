
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Noise from './noise'
import {other} from './noise'
import DAT from 'dat-gui'

//NOISE
//A PSUDORANDOM NOISE FOR THE RANDOM NUMBER FOR THE TERRAIN OFFSET


function rand2D(x, y){
    var x = Math.sin(dot(x,y,12.9898,78.233)) * 43758.5453;
    if (x >= 0.0)
        return x-Math.floor(x)
    else
        return x-Math.ceil(x)
}

function dot(x1, y1, x2, y2)
{
    return x1*x2 + y1*y2;
}

//TERRAIN 2D ARRAY
var arr = createMulDimArray(65,65);
//initialize the corner values with the bounding box values of the tile
arr[0][0] = new THREE.Vector3(-10,0,10);
arr[64][0] = new THREE.Vector3(-10,0,-10);
arr[0][64] = new THREE.Vector3(10,0,10);
arr[64][64] = new THREE.Vector3(10,0,-10);

function createMulDimArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createMulDimArray.apply(this, args);
    }

    return arr;
}

//WORKING ON UPDATING THE TERRAIN ALGO. TO REMOVE ARTIFACTS AND PRODUCE A SEAMLESS TERRAIN
//function DiamondSquare(x0, x1, z0, z1, roughness, pass, disp)
//{
//    for(var depth = 0; depth < 6; depth++)
//    {
//        for(var x = x0 ; x < x1; x += x1/(Math.pow(2, depth)))
//        {
//            for(var z = z0; z < z1; z += z1/(Math.pow(2, depth)))
//            {
//                var a = arr[x][z].y;
//                var b = arr[(x+x1/(Math.pow(2, depth)))][z].y;
//                var c = arr[x][(z+z1/(Math.pow(2, depth)))].y;
//                var d = arr[(x+x1/(Math.pow(2, depth)))][(z+z1/(Math.pow(2, depth)))].y; 
//                
//                var x = (a+b+c+d)/4 + rand2D(Math.floor((x+x+x1/(Math.pow(2, depth)))/2),Math.floor((z+z+z1/(Math.pow(2, depth)))/2)) * roughness * disp;
//                    
//                //diamond step
//                //a     b
//                //   x   <-----finding this (a+b+c+d) / 4 + rand * roughness
//                //c     d                                       
//                //position of x
//                arr[Math.floor((x+x+x1/(Math.pow(2, depth)))/2)][Math.floor(((z+z+z1/(Math.pow(2, depth)))/2))] = 
//                    new THREE.Vector3( (arr[x][z].x + arr[(x+x1/(Math.pow(2, depth)))][z].x) / 2,
//                                        x, 
//                                       (arr[x][z].z + arr[x][(z+z1/(Math.pow(2, depth)))].z) / 2 );
//                
//                //square step
//                //a   e   b    <--- e = (a+b+x) / 3 + rand * roughness
//                //f   x   g    <--- f = (a+c+x) / 3 + rand * roughness , g = (b+x+d) / 3 + rand * roughness
//                //c   h   d    <--- h = (c+x+d) / 3 + rand * roughness
//                if(x == 0 || x == x1 || z == 0 || z == z1)
//                {   
//                    var e = (a+x+b)/3 + rand2D( Math.floor((x+x+x1/(Math.pow(2, depth)))/2), z) * roughness * disp;
//                    var f = (a+x+c)/3 + rand2D( x, Math.floor((z+z+z1/(Math.pow(2, depth)))/2)) * roughness * disp;
//                    var g = (b+x+d)/3 + rand2D( (x+x1/(Math.pow(2, depth)))), Math.floor((z+z+z1/(Math.pow(2, depth)))/2)) * roughness * disp;
//                    var h = (c+x+d)/3 + rand2D( Math.floor((x+x+x1/(Math.pow(2, depth)))/2), (z+z1/(Math.pow(2, depth))))) * roughness * disp;
//                    
//                    //position of e
//                    arr[Math.floor((x+x+x1/(Math.pow(2, depth))))/2)][z] = 
//                        new THREE.Vector3( arr[x][z].x, e, (arr[x][z].z + arr[(x+x1/(Math.pow(2, depth)))][z].z) / 2);
//                    
//                    //position of f
//                    arr[x][Math.floor((z+z+z1/(Math.pow(2, depth)))/2)] = 
//                        new THREE.Vector3( (arr[x][z].x + arr[x][(z+z1/(Math.pow(2, depth)))].x) / 2, f, arr[x][z].z);
//                    
//                    //position of g
//                    arr[(x+x1/(Math.pow(2, depth))))][Math.floor((z+z+z1/(Math.pow(2, depth))))/2)] = 
//                        new THREE.Vector3( (arr[(x+x1/(Math.pow(2, depth)))][z].x + arr[(x+x1/(Math.pow(2, depth))))][(z+z1/(Math.pow(2, depth))))].x) / 2, g, arr[(x+x1/(Math.pow(2, depth))))][z].z);
//                    
//                    //position of h
//                    arr[Math.floor((x+x+x1/(Math.pow(2, depth)))/2)][(z+z1/(Math.pow(2, depth)))] = 
//                        new THREE.Vector3( arr[x][(z+z1/(Math.pow(2, depth))))].x, h, (arr[x][(z+z1/(Math.pow(2, depth))))].z + arr[(x+x1/(Math.pow(2, depth)))][(z+z1/(Math.pow(2, depth))))].z) / 2);
//                }
//                
//            }
//        }
//        
//        if(depth == 0)
//            continue;
//        
//        for(var x = x0 ; x < x1; x += x1/(Math.pow(2, depth))))
//        {
//            for(var z = z0; z < z1; z += z1/(Math.pow(2, depth)))
//            {
//                //square step
//                //        x1t
//                //    a   e   b    <--- e = (a+b+x) / 3 + rand * roughness
//                //x1l  f   x   g  x1r  <--- f = (a+c+x) / 3 + rand * roughness , g = (b+x+d) / 3 + rand * roughness
//                //    c   h   d    <--- h = (c+x+d) / 3 + rand * roughness
//                //        x1b
//                
//                var b = arr[(x+x1/(Math.pow(2, depth)))][z].y;
//                var c = arr[x][(z+z1/(Math.pow(2, depth)))].y;
//                var d = arr[(x+x1/(Math.pow(2, depth)))][(z+z1/(Math.pow(2, depth)))].y; 
//                var x = (a+b+c+d)/4 + rand2D(Math.floor((x+x+x1/(Math.pow(2, depth)))/2),Math.floor((z+z+z1/(Math.pow(2, depth)))/2)) * roughness * disp;
//                
//                
//            }
//        }
//    }
//    
//    
//    if(pass < 1) return;
//    
//    
//        var a = arr[x0][z0].y;
//        var b = arr[x1][z0].y;
//        var c = arr[x0][z1].y;
//        var d = arr[x1][z1].y;
////        var x = (a+b+c+d)/4 + THREE.Math.randFloat(-disp,disp) * roughness;
//        
//        var x = (a+b+c+d)/4 + rand2D(Math.floor((x0+x1)/2),Math.floor((z0+z1)/2)) * roughness;
//        
//        //position of x
//        arr[Math.floor((x0+x1)/2)][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x0][z0].x + arr[x0][z1].x) / 2, x, (arr[x0][z0].z + arr[x1][z0].z) / 2 );
//        
//        for(var i = x0 ; i < x1+1; i+=(x0+x1)/2)
//    
//    //square step
//    //a   e   b    <--- e = (a+b+x) / 3 + rand * roughness
//    //f   x   g    <--- f = (a+c+x) / 3 + rand * roughness , g = (b+x+d) / 3 + rand * roughness
//    //c   h   d    <--- h = (c+x+d) / 3 + rand * roughness 
////        var e = (a+b+x)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
////        var f = (a+c+x)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
////        var g = (b+x+d)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
////        var h = (c+x+d)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
//    
//        var e = (a+b+x)/3 + rand2D(Math.floor((x0+x1)/2),z0) * roughness;
//        var f = (a+c+x)/3 + THREE.Math.randFloat(x0,Math.floor((z0+z1)/2)) * roughness;
//        var g = (b+x+d)/3 + THREE.Math.randFloat(x1,Math.floor((z0+z1)/2)) * roughness;
//        var h = (c+x+d)/3 + THREE.Math.randFloat(Math.floor((x0+x1)/2),z1) * roughness;
//        
//        //position of e
//        arr[Math.floor((x0+x1)/2)][z0] = new THREE.Vector3( arr[x0][z0].x, e, (arr[x0][z0].z + arr[x1][z0].z) / 2);
//        //position of f
//        arr[x0][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x0][z0].x + arr[x0][z1].x) / 2, f, arr[x0][z0].z);
//        //position of g
//        arr[x1][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x1][z0].x + arr[x1][z1].x) / 2, g, arr[x1][z0].z);
//        //position of h
//        arr[Math.floor((x0+x1)/2)][z1] = new THREE.Vector3( arr[x0][z1].x, h, (arr[x0][z1].z + arr[x1][z1].z) / 2);
//
//    
//    //recursive call for each square
//    //|-----------|
//    //|  1  |  2  |
//    //|-----------|
//    //|  3  |  4  |
//    //|-----------|
//    
//    DiamondSquare(x0, Math.floor((x0+x1)/2), z0, Math.floor((z0+z1)/2), roughness/2, pass-1, disp); // 1
//    
//    DiamondSquare(Math.floor((x0+x1)/2), x1, z0, Math.floor((z0+z1)/2), roughness/2, pass-1, disp); // 2
//    
//    DiamondSquare(x0, Math.floor((x0+x1)/2), Math.floor((z0+z1)/2), z1, roughness/2, pass-1, disp); // 3
//    
//    DiamondSquare(Math.floor((x0+x1)/2), x1, Math.floor((z0+z1)/2), z1, roughness/2, pass-1, disp); // 4
//    
//    return arr;
//}




function DiamondSquare(x0, x1, z0, z1, roughness, pass, disp)
{
    if(pass < 1) return;
    
    //diamond step
    //a     b
    //   x   <-----finding this (a+b+c+d) / 4 + rand * roughness
    //c     d
        var a = arr[x0][z0].y;
        var b = arr[x1][z0].y;
        var c = arr[x0][z1].y;
        var d = arr[x1][z1].y;
        var x = (a+b+c+d)/4 + THREE.Math.randFloat(-disp,disp) * roughness;
        
//        var x = (a+b+c+d)/4 + rand2D(Math.floor((x0+x1)/2),Math.floor((z0+z1)/2)) * roughness * disp;
        
        //position of x
        arr[Math.floor((x0+x1)/2)][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x0][z0].x + arr[x0][z1].x) / 2, x, (arr[x0][z0].z + arr[x1][z0].z) / 2 );
    
    
    //square step
    //a   e   b    <--- e = (a+b+x) / 3 + rand * roughness
    //f   x   g    <--- f = (a+c+x) / 3 + rand * roughness , g = (b+x+d) / 3 + rand * roughness
    //c   h   d    <--- h = (c+x+d) / 3 + rand * roughness 
        var e = (a+b+x)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
        var f = (a+c+x)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
        var g = (b+x+d)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
        var h = (c+x+d)/3 + THREE.Math.randFloat(-disp,disp) * roughness;
    
//        var e = (a+b+x)/3 + rand2D(Math.floor((x0+x1)/2),z0) * roughness * disp;
//        var f = (a+c+x)/3 + rand2D(x0,Math.floor((z0+z1)/2)) * roughness * disp;
//        var g = (b+x+d)/3 + rand2D(x1,Math.floor((z0+z1)/2)) * roughness * disp;
//        var h = (c+x+d)/3 + rand2D(Math.floor((x0+x1)/2),z1) * roughness * disp;
        
        //position of e
        arr[Math.floor((x0+x1)/2)][z0] = new THREE.Vector3( arr[x0][z0].x, e, (arr[x0][z0].z + arr[x1][z0].z) / 2);
        //position of f
        arr[x0][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x0][z0].x + arr[x0][z1].x) / 2, f, arr[x0][z0].z);
        //position of g
        arr[x1][Math.floor((z0+z1)/2)] = new THREE.Vector3( (arr[x1][z0].x + arr[x1][z1].x) / 2, g, arr[x1][z0].z);
        //position of h
        arr[Math.floor((x0+x1)/2)][z1] = new THREE.Vector3( arr[x0][z1].x, h, (arr[x0][z1].z + arr[x1][z1].z) / 2);

    
    //recursive call for each square
    //|-----------|
    //|  1  |  2  |
    //|-----------|
    //|  3  |  4  |
    //|-----------|
    
    DiamondSquare(x0, Math.floor((x0+x1)/2), z0, Math.floor((z0+z1)/2), roughness/2, pass-1, disp); // 1
    
    DiamondSquare(Math.floor((x0+x1)/2), x1, z0, Math.floor((z0+z1)/2), roughness/2, pass-1, disp); // 2
    
    DiamondSquare(x0, Math.floor((x0+x1)/2), Math.floor((z0+z1)/2), z1, roughness/2, pass-1, disp); // 3
    
    DiamondSquare(Math.floor((x0+x1)/2), x1, Math.floor((z0+z1)/2), z1, roughness/2, pass-1, disp); // 4
    
    return arr;
}


// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
    var audio = framework.audio;
    //var data = framework.frequencyData;
    
  // LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
  // var {scene, camera, renderer, gui, stat} = framework; 
    

    //creation of the terrain
    //running the diamond square algorythm to create the terrain
    var pass = 6;
    var roughness = 0.8;
    var d = 5.5;
    arr = DiamondSquare(0, 64, 0, 64, roughness, pass, d);

    //tessellating the terrain
    var terrain = new THREE.Geometry();
    for(var i = 0 ; i < 65; i++)
    {
        for(var j = 0; j < 65; j++)
        {
            terrain.vertices.push(arr[j][i]);        
        }
    }
    
    for(var i = 0 ; i < 4160; i++)//272, 1056
    {
        if((i+1) % 65 == 0)
        {
            continue;
        }
        var face = new THREE.Face3(i, i+1, i+66);
        var face1 = new THREE.Face3(i, i+66, i+65);
        terrain.faces.push(face);
        terrain.faces.push(face1);
    }
    
    var terrain_material = new THREE.MeshLambertMaterial( {color: 0x808080, side: THREE.DoubleSide} );
    var terrain_mesh = new THREE.Mesh( terrain, terrain_material );
    terrain_mesh.geometry.verticesNeedUpdate = true;
    terrain_mesh.geometry.normalsNeedUpdate = true;
    terrain.elementsNeedUpdate = true;

    terrain_mesh.geometry.computeFaceNormals();
    terrain_mesh.geometry.computeVertexNormals(); 
    scene.add(terrain_mesh);
    
    
    
    //WIREFRAME MODE
//    var wireframe = new THREE.WireframeGeometry( terrain );
//
//    var line = new THREE.LineSegments( wireframe );
//    line.material.depthTest = false;
//    line.material.opacity = 0.25;
//    line.material.transparent = true;
//
//    scene.add( line );
    
    // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

//    TEST    
//    console.log(rand2D(0,1));

}
  

// called on frame updates
function onUpdate(framework) {
 
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

// console.log('hello world');

// console.log(Noise.generateNoise());

// Noise.whatever()

// console.log(other())