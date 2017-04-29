uniform vec3 grads[12];

uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float audioFreq;

varying float noise;
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 ePosition;

#define PI 3.14159265

int hash(vec3 p) {
	return int(mod(sin(dot(p, vec3(12.9898, 78.233,1938.2)))*43758.5453,12.0));
}

float new_t(float t) {
	return 6.0 * t*t*t*t*t - 15.0 * t*t*t*t + 10.0 * t*t*t;
}

float lerp(float a, float b, float t) {
  return a * (1.0-t) + b * t;
}

float cos_lerp(float a, float b, float t) {
  float cos_t = (1.0 - cos(t * PI)) * 0.5;
  return lerp(a,b,cos_t);
}

float blerp(float a, float b, float c, float d, float u, float v) {
	return cos_lerp(cos_lerp(a, b, u), cos_lerp(c, d, u), v);
}

float tlerp(float a, float b, float c, float d, float e, float f, float g, float h, float u, float v, float w) { 
	return cos_lerp(blerp(a,b,c,d,u,v), blerp(e,f,g,h,u,v), w);
}

vec3 getData(int id) {
    for (int i=0; i<8; i++) {
        if (i == id) return grads[i];
    }
}

float p_noise(vec2 point, float freq, float amp, float t) {
	vec3 p = freq * vec3(point, t/50.0)/ 10.0;
	vec3 cube1 = floor(p); 
	vec3 cube2 = vec3(ceil(p.x), floor(p.yz)); 
	vec3 cube3 = vec3(floor(p.x), ceil(p.y), floor(p.z));
	vec3 cube4 = vec3(ceil(p.xy), floor(p.z));
	vec3 cube5 = vec3(floor(p.xy), ceil(p.z));
	vec3 cube6 = vec3(ceil(p.x), floor(p.y), ceil(p.z));
	vec3 cube7 = vec3(floor(p.x), ceil(p.yz));
	vec3 cube8 = ceil(p);

	float u = new_t((p-cube1).x);
	float v = new_t((p-cube1).y);
	float w = new_t((p-cube1).z);

	float a = dot(p - cube1, getData(hash(cube1)));
	float b = dot(p - cube2, getData(hash(cube2)));
	float c = dot(p - cube3, getData(hash(cube3)));
	float d = dot(p - cube4, getData(hash(cube4)));
	float e = dot(p - cube5, getData(hash(cube5)));
	float f = dot(p - cube6, getData(hash(cube6)));
	float g = dot(p - cube7, getData(hash(cube7)));
	float h = dot(p - cube8, getData(hash(cube8)));

	return amp * tlerp(a,b,c,d,e,f,g,h,u,v,w);
}

void main() {

    vUV =  uv;
    vPosition = position;
    ePosition = cameraPosition;
    vec2 p = vec2(position.x, position.z);
    noise = p_noise(p, frequency, amplitude, time);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position + noise * normal, 1.0 );    
}