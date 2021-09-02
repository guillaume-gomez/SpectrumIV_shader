const FRAGMENT_SHADER_MOVING_DOT : string = `
  uniform vec3 vertexColor; // the input variable from the vertex shader (same name and same type)
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;
  const float PI = 3.1415926535897932384626433832795;


  vec2 movingTiles(vec2 _st, float _zoom, float _speed){
    _st *= _zoom;
    float iTime = iTime*_speed;

    if( fract(iTime)>0.5 ) {
        if (fract( _st.y * 0.5) > 0.5){
          _st.x += fract(iTime)*2.0;
        } else {
          _st.x -= fract(iTime)*2.0;
        }
    } else {
      if (fract( _st.x * 0.5) > 0.5){
        _st.y += fract(iTime)*2.0;
      } else {
        _st.y -= fract(iTime)*2.0;
      }
    }
    return fract(_st);
  }

  float circle(vec2 _st, float _radius) {
      vec2 pos = vec2(0.5)-_st;
      return smoothstep(1.0-_radius,1.0-_radius+_radius*0.2,1.-dot(pos,pos) * PI);
  }

  void main() {
      vec2 st = gl_FragCoord.xy/iResolution.xy;
      st.x *= iResolution.x/iResolution.y;

      st = movingTiles(st,8.,0.5);

      vec3 color = vec3( vertexColor - circle(st, 0.05 ) );

      gl_FragColor = vec4(color,1.0);
  }`
;

export default FRAGMENT_SHADER_MOVING_DOT;
