const FRAGMENT_SHADER_VCR : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  #define PI 3.1415926538
  #define scan_period 5.0

  float rand(vec2 co, float off){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453 * cos(iTime) + sin(off));
  }

  void main() {
    vec2 position = gl_FragCoord.xy / iResolution.xy;

    gl_FragColor += rand(position, 0.0) / 5.0; // noise
    gl_FragColor.r += vertexColor.x + rand(position, PI) / 20.0;
    gl_FragColor.g += vertexColor.y + rand(position, PI * 2.0) / 20.0;
    gl_FragColor.b += vertexColor.z + rand(position, PI * 3.0) / 20.0;
    
    
    float scan_pos = mod(iTime, scan_period) / scan_period;
    float random_height = rand(position, 10.0 * PI) / 80.0 + 0.02;

    if(position.y > scan_pos - random_height && position.y < scan_pos + random_height) {
      gl_FragColor.rgb += vec3(0.05);
    }
  }`
;

export default FRAGMENT_SHADER_VCR;
