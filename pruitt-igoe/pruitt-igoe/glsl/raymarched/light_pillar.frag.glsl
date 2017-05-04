#version 450

#define MAX_ITERATIONS 20
#define SECONDARY_ITERATIONS 5
#define EPSILON .001
#define NORMAL_ESTIMATION_EPSILON .1

#define VOLUMETRIC

#include <Raymarching>

uniform sampler2D RandomTexture;
uniform float Time;

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	vec2 uv = x.xz + x.yx;
	vec3 rg = texture2D(RandomTexture, (uv + 0.5) / 512.0).rgb;
	return mix(rg.x, rg.y, rg.z);
}

// Both noise and fractal from iq's hell shadertoy: https://www.shadertoy.com/view/MdfGRX
float fractal(vec3 p)
{
	float f;
	vec3 q = p                          - vec3(1.0,1.0,0.0)*Time * 16.0;
    f  = 0.50000*noise( q ); q = q*2.02 - vec3(1.0,1.0,0.0)*Time * 32.0;
    f += 0.25000*noise( q ); q = q*2.03 - vec3(1.0,0.0,1.0)*Time * 64.0;
    f += 0.12500*noise( q ); q = q*2.01 - vec3(1.0,1.0,0.0)*Time * 128.0;
    f += 0.06250*noise( q ); q = q*2.02 - vec3(1.0,1.0,1.0)*Time;
    f += 0.03125*noise( q );

	return f;
}

vec4 density(vec3 point)
{
	point.xz += sin(point.y * 20.0 + Time * 30.0) * .5 * saturate((100.0 - point.y) / 400.0) * .1;
	float l = length(point.xz) * 3.2;
	vec3 q = point;
	q.y *= 100.0;
	q.xz *= .4;

	float d = fractal(q) * saturate(1.0 - l);
	d *= step(-.1, point.y);
	vec3 color = vec3(.2, .85, .3) * (1.0 - l) * 10.0;
	return vec4(color, d * d);
}

float scene(vec3 point)
{
	//point.xz += sin(point.y * 20.0 + Time * 30.0) * .5 * saturate((100.0 - point.y) / 400.0);
	//point.xz += fractal(point) * 4.0;
	vec3 q = point;
	q.y *= 50.0;
	float d = sdCappedCylinder(point, vec2(fractal(q * 4.0) * .5, 1.0));
	return d;
}

vec3 shade(vec3 point, vec3 normal, vec3 rayOrigin, vec3 rayDirection, float t)
{
	vec3 light = vec3(35.0, 35.0, 50.0);
	vec3 l = light - point;

	float diffuse = clamp(dot(normal, normalize(l)), 0.0, 1.0) * .5 + .5;

	float falloff = 1500.0 / pow(length(l) + .001, 2.0);
	float rim = pow(dot(normal, -rayDirection), 10.0) + .25;

	return vec3(.2, .3, 1.0) * rim * 5.0; 
}