#version 300 es

precision highp float;
 
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_mouse;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_projectionView;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform float u_mouseClicked;
uniform float u_particleSpeed;
uniform float u_particleNoise;
uniform float u_forceRadius;

in vec4 inPos;
in vec4 inVel;
in vec4 inAcc;
in float inMass;
in vec4 inObjPos;

out vec4 outPos;
out vec4 outVel;
out vec4 outAcc;
out float outMass;

#define M_PI 3.1415926535897932384626433832795

float hash(vec3 p) 
{
  p = fract( p*0.3183099+.1);
	p *= 17.0;
  return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}

float smoothing(float x, float y, float z) {
   
    //left side
    float l1 = hash(vec3(x-1.0,y-1.0,z-1.0));
    float l2 = hash(vec3(x-1.0,y-1.0,z));
    float l3 = hash(vec3(x-1.0,y-1.0,z+1.0));
    float l4 = hash(vec3(x-1.0,y,z-1.0));
    float l5 = hash(vec3(x-1.0,y,z));
    float l6 = hash(vec3(x-1.0,y-1.0,z+1.0));
    float l7 = hash(vec3(x-1.0,y+1.0,z-1.0));
    float l8 = hash(vec3(x-1.0,y+1.0,z));
    float l9 = hash(vec3(x-1.0,y+1.0,z+1.0));

    //middle
    float m1 = hash(vec3(x,y-1.0,z-1.0));
    float m2 = hash(vec3(x,y-1.0,z));
    float m3 = hash(vec3(x,y-1.0,z+1.0));
    float m4 = hash(vec3(x,y,z-1.0));
    float m5 = hash(vec3(x,y,z));
    float m6 = hash(vec3(x,y-1.0,z+1.0));
    float m7 = hash(vec3(x,y+1.0,z-1.0));
    float m8 = hash(vec3(x,y+1.0,z));
    float m9 = hash(vec3(x,y+1.0,z+1.0));
    
    //right
    float r1 = hash(vec3(x+1.0,y-1.0,z-1.0));
    float r2 = hash(vec3(x+1.0,y-1.0,z));
    float r3 = hash(vec3(x+1.0,y-1.0,z+1.0));
    float r4 = hash(vec3(x+1.0,y,z-1.0));
    float r5 = hash(vec3(x+1.0,y,z));
    float r6 = hash(vec3(x+1.0,y-1.0,z+1.0));
    float r7 = hash(vec3(x+1.0,y+1.0,z-1.0));
    float r8 = hash(vec3(x+1.0,y+1.0,z));
    float r9 = hash(vec3(x+1.0,y+1.0,z+1.0));
    
    
    //not including center point
    float total =      (l1) + (l2) + (l3)
                    +  (l4) + (l5) + (l6)
                    +  (l7) + (l8) + (l9)
        
                    +  (m1) + (m2) + (m3)
                    +  (m4) + (m6)
                    +  (m7) + (m8) + (m9)
 
                    +  (r1) + (r2) + (r3)
                    +  (r4) + (r5) + (r6)
                    +  (r7) + (r8) + (r9);
        
    float totalAvg = total / 27.0 * 0.25; //0.25 influence
     
    return totalAvg + m5 * 0.5; //0.5 original point influence
}

float lerp(float a, float b, float t) {
    return a * (1.0 - t) + b * t;
}

float cos_interpolation(float a, float b, float t) {
    float cos_t = (1.0 - cos(t * 3.141592653589793238462643383279)) * 0.5;
    return lerp(a, b, cos_t);
}

