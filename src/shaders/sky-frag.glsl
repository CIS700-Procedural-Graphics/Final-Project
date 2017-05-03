uniform sampler2D waterSampler;
varying vec2 vUv;
varying float noise;
varying vec3 fragPos;
varying vec3 vNormal;

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = vec4( 0.1, 0.5 * (1.0-fragPos.y/500.0), (1.0-fragPos.y/500.0), 1.0 );

  vec3 lightColor = vec3( 0.1, 0.1, fragPos.y );
  vec3 lightPos = vec3( 0.0,100.0,0.0 );
  vec3 lightDir = normalize(lightPos - fragPos);
  float diff = max(dot(vNormal, lightDir), 0.0);
  vec3 diffColor = diff * lightColor;
       diffColor += color.rgb;
       diffColor /= vec3(2.0,2.0,2.0);

  gl_FragColor = vec4( color.rgb, 1.0 );

}
