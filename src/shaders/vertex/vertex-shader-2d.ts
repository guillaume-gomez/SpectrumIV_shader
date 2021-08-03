const VERTEX_SHADER : string = `
  // an attribute will receive data from a buffer
  attribute vec4 a_position;

  uniform vec2 u_resolution;

  // all shaders have a main function
  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
  }`;

export default VERTEX_SHADER;