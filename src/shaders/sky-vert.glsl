
varying vec3 point;

void main() {
    vec4 p = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    point = p.xyz;
    gl_Position = p;
}