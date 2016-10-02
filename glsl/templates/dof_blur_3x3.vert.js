module.exports = function( obj ){
var __t,__p='';
__p+='\nprecision highp float;\n\n\nattribute vec2 aTexCoord0;\n\nuniform vec2 uInvTargetSize;\nuniform vec2 uViewportScale;\n\nvarying vec4 vTexCoord;\n\n\nvoid main(void)\n{\n\n  const vec4 halfPixel = vec4( -0.5, 0.5, -0.5, 0.5 );\n\n  vec2 texCoords = aTexCoord0 * uViewportScale;\n  vTexCoord = texCoords.xxyy + halfPixel * uInvTargetSize.xxyy;\n\n  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);\n  gl_Position.zw = vec2(0.0,1.0);\n\n}\n';
return __p;
}