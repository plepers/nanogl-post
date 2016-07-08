
c += c * (uGrainScaleBias.x * texture2D(tGrain,vTexCoord0*uGrainCoord.xy+uGrainCoord.zw).x+uGrainScaleBias.y);