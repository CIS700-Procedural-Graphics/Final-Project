uniform sampler2D texture;
uniform vec3 u_lightPos;

varying vec3 f_position;
varying vec3 f_normal;
varying vec2 f_uv;

void main() {
    vec4 color = texture2D(texture, f_uv);
    float d = clamp(dot(f_normal, normalize(u_lightPos - f_position)), 0.0, 1.0);

    gl_FragColor = vec4(d * color.rgb + vec3(0.1, 0.1, 0.1), 1.0);
}