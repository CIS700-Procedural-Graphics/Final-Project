#version 330

struct VertexData
{
	vec3 localVertexPosition;
	vec3 localCameraPosition;
};

uniform vec4 CameraPosition;
uniform mat4 ViewProj;
uniform mat4 Model;
uniform mat4 ModelInv;

in vec4 vertexPosition;
in vec4 vertexNormal;
in vec2 vertexUV;

out VertexData vertexData;

void main() 
{
	// Inflate the mesh
	vec4 p = Model * vertexPosition;
	p.y += 5.0f;
	p.xyz += vertexNormal.xyz * 3.0f;

	vertexData.localVertexPosition = (ModelInv * vec4(p.xyz, 1.0)).xyz;
	vertexData.localCameraPosition = (ModelInv * vec4(CameraPosition.xyz, 1.0)).xyz;

    gl_Position = ViewProj * p;
}