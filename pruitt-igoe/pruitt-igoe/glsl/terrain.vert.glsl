#version 330
#define FAR_CLIP 1000.0

struct VertexData
{
	vec2 uv;
	vec4 ndc;
	vec3 rayDir;
	vec3 rayPos;
};

in vec4 vertexPosition;
in vec2 vertexUV;

out VertexData vertexData;

uniform mat4 InvViewProjection;
uniform vec4 CameraPosition;

uniform mat4 Model;
uniform mat4 ViewProj;

void main() 
{
    vertexData.ndc = vec4(vertexPosition.x, vertexPosition.y, 1.0, 1.0) * FAR_CLIP;
    vertexData.uv = vertexUV;

    vertexData.rayDir = normalize((InvViewProjection * vertexData.ndc).xyz - CameraPosition.xyz);
    vertexData.rayPos = CameraPosition.xyz;

    gl_Position = vec4(vertexPosition.x, vertexPosition.y, .25, 1.0);
}