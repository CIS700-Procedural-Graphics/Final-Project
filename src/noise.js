const THREE = require('three');

function cosineInterp(x, y, z)
{
    var t = (1.0 - Math.cos(z * 3.1459)) * 0.5;
    return (x * (1.0 - t)) + (y * t);
}

function randomNoise3D(x, y, z)
{
    var a = new THREE.Vector3(x, y, z);
    var b = new THREE.Vector3(12.9898, 78.233, 140.394);

    var dot_prod = (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    var val = Math.sin(dot_prod) * 43758.5453;

    var int_val = Math.floor(val);
    return (val - int_val) * 2.0 - 1.0;
}

function smoothedNoise(x, y, z)
{
    //edge connected (12) / 8
    var edges = (randomNoise3D(x - 1.0, y + 1.0, z) + randomNoise3D(x, y + 1.0, z + 1.0) + randomNoise3D(x + 1.0, y + 1.0, z) + randomNoise3D(x, y + 1.0, z - 1.0)
                  + randomNoise3D(x - 1.0, y, z + 1.0) + randomNoise3D(x + 1.0, y, z + 1.0) + randomNoise3D(x + 1.0, y, z - 1.0) + randomNoise3D(x - 1.0, y, z - 1.0)
                  + randomNoise3D(x - 1.0, y - 1.0, z) + randomNoise3D(x, y - 1.0, z + 1.0) + randomNoise3D(x + 1.0, y - 1.0, z) + randomNoise3D(x, y - 1.0, z - 1.0))
                  / 8.0;

    //point connected (8) / 16
    var points = randomNoise3D(x - 1.0, y + 1.0, z + 1.0) + randomNoise3D(x + 1.0, y + 1.0, z + 1.0) + randomNoise3D(x - 1.0, y - 1.0, z + 1.0) + randomNoise3D(x + 1.0, y - 1.0, z + 1.0)
                    + randomNoise3D(x - 1.0, y + 1.0, z - 1.0) + randomNoise3D(x + 1.0, y + 1.0, z - 1.0) + randomNoise3D(x - 1.0, y - 1.0, z - 1.0) + randomNoise3D(x + 1.0, y - 1.0, z - 1.0)
                    / 16.0;

    //face connected (6) / 4
    var faces = randomNoise3D(x - 1.0, y , z) + randomNoise3D(x, y + 1.0, z) + randomNoise3D(x , y, z + 1.0)
                    + randomNoise3D(x + 1.0, y, z) + randomNoise3D(x , y, z - 1.0) + randomNoise3D(x , y - 1.0, z)
                    / 4.0;

    //center (1) / 2
    var center = randomNoise3D(x , y, z) / 2.0;

    return edges + points + faces + center;
}

//each sample point has a smoothed value, and then you interpolate between those smoothed values rather than the original ones
function interpolatedNoise( x,  y,  z)
{
    var floored_x = Math.floor(x);
    var difference_x = x - floored_x;

    var floored_y = Math.floor(y);
    var difference_y = y - floored_y;

    var floored_z = Math.floor(z);
    var difference_z = z - floored_z;

    var v1 = smoothedNoise(floored_x, floored_y, floored_z);
    var v2 = smoothedNoise(floored_x + 1.0, floored_y, floored_z);

    var v3 = smoothedNoise(floored_x, floored_y + 1.0, floored_z);
    var v4 = smoothedNoise(floored_x + 1.0, floored_y + 1.0, floored_z);

    var v5 = smoothedNoise(floored_x, floored_y, floored_z + 1.0);
    var v6 = smoothedNoise(floored_x + 1.0, floored_y, floored_z + 1.0);

    var v7 = smoothedNoise(floored_x, floored_y + 1.0, floored_z + 1.0);
    var v8 = smoothedNoise(floored_x + 1.0, floored_y + 1.0, floored_z + 1.0);


    var interp_1 = cosineInterp(v1, v2, difference_x);
    var interp_2 = cosineInterp(v3, v4, difference_x);

    var interp_3 = cosineInterp(v5, v6, difference_x);
    var interp_4 = cosineInterp(v7, v8, difference_x);

    var interp_5 = cosineInterp(interp_1, interp_2, difference_y);
    var interp_6 = cosineInterp(interp_3, interp_4, difference_y);

    return cosineInterp(interp_5, interp_6, difference_z);
}

export default function perlinNoise( x,  y,  z)
{
    var noise_total = 0.0;
    var persistence = 0.5;//perlin_persistence;//0.75;  //0.75 makes it spikier. 0.5 makes it more gaseous
    var numOctaves = 1.0;
    var frequency = 0.0;
    var amplitude = 0.0;
    var i = 0.0;

    x = x / 3.0;
    y = y / 2.0;
    z = z / 3.0;

    // const int octaves = int(num_octaves); //8;
    for (var j = 0; j < 20; j += 1)
    {
        if (j < numOctaves) {
          frequency = 0.1 * Math.pow(2.0, i);
          amplitude = Math.pow(persistence, i);

          //call either randomNoise3D or interpolatedNoise here
          noise_total += interpolatedNoise(x * frequency, y * frequency, z * frequency) * amplitude;
          i++;
        }
    }

    return noise_total;
}

function noiseOutput( x,  y,  z)
{
    var height = 5.0;
    var noise_output = height * perlinNoise(x, y, z);
}
