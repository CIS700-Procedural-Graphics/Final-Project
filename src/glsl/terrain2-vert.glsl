varying vec3 vNormal;
varying vec2 TexCoordX;
varying vec2 TexCoordY;
varying vec2 TexCoordZ;

void main() {

  float tileSize = 5.0;
  vec4 worldPos = vec4(position, 1.0);

  TexCoordX = vec2(worldPos.zy/tileSize);
  TexCoordY = vec2(worldPos.xz/tileSize);
  TexCoordZ = vec2(worldPos.xy/tileSize);
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
