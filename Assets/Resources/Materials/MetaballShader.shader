Shader "Unlit/WorldSpaceNormals"
{
	Properties
	{

	_InfluencePoint ("Influence Point", Vector) = (0,0,0)
	_DTime ("Time", Float) = 0.0

	}

	SubShader
	{
		Pass
	{
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
				// include file that contains UnityObjectToWorldNormal helper function
		#include "UnityCG.cginc"

	struct v2f {
		// we'll output world space normal as one of regular ("texcoord") interpolators
		half3 worldNormal : TEXCOORD1;
		int isDisplaced : TEXCOORD2;
		fixed4 noiseCol : COLOR;
		float4 pos : SV_POSITION;
	};
	
	float4 _InfluencePoint;
	float _DTime;

	struct appdata {
		float4 vertex : POSITION;
		float4 texcoord : TEXCOORD0;
		float3 normal: NORMAL;
	};

	float rand(float3 co) {
		return frac(sin(dot(co.xyz, float3(12.9898, 78.233, 45.5432))) * 43758.5453);
	}

	float cosine_interpolate(float a, float b, float t) {
		float cos_t = (1.0 - cos(t * 3.14159265359)) * 0.5;
		return lerp(a, b, cos_t);
	}

	float noise1(float3 seed) {
		return frac(sin(dot(seed, float3(12.9898, 78.233, 157.179))) * 43758.5453);
	}

	float bilinearInterpolation(float3 pos, float frequency, float amplitude) {

		float3 pd = pos * frequency;

		//4 adjacent vec2 positions on plane
		float3 v00 = float3(floor(pd.x), floor(pd.y), 0.0);
		float3 v01 = float3(floor(pd.x), ceil(pd.y), 0.0);
		float3 v10 = float3(ceil(pd.x), floor(pd.y), 0.0);
		float3 v11 = float3(ceil(pd.x), ceil(pd.y), 0.0);

		//noise of cooresponding positions on lattice
		float n00 = noise1(v00 * (frequency)) * amplitude;
		float n01 = noise1(v01 * (frequency)) * amplitude;
		float n10 = noise1(v10 * (frequency)) * amplitude;
		float n11 = noise1(v11 * (frequency)) * amplitude;

		//time val for interpolation
		float tX = pd.x - floor(pd.x);
		float tY = pd.y - floor(pd.y);

		float nx0 = cosine_interpolate(n00, n10, tX);
		float nx1 = cosine_interpolate(n01, n11, tX);
		float n = cosine_interpolate(nx0, nx1, tY);

		return n;
	}

	float perlinNoise(float3 pos, float frequencyControl) {
		int numOctaves = 5;
		float total = 0.0;
		float persistance = 1.0 / 2.0;

		for (int i = 0; i < numOctaves; i++) {

			float frequency = pow(2.0, i) * frequencyControl;
			float amplitude = pow(persistance, i);
			total += bilinearInterpolation(pos, frequency, amplitude);
		}

		return total;

	}

	// vertex shader: takes object space normal as input too
	v2f vert(appdata v)
	{

		v2f o;
		o.isDisplaced = 0;

		float dist = distance(_InfluencePoint, v.vertex);
		if (dist < 1.03f) {
			//o.pos = UnityObjectToClipPos(_InfluencePoint);
			o.pos = UnityObjectToClipPos(v.vertex - normalize(_InfluencePoint - v.vertex)*0.25);
			o.isDisplaced = 1;


		}
		else {
			o.pos = UnityObjectToClipPos(v.vertex);
		}
		o.worldNormal = UnityObjectToWorldNormal(v.normal);
		return o;
	}

	fixed4 frag(v2f i) : SV_Target
	{
		fixed4 c = 0;

		c.rgb = i.worldNormal*0.5 + 0.5;

	if (i.isDisplaced != 0) {
		////float noiseVal = rand(i.uv);
		//float3 pos = float3(i.objPos.x, i.objPos.y, i.objPos.z);
		//float noiseVal2 = 1.0 - perlinNoise(i.pos,1);
		//c.rgb = fixed4(i.objPos.y, i.objPos.y, i.objPos.y, 1.0);
		////c.rgb = fixed4 (1.0, 0.0, 0.0, 1.0);
		////float stripes = sin((i.pos.x +i.pos.y) * (100 + 1* sin(_Time * 10)));
		////if (stripes < 0) {
		////	c.rgb = fixed4(0.0, 0.0, 0.0, 1.0);
		////}
		float noiseVal = 1.0 - perlinNoise(i.pos + _DTime*10.0, 0.1 * sin(_DTime * 7));
		return fixed4(noiseVal * c.b * 2, noiseVal * c.g * 2, noiseVal * c.r * 2, 1);
		//return i.noiseCol;
	}

	i.isDisplaced = 0;
	return c;

	}

		ENDCG
	}


	}
}