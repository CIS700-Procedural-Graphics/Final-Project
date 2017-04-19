#version 300 es
 
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


in vec4 inPos;
in vec4 inVel;

out vec4 outPos;
out vec4 outVel;

#define M_PI 3.1415926535897932384626433832795


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{     
    vec4 pos = inPos;    
    vec4 vel = inVel;    
    
   if (pos.x > 1.0 || pos.x < -1.0)
       vel.x = -vel.x;

   if (pos.y > 1.0 || pos.y < -1.0)
       vel.y = -vel.y;

   if (pos.z > 1.0 || pos.y < -1.0)
        vel.z = -vel.z;
    
    outPos = vec4(pos.x+vel.x,pos.y+vel.y,pos.z+vel.z,1.0); 
    outVel = vec4(vel.x, vel.y,vel.z,1.0);
}