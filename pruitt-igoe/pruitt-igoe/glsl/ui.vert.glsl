#version 150

uniform mat4 Model;
uniform mat4 ViewProj;

in vec4 vertexPosition;
in vec2 vertexUV;

out vec2 uv;

void main()
{
    uv = vertexUV;
    gl_Position = ViewProj * Model * vertexPosition;
}
