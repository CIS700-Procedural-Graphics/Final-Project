uniform float u_amount;
uniform vec3 u_albedo;

varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;
varying vec3 f_light;

varying float h;


// References 
// IQ: http://www.iquilezles.org/www/articles/palettes/palettes.htm
// cosine gradient generator: http://dev.thi.ng/gradients/
const vec3 A = vec3(0.548, 0.828, 0.988);
const vec3 B = vec3(0.608, -0.222, -0.112);
const vec3 C = vec3(-0.382, 0.328, 0.608);
const vec3 D = vec3(-1.492, 0.167, 0.725);

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
	vec3 col = palette(h, A, B, C, D);
	gl_FragColor = vec4(col.rgb, 1.0);
}