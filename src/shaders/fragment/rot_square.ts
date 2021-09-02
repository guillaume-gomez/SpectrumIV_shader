const FRAGMENT_SHADER_ROT_SQUARE : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  #define PI 3.1415926535897932384626433832795
  
  void main() {
    vec2 a = gl_FragCoord.xy / min(iResolution.x, iResolution.y) * 10.;
    vec2 pos = fract(a + .5) -.5;
    vec2 q = abs(mat2(cos(iTime),-sin(iTime),sin(iTime),cos(iTime)) * pos);
    float c = step(q.x + q.y, .33);
    gl_FragColor = vec4(vertexColor - c, 1.0);
  }`
;

export default FRAGMENT_SHADER_ROT_SQUARE;
