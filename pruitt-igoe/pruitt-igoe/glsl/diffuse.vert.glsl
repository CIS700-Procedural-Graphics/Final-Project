#version 330

uniform mat4 ModelViewProj;

in vec4 vertexPosition;
in vec4 vertexNormal;

//out vec2 uv;
out vec4 normal;

void main()
{
	normal = vertexNormal;
    gl_Position = ModelViewProj * vertexPosition;
}
