module.exports = function( obj ){
var __t,__p='';
__p+='precision mediump float;\n\nuniform sampler2D tInput;\n\nuniform vec3 uKernel[BLUR_SAMPLES];\nvarying vec2 vTexCoordVP;\n\nvoid main(void)\n{\n\n  vec4 color = vec4( 0.0 );\n\n  for(int i=0; i<BLUR_SAMPLES; ++i)\n  {\n    vec3 kernel = uKernel[i];\n    color += texture2D( tInput, vTexCoordVP + kernel.xy ) * kernel.z;\n  }\n\n  gl_FragColor = color;\n\n}\n';
return __p;
}