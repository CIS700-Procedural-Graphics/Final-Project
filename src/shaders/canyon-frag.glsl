varying vec3 vNormal;
varying float vNoise;
varying vec2 vUV;

vec3 v_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {
 

  vec3 ncolor = v_lerp(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vNoise);
  vec3 color = v_lerp(ncolor, vec3(1.0, 0.0, 0.0), vUV.x);

  gl_FragColor = vec4( color.rgb, 1.0 );

}