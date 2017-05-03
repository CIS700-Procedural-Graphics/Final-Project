uniform sampler2D waterSampler;
varying vec2 vUv;
varying float noise;
varying vec3 fragPos;
varying vec3 vNormal;

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = vec4(0.8,0.8,0.95,1.0);//texture2D( waterSampler, uv );

  vec3 lightColor = vec3( 0.7, 0.7, 0.7 );
  vec3 lightPos = vec3( 0.0,100.0,0.0 );
  vec3 lightDir = normalize(lightPos - fragPos);
  float diff = max(dot(vNormal, lightDir), 0.0);
  vec3 diffColor = diff * lightColor;
       diffColor += color.rgb;
       diffColor /= vec3(2.0,2.0,2.0);


  gl_FragColor = vec4( diffColor.rgb, 1.0 );

}
