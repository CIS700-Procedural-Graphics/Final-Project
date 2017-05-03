varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;

uniform vec3 u_center;

// IQ's Pallette
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

// Green -> Teal -> Rose Pink
vec3 a = vec3(0.358, 0.468, 0.500);
vec3 b = vec3(-0.742, -0.252, 0.028);
vec3 c = vec3(0.528, -0.302, 1.000);
vec3 d = vec3(0.000, -0.632, 0.667);

vec3 up = vec3(0.0, 0.0, 1.0);

void main() {
	vec3 dir = normalize(f_position - u_center);
	float t = clamp(dot(up, dir), 0.0, 1.0);

	vec3 col = palette(t, a, b, c, d);
	col += vec3(t - 0.5);

	gl_FragColor = vec4(col, 1.0);
  	// gl_FragColor = vec4(normalize(f_position), 1.0);
}