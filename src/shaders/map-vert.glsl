varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying float v_elevation;
varying float v_moisture;

uniform int u_color;

attribute float elevation;
attribute float moisture;

void main() {
    v_uv = uv;
    v_normal = normal;
    v_position = position;
    v_elevation = elevation;
    v_moisture = moisture;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}