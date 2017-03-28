
vec3 sobelAccum;


#if __VERSION__ == 300
  sobelAccum  = textureOffset( tInput, texCoordVP, ivec2(-1, 0 ) ).xyz;
  sobelAccum += textureOffset( tInput, texCoordVP, ivec2( 1, 0 ) ).xyz;
  sobelAccum += textureOffset( tInput, texCoordVP, ivec2( 0, 1 ) ).xyz;
  sobelAccum += textureOffset( tInput, texCoordVP, ivec2( 0,-1 ) ).xyz;
#else
  sobelAccum  = texture2D( tInput, texCoordVP + uSharpenKernel.xy ).xyz;
  sobelAccum += texture2D( tInput, texCoordVP - uSharpenKernel.xy ).xyz;
  sobelAccum += texture2D( tInput, texCoordVP + uSharpenKernel.zw ).xyz;
  sobelAccum += texture2D( tInput, texCoordVP - uSharpenKernel.zw ).xyz;
#endif



vec3 sr = uSharpness.x*c - uSharpness.y*sobelAccum;
c += clamp( sr, -uSharpness.z, uSharpness.z );