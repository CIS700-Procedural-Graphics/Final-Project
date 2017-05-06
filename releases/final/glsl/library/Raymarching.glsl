// This file includes the main raymarching code, reused in all shaders.
// The shader assumes a constant material.
// It has the main function, and assumes the existence of certain functions, such as 

// Conservative depth testing
//layout (depth_greater) out float gl_FragDepth;

#ifdef CUSTOM_BACKGROUND
vec3 sceneBackground();
#endif

#ifdef ENABLE_ALPHA
// - If the shader needs alpha blending, it can return it through here
float shadeAlpha(vec3 point);
#endif

#ifdef VOLUMETRIC
// - rgb is the accumulated color, alpha is the actual density
vec4 density(vec3 point);
#endif

#ifdef REFLECTIONS
// - sceneReflections: the raymarched sdf for reflections, which can be different than the object's sdf
float sceneReflections(vec3 point);

// - shadeReflections:  the output color of the reflected scene
vec3 shadeReflections(vec3 point, vec3 normal, vec3 rayOrigin, vec3 rayDirection, float t);
#endif

// - shade:  the output color
vec3 shade(vec3 point, vec3 normal, vec3 rayOrigin, vec3 rayDirection, float t);

// - scene: the raymarched sdf.
float scene(vec3 point);

#define saturate(x) clamp(x, 0.0, 1.0)

// Reference: https://github.com/stackgl/glsl-smooth-min
float smin(float a, float b, float k) 
{
  float res = exp(-k * a) + exp(-k * b);
  return -log(res) / k;
}

// Reference: http://www.iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d)
{
    return saturate(a + b * cos(6.28318 * ( c * t + d)));
}

float sdCappedCylinder( vec3 p, vec2 h)
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

vec3 debugIterations(float factor)
{
	vec3 a = vec3(0.478, 0.500, 0.500);
	vec3 b = vec3(0.500);
	vec3 c = vec3(0.688, 0.748, 0.748);
	vec3 d = vec3(0.318, 0.588, 0.908);

	return palette(factor, a, b, c, d);
}

vec3 estimateSceneGradient(vec3 point, float epsilon)
{
	vec3 e = vec3(epsilon, -epsilon, 0);

	float x = scene(vec3(point.x + epsilon, point.y, point.z));
	x -= scene(vec3(point.x - epsilon, point.y, point.z));

	float y = scene(vec3(point.x, point.y + epsilon, point.z));
	y -= scene(vec3(point.x, point.y - epsilon, point.z));

	float z = scene(vec3(point.x, point.y, point.z + epsilon));
	z -= scene(vec3(point.x, point.y, point.z - epsilon));

	return normalize(vec3(x,y,z));
}

// TODO: Reintroduce
#ifdef TEMPORAL_REPROJECTION
uniform sampler2D FeedbackBuffer;

// Temporal reprojection
float SamplePreviousFrame(vec2 uv)
{
	float d = min(texture2D(FeedbackBuffer, uv).r, textureLod(FeedbackBuffer, uv, 3).r);	
	return d;
}
#endif

uniform mat4 Model;
uniform mat4 ModelInv;
uniform mat4 ModelInvTr;

uniform vec4 CameraPosition;
uniform vec4 CameraParameters;

struct VertexData
{
	vec3 localVertexPosition;
	vec3 localCameraPosition;
};

in VertexData vertexData;

layout(location = 0) out vec4 out_Col;

#ifdef REFLECTIONS

vec3 estimateSceneGradientReflections(vec3 point, float epsilon)
{
	vec3 e = vec3(epsilon, -epsilon, 0);

	float x = sceneReflections(vec3(point.x + epsilon, point.y, point.z));
	x -= sceneReflections(vec3(point.x - epsilon, point.y, point.z));

	float y = sceneReflections(vec3(point.x, point.y + epsilon, point.z));
	y -= sceneReflections(vec3(point.x, point.y - epsilon, point.z));

	float z = sceneReflections(vec3(point.x, point.y, point.z + epsilon));
	z -= sceneReflections(vec3(point.x, point.y, point.z - epsilon));

	return normalize(vec3(x,y,z));
}

