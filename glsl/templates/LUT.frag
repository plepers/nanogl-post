
c = clamp(c,0.0,1.0);
c = (255.0/256.0)*c+vec3(0.5/256.0);

c.x= texture2D(tLUT,c.xx).x;
c.y= texture2D(tLUT,c.yy).y;
c.z= texture2D(tLUT,c.zz).z;

c *= c;