Shader "Show Insides" {
	SubShader{

		Tags{ "RenderType" = "Opaque" }

		Cull Front

		CGPROGRAM

#pragma surface surf Lambert vertex:vert

		void vert(inout appdata_full v)
	{
		v.normal.xyz = v.normal * -1;
	}

	struct Input {
		float4 color : COLOR;
	};

	void surf(Input IN, inout SurfaceOutput o) {
		o.Albedo = fixed3(0.04, 0.04, 0.04);
	}

	ENDCG

	}

		Fallback "Diffuse"

}