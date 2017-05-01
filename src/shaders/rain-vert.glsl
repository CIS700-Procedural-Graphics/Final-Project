attribute vec3 offset;

varying vec2 f_uv;
varying vec3 f_normal;
varying vec3 f_position;
varying vec3 e_position;

void main() {
    f_uv = uv;
    f_normal = normal;
    e_position =  cameraPosition;
    f_position = position + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(f_position, 1.0);
}