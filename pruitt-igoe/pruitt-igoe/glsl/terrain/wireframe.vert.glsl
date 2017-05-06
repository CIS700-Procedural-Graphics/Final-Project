#version 150

uniform mat4 ViewProj;
uniform mat4 Model;

in vec4 vertexPosition;
in vec4 vertexNormal;

void main()
{
	vec4 p = Model * vertexPosition;
//	p.xyz += vertexNormal.xyz * 4.0f;

    gl_Position = ViewProj * p;
}
