uniform vec3 bcolor;
uniform vec3 rcolor;

varying float noise;

vec3 v_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {
  vec3 color = v_lerp(bcolor, rcolor, noise);
  gl_FragColor = vec4(color, 1.0 );

}