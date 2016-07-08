

vec2 fT=vTexCoord0*uVignetteAspect.xy-uVignetteAspect.zw;

vec3 fN=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(fT,fT),0.0,1.0);
vec3 fU=fN*fN;

fU*=fN;

c*=mix(fN,fU,uVignette.w);