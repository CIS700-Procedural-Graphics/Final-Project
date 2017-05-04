#version 150

uniform mat4 u_Model;
uniform mat4 u_ViewProj;

in vec4 vertexPosition;
in vec4 vertexColor;

out vec4 color;

void main()
{
    color = vertexPosition * .5 + vec4(.5);
    gl_Position = vec4(vertexPosition.x, vertexPosition.y, .5, 1.0);
}
