const FRAGMENT_SHADER_GRADIENT : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  void main() {
    vec2 position = gl_FragCoord.xy/iResolution.xy + iMouse / 4.0;

    // Time varying pixel color
    vec3 gradientColor = vertexColor * position.y;

    // Output to screen
    gl_FragColor = vec4(gradientColor, 1);
  }`
;

export default FRAGMENT_SHADER_GRADIENT;