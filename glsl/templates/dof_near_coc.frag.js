module.exports = function( obj ){
var __t,__p='';
__p+='precision mediump float;\n\nuniform sampler2D tDownsample;\nuniform sampler2D tBlurred;\n\nvarying vec2 vTexCoord;\n\nvoid main(void)\n{\n\n  vec4 shrunk  = texture2D( tDownsample, vTexCoord );\n  vec4 blurred = texture2D( tBlurred   , vTexCoord );\n\n  float coc = 2.0 * max( blurred.a, shrunk.a ) - shrunk.a;\n\n  gl_FragColor = vec4( shrunk.rgb, coc );\n\n}\n';
return __p;
}