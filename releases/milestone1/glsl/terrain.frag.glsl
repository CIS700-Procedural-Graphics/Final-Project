#version 330

#define FAR_CLIP 1000.0
#define MAX_ITERATIONS 5
#define SECONDARY_ITERATIONS 5
#define EPSILON .01

#define NORMAL_ESTIMATION_EPSILON 1.4 // TODO: this is dependent on the texture texel size

#define saturate(x) clamp(x, 0.0, 1.0)

#define COHERENCE

struct Ray {
	vec3 position;
	vec3 direction;
};

struct VertexData
{
	vec2 uv;
	vec4 ndc;
	vec3 rayDir;
	vec3 rayPos;
};

uniform float u_debug;
uniform float Time;

uniform sampler2D Heightfield;
uniform vec4 Heightfield_Size;

uniform sampler2D FeedbackBuffer;

in VertexData vertexData;

layout(location = 0) out vec4 out_Col;

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

Ray getRay(vec3 origin, vec3 dir)
{
	Ray ray;
	ray.position = origin;
	ray.direction = dir;
	return ray;
}

float terrainSDF(vec3 point)
{
	float h = texture2D(Heightfield, point.xz * .005).r * 30.0;
	float d = (point.y - h);

	d = min(d, sdCappedCylinder(point - vec3(35.0, 35.0, 50.0), vec2(1.0, 300.0)));

	return d;
}

// Assumes minDistance was initialized to FAR_CLIP
void evaluateSceneSDF(vec3 point, out float minDistance, out float hitMaterial)
{	
	hitMaterial = 0.0;
	minDistance = FAR_CLIP;

	minDistance = min(minDistance, terrainSDF(point));

	//float farBackground = farBackgroundSDF(point);
	//minDistance = min(minDistance, farBackground);
	//hitMaterial = mix(hitMaterial, 0.0, step(abs(farBackground - minDistance), .001));
}

// This method is useful for just the distance
float evaluateSceneSDFSimple(vec3 point)
{
	float minDistance = FAR_CLIP;
	minDistance = min(minDistance, terrainSDF(point));
	return minDistance;	
}

vec3 estimateSceneGradient(vec3 point, float epsilon)
{
	vec3 e = vec3(epsilon, -epsilon, 0);
	float x = evaluateSceneSDFSimple(vec3(point.x + epsilon, point.y, point.z));
	x -= evaluateSceneSDFSimple(vec3(point.x - epsilon, point.y, point.z));

	float y = evaluateSceneSDFSimple(vec3(point.x, point.y + epsilon, point.z));
	y -= evaluateSceneSDFSimple(vec3(point.x, point.y - epsilon, point.z));

	float z = evaluateSceneSDFSimple(vec3(point.x, point.y, point.z + epsilon));
	z -= evaluateSceneSDFSimple(vec3(point.x, point.y, point.z - epsilon));

	return normalize(vec3(x,y,z));
}

vec3 shade(vec3 point, Ray ray, float t)
{
	vec3 normal = estimateSceneGradient(point, NORMAL_ESTIMATION_EPSILON );

	vec3 light = vec3(35.0, 35.0, 50.0);
	vec3 l = light - point;

	float diffuse = clamp(dot(normal, normalize(l)), 0.0, 1.0) * .5 + .5;

	float falloff = 500.0 / pow(length(l) + .001, 2.0);
	//float shadow = clamp(evaluateShadows(point + normal * SHADOW_OFFSET, l) + .15, 0.0, 1.0);

	//float ao = evaluateAmbientOcclusion(point, normal);

	return vec3(diffuse * falloff);
}

float SamplePreviousFrame(vec2 uv)
{
	float d = min(texture2D(FeedbackBuffer, uv).r, textureLod(FeedbackBuffer, uv, 3).r);	
	return d;
}

void main()
{
	// Renormalize due to interpolation
	Ray ray = getRay(vertexData.rayPos, normalize(vertexData.rayDir));

    vec3 color;
    vec3 current = ray.position;

    float t = 0.0;
	float d = FAR_CLIP;
    float iterationCount = 0.0;
    float hitMaterial = 0.0;
	float bias = 1.f;

#ifdef COHERENCE
	float previousFrame = SamplePreviousFrame(vertexData.uv);
	t = previousFrame * 200.f * .95;
	current += ray.direction * t;	
#endif

	//if(evaluateSceneSDFSimple(current) < .1)
	//{
	//	float rollback = .15;
	//	current -= ray.direction * t * rollback;
	//	t *= 1.0 - rollback;
	//}

	for(int j = 0; j < MAX_ITERATIONS; j++)
	{
		evaluateSceneSDF(current, d, hitMaterial);

		if(d < EPSILON)
			break;

		d = clamp(d, .001, .01);

		t += d;
		current += ray.direction * d;
		iterationCount += 1.0;

		if(t >= FAR_CLIP)
			break;
	}

	float shadeDistance = t * .975;
	current = ray.position + ray.direction * shadeDistance;	

	// More details in intersections (similar to a discontinuity reduction)
	// This GREATLY improves, for example, the gradient estimation for 
	// big discontinuities such as box edges
	for(int k = 0; k < SECONDARY_ITERATIONS; k++)
	{
		if(t >= FAR_CLIP)
			break;

		shadeDistance = evaluateSceneSDFSimple(current);
	
		if(shadeDistance <= 0)
			break;

		t += shadeDistance;
		current += ray.direction * shadeDistance;
	}

	color = shade(current, ray, shadeDistance);

	// Gamma correction
	color = pow(color, vec3(.45454));
	
	t /= 200.f;

	out_Col = vec4(t,color);

}