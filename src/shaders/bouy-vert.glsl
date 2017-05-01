varying vec2 vUv;
uniform vec3 random;

float sampleNoise(vec3 pos) {
	float x = fract(sin(dot(pos, vec3(134.9235, 63.5879, 218.9542))) * 27495.2467);
	return x;
}

void main() {
    vUv = uv;
    float noise = position.y < 0.0 ? 0.0 : sampleNoise(vec3(random.x*position.x, random.y*position.y, random.z*position.z)) * 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y + noise, position.z, 1.0 );
}
