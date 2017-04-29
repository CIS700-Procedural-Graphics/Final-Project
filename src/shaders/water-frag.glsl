uniform sampler2D spline_tex;
uniform float buckets;
uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUV;
varying float noise;

vec3 color_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {

	float level = texture2D(spline_tex, vUV).r - 0.1;
	float d = floor (buckets * level) / buckets;

    gl_FragColor = vec4(0.0, 0.0, d , 1.0);
}