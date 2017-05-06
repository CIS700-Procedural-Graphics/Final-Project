#version 330
#define FAR_CLIP 1000.0

struct VertexData
{
	vec3 localVertexPosition;
	vec3 localCameraPosition;
};

uniform vec4 CameraPosition;
uniform mat4 ModelViewProj;
uniform mat4 Model;
uniform mat4 ModelInv;

in vec4 vertexPosition;

out VertexData vertexData;

void main() 
{
	vertexData.localVertexPosition = vertexPosition.xyz;
	vertexData.localCameraPosition = (ModelInv * vec4(CameraPosition.xyz, 1.0)).xyz;
    gl_Position = ModelViewProj * vertexPosition;
}