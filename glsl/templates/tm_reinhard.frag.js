module.exports = function( obj ){
var __t,__p='';
__p+='\nc*=1.8;\nfloat lum = dot(c,vec3(1.0/3.0));\nc=clamp(c/(1.0+lum),0.0,1.0);';
return __p;
}