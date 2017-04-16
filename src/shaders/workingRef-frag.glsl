varying vec2 vUv;
varying float noise;
uniform sampler2D image;


void main() {

  vec4 color = texture2D( image, vUv );

  gl_FragColor = vec4( color.rgb, color[0]*2.0*1.0 );

}