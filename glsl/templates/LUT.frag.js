module.exports = function( obj ){
var __t,__p='';
__p+='\nc = clamp(c,0.0,1.0);\nc = (255.0/256.0)*c+vec3(0.5/256.0);\n\nc.x= texture2D(tLUT,c.xx).x;\nc.y= texture2D(tLUT,c.yy).y;\nc.z= texture2D(tLUT,c.zz).z;\n\nc *= c;';
return __p;
}