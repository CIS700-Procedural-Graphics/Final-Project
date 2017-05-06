#version 330

uniform mat4 Model;
uniform mat4 ViewProj;

in vec4 vertexPosition;
in vec2 vertexUV;

out vec2 uv;

void main()
{
    uv = vertexUV;
    gl_Position = vec4(vertexPosition.x, vertexPosition.y, .5, 1.0);
}
