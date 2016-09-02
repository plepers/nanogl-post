module.exports = function( obj ){
var __t,__p='';
__p+='\n{\n  vec2 pPos=vTexCoord1*uVignetteAspect.xy-uVignetteAspect.zw;\n\n  vec3 ramp=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(pPos,pPos),0.0,1.0);\n  vec3 ramp5=ramp*ramp;\n\n  ramp5*=ramp;\n\n  c*=mix(ramp,ramp5,uVignette.w);\n}';
return __p;
}