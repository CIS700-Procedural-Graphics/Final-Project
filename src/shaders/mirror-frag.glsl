uniform vec3 mirrorColor;
uniform sampler2D mirrorSampler;
uniform vec2 splashes[ 5 ];
uniform float time;

varying vec4 fragCoord;
varying vec4 mirrorCoord;

float blendOverlay(float base, float blend) {
  return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}

void main() {


  vec4 color = texture2DProj(mirrorSampler, mirrorCoord);
  color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);

  float dist = 1000.0;
  for (int i = 0; i < 5; i++) {
     dist = min(distance(fragCoord.xz, splashes[i]), dist);
  }

  gl_FragColor = dist < 3.0 ? vec4( 0.6,0.7,0.7, 1.0 ) : color;

}
