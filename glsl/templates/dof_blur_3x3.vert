
precision highp float;


attribute vec2 aTexCoord0;

uniform vec2 uInvTargetSize;
uniform vec2 uViewportScale;

varying vec4 vTexCoord;


void main(void)
{

  const vec4 halfPixel = vec4( -0.5, 0.5, -0.5, 0.5 );

  vec2 texCoords = aTexCoord0 * uViewportScale;
  vTexCoord = texCoords.xxyy + halfPixel * uInvTargetSize.xxyy;

  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);
  gl_Position.zw = vec2(0.0,1.0);

}