float interpolate_noise(float x, float y, float z) {
    
    vec3 v1 = vec3(floor(x), floor(y), floor(z));
    vec3 v2 = vec3(floor(x), floor(y), ceil(z));
    vec3 v3 = vec3(floor(x), ceil(y), floor(z));
    vec3 v4 = vec3(floor(x), ceil(y), ceil(z));
    
    vec3 v5 = vec3(ceil(x), floor(y), floor(z));
    vec3 v6 = vec3(ceil(x), floor(y), ceil(z));
    vec3 v7 = vec3(ceil(x), ceil(y), floor(z));
    vec3 v8 = vec3(ceil(x), ceil(y), ceil(z));
    
    
    float x1, x2, y1, y2;
    
    x1 = cos_interpolation(smoothing(v1.x,v1.y,v1.z),
                smoothing(v2.x,v2.y,v2.z),     
                z - floor(z));                      
    x2 = cos_interpolation(smoothing(v3.x,v3.y,v3.z),
                smoothing(v4.x,v4.y,v4.z),     
                z - floor(z)); 
    
    y1 = cos_interpolation(x1, x2, y - floor(y));

    x1 = cos_interpolation(smoothing(v5.x, v5.y, v5.z),
                smoothing(v6.x, v6.y, v6.z),     
                z - floor(z));                      
    x2 = cos_interpolation(smoothing(v7.x, v7.y, v7.z),
                smoothing(v8.x,v8.y,v8.z),     
                z - floor(z)); 
    
    y2 = cos_interpolation(x1, x2, y - floor(y));
    
    return cos_interpolation(y1, y2, x - floor(x));
}

float perlin_noise(float x, float y, float z) {
    
    float total = 0.0;
    float persistence = 1.5;
      
    float j = 0.0;
    for (int i = 0; i < 5; i++) {
        float frequency = pow(2.0,j);
        float amplitude = pow(persistence, j);
        
        total += interpolate_noise(x * frequency, y * frequency, z  * frequency) * amplitude;
            
        j = j + 1.0;
    }
    
    return total;
}

float map (float v, float range1, float range1end, float range2, float range2end) 
{
    return (v - range1) / (range1end - range1) * (range2end - range2) + range2;
}



void main()
{     
    vec3 pos = inPos.xyz; 
    //pos = vec3(inPos.xy, 1000.0);
    vec3 vel = inVel.xyz; 
    vec3 acc = inAcc.xyz;
    vec3 objPos = inObjPos.xyz;
    vec3 mousePos = u_mouse.xyz;
    float mouseClicked = u_mouseClicked;
    float mass = inMass;
    
    vec3 desired = objPos - pos;
    float dist = length(desired);

    if (dist < u_forceRadius) {
        
        if (mouseClicked == 1.0) {
            desired = mousePos - pos;
        } else if (mouseClicked == 2.0) {
            desired = pos - mousePos; 
        }
    }
    dist = length(desired);
    
    desired = normalize(desired);
    
    float maxSpeed = u_particleSpeed;
    
    //if particle is close to goal position map velocity to smaller range
    //depending on how close the particle is to goal position.
    if (dist < 3.0) {
        
        float m = map(dist, 0.0, 3.0, 0.0, maxSpeed);
        desired *= m;
    } else {
        desired *= maxSpeed;
    }
    
    vec3 steer = desired-vel;
    steer /= mass;
    steer = min(steer, vec3(maxSpeed,maxSpeed,maxSpeed));
    
    acc = steer;
    vel += acc; 
    
    vec4 pos2 = vec4(pos.xyz+vel.xyz,1.0); 
    
    //Noise
    vec4 offset = vec4(vel,1.0) + u_time/100.0;
    pos2 = pos2 + (perlin_noise(offset.x, offset.y, offset.z) * vec4(pos,1) / 1000.0 * u_particleNoise) * 1.0;
    
    //reset particle position if new position is too far.
    if (length(pos2) > 200.0) {
        //pos2 = vec4(pos.xyz-vel.xyz,1.0);
        pos2 = vec4(0.,0.,0.,1.);
    }
    
    outPos = pos2;
    outVel = vec4(vel.x, vel.y,vel.z,1.0);
    outAcc = vec4(acc.x, acc.y,acc.z,1.0);
    outMass = mass;
}

