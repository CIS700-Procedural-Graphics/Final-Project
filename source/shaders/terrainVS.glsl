precision highp float;
attribute vec3 a_position;
attribute vec3 a_normal;
varying vec3 v_normal;
uniform mat3 u_normalMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
varying vec3 pos;
attribute vec3 a_noise;
varying vec3 noisefs;

void main(void)
{
    vec4 pos1 = u_modelViewMatrix * vec4(a_position,1.0);
    v_normal = u_normalMatrix * a_normal;//u_normalMatrix * a_normal;
	pos = vec3(a_position/8000000.0);//a_normal;
    noisefs= a_noise;
    gl_Position = u_projectionMatrix * pos1;
}
