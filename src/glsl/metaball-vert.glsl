varying vec3 frag_normal;
varying vec3 frag_pos;
varying vec2 frag_uv;

void main() {
    frag_normal = normal;
    frag_pos = position;
    frag_uv = vec2((normal.x + 1.0) / 2.0, (normal.y + 1.0) / 2.0);//uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
