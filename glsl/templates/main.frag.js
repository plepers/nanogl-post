module.exports = function( obj ){
var __t,__p='';
__p+='\nuniform sampler2D tInput;\nvarying vec2 vTexCoord0;\nvarying vec2 vTexCoord1;\n\n\nvec3 sRGB( vec3 c )\n{\n  return c * ( c * ( c*0.305306011 + vec3(0.682171111) ) + vec3(0.012522878) );\n}\n\nfloat luminance( vec3 c )\n{\n  return dot( c, vec3(0.3,0.59,0.11) );\n}\n\n\n\n'+
(obj.precode)+
'\n\n\nvoid main(void){\n  vec3 c;\n\n  '+
(obj.code)+
'\n\n  gl_FragColor.xyz=c;\n  gl_FragColor.w=1.0;\n\n}';
return __p;
}