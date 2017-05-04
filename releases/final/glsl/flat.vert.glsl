#version 150

uniform mat4 ModelViewProj;

in vec4 vertexPosition;

void main()
{
    gl_Position = ModelViewProj * vertexPosition;
}
