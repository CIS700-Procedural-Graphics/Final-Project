#version 330

#define COHERENCE

uniform sampler2D SourceTexture;
uniform float Time;
uniform vec4 SourceTextureSize;

in vec2 uv;

out vec4 out_Col;

void main()
{

#ifdef COHERENCE
    vec4 tex = textureLod(SourceTexture, uv, 0);

	float d = tex.r;
	float d1;
	//int iterations = 2 + int(tex.b * 3.0);// + int(4.0 - smoothstep(0.0, 1.0, tex.b) * 3.0);
	for(int i = 1; i < 3; i++)
	{ 
		int lod = 0;
		vec3 pixelSize = vec3(i, -i, 0) * vec3(SourceTextureSize.z, SourceTextureSize.w, 0);

		// Cross
		d = min(d, textureLod(SourceTexture, uv + pixelSize.xz, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.yz, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.zx, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.zy, lod).r);

		// Corners
		d = min(d, textureLod(SourceTexture, uv + pixelSize.xx, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.xy, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.yy, lod).r);
		d = min(d, textureLod(SourceTexture, uv + pixelSize.yx, lod).r);

		if(i == 1)
			d1 = d;
	}

#else
	float d = 0.0;
#endif

    out_Col = vec4(d, 0, tex.b, 1.0);
}
