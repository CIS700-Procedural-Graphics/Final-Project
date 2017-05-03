uniform mat4 textureMatrix;
varying vec4 mirrorCoord;
varying vec4 fragCoord;
uniform vec2 splashes[ 5 ];


void main() {

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	mirrorCoord = textureMatrix * worldPosition;
	fragCoord = worldPosition;

	gl_Position = projectionMatrix * mvPosition;

}
