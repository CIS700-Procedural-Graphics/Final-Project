uniform sampler2D spline_tex;

varying vec3 vNormal;
varying float vNoise;
varying vec2 vUV;
varying vec3 vPoint;

vec3 v_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {
 
  vec3 ncolor = v_lerp(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vNoise);
  float scale = texture2D(spline_tex, vUV).r;
  vec3 color = v_lerp(ncolor, vec3(1.0, 0.0, 0.0), scale);

  gl_FragColor = vec4( color.rgb, 1.0 );

}