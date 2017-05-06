#version 150

// Note:
// As for most of these assignments, this is not intended to be a very optimal approach to this algorithm,
// as I try to be as clear as possible for future reference
#define FAR_CLIP 1000.0
#define MAX_ITERATIONS 10
#define SECONDARY_ITERATIONS 3
#define EPSILON 0.005

#define NORMAL_ESTIMATION_EPSILON .0075

#define AO_ITERATIONS 4
#define AO_DELTA .133
#define AO_DECAY .8
#define AO_INTENSITY .3

// SHADOW PARAMETERS
#define SHADOW_ITERATIONS 18
#define SHADOW_SOFT_FACTOR 6.0
#define SHADOW_EPSILON 0.00
#define SHADOW_OFFSET .01

// Note: some of the functions are taken from mercury's HG_SDF
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
uniform sampler2D FeedbackBuffer;

in VertexData vertexData;

out vec4 out_Col;

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

vec3 debugIterations(float factor)
{
	vec3 a = vec3(0.478, 0.500, 0.500);
	vec3 b = vec3(0.500);
	vec3 c = vec3(0.688, 0.748, 0.748);
	vec3 d = vec3(0.318, 0.588, 0.908);

	return palette(factor, a, b, c, d);
}

// All SDFS from iq, http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
// But they are tweaked for their threejs equivalents
float sdSphere( vec3 p, float r )
{
	return length(p) - r;
}

float udBox(vec3 p, vec3 b)
{
	return length(max(abs(p) - b, 0.0));
}

// TODO: build a parabola mixed with a plane to solve the 
// grazing angle/boundary iteration problem
float sdPlane( vec3 p)
{
	return p.y;
}

float sdCappedCylinder( vec3 p, vec2 h)
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float pow8(float x)
{
	x *= x; // xˆ2
	x *= x; // xˆ4
	return x * x;
}

float length8(vec2 v)
{
	return pow(pow8(v.x) + pow8(v.y), .125);
}
// float wheelDistance(Point3 X, Point3 C, float r, float R) {
// return length8(Vector2(length(X.xz - C.xz) - r, X.y - C.y)) - R;
// }

float sdTorus82( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length8(q)-t.y;
}

float sdTorus( vec3 p)
{
  vec2 q = vec2(length(p.xz)-1.0,p.y);
  return length(q) - .2;
}

float sdHexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

float udRoundBox( vec3 p, vec3 b, float r )
{
	return length(max(abs(p) - b, 0.0)) - r;
}

