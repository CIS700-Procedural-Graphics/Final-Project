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
in vec4 inObjPos;

out vec4 outPos;
out vec4 outVel;

#define M_PI 3.1415926535897932384626433832795


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{     
    vec3 pos = inPos.xyz; 
    vec3 vel = inVel.xyz; 
    vec3 objPos = inObjPos.xyz;
    vec4 mousePos = u_mouse;
    //objPos = max(mousePos.xyz,objPos);
    
    vel = (objPos - pos)/30.0;
    if (length(objPos - pos) < 0.01) {
        vel = vec3(0);
    }
    
    outPos = vec4(pos.x+vel.x,pos.y+vel.y,pos.z+vel.z,1.0);
    outVel = vec4(vel.x,vel.y,vel.z,1.0);
}

