uniform sampler2D spline_tex;
uniform float buckets;
uniform vec3 drop_color;
uniform vec3 splash_color;

varying vec2 vUV;
varying vec3 vPosition;
varying float splash;
varying float dist;
varying vec3 ePosition;

float bias(float b, float t) {
	return pow(t, log(b) / log(0.5));
}

float smoothstep(float x) {
	return 3.0 * x * x - 2.0 * x * x * x;
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

	if (splash == 1.0) {
		color = mix(splash_color, water_color, dist);
	} else {
		color = drop_color;
	}

    gl_FragColor = vec4(color, 1.0);
}