float sdCappedCone( in vec3 p)
{
	p.y -= .25;
    vec2 q = vec2( length(p.xz), p.y );
    vec2 v = vec2(0.5773502691896258, -0.5773502691896258);
    vec2 w = v - q;
    vec2 vv = vec2( dot(v,v), v.x*v.x );
    vec2 qv = vec2( dot(v,w), v.x*w.x );
    vec2 d = max(qv,0.0) * qv / vv;
    return sqrt(max(dot(w,w) - max(d.x,d.y), .000000001) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

Ray getRay(vec3 origin, vec3 dir)
{
	Ray ray;
	ray.position = origin;
	ray.direction = dir;
	return ray;
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float opUnion( float d1, float d2 )
{
    return min(d1, d2);
}

vec3 opCheapBend( vec3 p, float magnitude)
{
    float c = cos(magnitude * p.y);
    float s = sin(magnitude * p.y);
    mat2  m = mat2(c, -s, s, c);
    vec3 q = vec3( m * p.xy, p.z);
    return q;
}

float repeatDimension(float x, float m, float extent)
{
	return mix(x, mod(x + m * .5, m) - m * .5, step(abs(x + m * .5), extent));
}

float backgroundSDF(vec3 point)
{
	float base = udBox(point + vec3(-5.0, 0.0, 40.0), vec3(100.0, 100.0, 2.5));
	base = max(base, -sdSphere(point + vec3(-5.0, 0.0, 40.0), 25.0));
	base = min(base, sdTorus82((point + vec3(-5.0, 0.0, 37.0)).xzy, vec2(25.0, 1.5)));

	return base;
}

float farBackgroundSDF(vec3 point)
{
	float base = udBox(point + vec3(-5.0, 0.0, 60.0), vec3(100.0, 100.0, 2.5));
	return base;
}

float singleTrackSDF(vec3 point)
{
	float base = udBox(point, vec3(20.0, .3, .3));
	base = min(base, udBox(point + vec3(0.0, .3, 0.0), vec3(50.0, .075, .5)));
	base = min(base, udBox(point + vec3(0.0, -.3, 0.0), vec3(50.0, .075, .5)));

	vec3 detailP = point + vec3(0.0, 0.0, -0.3);
	detailP.x = repeatDimension(detailP.x, 1.0, 50.0);
	base = min(base, udBox(detailP, vec3(.075, .3, .1)));

	detailP = point + vec3(0.5, .35, -.3);
	detailP.x = repeatDimension(detailP.x, 1.0, 50.0);
	base = min(base, sdSphere(detailP, .1));

	detailP = point + vec3(0.75, .35, .3);
	detailP.x = repeatDimension(detailP.x, 1.0, 50.0);
	base = min(base, sdSphere(detailP, .1));

	return base;
}

float clawSDF(vec3 point)
{
	float base = udBox(point, vec3(.65));

	base = min(base, udBox(point + vec3(0.0, 1.75, 0.0), vec3(.1, 2.5, .1)));

	point += vec3(0.0, 4.45, 0.0);
	base = min(base, udBox(point, vec3(.3, .3, .3)));

	base = min(base, sdCapsule(point, vec3(-2.0, -1.0, 0.0), vec3(2.0, -1.2, 0.0), 1.0));
	base = min(base, sdCappedCone((point - vec3(3.0, -1.2, 0.0)).yxz * .65));

	return base;
}

float tracksSDF(vec3 point)
{
	float base = singleTrackSDF(point - vec3(0.0, 6.0, -10.0));	

	// Neverending claws
	point.x = repeatDimension(point.x - mod(Time, 10.0), 10.0, 30.0);
	base = min(base, clawSDF(point - vec3(0.0, 6.0, -10.0)));
	return base;
}

float railingSDF(vec3 point)
{
	float base = udBox(point + vec3(0.0, 1.25, 0.75), vec3(20.0, .1, 2.5));

	base = min(base, udBox(point + vec3(0.0, 1.13, 2.85), vec3(20.0, .1, .2)));
	base = min(base, udBox(point + vec3(0.0, 1.13, -1.4), vec3(20.0, .1, .2)));

	base = min(base, udBox(point + vec3(0.0, 1.5, 0.75), vec3(20.0, .2, 2.25)));
	base = min(base, udBox(point + vec3(0.0, 1.8, 0.75), vec3(20.0, .1, 2.5)));


	// Railing bump map ;)
	vec3 bumpPoint = point + vec3(0.0, 1.15, 0.0);
	bumpPoint.z = repeatDimension(bumpPoint.z + .5, .5, 2.5);
	bumpPoint.x = repeatDimension(bumpPoint.x, .55, 20.0);
	base = smin(base, sdCapsule(bumpPoint, vec3(0.0, 0.0, 0.0), vec3(.1, 0.0, .1), .015), 30.0);

	bumpPoint = point + vec3(0.25, 1.15, 0.25);
	bumpPoint.z = repeatDimension(bumpPoint.z + .5, .5, 2.5);
	bumpPoint.x = repeatDimension(bumpPoint.x, .55, 20.0);
	base = smin(base, sdCapsule(bumpPoint, vec3(0.0, 0.0, 0.0), vec3(-.1, 0.0, .1), .015), 30.0);

	vec3 columnPoint = point + vec3(3.0, 1.25, -2.5);
	columnPoint.x = mix(columnPoint.x, mod(columnPoint.x + 5.0, 10.0) - 5.0, step(abs(columnPoint.x), 25.0));
	columnPoint.z = mix(columnPoint.z, mod(columnPoint.z + 5.0, 10.0) - 5.0, step(abs(columnPoint.z + 10.0), 10.0));

	float column = udBox(columnPoint, vec3(.35, 50.0, .35));
	column = min(column, udBox(columnPoint + vec3(.25, 0.0, 0.0), vec3(.1, 50.0, .5)));
	column = min(column, udBox(columnPoint + vec3(-.25, 0.0, 0.0), vec3(.1, 50.0, .5)));

	base = min(base, column);

	vec3 rep = vec3(1.0, 100.0, 10.0);

	vec3 screwPoint = (point + vec3(0.0, 1.05, -1.4)).xzy;
	screwPoint.x = repeatDimension(screwPoint.x, 1.0, 20.0);//  mod(screwPoint.x + .5, 1.0) - .5;
	float screws1 = sdHexPrism(screwPoint, vec2(.1));
	screwPoint.y += 4.25;
	float screws2 = sdHexPrism(screwPoint, vec2(.1));

	return min(min(base, screws1), screws2);
}

float minionBaseSDF(vec3 point)
{
	vec3 blendOffset = vec3(0.0, 1.5, 0.0);
	vec3 bendedPoint = opCheapBend(point - blendOffset, .15) + blendOffset;
	vec3 bendedPointSym = opCheapBend(point - blendOffset, -.15) + blendOffset;

	float base = sdCapsule(point, vec3(0.0, .5, .0), vec3(0.0, 3.5, 0.0), 1.15);

	float hand1 = sdCapsule(bendedPoint, vec3(1.15, 1.25, 0.0), vec3(2.25, .5, 0.0), .135);
	float hand2 = sdCapsule(bendedPointSym, vec3(-1.15, 1.25, 0.0), vec3(-2.25, .5, 0.0), .135);

	float foot1 = sdCapsule(point, vec3(0.45, -1.0, 0.0), vec3(0.35, 0.5, 0.0), .2);
	float foot2 = sdCapsule(point, vec3(-0.45, -1.0, 0.0), vec3(-0.35, 0.5, 0.0), .2);

	float dist = smin(base, hand1, 5.0);
	dist = smin(dist, hand2, 5.0);
	dist = smin(dist, foot1, 5.0);
	dist = smin(dist, foot2, 5.0);

	// Left Hand
	bendedPointSym.y -= .15;
	float handBase1 = sdCappedCylinder(bendedPointSym - vec3(1.6, -.45, 0.0), vec2(.2, .05));
	handBase1 = smin(handBase1, sdCappedCylinder(bendedPointSym - vec3(1.6, -.6, 0.0), vec2(.1, .15)), 7.5);

	// Base
	handBase1 = smin(handBase1, sdSphere(bendedPointSym - vec3(1.6, -.8, 0.0), .15), 10.0);

	// Fingers (note: cylinders would make it better.. but no time!)
	handBase1 = smin(handBase1, sdSphere(bendedPointSym - vec3(1.3, -1.0, -0.1), .135), 20.0);
	handBase1 = smin(handBase1, sdSphere(bendedPointSym - vec3(1.85, -1.0, -0.1), .135), 20.0);
	handBase1 = smin(handBase1, sdSphere(bendedPointSym - vec3(1.6, -1.15, -.05), .135), 20.0);

	dist = min(dist, handBase1);

	// Right Hand
	bendedPoint.y -= .15;
	float handBase2 = sdCappedCylinder(bendedPoint - vec3(-1.6, -.45, 0.0), vec2(.2, .05));
	handBase2 = smin(handBase2, sdCappedCylinder(bendedPoint - vec3(-1.6, -.6, 0.0), vec2(.1, .15)), 7.5);

	// Base
	handBase2 = smin(handBase2, sdSphere(bendedPoint - vec3(-1.6, -.8, 0.0), .15), 10.0);

	// Fingers
	handBase2 = smin(handBase2, sdSphere(bendedPoint - vec3(-1.3, -1.0, -0.1), .135), 20.0);
	handBase2 = smin(handBase2, sdSphere(bendedPoint - vec3(-1.85, -1.0, -0.1), .135), 20.0);
	handBase2 = smin(handBase2, sdSphere(bendedPoint - vec3(-1.6, -1.15, -.05), .135), 20.0);

	dist = min(dist, handBase2);

	vec3 glassPoint = point - vec3(0.0, 3.0, 1.15);	
	float glassBase = sdTorus82(glassPoint.xzy, vec2(.5, .1));

	float belt = sdTorus82(point - vec3(0.0, 3.0, 0.0), vec2(1.1, .125));
	belt = max(belt, -sdSphere(glassPoint, .5));
	glassBase = min(glassBase, belt);
	dist = min(dist, glassBase);

	dist = min(dist, sdSphere(glassPoint + vec3(0.0, 0.0, .35), .55));

	float mouth = sdEllipsoid(opCheapBend(point, .25) - vec3(0.8, 1.5, 1.15), vec3(.4, .1, 1.0));

	dist = max(dist, -mouth);

	return dist;
}

// Assumes minDistance was initialized to FAR_CLIP
// TODO: add material types
void evaluateSceneSDF(vec3 point, out float minDistance, out float hitMaterial)
{	
	hitMaterial = 0.0;
	minDistance = FAR_CLIP;

	float farBackground = farBackgroundSDF(point);
	minDistance = min(minDistance, farBackground);
	hitMaterial = mix(hitMaterial, 0.0, step(abs(farBackground - minDistance), .001));

	float minion = minionBaseSDF(point);
	minDistance = min(minDistance, minion);
	hitMaterial = mix(hitMaterial, 1.0, step(abs(minion - minDistance), .001));

	float railing = railingSDF(point);
	minDistance = min(minDistance, railing);
	hitMaterial = mix(hitMaterial, 2.0, step(abs(railing - minDistance), .001));

	float background = backgroundSDF(point);
	minDistance = min(minDistance, background);
	hitMaterial = mix(hitMaterial, 3.0, step(abs(background - minDistance), .001));
	
	float tracks = tracksSDF(point);
	minDistance = min(minDistance, tracks);
	hitMaterial = mix(hitMaterial, 4.0, step(abs(tracks - minDistance), .001));
}

// This method is useful for just the distance
float evaluateSceneSDFSimple(vec3 point)
{
	float minDistance = FAR_CLIP;
	minDistance = min(minDistance, minionBaseSDF(point));
	minDistance = min(minDistance, railingSDF(point));
	minDistance = min(minDistance, backgroundSDF(point));
	minDistance = min(minDistance, farBackgroundSDF(point));
	minDistance = min(minDistance, tracksSDF(point));
	return minDistance;	
}

vec3 estimateSceneGradient(vec3 point, float epsilon)
{
	float x = evaluateSceneSDFSimple(vec3(point.x + epsilon, point.y, point.z));
	x -= evaluateSceneSDFSimple(vec3(point.x - epsilon, point.y, point.z));

	float y = evaluateSceneSDFSimple(vec3(point.x, point.y + epsilon, point.z));
	y -= evaluateSceneSDFSimple(vec3(point.x, point.y - epsilon, point.z));

	float z = evaluateSceneSDFSimple(vec3(point.x, point.y, point.z + epsilon));
	z -= evaluateSceneSDFSimple(vec3(point.x, point.y, point.z - epsilon));

	return normalize(vec3(x,y,z));
}

// For reference, http://www.iquilezles.org/www/articles/rmshadows/rmshadows.htm
// with tweaks
float evaluateShadows(vec3 origin, vec3 toLight)
{
	vec3 direction = toLight;
	float maxDistance = length(direction);
	direction /= maxDistance;

    float t = SHADOW_EPSILON;
    float soft = .5;

    // WebGL doesnt like loops that cannot be easily unrolled
	for(int i = 0; i < SHADOW_ITERATIONS; i++)
	{
		float d = min(evaluateSceneSDFSimple(origin + direction * t), maxDistance);

		if(d < SHADOW_EPSILON)
			break;

		soft = min(soft, SHADOW_SOFT_FACTOR * (d / t));

		if(t >= maxDistance)
			break;

		t += d;
	}

	soft = clamp(soft * 2.0, 0.0, 1.0);

	// This is a mix of soft shadows and a fake AO
	return soft + clamp(t * .1, 0.0, 1.0) * (1.0 - soft);
}

float evaluateAmbientOcclusion(vec3 point, vec3 normal)
{
	float ao = 0.0;
	float delta = AO_DELTA;
	float decay = 1.0;

	for(int i = 0; i < AO_ITERATIONS; i++)
	{
		float d = float(i) * delta;
		decay *= AO_DECAY;
		ao += (d - evaluateSceneSDFSimple(point + normal * d)) / decay;
	}

	return clamp(1.0 - ao * AO_INTENSITY, 0.0, 1.0);
}

vec3 shade(vec3 point, Ray ray, float t, float material)
{
	vec3 normal = estimateSceneGradient(point, NORMAL_ESTIMATION_EPSILON );

	vec3 light = vec3(1.0, 5.0, 7.0);
	vec3 l = light - point;

	float diffuse = clamp(dot(normal, normalize(l)), 0.0, 1.0) * .5 + .5;

	float falloff = 40.0 / pow(length(l) + EPSILON, 2.0);
	float shadow = clamp(evaluateShadows(point + normal * SHADOW_OFFSET, l) + .15, 0.0, 1.0);

	float ao = evaluateAmbientOcclusion(point, normal);

	return vec3(diffuse * shadow * ao * falloff);
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
	vec4 previousFrame = texture2D(FeedbackBuffer, vertexData.uv);
	t += previousFrame.r * 100.f * .95f;
	current += ray.direction * t;
	bias += smoothstep(0.0, 1.0, previousFrame.b) * .125;
#endif

	for(int j = 0; j < MAX_ITERATIONS; j++)
	{
		evaluateSceneSDF(current, d, hitMaterial);

		if(d < EPSILON)
			break;

		d *= bias;

		t += d;
		current += ray.direction * d;
		iterationCount += 1.0;

		if(t >= FAR_CLIP)
			break;
	}

	// More details in intersections (similar to a discontinuity reduction)
	// This GREATLY improves, for example, the gradient estimation for 
	// big discontinuities such as box edges
	for(int k = 0; k < SECONDARY_ITERATIONS; k++)
	{
		if(t >= FAR_CLIP)
			break;

		d = evaluateSceneSDFSimple(current);
		
		if(d <= 0.0)
			break;

		t += d;
		current += ray.direction * d;
		//iterationCount += 1.0;
	}

	//color = shade(current, ray, t, hitMaterial);

	//// Gamma correction
	//color = pow(color, vec3(.45454));

	float normalizedIterations = iterationCount / float(MAX_ITERATIONS);
	vec3 debugColor = debugIterations(iterationCount / float(MAX_ITERATIONS + SECONDARY_ITERATIONS));
	//color = mix(color, debugColor, u_debug);

	t /= 100.f;

	out_Col = vec4(t,0,normalizedIterations, 1.0);
}