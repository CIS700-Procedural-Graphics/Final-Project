varying vec2 vUv;
varying float noise;
varying vec3 fragPos;
varying vec3 vNormal;

uniform sampler2D image;


void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = texture2D( image, uv );

  vec3 lightColor = vec3(0.5,0.2,0.7);
  vec3 lightPos = vec3( 0.0,7.0,10.0 );
  vec3 lightDir = normalize(lightPos - fragPos);
  float diff = max(dot(vNormal, lightDir), 0.0);
  vec3 diffColor = diff * lightColor;

  gl_FragColor = vec4( diffColor.x + noise / 5.0, diffColor.y + noise / 5.0, diffColor.z, 1.0 );

}
