#version 300 es

uniform mat4 u_model;
uniform mat4 u_projectionView;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform float u_particleSize;

in vec4 inPos;
in vec4 inVel;
in vec4 inAcc;
in float inMass;
//in vec4 inObjPos;

out vec3 out_pos;
out vec4 out_col1;
out vec4 out_col2;

void main()
{
    vec3 pos = inPos.xyz; 
    vec3 vel = inVel.xyz; 
    vec3 acc = inAcc.xyz;
    float mass = inMass;
    
    gl_PointSize = u_particleSize;
    gl_Position = u_projectionView * u_model * inPos;
    out_pos = inPos.xyz;
    out_col1 = u_color1;
    out_col2 = u_color2;
}