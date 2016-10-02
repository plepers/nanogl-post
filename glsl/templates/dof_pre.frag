
uniform sampler2D tDofMedBlur;
uniform sampler2D tDofBlur;
uniform vec2      uDofInvTargetSize;

uniform vec4      uDofLerpScale;
uniform vec4      uDofLerpBias;
uniform vec3      uDofEqFar;


vec3 GetSmallBlurSample( vec2 texCoords )
{
  vec3 sum;
  const float weight = 4.0 / 17.0;
  sum  = weight * texture2D( tInput, texCoords + vec2(+0.5, -1.5)*uDofInvTargetSize ).rgb;
  sum += weight * texture2D( tInput, texCoords + vec2(-1.5, -0.5)*uDofInvTargetSize ).rgb;
  sum += weight * texture2D( tInput, texCoords + vec2(-0.5, +1.5)*uDofInvTargetSize ).rgb;
  sum += weight * texture2D( tInput, texCoords + vec2(+1.5, +0.5)*uDofInvTargetSize ).rgb;
  return sum;
}



void InterpolateDof( inout vec3 c, mediump vec3 small, mediump vec3 med, mediump vec3 large, mediump float coc )
{
  mediump vec4  weights;
  mediump vec3  color;
  mediump float alpha;


  // small = small*0.0000001 + vec3(1.0, 0.0, 0.0);
  // med   = med  *0.0000001 + vec3(0.0, 1.0, 0.0);
  // large = large*0.0000001 + vec3(0.0, 0.0, 1.0);


  // Efficiently calculate the cross-blend weights for each sample.
   // Let the unblurred sample to small blur fade happen over distance
   // d0, the small to medium blur over distance d1, and the medium to
   // large blur over distance d2, where d0 + d1 + d2 = 1.
   // dofLerpScale = float4( -1 / d0, -1 / d1, -1 / d2, 1 / d2 );
   // dofLerpBias = float4( 1, (1 – d2) / d1, 1 / d2, (d2 – 1) / d2 );

  weights = clamp( coc * uDofLerpScale + uDofLerpBias, 0.0, 1.0 );
  weights.yz = min( weights.yz, 1.0 - weights.xy );

  // Unblurred sample with weight "weights.x" done by alpha blending
  color = weights.y * small + weights.z * med + weights.w * large;
  alpha = 1.0 - dot( weights.yzw, vec3( 16.0 / 17.0, 1.0, 1.0 ) );

  c = c*alpha + color;
  // return half4( color, alpha );

}