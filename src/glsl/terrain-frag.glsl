uniform sampler2D texture;

varying vec3 frag_normal;
varying vec3 frag_pos;
varying vec2 frag_uv;

void main() {

  vec4 color = vec4(frag_normal, 1.0);
  color = texture2D(texture, frag_uv);
  gl_FragColor = vec4(color.rgb, 1.0);

}
