varying vec2 vUv;
uniform sampler2D image;
varying vec3 vPosition;


float sampleNoise(vec3 pos) {
	float x = fract(sin(dot(pos, vec3(134.9235, 63.5879, 218.9542))) * 27495.2467);
	return x;
}

void main() {

  vec2 uv = vec2(1,1) - vUv;
  vec4 color = texture2D( image, uv );
  //float noise = sampleNoise( vec3(vPosition.x, 0.0, 0.0) );
  if (vPosition.x > 0.9) {
    gl_FragColor = vec4( 0.5, 1.0, 0.5, 1.0 );
  } else {
    gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
  }

}
