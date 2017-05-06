uniform sampler2D waterSampler;
varying vec2 vUv;
varying float noise;

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = texture2D( waterSampler, uv );

  gl_FragColor = vec4( color.rgb, 1.0 );

}
