module.exports = function( obj ){
var __t,__p='';
__p+='\nuniform sampler2D tInput;\nvarying vec2 vTexCoordVP;\nvarying vec2 vTexCoordFull;\n\n#if NEED_DEPTH\n  uniform sampler2D tDepth;\n#endif\n\n\n#if TEXTURE_DEPTH\n  float FETCH_DEPTH( sampler2D t, vec2 uvs ){\n    return texture2D(t,uvs).x;\n  }\n#else\n  \n  highp float decodeDepthRGB(highp vec3 rgb){\n    return(rgb.x+rgb.y*(1.0/255.0))+rgb.z*(1.0/65025.0);\n  }\n\n  float FETCH_DEPTH( sampler2D t, vec2 uvs ){\n    return decodeDepthRGB( texture2D(t,uvs).xyz );\n  }\n#endif\n\n\n\nvec3 sRGB( vec3 c )\n{\n  return c * ( c * ( c*0.305306011 + vec3(0.682171111) ) + vec3(0.012522878) );\n}\n\nfloat luminance( vec3 c )\n{\n  return dot( c, vec3(0.3,0.59,0.11) );\n}\n\n\n\n'+
(obj.precode)+
'\n\n\nvoid main(void){\n  vec3 c;\n\n  vec2 texCoordVP   = vTexCoordVP;\n  vec2 texCoordFull = vTexCoordFull;\n\n\n  #if NEED_DEPTH\n    float sceneDepth = FETCH_DEPTH( tDepth, texCoordVP );\n  #endif\n\n  '+
(obj.code)+
'\n\n  gl_FragColor.xyz=c;\n  gl_FragColor.w=1.0;\n\n}';
return __p;
}