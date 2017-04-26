#version 300 es
 
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_mouse;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_projectionView;

in vec4 inPos;
in vec4 inVel;

out vec3 out_pos;

void main()
{
    gl_PointSize = 2.;
    gl_Position = u_projectionView * u_model * inPos;
    out_pos = inPos.xyz;
}