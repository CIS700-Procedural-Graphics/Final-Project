Shader "Unlit/WorldSpaceNormals"
{
	Properties
	{

	_InfluencePoint ("Influence Point", Vector) = (0,0,0)
	_Time ("Time", Float) = 0.0

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
		half3 worldNormal : TEXCOORD0;
		int isDisplaced : TEXCOORD1;
		float4 pos : SV_POSITION;
	};

	float4 _InfluencePoint;

	// vertex shader: takes object space normal as input too
	v2f vert(float4 vertex : POSITION, float3 normal : NORMAL)
	{

		v2f o;
		o.isDisplaced = 0;
		float dist = distance(_InfluencePoint, vertex);
		if (dist < 1.05) {
			//o.pos = UnityObjectToClipPos(_InfluencePoint);
			o.pos = UnityObjectToClipPos(vertex - normalize(_InfluencePoint - vertex));
			o.isDisplaced = 1;
		}
		else {
			o.pos = UnityObjectToClipPos(vertex);
		}
		o.worldNormal = UnityObjectToWorldNormal(normal);
		return o;
	}

	fixed4 frag(v2f i) : SV_Target
	{
		fixed4 c = 0;
	// normal is a 3D vector with xyz components; in -1..1
	// range. To display it as color, bring the range into 0..1
	// and put into red, green, blue components
	c.rgb = i.worldNormal*0.5 + 0.5;
	if (i.isDisplaced != 0) {
		c.rgb = fixed4 (1.0, 0.0, 0.0, 1.0);
		float stripes = sin((i.pos.x +i.pos.y) * (100 + 1* sin(_Time * 10)));
		if (stripes < 0) {
			c.rgb = fixed4(0.0, 0.0, 0.0, 1.0);
		}
		i.isDisplaced = 0;
	}
	return c;
	}
		ENDCG
	}
	}
}