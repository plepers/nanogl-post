

float gray = luminance( c );
c = mix( vec3(gray), c, uSaturation );