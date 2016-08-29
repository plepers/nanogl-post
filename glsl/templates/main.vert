precision highp float;

attribute vec2 aTexCoord0;

varying vec2 vTexCoord0;
varying vec2 vTexCoord1;

uniform vec2 uViewportScale;

void main(void)
{
  vTexCoord0 = aTexCoord0 * uViewportScale;
  vTexCoord1 = aTexCoord0;

  vec2 pos = aTexCoord0;
  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);
  gl_Position.zw = vec2(0.0,1.0);
}
