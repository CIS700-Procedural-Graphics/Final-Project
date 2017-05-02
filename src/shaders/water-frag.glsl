uniform sampler2D spline_tex;
uniform vec3 grads[12];
uniform float density;
uniform float time;

uniform float buckets;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUV;
varying float noise;
varying vec3 ePosition;
varying vec3 vPosition;

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
	vec3 p = freq * vec3(point, t/30000.0)/ 10.0;
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

vec3 applyFog(vec3 color, float distance, float b) {
	float fogAmount = 1.0 - exp( -distance*b );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( color, fogColor, fogAmount );
}

void main() {


	float level = texture2D(spline_tex, vUV).r - 0.1;
	float d = floor(buckets * level) / buckets / 3.0;
	vec3 color = vec3(0.0, d, 2.0 * d);
	float noise = p_noise(vUV, 5000.0, 2.0, time);

	color = applyFog(color, length(vPosition - ePosition), 0.01);

    gl_FragColor = vec4(color, 1.0);
}