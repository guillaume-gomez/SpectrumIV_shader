const FRAGMENT_SHADER_LINE_MOUSE : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  float rand(vec2 p) {
    return fract(sin(dot(p, vec2(16,79) * 125.1234))) * 2.0 - 1.0;
  }

  void main( void ) {
    vec2 position = ( 2.0 * gl_FragCoord.xy - iResolution.xy ) / min(iResolution.x, iResolution.y) * iMouse;
    float a = abs(rand(position));
    gl_FragColor = vec4(vertexColor * a, 1.0 );
  }`
;

export default FRAGMENT_SHADER_LINE_MOUSE;
