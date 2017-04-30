uniform sampler2D spline_tex;
uniform vec3 tip_color;
uniform vec3 base_color;

varying float vNoise;
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 ePosition;

vec3 v_lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

vec3 applyFog(vec3 color, float distance, float b) {
	float fogAmount = 1.0 - exp( -distance*b );
    vec3  fogColor  = vec3(0.5,0.6,0.7);
    return mix( color, fogColor, fogAmount );
}

void main() {
 
  vec3 ncolor = mix(vec3(0.0, 0.0, 0.0), tip_color, vNoise);
  float scale = texture2D(spline_tex, vUV).r;
  vec3 color = mix(ncolor, base_color, scale);

  color = applyFog(color, length(vPosition - ePosition), 0.035);

  gl_FragColor = vec4( color , 1.0 );

}