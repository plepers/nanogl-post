
{
  vec2 pPos=vTexCoord1*uVignetteAspect.xy-uVignetteAspect.zw;

  vec3 ramp=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(pPos,pPos),0.0,1.0);
  vec3 ramp5=ramp*ramp;

  ramp5*=ramp;

  c*=mix(ramp,ramp5,uVignette.w);
}