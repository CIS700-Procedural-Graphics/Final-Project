#version 150

uniform sampler2D SourceTexture;

in vec2 uv;

out vec4 out_Col;

void main()
{
    vec4 tex = texture2D(SourceTexture, uv);
    out_Col = tex.yzwx;
}
