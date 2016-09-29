
c*=1.8;
float lum = dot(c,vec3(1.0/3.0));
c=clamp(c/(1.0+lum),0.0,1.0);