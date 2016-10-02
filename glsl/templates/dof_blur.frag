precision mediump float;

uniform sampler2D tInput;

uniform vec3 uKernel[BLUR_SAMPLES];
varying vec2 vTexCoordVP;

void main(void)
{

  vec4 color = vec4( 0.0 );

  for(int i=0; i<BLUR_SAMPLES; ++i)
  {
    vec3 kernel = uKernel[i];
    color += texture2D( tInput, vTexCoordVP + kernel.xy ) * kernel.z;
  }

  gl_FragColor = color;

}
