uniform vec2 grads[8];
uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float buckets;

varying vec2 vUv;

#define PI 3.14159265

int hash(vec2 p) {
	return int(mod(sin(dot(p, vec2(78.233,1938.2)))*43758.5453,8.0));
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

vec2 getData(int id) {
    for (int i=0; i<8; i++) {
        if (i == id) return grads[i];
    }
}

float p_noise(vec2 point, float freq, float amp, float t) {
	vec2 p = freq * point/ 10.0;
	vec2 square1 = floor(p); 
	vec2 square2 = vec2(ceil(p.x), floor(p.y)); 
	vec2 square3 = vec2(floor(p.x), ceil(p.y));
	vec2 square4 = ceil(p);

	float u = new_t((p-square1).x);
	float v = new_t((p-square1).y);

	float a = dot(p - square1, getData(hash(square1)));
	float b = dot(p - square2, getData(hash(square2)));
	float c = dot(p - square3, getData(hash(square3)));
	float d = dot(p - square4, getData(hash(square4)));

	return amp * blerp(a,b,c,d,u,v);
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

    float noise = p_noise(vUv, frequency, amplitude, time);
    vec3 horizon = vec3(1.0, 0.855, 0.725);
    vec3 mid = vec3(0.976, 0.537, 0.718);
    vec3 sky = vec3(0.0745,0.0941,0.384);

    float d = floor (buckets * noise) / buckets;
    vec3 sunset_from = grad_map(horizon, mid, sky, vUv.y/1.33);
    vec3 sunset_to = grad_map(horizon, mid, sky, vUv.y/1.33 + 0.25);
    
    vec3 color = color_lerp(sunset_from, sunset_to, d);

    gl_FragColor = vec4( color.rgb, 1.0 );
}