// Note: Reflections are calculated in world space
vec3 reflections(vec3 origin, vec3 direction, float initialOffset)
{
	vec3 rayOrigin = origin;
	vec3 rayDir = direction;
    float t = initialOffset;
		
    vec3 color = vec3(0.0);
    vec3 current = rayOrigin + rayDir * t;

	float d = CameraParameters.y;
	bool hit = false;

#ifdef DEBUG_REFLECTIONS
    float iterationCount = 0.0;
#endif

	for(int j = 0; j < REFLECTION_ITERATIONS; j++)
	{
		d = sceneReflections(current);
		t += d;
		current += rayDir * d;

		if(d < REFLECTION_EPSILON)
		{
			hit = true;
			break;
		}

#ifdef DEBUG_REFLECTIONS
		iterationCount += 1.0;
#endif
	}

	if(hit)
	{
	#ifdef DEBUG_REFLECTIONS
		color  = debugIterations(iterationCount / float(MAX_ITERATIONS));
	#else
		vec3 normal = estimateSceneGradientReflections(current, NORMAL_ESTIMATION_EPSILON);
		color = shadeReflections(current, normal, rayOrigin, rayDir, t);
	#endif
		return color;
	}

#ifdef CUSTOM_BACKGROUND
	return sceneBackground();
#else
	return vec3(1.0);
#endif
}
#endif

#ifdef SHADOWS
// Reference: http://www.iquilezles.org/www/articles/rmshadows/rmshadows.htm
float shadows(vec3 origin, vec3 lightPosition)
{
	origin = (ModelInv * vec4(origin.xyz, 1.0)).xyz;
	lightPosition = (ModelInv * vec4(lightPosition.xyz, 1.0)).xyz;
	
	vec3 direction = lightPosition - origin;
	float maxDistance = length(direction);
	direction /= maxDistance;

    float t = SHADOW_OFFSET;
    float soft = .5;

	for(int i = 0; i < SHADOW_ITERATIONS; i++)
	{
		float d = min(scene(origin + direction * t), maxDistance) * SHADOW_BIAS;

		soft = min(soft, SHADOW_SOFT_FACTOR * (d / t));
		t += d;

		if(d < SHADOW_EPSILON)
			break;
	}

	soft = clamp(soft * 2.0, 0.0, 1.0);

	// This is a mix of soft shadows and a fake AO
	return soft;// + clamp(t * .1, 0.0, 1.0) * (1.0 - soft);
}
#endif

#ifdef VOLUMETRIC
void main()
{
	vec3 rayOrigin = vertexData.localCameraPosition;
	vec3 toCamera = vertexData.localVertexPosition - rayOrigin;
	vec3 rayDir = normalize(toCamera);

	vec4 color = vec4(0.0);
	float t = length(toCamera);

	for(int i = 0; i < MAX_ITERATIONS; i++ )
	{
		if(color.a > 0.99)
			break;
		
		vec3 p = rayOrigin + t * rayDir;
		vec4 col = density(p);
		col.rgb *= col.a;

		color += col * (1.0 - color.a);	
		t += 0.05;
	}

	out_Col = color;
}
#else
void main()
{
	vec3 rayOrigin = vertexData.localCameraPosition;
	vec3 toCamera = vertexData.localVertexPosition - rayOrigin;
	vec3 rayDir = normalize(toCamera);
	float depth = length(toCamera);
		
    vec3 color = vec3(0.0);
    vec3 current = rayOrigin + rayDir * depth;

    float t = depth;
	float d = CameraParameters.y;

	bool hit = false;

#ifdef DEBUG
    float iterationCount = 0.0;
#endif

	for(int j = 0; j < MAX_ITERATIONS; j++)
	{
		d = scene(current);

		if(d < EPSILON)
		{
			hit = true;
			break;
		}

		t += d;
		current += rayDir * d;

#ifdef DEBUG
		iterationCount += 1.0;
#endif
	}

	if(hit)
	{
		// More details in intersections (similar to a discontinuity reduction)
		// This GREATLY improves, for example, the gradient estimation for 
		// big discontinuities such as box edges
		for(int k = 0; k < SECONDARY_ITERATIONS; k++)
		{
			d = scene(current);
	

			if(d <= 0)
				break;
			t += d;
			current += rayDir * d;
		}

#ifdef DEBUG
		vec3 debugColor = debugIterations(iterationCount / float(MAX_ITERATIONS));
		out_Col = vec4(debugColor, 1.0);
#else
		// Local normal
		vec3 normal = estimateSceneGradient(current, NORMAL_ESTIMATION_EPSILON);

		// Transform into world space again
		current = (Model * vec4(current, 1.0)).xyz;
		t = length(CameraPosition.xyz - current);
		normal = normalize((ModelInvTr * vec4(normal, 0.0)).xyz);

		color = shade(current, normal, CameraPosition.xyz, normalize(current - CameraPosition.xyz), t);

		// Gamma correction: TODO: Check if projector destroys gamma
		color = pow(color, vec3(.45454));

#ifdef ENABLE_ALPHA
		float alpha = shadeAlpha(current);
		out_Col = vec4(color, alpha);
#else
		out_Col = vec4(color, 1.0);
#endif

#endif
	}
	else
	{
		// Make fragment far clip
		t = CameraParameters.y;
	}

	gl_FragDepth = (t - CameraParameters.x) / (CameraParameters.y - CameraParameters.x);
}
#endif