uniform sampler2D spline_tex;
uniform sampler2D texture;
uniform float buckets;
uniform vec3 drop_color;
uniform vec3 splash_color;

varying vec3 vPosition;
varying vec3 ePosition;
varying float size;
varying vec2 vUV;

float bias(float b, float t) {
	return pow(t, log(b) / log(0.5));
}

vec3 applyFog(vec3 color, float distance, float b) {
	float fogAmount = 1.0 - exp( -distance*b );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( color, fogColor, fogAmount );
}

void main() {

	float level = texture2D(spline_tex, vUV).r - 0.1;
	float d = floor(buckets * level) / buckets / 3.0;
	vec3 water_color = vec3(0.0, d, 2.0 * d);
	water_color = applyFog(water_color, length(ePosition - vPosition), 0.01);

	vec3 color = mix(splash_color, water_color, size);


    gl_FragColor = vec4(color, 1.0);
    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}