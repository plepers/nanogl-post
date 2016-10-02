precision mediump float;

uniform sampler2D tDownsample;
uniform sampler2D tBlurred;

varying vec2 vTexCoord;

void main(void)
{

  vec4 shrunk  = texture2D( tDownsample, vTexCoord );
  vec4 blurred = texture2D( tBlurred   , vTexCoord );

  float coc = 2.0 * max( blurred.a, shrunk.a ) - shrunk.a;

  gl_FragColor = vec4( shrunk.rgb, coc );

}
