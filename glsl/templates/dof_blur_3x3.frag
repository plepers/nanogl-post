precision mediump float;

uniform sampler2D tCoc;

varying vec4 vTexCoord;

void main(void)
{

  vec4 color;

  color  = texture2D( tCoc, vTexCoord.xz );
  color += texture2D( tCoc, vTexCoord.yz );
  color += texture2D( tCoc, vTexCoord.xw );
  color += texture2D( tCoc, vTexCoord.yw );

  gl_FragColor = color / 4.0;

}
