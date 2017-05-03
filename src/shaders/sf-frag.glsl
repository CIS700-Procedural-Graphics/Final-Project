varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;

void main() {
  gl_FragColor = vec4(normalize(f_position), 1.0);
}