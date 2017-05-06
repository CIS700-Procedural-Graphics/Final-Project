#version 450

#define MAX_ITERATIONS 100
#define SECONDARY_ITERATIONS 3
#define EPSILON 1.0
#define NORMAL_ESTIMATION_EPSILON 1.2

// SHADOW PARAMETERS
#define SHADOW_ITERATIONS 100
#define SHADOW_SOFT_FACTOR 20.0
#define SHADOW_EPSILON 3.85
#define SHADOW_OFFSET 5.0
#define SHADOW_BIAS 1.75

#define SHADOWS
  
//#define DEBUG

#include <Raymarching>
 
uniform sampler2D Heightfield;
uniform sampler2D HeightfieldNormal;

uniform vec4 TerrainScale; // Scaling in the sdf to prevent transformation errors
uniform float Time;
 
float scene(vec3 point)
{
	vec2 uv = point.xz * TerrainScale.xz;
	float h = texture2D(Heightfield, uv).r;
	float d = (point.y - h);
	return d;
} 

vec3 shade(vec3 point, vec3 normal, vec3 rayOrigin, vec3 rayDirection, float t)
{ 
	vec2 uv = point.xz * TerrainScale.xz;
	float snow = saturate(smoothstep(.6, .65, normal.y) - step(-35.0, point.y));

	vec3 lightPosition = vec3(512.0, 50, 512.0);
	vec3 lightDirection = normalize(lightPosition - point);

	float cosTheta = dot(normal, lightDirection);
 
	float rim = pow(1.0 - dot(rayDirection, -normal), 3.0);
	float diffuse = pow(smoothstep(0.0, 1.0, cosTheta * .5 + .5), 3.0) * .25 + .25 + rim * .25;
	float ambient = .04f + rim * .0075 - saturate(-cosTheta) * .05;

	vec3 amb = vec3(.2, .5, .9);

	vec3 terrainColor = mix(vec3(.1, .1, .3), vec3(.95, .5, .1) * 1.2, snow);
	vec3 shadow = mix(vec3(.1, .35, .9), vec3(1.0), shadows(point - normal * 1.0, lightPosition));

	vec3 outColor = terrainColor * diffuse + amb * ambient;
	outColor = mix(outColor, amb * 1.5, saturate(-.15 + t / 400.0)) * shadow;

	float falloff = 5000.0 / pow(length(lightPosition - point) + .001, 2.0);

	float s = length(outColor) * falloff;
	return vec3(s * s * 4.0);
}