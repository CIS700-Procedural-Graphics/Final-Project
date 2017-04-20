const float PI = 3.14159265;
const int size = 8;

varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;
varying vec3 f_light;

varying float h;

uniform float waterHeight;
uniform float time; // time
uniform vec3 light;

uniform int numWaves;
uniform float amplitude[8];
uniform float wavelength[8];
uniform float speed[8];
uniform vec2 direction[8];

// Equation 1
// State of each wave as a function of horizontal position (x, y) and time t
float wave(int i, float x, float y) {
	float w = 2.0 * PI / wavelength[i]; // frequency
	float phi = speed[i] * w; // phase
	float theta = dot(direction[i], vec2(x, y));

	return amplitude[i] * sin(theta * w + time * phi);
}

// Equation 2
// Sun of all of the waves
float height(float x, float y) {
	float height = 0.0;
	for (int i = 0; i < size; i++) {
		if (i >= numWaves) {
			break;
		}
		height += wave(i, x, y);
	}
	return height;
}

// Partial Deriviatives of Equation 1
// TODO: Move this into the wave function to clean up.
float ddx(int i, float x, float y) {
	float w = 2.0 * PI / wavelength[i]; // frequency
	float phi = speed[i] * w; // phase
	float theta = dot(direction[i], vec2(x, y));

	return amplitude[i] * cos(theta * w + time * phi) * direction[i].x * w;
}

float ddy(int i, float x, float y) {
	float w = 2.0 * PI / wavelength[i]; // frequency
	float phi = speed[i] * w; // phase
	float theta = dot(direction[i], vec2(x, y));

	return amplitude[i] * cos(theta * w + time * phi) * direction[i].y * w;
}

void main() {
    f_uv = uv;
    f_normal = normal;
    f_position = position;

    float x = position.x;
    float y = position.y;

    h = height(x, y); // Passed to fragment shader
    vec3 pos = vec3(x, y, h);

	float dx, dy;
	for (int i = 0; i < size; i++) {
		if (i >= numWaves) {
			break;
		}

		dx += ddx(i, x, y);
		dy += ddy(i, x, y);
	}

	vec3 B = normalize(vec3(1, 0, dx));
	vec3 T = normalize(vec3(0, 1, dy));
	vec3 N = normalize(vec3(-dx, -dy, 1));

    pos.z = waterHeight + h;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}