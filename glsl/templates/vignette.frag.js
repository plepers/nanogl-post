module.exports = function( obj ){
var __t,__p='';
__p+='\n\nvec2 fT=vTexCoord0*uVignetteAspect.xy-uVignetteAspect.zw;\n\nvec3 fN=clamp(vec3(1.0,1.0,1.0)-uVignette.xyz*dot(fT,fT),0.0,1.0);\nvec3 fU=fN*fN;\n\nfU*=fN;\n\nc*=mix(fN,fU,uVignette.w);';
return __p;
}