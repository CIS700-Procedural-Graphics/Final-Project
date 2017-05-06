#version 150

in vec4 vertexPosition;
in vec2 vertexUV;

out vec2 uv;

void main()
{
    uv = vertexUV;
    gl_Position = vec4(vertexPosition.x, vertexPosition.y, .5, 1.0);
}
