#version 150

uniform sampler2D SourceTexture;
uniform float Time;

in vec2 uv;

out vec4 out_Col;

void main()
{
    vec4 tex = textureLod(SourceTexture, uv, 0);
    out_Col = tex;
}
