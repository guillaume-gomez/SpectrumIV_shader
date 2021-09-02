const FRAGMENT_SHADER_BLACK_STRIPES : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  const float PI = 3.1415926535897932384626433832795;
  const float PI_2 = 1.57079632679489661923;
  const float PI_4 = 0.785398163397448309616;


  float PI_180 = float(PI / 180.0);
  float sind(float a){return sin(a * PI_180);}
  float cosd(float a){return cos(a * PI_180);}

  void main() {
    float norm_x = gl_FragCoord.x / iResolution.x;
  
    float l = mod(norm_x * 13.0 + iTime, 1.0);
  
    gl_FragColor = vec4(vertexColor * l, 1.0);
  }`
;

export default FRAGMENT_SHADER_BLACK_STRIPES;