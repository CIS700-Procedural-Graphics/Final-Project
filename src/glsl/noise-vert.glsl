//uniform float time;

//varying vec3 perlin_color;
// uniform float num_octaves;
// uniform float perlin_persistence;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPos;
varying float vAmount;

float cosineInterp(float x, float y, float z)
{
    float t = (1.0 - cos(z * 3.1459)) * 0.5;
    return (x * (1.0 - t)) + (y * t);
}

float randomNoise3D(float x, float y, float z)
{
    vec3 a = vec3(x, y, z);
    vec3 b = vec3(12.9898, 78.233, 140.394);

    float dot_prod = (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    float val = sin(dot_prod) * 43758.5453;

    float int_val = floor(val);
    return (val - int_val) * 2.0 - 1.0;
}

float smoothedNoise(float x, float y, float z)
{
    //edge connected (12) / 8
    float edges = (randomNoise3D(x - 1.0, y + 1.0, z) + randomNoise3D(x, y + 1.0, z + 1.0) + randomNoise3D(x + 1.0, y + 1.0, z) + randomNoise3D(x, y + 1.0, z - 1.0)
                  + randomNoise3D(x - 1.0, y, z + 1.0) + randomNoise3D(x + 1.0, y, z + 1.0) + randomNoise3D(x + 1.0, y, z - 1.0) + randomNoise3D(x - 1.0, y, z - 1.0)
                  + randomNoise3D(x - 1.0, y - 1.0, z) + randomNoise3D(x, y - 1.0, z + 1.0) + randomNoise3D(x + 1.0, y - 1.0, z) + randomNoise3D(x, y - 1.0, z - 1.0))
                  / 8.0;

    //point connected (8) / 16
    float points = randomNoise3D(x - 1.0, y + 1.0, z + 1.0) + randomNoise3D(x + 1.0, y + 1.0, z + 1.0) + randomNoise3D(x - 1.0, y - 1.0, z + 1.0) + randomNoise3D(x + 1.0, y - 1.0, z + 1.0)
                    + randomNoise3D(x - 1.0, y + 1.0, z - 1.0) + randomNoise3D(x + 1.0, y + 1.0, z - 1.0) + randomNoise3D(x - 1.0, y - 1.0, z - 1.0) + randomNoise3D(x + 1.0, y - 1.0, z - 1.0)
                    / 16.0;

    //face connected (6) / 4
    float faces = randomNoise3D(x - 1.0, y , z) + randomNoise3D(x, y + 1.0, z) + randomNoise3D(x , y, z + 1.0)
                    + randomNoise3D(x + 1.0, y, z) + randomNoise3D(x , y, z - 1.0) + randomNoise3D(x , y - 1.0, z)
                    / 4.0;

    //center (1) / 2
    float center = randomNoise3D(x , y, z) / 2.0;

    return edges + points + faces + center;
}

//each sample point has a smoothed value, and then you interpolate between those smoothed values rather than the original ones
float interpolatedNoise(float x, float y, float z)
{
    float floored_x = floor(x);
    float difference_x = x - floored_x;

    float floored_y = floor(y);
    float difference_y = y - floored_y;

    float floored_z = floor(z);
    float difference_z = z - floored_z;

    float v1 = smoothedNoise(floored_x, floored_y, floored_z);
    float v2 = smoothedNoise(floored_x + 1.0, floored_y, floored_z);

    float v3 = smoothedNoise(floored_x, floored_y + 1.0, floored_z);
    float v4 = smoothedNoise(floored_x + 1.0, floored_y + 1.0, floored_z);

    float v5 = smoothedNoise(floored_x, floored_y, floored_z + 1.0);
    float v6 = smoothedNoise(floored_x + 1.0, floored_y, floored_z + 1.0);

    float v7 = smoothedNoise(floored_x, floored_y + 1.0, floored_z + 1.0);
    float v8 = smoothedNoise(floored_x + 1.0, floored_y + 1.0, floored_z + 1.0);


    float interp_1 = cosineInterp(v1, v2, difference_x);
    float interp_2 = cosineInterp(v3, v4, difference_x);

    float interp_3 = cosineInterp(v5, v6, difference_x);
    float interp_4 = cosineInterp(v7, v8, difference_x);

    float interp_5 = cosineInterp(interp_1, interp_2, difference_y);
    float interp_6 = cosineInterp(interp_3, interp_4, difference_y);

    return cosineInterp(interp_5, interp_6, difference_z);
}

float perlinNoise(float x, float y, float z)
{
    float noise_total = 0.0;
    float persistence = 0.5;//perlin_persistence;//0.75;  //0.75 makes it spikier. 0.5 makes it more gaseous
    float numOctaves = 1.0;
    float frequency = 0.0;
    float amplitude = 0.0;

    float i = 0.0;
    x = x / 3.0;
    y = y / 2.0;
    z = z / 3.0;

    // const int octaves = int(num_octaves); //8;
    for (int j = 0; j < 20; j+= 1)
    {
        if (j < int(numOctaves)) {
          frequency = 0.1 * pow(2.0, i);
          amplitude = pow(persistence, i);

          //call either randomNoise3D or interpolatedNoise here
          noise_total += interpolatedNoise(x * frequency, y * frequency, z * frequency) * amplitude;
          i++;
        }
    }

    return noise_total;
}

vec3 calculateNormal(vec3 point)
{
  vec3 grad = vec3(0.0, 0.0, 0.0);
  float offset = 0.01;

  vec3 p1x = vec3(point.x + offset, point.y, point.z);
  vec3 p2x = vec3(point.x - offset, point.y, point.z);
  grad.x = perlinNoise(p1x.x, p1x.y, p1x.z) - perlinNoise(p2x.x, p2x.y, p2x.z);

  vec3 p1y = vec3(point.x, point.y + offset, point.z);
  vec3 p2y = vec3(point.x, point.y - offset, point.z);
  grad.y = perlinNoise(p1y.x, p1y.y, p1y.z) - perlinNoise(p2y.x, p2y.y, p2y.z);

  vec3 p1z = vec3(point.x, point.y, point.z + offset);
  vec3 p2z = vec3(point.x, point.y, point.z - offset);
  grad.y = perlinNoise(p1z.x, p1z.y, p1z.z) - perlinNoise(p2z.x, p2z.y, p2z.z);

  return normalize(grad);
}


void main() {

    float height = 5.0;
    float noise_output = height * perlinNoise(position.x, position.y, position.z);

    //to send to frag shader - calculate post-noise normal and position
    vNormal = normal;//calculateNormal(normal);  //normal;
    vPos = position;//vec3(noise_output);  //position;

    vUv = 0.1 * vec2(mod(position.x, 1.25), mod(position.z, 1.25)); //uv;
    //vUv = 3.0 * vec2(mod(position.x, 2.0), mod(position.z, 2.0));

    vAmount = noise_output;

    //change position of mesh based on perlin output
    vec3 new_pos = position + (normal * 0.5 * noise_output);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
