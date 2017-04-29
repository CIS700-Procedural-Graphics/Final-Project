uniform sampler2D spline_tex;
uniform vec3 tip_color;
uniform vec3 base_color;

varying float vNoise;
varying vec2 vUV;



vec3 v_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {
 
  vec3 ncolor = v_lerp(vec3(0.0, 0.0, 0.0), tip_color, vNoise);
  float scale = texture2D(spline_tex, vUV).r;
  vec3 color = v_lerp(ncolor, base_color, scale);

  gl_FragColor = vec4( color.rgb, 1.0 );

}