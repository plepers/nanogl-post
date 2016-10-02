module.exports = function( obj ){
var __t,__p='';
__p+='precision mediump float;\n\nuniform sampler2D tCoc;\n\nvarying vec4 vTexCoord;\n\nvoid main(void)\n{\n\n  vec4 color;\n\n  color  = texture2D( tCoc, vTexCoord.xz );\n  color += texture2D( tCoc, vTexCoord.yz );\n  color += texture2D( tCoc, vTexCoord.xw );\n  color += texture2D( tCoc, vTexCoord.yw );\n\n  gl_FragColor = color / 4.0;\n\n}\n';
return __p;
}