#version 300 es
 
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

in vec4 inPos;
in vec4 inVel;

out vec3 out_pos;

void main()
{
    gl_PointSize = 1.;
    gl_Position = inPos;
    out_pos = inPos.xyz;
}