#version 330

uniform vec4 Color;
//uniform sampler2D MainTexture;

//in vec2 uv;
in vec4 normal;

out vec4 out_Col;

void main()
{
    //vec4 tex = texture(MainTexture, uv);
    out_Col = vec4(normal.xyz * .5 + vec3(.5), 1.0);// tex * Color;

	//vec3 p = normal.xyz / normal.w;
	//p.xy = p.xy * .5 + .5;
	

	//out_Col = vec4(p.z);

	//out_Col = vec4(normal.y);
}
