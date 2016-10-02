
precision highp float;

uniform vec2 uInvTargetSize;
uniform vec2 uViewportScale;

attribute vec2 aTexCoord0;

varying vec2 tcColor0;
varying vec2 tcColor1;
varying vec2 tcDepth0;
varying vec2 tcDepth1;
varying vec2 tcDepth2;
varying vec2 tcDepth3;


void main(void)
{
  vec2 tc = aTexCoord0 * uViewportScale;

  tcColor0 = tc + vec2( -0.5, -0.5 ) * uInvTargetSize;
  tcColor1 = tc + vec2( +1.5, -0.5 ) * uInvTargetSize;
  tcDepth0 = tc + vec2( -2.5, -0.5 ) * uInvTargetSize;
  tcDepth1 = tc + vec2( -0.5, -0.5 ) * uInvTargetSize;
  tcDepth2 = tc + vec2( +1.5, -0.5 ) * uInvTargetSize;
  tcDepth3 = tc + vec2( +3.5, -0.5 ) * uInvTargetSize;

  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);
  gl_Position.zw = vec2(0.0,1.0);
}
