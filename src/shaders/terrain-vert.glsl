varying vec2 vUv;
varying float noise;
varying vec3 fragPos;
varying vec3 vNormal;

#define M_PI 3.14159265
const int N_OCTAVES = 5;

float sampleNoise(vec3 pos) {
	float x = fract(sin(dot(pos, vec3(134.9235, 63.5879, 218.9542))) * 27495.2467);
	return x;
}

float interpolate(float a, float b, float t) {
	float cos_t = (1. - cos(t * M_PI)) * 0.5;
	return a * (1. - cos_t) + b * cos_t;
}

float interpNoise(vec3 pos, float f) {

	// Calculate the min/max positions of cube
	vec3 p0 = floor(pos * f) / f;
	vec3 p1 = p0 + 1. / f;
	vec3 t  = (pos - p0) * f;

	// Find noise values at corners of cube
	float A = sampleNoise(vec3(p0.x, p0.y, p0.z));
	float E = sampleNoise(vec3(p1.x, p0.y, p0.z));

	float B = sampleNoise(vec3(p0.x, p1.y, p0.z));
	float F = sampleNoise(vec3(p1.x, p1.y, p0.z));

	float C = sampleNoise(vec3(p0.x, p0.y, p1.z));
	float G = sampleNoise(vec3(p1.x, p0.y, p1.z));

	float D = sampleNoise(vec3(p0.x, p1.y, p1.z));
	float H = sampleNoise(vec3(p1.x, p1.y, p1.z));

	// First pass of interpolation
	float interpLi_AE = interpolate(A, E, t.x);
	float interpLi_BF = interpolate(B, F, t.x);
	float interpLi_CG = interpolate(C, G, t.x);
	float interpLi_DH = interpolate(D, H, t.x);

	// Second pass of interpolation
	float interpBi_12 = interpolate(interpLi_AE, interpLi_BF, t.y);
	float interpBi_34 = interpolate(interpLi_CG, interpLi_DH, t.y);

	// Third pass
	return interpolate(interpBi_12, interpBi_34, t.z);
}

float multiOctaveNoise(vec3 worldPosition, float offset) {

	float total = 0.;
	float persistence = 1. / 2.0;

	for (int i = 0; i < N_OCTAVES; i++) {

		float frequency = pow(2., float(i));
		float amplitude = pow(persistence, float(i));
		total += interpNoise(worldPosition + offset, frequency) * amplitude;
	}

	return total;
}

void main() {
    vUv = uv;
    float scale = 100.0;
		vec4 worldPosition = modelMatrix * vec4( position.xy, 0.0, 1.0 );

    noise = multiOctaveNoise(position.xyz, 0.4);
    vec3 noisePosition = vec3( position.x, position.y, position.z ) + normal * noise;
    fragPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( noisePosition, 1.0 );
}
