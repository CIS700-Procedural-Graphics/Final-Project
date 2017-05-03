varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying float v_elevation;
varying float v_moisture;

uniform int u_color;

// Grabbed from: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

vec3 getElevationColor(float elevation) {
  vec3 lo = vec3(0.000, 0.541, 0.898);
  vec3 hi = vec3(1.000, 1.000, 0.000);

  return (hi - lo) * ((elevation + 1.0) / 2.0) / 1.0 + lo;
}

vec3 getMoistureColor(float moisture) {
  vec3 lo = vec3(0.984, 0.635, 0.443);
  vec3 hi = vec3(0.313, 0.439, 1.000);

  return (hi - lo) * ((moisture + 1.0) / 2.0) / 1.0 + lo;
}

vec3 getBiomeColor(float elevation, float moisture) {
    if (elevation <= 0.00) return vec3(0.211, 0.207, 0.384);

    if (elevation <= 0.25) {
      if (moisture <= -0.66)  return vec3(0.325, 0.549, 0.435);
      if (moisture <= -0.33)  return vec3(0.325, 0.549, 0.435);
      if (moisture <= 0.00)   return vec3(0.431, 0.654, 0.372);
      if (moisture <= 0.33)   return vec3(0.431, 0.654, 0.372);
      if (moisture <= 0.66)   return vec3(0.596, 0.709, 0.427);
      if (moisture <= 1.00)      return vec3(0.913, 0.866, 0.776);
    }

    if (elevation <= 0.50) {
      if (moisture <= -0.66)  return vec3(0.376, 0.603, 0.435);
      if (moisture <= -0.33)  return vec3(0.701, 0.792, 0.658);
      if (moisture <= 0.00)   return vec3(0.701, 0.792, 0.658);
      if (moisture <= 0.33)   return vec3(0.596, 0.709, 0.427);
      if (moisture <= 0.66)   return vec3(0.596, 0.709, 0.427);
      if (moisture <= 1.00)   return vec3(0.803, 0.835, 0.650);
    }

    if (elevation <= 0.75) {
      if (moisture <= -0.66)  return vec3(0.800, 0.831, 0.729);
      if (moisture <= -0.33)  return vec3(0.800, 0.831, 0.729);
      if (moisture <= 0.00)   return vec3(0.768, 0.800, 0.729);
      if (moisture <= 0.33)   return vec3(0.768, 0.800, 0.729);
      if (moisture <= 0.66)   return vec3(0.803, 0.835, 0.650);
      if (moisture <= 1.00)   return vec3(0.803, 0.835, 0.650);
    }

    if (elevation <= 1.00) {
      if (moisture <= -0.66)  return vec3(0.972, 0.972, 0.972);
      if (moisture <= -0.33)  return vec3(0.972, 0.972, 0.972);
      if (moisture <= 0.00)   return vec3(0.972, 0.972, 0.972);
      if (moisture <= 0.33)   return vec3(0.866, 0.870, 0.725);
      if (moisture <= 0.66)   return vec3(0.733, 0.733, 0.733);
      if (moisture <= 1.00)   return vec3(0.835, 0.756, 0.600);
    }
}

vec3 getSmoothedBiomeColor(float elevation, float moisture) {
  float noise  = (cnoise(v_position.xy + vec2( 0.0,  0.0)) + 1.0) / 2.0;
  float noiseT = (cnoise(v_position.xy + vec2( 1.0,  0.0)) + 1.0) / 2.0;
  float noiseB = (cnoise(v_position.xy + vec2(-1.0,  0.0)) + 1.0) / 2.0;
  float noiseL = (cnoise(v_position.xy + vec2( 0.0, -1.0)) + 1.0) / 2.0;
  float noiseR = (cnoise(v_position.xy + vec2( 0.0,  1.0)) + 1.0) / 2.0;

  return getBiomeColor(elevation, moisture);

}

void main() {
  vec3 c = (u_color == 0) ? getElevationColor(v_elevation) :
           (u_color == 1) ? getMoistureColor(v_moisture) :
           (u_color == 2) ? getSmoothedBiomeColor(v_elevation, v_moisture) :
                            vec3(0, 0, 0);

  gl_FragColor = vec4(c, 1.0);
}