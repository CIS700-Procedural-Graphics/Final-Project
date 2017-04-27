uniform sampler2D waterSampler;
varying vec2 vUv;
varying float noise;

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = vec4(0.97,0.97,0.97,1.0);//texture2D( waterSampler, uv );


  gl_FragColor = vec4( color.rgb, 1.0 );

}
