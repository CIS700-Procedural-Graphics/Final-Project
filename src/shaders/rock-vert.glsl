uniform float time;

attribute vec3 position;
attribute vec3 offset;
attribute vec3 color;
attribute vec3 scale;
attribute vec3 orientation;

varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;

// uv, position, projectionMatrix, modelViewMatrix, normal
void main() {
    f_uv = uv;
    f_normal = normal;
    f_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + sin(time) * normal, 1.0);

}