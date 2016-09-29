module.exports = function( obj ){
var __t,__p='';
__p+='vec3 tbc_sqrtc = sqrt( c );\nc = ( tbc_sqrtc - tbc_sqrtc*c ) + c * ( 0.4672 * c + vec3(0.5328) );';
return __p;
}