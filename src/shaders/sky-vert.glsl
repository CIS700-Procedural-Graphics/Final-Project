varying vec2 vUv;
uniform vec3 random;
varying vec3 fragPos;
varying vec3 vNormal;
varying float noise;

float sampleNoise(vec3 pos) {
	float x = fract(sin(dot(pos, vec3(134.9235, 63.5879, 218.9542))) * 27495.2467);
	return x;
}

void main() {
    vUv = uv;
		vec4 worldPosition = modelMatrix * vec4( position.xyz, 1.0 );
		fragPos = worldPosition.xyz;
		vNormal = normal;
    noise = sampleNoise(vec3(random.x*position.x, random.y*position.y, random.z*position.z));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y + noise, position.z, 1.0 );
}
