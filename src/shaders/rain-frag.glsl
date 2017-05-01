uniform sampler2D spline_tex;
uniform float buckets;

varying vec2 vUV;
varying vec3 vPosition;
varying vec3 ePosition;
varying int splash;
varying float dist;

float bias(float b, float t) {
	return pow(t, log(b) / log(0.5));
}

vec3 applyFog(vec3 color, float distance, float b) {
	float fogAmount = 1.0 - exp( -distance*b );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( color, fogColor, fogAmount );
}

void main() {
	
	float distance = smoothstep(length(ePosition - vPosition));
	float alpha = bias(0.2, 1.0 - distance);

	vec3 color = vec3(0.0);

	float level = texture2D(spline_tex, vUV).r - 0.1;
	float d = floor(buckets * level) / buckets / 3.0;
	vec3 water_color = vec3(0.0, d, 2.0 * d);
	water_color = applyFog(water_color, length(ePosition - vPosition), 0.01);

	if (splash == 1) {
		color = mix(purple, water_color, dist);
	} else {
		color = vec3(0.1, 0.1, 0.1);
	}

    gl_FragColor = vec4(color, alpha);
}