
precision highp float;

uniform vec2 uViewportScale;

attribute vec2 aTexCoord0;

varying vec2 vTexCoord;


void main(void)
{
  vTexCoord = aTexCoord0 * uViewportScale;
  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);
  gl_Position.zw = vec2(0.0,1.0);
}
