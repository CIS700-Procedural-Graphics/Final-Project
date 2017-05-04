#version 150

uniform vec4 Color;
uniform sampler2D MainTexture;

in vec2 uv;

out vec4 out_Col;

void main()
{
    vec4 tex = texture(MainTexture, uv);
    out_Col = tex * Color;
}
