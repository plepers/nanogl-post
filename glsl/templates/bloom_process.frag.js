module.exports = function( obj ){
var __t,__p='';
__p+='precision mediump float;\n\nuniform sampler2D tInput;\n\nuniform vec4 uKernel[BLOOM_SAMPLES];\nvarying vec2 vTexCoordVP;\n\nvoid main(void)\n{\n\n  vec3 color = vec3(0.0);\n\n  for(int i=0; i<BLOOM_SAMPLES; ++i)\n  {\n    vec3 kernel = uKernel[i].xyz;\n    color += texture2D( tInput,vTexCoordVP + kernel.xy ).xyz * kernel.z;\n  }\n\n  gl_FragColor = vec4( color, 0.0 );\n  //gl_FragColor = vec4( texture2D( tInput,vTexCoord ).xyz, 0.0 );\n}\n';
return __p;
}