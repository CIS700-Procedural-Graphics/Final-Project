uniform vec3 grads[12];

uniform vec3 horizon;
uniform vec3 mid;
uniform vec3 sky;

uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float audioFreq;
uniform float buckets;

varying vec3 point;

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

float p_noise(vec3 point, float freq, float amp, float t) {
	vec3 p = freq * point/ 10.0 + vec3(t/500.0);
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

vec3 color_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

vec3 grad_map(vec3 c1, vec3 c2, vec3 c3, float t) {
	if (t > 0.5) {
		return color_lerp(c2, c3, 2.0 * (t - 0.5));
	} else {
		return color_lerp(c1, c2, 2.0 * t);
	}
}

void main() {

    float noise = p_noise(point, frequency, amplitude, time);
    
    float d = floor (buckets * noise) / buckets;
    float height = (point.y + 500.0)/1000.0;
    vec3 sunset_from = grad_map(horizon, mid, sky, height/1.33);
    vec3 sunset_to = grad_map(horizon, mid, sky, height/1.33 + 0.25);
    
    vec3 color = color_lerp(sunset_from, sunset_to, d);
	gl_FragColor = vec4( color.rgb, 1.0 );
    
}