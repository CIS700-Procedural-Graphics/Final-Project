uniform sampler2D spline_tex;

varying vec3 vNormal;
varying vec2 vUV;
varying float vNoise;
varying vec3 vPoint;

float hash (float n)
{
	return fract( n * 17.0 * fract( n * 0.3183099));
}

float noised (vec3 x) 
{
	vec3 p = floor(x);
	vec3 w = fract(x);

	vec3 u = w*w*w*(w*(w*6.0 - 15.0)+10.0);
	vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

	float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash(n+0.0);
    float b = hash(n+1.0);
    float c = hash(n+317.0);
    float d = hash(n+318.0);
    float e = hash(n+157.0);
	float f = hash(n+158.0);
    float g = hash(n+474.0);
    float h = hash(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

void main() {
    vNoise = noised(position);
    vNormal = normal;
    vPoint = position;
    vUV =  uv;
    vec3 offset = vec3(0.0);
    float scale = 1.0 - texture2D(spline_tex, uv).r;
    if (scale > 0.5) offset = 10.0 * scale * (vNoise) * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position + offset, 1.0 );
}