const FRAGMENT_SHADER_SPECTRUM : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;

  void main() {
    vec2 uv = gl_FragCoord.xy/iResolution.xy;

    // Time varying pixel color
    vec3 gradientColor = clamp(abs(sin(iTime)) * (uv.x + 0.5), 0.25, 1.0) * vertexColor;

    // Output to screen
    gl_FragColor = vec4(gradientColor, 1);

    // old shader
    //gl_FragColor = vec4(vertexColor, 1);
  }`;

export default FRAGMENT_SHADER_SPECTRUM;