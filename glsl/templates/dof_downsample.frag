precision mediump float;

uniform sampler2D tInput;
uniform sampler2D tDepth;

uniform vec2 uDofEq;
// uniform vec3 uDofFarEq;
uniform highp vec2 uInvTargetSize;

varying vec2 tcColor0;
varying vec2 tcColor1;
varying vec2 tcDepth0;
varying vec2 tcDepth1;
varying vec2 tcDepth2;
varying vec2 tcDepth3;


vec4 saturate( vec4 v ){
  return clamp( v, 0.0, 1.0 );
}

vec4 getDofCoC( vec4 depth ){
  // return max(
  //   saturate( uDofEq.x    * depth + uDofEq.y    ),
  //   saturate( uDofFarEq.x * depth + uDofFarEq.y )
  // );

  return saturate( uDofEq.x    * depth + uDofEq.y    );
}

void main(void)
{

  vec3 color;
  vec4 depth;
  vec4 coc;

  vec2 rowDelta;

  rowDelta = vec2( 0.0, 2.0 * uInvTargetSize.y );
  // Use bilinear filtering to average 4 color samples for free.

  color  = texture2D( tInput, tcColor0            ).rgb;
  color += texture2D( tInput, tcColor1            ).rgb;
  color += texture2D( tInput, tcColor0 + rowDelta ).rgb;
  color += texture2D( tInput, tcColor1 + rowDelta ).rgb;
  color /= 4.0;

  // Process 4 samples at a time to use vector hardware efficiently.
   // The CoC will be 1 if the depth is negative, so use "min" to pick
   // between "sceneCoc" and "viewCoc".
  depth.x = texture2D( tDepth, tcDepth0            ).r;
  depth.y = texture2D( tDepth, tcDepth1            ).r;
  depth.z = texture2D( tDepth, tcDepth2            ).r;
  depth.w = texture2D( tDepth, tcDepth3            ).r;

  coc = getDofCoC( depth );


  rowDelta = vec2( 0.0, -2.0 * uInvTargetSize.y );
  depth.x = texture2D( tDepth, tcDepth0 + rowDelta ).r;
  depth.y = texture2D( tDepth, tcDepth1 + rowDelta ).r;
  depth.z = texture2D( tDepth, tcDepth2 + rowDelta ).r;
  depth.w = texture2D( tDepth, tcDepth3 + rowDelta ).r;

  coc = max( coc, getDofCoC( depth ) );


  rowDelta = vec2( 0.0, 2.0 * uInvTargetSize.y );
  depth.x = texture2D( tDepth, tcDepth0 + rowDelta ).r;
  depth.y = texture2D( tDepth, tcDepth1 + rowDelta ).r;
  depth.z = texture2D( tDepth, tcDepth2 + rowDelta ).r;
  depth.w = texture2D( tDepth, tcDepth3 + rowDelta ).r;

  coc = max( coc, getDofCoC( depth ) );


  rowDelta = vec2( 0.0, 4.0 * uInvTargetSize.y );
  depth.x = texture2D( tDepth, tcDepth0 + rowDelta ).r;
  depth.y = texture2D( tDepth, tcDepth1 + rowDelta ).r;
  depth.z = texture2D( tDepth, tcDepth2 + rowDelta ).r;
  depth.w = texture2D( tDepth, tcDepth3 + rowDelta ).r;

  coc = max( coc, getDofCoC( depth ) );


  float maxCoc = max( max( coc.x, coc.y ), max( coc.z, coc.w ) );
  gl_FragColor = vec4( color, maxCoc );

}
