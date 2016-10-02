module.exports = function( obj ){
var __t,__p='';
__p+='\nprecision highp float;\n\nuniform vec2 uViewportScale;\n\nattribute vec2 aTexCoord0;\n\nvarying vec2 vTexCoord;\n\n\nvoid main(void)\n{\n  vTexCoord = aTexCoord0 * uViewportScale;\n  gl_Position.xy = 2.0 * aTexCoord0-vec2(1.0,1.0);\n  gl_Position.zw = vec2(0.0,1.0);\n}\n';
return __p;
}