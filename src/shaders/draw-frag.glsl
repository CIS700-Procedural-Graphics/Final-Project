#version 300 es

precision highp float;

uniform sampler2D u_image;

in vec3 out_pos;
in vec4 out_col1;
in vec4 out_col2;

out vec4 fragColor;


vec4 rgb_lerp (vec4 col1, vec4 col2, float t)
{
	return vec4
	(
		col1.r + (col2.r - col1.r) * t,
		col1.g + (col2.g - col1.g) * t,
		col1.b + (col2.b - col1.b) * t,
		col1.a + (col2.a - col1.a) * t
	);
}

float hash(vec3 p) 
{
    p = fract( p*0.3183099+.1);
	p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}


void main(void) {
    
    fragColor = rgb_lerp(out_col1,out_col2, hash(out_pos)/1.5);
}