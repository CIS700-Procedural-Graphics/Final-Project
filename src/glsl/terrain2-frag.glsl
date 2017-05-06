uniform sampler2D texture;

varying vec3 vNormal;
varying vec2 TexCoordX;
varying vec2 TexCoordY;
varying vec2 TexCoordZ;

void main() {

  vec3 n = vNormal;
  n = n * n;
  vec2 tcX = fract(TexCoordX);
  vec2 tcY = fract(TexCoordY);
  vec2 tcZ = fract(TexCoordZ);

  vec4 grassCol = texture2D(texture, tcX) * n.x +
                  texture2D(texture, tcY) * n.y +
                  texture2D(texture, tcZ) * n.z ;

  gl_FragColor = grassCol;

}
