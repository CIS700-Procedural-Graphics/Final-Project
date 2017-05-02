uniform sampler2D spline_tex;

uniform float time;

uniform float buckets;
uniform vec3 shallow_water;
uniform vec3 deep_water;

varying vec2 vUV;
varying vec3 ePosition;
varying vec3 vPosition;

vec3 applyFog(vec3 color, float distance, float b) {
	float fogAmount = 1.0 - exp( -distance*b );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( color, fogColor, fogAmount );
}

void main() {


	float level = texture2D(spline_tex, vUV).r - 0.1;
	float d = floor(buckets * level) / buckets / 3.0;
	vec3 color = vec3(0.0, d, 2.0 * d);

	color = applyFog(color, length(vPosition - ePosition), 0.01);

    gl_FragColor = vec4(color, 1.0);
}