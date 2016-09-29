module.exports = function( obj ){
var __t,__p='';
__p+='\nvec3 sobelAccum;\nsobelAccum  = texture2D( tInput, texCoordVP + uSharpenKernel.xy ).xyz;\nsobelAccum += texture2D( tInput, texCoordVP - uSharpenKernel.xy ).xyz;\nsobelAccum += texture2D( tInput, texCoordVP + uSharpenKernel.zw ).xyz;\nsobelAccum += texture2D( tInput, texCoordVP - uSharpenKernel.zw ).xyz;\nvec3 sr = uSharpness.x*c - uSharpness.y*sobelAccum;\nc += clamp( sr, -uSharpness.z, uSharpness.z );';
return __p;
}