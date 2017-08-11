vec3 tbc_sqrtc = sqrt( c );
c = ( tbc_sqrtc - tbc_sqrtc*c ) + c * ( 0.4672 * c + vec3(0.5328) );