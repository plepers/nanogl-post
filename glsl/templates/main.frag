
uniform sampler2D tInput;
varying vec2 vTexCoord0;


vec3 sRGB( vec3 c )
{
  return c * ( c * ( c*0.305306011 + vec3(0.682171111) ) + vec3(0.012522878) );
}

float luminance( vec3 c )
{
  return dot( c, vec3(0.3,0.59,0.11) );
}


vec3 toneMap(vec3 c){
  vec3 sqrtc = sqrt( c );
  return(sqrtc-sqrtc*c) + c*(0.4672*c+vec3(0.5328));
}


{{@precode}}

void main(void){
  vec3 c = texture2D(tInput,vTexCoord0).xyz;

  {{@code}}

  gl_FragColor.xyz=toneMap(c);
  gl_FragColor.w=1.0;

}