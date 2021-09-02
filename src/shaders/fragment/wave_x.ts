const FRAGMENT_SHADER_WAVE_X : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  void main() {
    vec2 position = ((gl_FragCoord.xy * 2.0) - iResolution.xy) / min(iResolution.x, iResolution.y);

    float z = 0.5 + sin(iTime * 1.5 + position.x * 2.5) * 0.5;
    position *= 1.0 + z * 0.1;
    
    z = 1.0 - z;
    z = 0.7 + (z * .85);
    position.x += iTime * 0.2;
    
    vec3 col1 = vertexColor - 0.05;
    vec3 col2 = vertexColor;
    
    float d = step(sin(position.y * 50.0)+ sin(position.x * 0.0),0.0);
    gl_FragColor = vec4(mix(vertexColor, col1, d) * z ,1.0);
  }`
;

export default FRAGMENT_SHADER_WAVE_X;
