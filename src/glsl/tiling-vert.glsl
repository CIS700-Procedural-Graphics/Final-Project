varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPos;

void main() {

    //to send to frag shader
    vNormal = normal;
    vPos = position;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
