const FRAGMENT_SHADER_NOISE_X : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;

  const float Pi = 3.14159;
  const int   complexity      = 12;    // More points of color.
  const float fluid_speed     = 1000.;  // Drives speed, higher number will make it slower.
  const float color_intensity = 10.;

  void main() {
    vec2 position = (12.0 * gl_FragCoord.xy - iResolution.xy)/max(iResolution.x,iResolution.y);
    for(int i = 1; i < complexity;i += 2)
    {
      vec2 newp = position + iTime * 0.15;
      newp.x += .6 / float(i) * sin(float(i) * position.x + fluid_speed + .3) + 100.5;
      newp.y += .6 / float(i) * sin(float(i) * (position.y / position.x * 2.1) + float(i));
      position = newp;
    }
    vec3 col = vertexColor * sin(5.0 * position.x);
    gl_FragColor = vec4(col, sin(5.0 * position.x));
  }`;

export default FRAGMENT_SHADER_NOISE_X;