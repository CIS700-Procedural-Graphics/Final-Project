uniform sampler2D texture;

//varying vec3 perlin_color;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPos;
varying float vAmount;

void main() {
  //Test your shader setup by applying the material to the icosahedron and color the mesh in the fragment shader using the normals' XYZ components as RGB.

  //gl_FragColor = vec4(vNormal, 1.0);
  //gl_FragColor = vec4(1.0 * perlin_color, 1.0);


  // if (u_useTexture == 1) {
  //     color = texture2D(texture, f_uv);
  // }

  // //lambertian shading
  // float lightIntensity = 1.0;
  // vec3 lightPos = vec3(1.0, 10.0, 2.0);
  // vec3 ambient = vec3(17.0/255.0, 17.0/255.0, 17.0/255.0);
  // vec3 lightCol = vec3(255.0/255.0, 255.0/255.0, 255.0/255.0);
  // vec4 color = vec4(221.0/255.0, 221.0/255.0, 221.0/255.0, 1.0);
  //
  // float d = clamp(dot(vNormal, normalize(lightPos - vPos)), 0.0, 1.0);
  // gl_FragColor = vec4(d * color.rgb * lightCol * lightIntensity + ambient, 1.0);

  // gl_FragColor = vec4(color.rgb, 1.0);

  //texture mapping
  vec4 grass = texture2D(texture, vUv * 10.0);
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + grass;

}
