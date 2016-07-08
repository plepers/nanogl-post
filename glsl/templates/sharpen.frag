
vec3 sobelAccum;
sobelAccum  = texture2D( tInput, vTexCoord0 + uSharpenKernel.xy ).xyz;
sobelAccum += texture2D( tInput, vTexCoord0 - uSharpenKernel.xy ).xyz;
sobelAccum += texture2D( tInput, vTexCoord0 + uSharpenKernel.zw ).xyz;
sobelAccum += texture2D( tInput, vTexCoord0 - uSharpenKernel.zw ).xyz;
vec3 sr = uSharpness.x*c - uSharpness.y*sobelAccum;
c += clamp( sr, -uSharpness.z, uSharpness.z );