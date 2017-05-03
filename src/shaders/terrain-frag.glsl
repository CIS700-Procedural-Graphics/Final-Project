varying vec2 vUv;
varying float noise;
varying vec3 fragPos;
varying vec3 vNormal;

uniform sampler2D waterSampler;
uniform vec3 cameraPos;


// IQ's fog: http://iquilezles.org/www/articles/fog/fog.htm
vec3 applyFog( in vec3  rgb,       // original color of the pixel
               in float distance ) // camera to point distance
{
    float fogAmount = 1.0 - exp( -distance*10.0 );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( rgb, fogColor, fogAmount );
}

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = texture2D( waterSampler, uv );

  vec3 lightColor = vec3(0.5,0.2,0.7);
  vec3 lightPos = vec3( 0.0,7.0,10.0 );
  vec3 lightDir = normalize(lightPos - fragPos);
  float diff = max(dot(vNormal, lightDir), 0.0);
  vec3 diffColor = diff * lightColor;
  // diffColor += color.xyz * 0.5;
  // diffColor += applyFog(color.xyz, 0.1*length(fragPos-cameraPos)) * 0.5;


  gl_FragColor = vec4( diffColor, 0.0 );

}
