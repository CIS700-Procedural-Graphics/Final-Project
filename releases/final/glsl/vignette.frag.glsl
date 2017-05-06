#version 150

uniform sampler2D Texture;
uniform float Time;
uniform float Fade;

in vec2 uv;

out vec4 out_Col;

void main()
{
    vec4 tex = texture2D(Texture, uv);
    out_Col = tex * 1.15 * Fade;
}
