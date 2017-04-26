#version 300 es

precision highp float;

uniform sampler2D u_image;

out vec4 fragColor;
in vec3 out_pos;

void main(void) {
    vec3 col = (out_pos+1.0)/2.0;
    fragColor = vec4(col.xyz, 1.);
  //  fragColor = vec4( vec3(1,1,0), 1. );
}